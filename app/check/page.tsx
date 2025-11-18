"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";

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

export default function CheckPage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function checkName() {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`/api/name/${encodeURIComponent(trimmed)}`);

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        const msg =
          (json && (json.error || json.message)) ||
          `Request failed with status ${res.status}`;
        setError(msg);
        return;
      }

      const json = (await res.json()) as ApiResult;
      setResult(json);
    } catch (e: any) {
      setError(e?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      checkName();
    }
  }

  const hasResult = !!result;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>ENS + FNames Name Checker</h1>

      <p style={styles.subtitle}>
        Input your name — i'll check{" "}
        <strong>name.eth</strong> in ENS and <strong>fname</strong> в Farcaster.
      </p>

      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="например, igoreha"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button style={styles.button} onClick={checkName} disabled={loading}>
          {loading ? "Checking..." : "Check name"}
        </button>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <div style={styles.errorTitle}>Error</div>
          <div>{error}</div>
        </div>
      )}

      {hasResult && !error && (
        <div style={styles.resultsWrapper}>
          <div style={styles.resultsHeader}>
            <span style={styles.resultsLabel}>Name:</span>
            <span style={styles.resultsValue}>{result?.name}</span>
          </div>

          <div style={styles.cardsGrid}>
            <EnsCard ens={result!.ens} />
            <FnameCard fname={result!.fname} />
          </div>
        </div>
      )}
    </div>
  );
}

function EnsCard({ ens }: { ens: EnsResult }) {
  const statusColor = ens.error
    ? "#4b5563"
    : ens.available
    ? "#16a34a"
    : "#dc2626";

  const statusLabel = ens.error
    ? "Error"
    : ens.available
    ? "Available"
    : "Taken";

  return (
    <div style={{ ...styles.card, borderColor: statusColor }}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>ENS (.eth)</span>
        <span style={{ ...styles.badge, backgroundColor: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardMainLine}>{ens.domain}</div>

        {ens.error && (
          <div style={styles.cardErrorText}>
            ENS error: {ens.error}
          </div>
        )}

        {!ens.error && ens.available && (
          <div style={styles.cardInfoText}>
            This ENS name appears to be <strong>available</strong>.
          </div>
        )}

        {!ens.error && !ens.available && (
          <>
            {ens.avatar && (
              <img
                src={ens.avatar}
                alt={ens.displayName || ens.domain}
                style={styles.avatar}
              />
            )}
            <div style={styles.cardInfoText}>
              Owner address:
              <br />
              <code style={styles.code}>{ens.address}</code>
            </div>
            {ens.displayName && (
              <div style={styles.cardInfoText}>
                Display name: <strong>{ens.displayName}</strong>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FnameCard({ fname }: { fname: FnameResult }) {
  const statusColor = fname.error
    ? "#4b5563"
    : fname.available
    ? "#16a34a"
    : "#dc2626";

  const statusLabel = fname.error
    ? "Error"
    : fname.available
    ? "Available"
    : "Taken";

  return (
    <div style={{ ...styles.card, borderColor: statusColor }}>
      <div style={styles.cardHeader}>
        <span style={styles.cardTitle}>Farcaster FName</span>
        <span style={{ ...styles.badge, backgroundColor: statusColor }}>
          {statusLabel}
        </span>
      </div>

      <div style={styles.cardBody}>
        <div style={styles.cardMainLine}>@{fname.name}</div>

        {fname.error && (
          <div style={styles.cardErrorText}>
            FName error: {fname.error}
          </div>
        )}

        {!fname.error && fname.available && (
          <div style={styles.cardInfoText}>
            This FName appears to be <strong>available</strong>.
          </div>
        )}

        {!fname.error && !fname.available && (
          <>
            {typeof fname.currentOwnerFid === "number" && (
              <div style={styles.cardInfoText}>
                Current owner FID:{" "}
                <strong>{fname.currentOwnerFid}</strong>
              </div>
            )}
            {fname.ownerAddress && (
              <div style={styles.cardInfoText}>
                Custody address:
                <br />
                <code style={styles.code}>{fname.ownerAddress}</code>
              </div>
            )}
            {fname.lastTransferTimestamp && (
              <div style={styles.cardMetaText}>
                Last transfer (unix): {fname.lastTransferTimestamp}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: "40px 20px",
    maxWidth: 800,
    margin: "0 auto",
    textAlign: "left",
  },
  title: {
    fontSize: 36,
    fontWeight: 700,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.8,
    marginBottom: 24,
    lineHeight: 1.5,
  },
  form: {
    display: "flex",
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    fontSize: 16,
    borderRadius: 999,
    border: "1px solid #4b5563",
    outline: "none",
    background: "#020617",
    color: "#f9fafb",
  },
  button: {
    padding: "10px 18px",
    fontSize: 16,
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    background: "#3b82f6",
    color: "#f9fafb",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  errorBox: {
    marginTop: 16,
    padding: "12px 14px",
    borderRadius: 8,
    background: "#450a0a",
    border: "1px solid #b91c1c",
    color: "#fecaca",
    fontSize: 14,
  },
  errorTitle: {
    fontWeight: 600,
    marginBottom: 4,
  },
  resultsWrapper: {
    marginTop: 24,
  },
  resultsHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  resultsLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  resultsValue: {
    fontSize: 18,
    fontWeight: 600,
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260, 1fr))",
    gap: 16,
  },
  card: {
    borderRadius: 16,
    border: "1px solid #374151",
    padding: 16,
    background: "#020617",
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },
  badge: {
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    color: "#f9fafb",
    fontWeight: 600,
  },
  cardBody: {
    fontSize: 14,
  },
  cardMainLine: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
  },
  cardInfoText: {
    marginTop: 6,
    lineHeight: 1.5,
  },
  cardMetaText: {
    marginTop: 6,
    opacity: 0.7,
    fontSize: 12,
  },
  cardErrorText: {
    marginTop: 6,
    color: "#fecaca",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    display: "block",
    marginTop: 4,
    marginBottom: 8,
  },
  code: {
    fontFamily: "monospace",
    fontSize: 12,
    padding: "2px 4px",
    borderRadius: 4,
    background: "#020617",
  },
};
