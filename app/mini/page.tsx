"use client";

import { useState, useEffect, FormEvent } from "react";

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

type ApiResult = {
  name: string;
  ens: EnsResult;
  fname: FnameResult;
  error?: string;
};

export default function MiniPage() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);

  // 🔥 
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. 
      if ((window as any).farcaster?.actions?.ready) {
        (window as any).farcaster.actions.ready();
      }

      // 2.
      window.parent.postMessage(
        { type: "farcaster:ready" },
        "*"
      );
    }
  }, []);

  async function handleCheck(e: FormEvent) {
    e.preventDefault();

    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/name/${encodeURIComponent(trimmed)}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "Request failed");
        return;
      }

      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={s.root}>
      <div style={s.card}>

        <h1 style={s.title}>Base ENS + FName Checker</h1>

        <form onSubmit={handleCheck} style={s.form}>
          <input
            style={s.input}
            placeholder="igoreha"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button style={s.button} disabled={loading}>
            {loading ? "…" : "Check"}
          </button>
        </form>

        {error && <div style={s.error}>{error}</div>}

        {result && !error && (
          <div style={s.resultRoot}>
            <div style={s.resultHeader}>
              <span>Name</span>
              <span
                style={{
                  ...s.badge,
                  ...(result.ens.available && result.fname.available
                    ? s.badgeFree
                    : s.badgeTaken),
                }}
              >
                {result.ens.available && result.fname.available
                  ? "Available"
                  : "Taken"}
              </span>
            </div>

            <div style={s.resultName}>{result.name}</div>

            {/* ENS */}
            <EnsSection data={result.ens} />

            {/* FNAME */}
            <FnameSection data={result.fname} />

          </div>
        )}
      </div>
    </div>
  );
}

function EnsSection({ data }: { data: EnsResult }) {
  const available = data.available;
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <span>ENS (.eth)</span>
        <span
          style={{
            ...s.badgeSmall,
            ...(available ? s.smallFree : s.smallTaken),
          }}
        >
          {available ? "Available" : "Taken"}
        </span>
      </div>

      <div style={s.value}>{data.domain}</div>

      {!available && (
        <>
          {data.avatar && (
            <img
              src={data.avatar}
              style={s.avatar}
              onError={(e) =>
                ((e.target as HTMLImageElement).style.display = "none")
              }
            />
          )}

          <div style={s.row}>
            <span style={s.label}>Owner</span>
            <span style={s.mono}>{short(data.address!)}</span>
          </div>

          {data.displayName && (
            <div style={s.row}>
              <span style={s.label}>Display</span>
              <span>{data.displayName}</span>
            </div>
          )}
        </>
      )}

      {available && (
        <div style={s.availableHint}>ENS name is free</div>
      )}
    </div>
  );
}

function FnameSection({ data }: { data: FnameResult }) {
  const available = data.available;
  return (
    <div style={s.section}>
      <div style={s.sectionHeader}>
        <span>Farcaster FName</span>
        <span
          style={{
            ...s.badgeSmall,
            ...(available ? s.smallFree : s.smallTaken),
          }}
        >
          {available ? "Available" : "Taken"}
        </span>
      </div>

      <div style={s.value}>@{data.name}</div>

      {!available && (
        <>
          <div style={s.row}>
            <span style={s.label}>FID</span>
            <span>{data.currentOwnerFid}</span>
          </div>

          {data.ownerAddress && (
            <div style={s.row}>
              <span style={s.label}>Custody</span>
              <span style={s.mono}>{short(data.ownerAddress)}</span>
            </div>
          )}

          {data.lastTransferTimestamp && (
            <div style={s.row}>
              <span style={s.label}>Last transfer</span>
              <span>
                {new Date(
                  data.lastTransferTimestamp * 1000
                ).toLocaleString()}
              </span>
            </div>
          )}
        </>
      )}

      {available && (
        <div style={s.availableHint}>FName is free</div>
      )}
    </div>
  );
}

function short(addr: string, l = 6, r = 4) {
  return `${addr.slice(0, l)}…${addr.slice(-r)}`;
}

// 
const s = { /* () */ };
