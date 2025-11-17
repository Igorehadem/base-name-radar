import { NextResponse } from "next/server";

type EnsResult = {
  service: "ensideas";
  domain: string;
  available: boolean;
  address?: string;
  displayName?: string;
  avatar?: string | null;
  error?: string;
};

type FnameResult = {
  service: "farcaster-fnames";
  name: string;
  available: boolean;
  currentOwnerFid?: number;
  ownerAddress?: string;
  lastTransferTimestamp?: number;
  error?: string;
};

type CombinedResult = {
  name: string;
  ens: EnsResult;
  fname: FnameResult;
};

async function checkEns(name: string): Promise<EnsResult> {
  const domain = `${name}.eth`;
  const url = `https://api.ensideas.com/ens/resolve/${encodeURIComponent(
    domain
  )}`;

  try {
    const res = await fetch(url, {
      // small cache is fine, but you can turn it off if needed
      next: { revalidate: 60 },
    });

    // ensideas returns 404 if name/address not found
    if (res.status === 404) {
      return {
        service: "ensideas",
        domain,
        available: true,
      };
    }

    if (!res.ok) {
      return {
        service: "ensideas",
        domain,
        available: false,
        error: `ENS API error: HTTP ${res.status}`,
      };
    }

    const json: any = await res.json();

    // If there is no address in response, we treat it as available
    if (!json?.address) {
      return {
        service: "ensideas",
        domain,
        available: true,
      };
    }

    return {
      service: "ensideas",
      domain,
      available: false,
      address: json.address,
      displayName: json.displayName ?? json.name ?? domain,
      avatar: json.avatar ?? null,
    };
  } catch (err: any) {
    return {
      service: "ensideas",
      domain,
      available: false,
      error: err?.message ?? "Unknown ENS error",
    };
  }
}

async function checkFname(name: string): Promise<FnameResult> {
  const url = `https://fnames.farcaster.xyz/transfers?name=${encodeURIComponent(
    name
  )}`;

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        service: "farcaster-fnames",
        name,
        available: false,
        error: `FName API error: HTTP ${res.status}`,
      };
    }

    const json: any = await res.json();
    const transfers: any[] = Array.isArray(json?.transfers)
      ? json.transfers
      : [];

    // no transfers → имя никогда не регистрировали → свободно
    if (transfers.length === 0) {
      return {
        service: "farcaster-fnames",
        name,
        available: true,
      };
    }

    // last transfer = current state
    const latest = transfers[transfers.length - 1];
    const to = Number(latest?.to ?? 0);

    // to === 0 → имя разрегистрировано → свободно
    if (!Number.isFinite(to) || to === 0) {
      return {
        service: "farcaster-fnames",
        name,
        available: true,
        lastTransferTimestamp: latest?.timestamp
          ? Number(latest.timestamp)
          : undefined,
      };
    }

    // иначе имя занято
    return {
      service: "farcaster-fnames",
      name,
      available: false,
      currentOwnerFid: to,
      ownerAddress: latest?.owner ?? undefined,
      lastTransferTimestamp: latest?.timestamp
        ? Number(latest.timestamp)
        : undefined,
    };
  } catch (err: any) {
    return {
      service: "farcaster-fnames",
      name,
      available: false,
      error: err?.message ?? "Unknown FName error",
    };
  }
}

export async function GET(
  _req: Request,
  context: { params: { name: string } }
) {
  const rawName = context.params.name ?? "";
  const name = rawName.trim().toLowerCase();

  if (!name) {
    return NextResponse.json({ error: "No name provided" }, { status: 400 });
  }

  try {
    const [ens, fname] = await Promise.all([checkEns(name), checkFname(name)]);

    const payload: CombinedResult = {
      name,
      ens,
      fname,
    };

    return NextResponse.json(payload, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Unexpected server error",
        details: err?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
