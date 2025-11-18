"use client";

import React, { useState, FormEvent } from "react";

type EnsData = {
  name?: string;
  owner?: string;
  displayName?: string;
  avatar?: string;
};

type FnameData = {
  username?: string;
  fid?: number;
  custodyAddress?: string;
  lastTransfer?: number;
};

type NameResult = {
  name: string;
  available: boolean;
  ens?: EnsData;
  farcaster?: FnameData;
  error?: string;
};

export default function MiniPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NameResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const name = input.trim().toLowerCase();
    if (!name) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/name/${encodeURIComponent(name)}`);
      const json = (await res.json()) as NameResult;

      if (!res.ok || json.error) {
        setErrorMsg(json.error || "Something went wrong");
      } else {
        setResult(json);
      }
    } catch {
      setErrorMsg("Network error — try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <h1 style={styles.title}>Base ENS + FName Checker</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a name"
            autoComplete="off"
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.button}
            disabled={loading || !input.trim()}
          >
            {loading ? "…" : "Check"}
          </button>
        </form>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        {result && (
          <div style={styles.resultBox}>
            <div style={styles.nameRow}>
              <span style={styles.nameLabel}>Name</span>
              <span
                style={{
                  ...styles.badge,
                  ...(result.available
                    ? styles.badgeFree
                    : styles.badgeTaken),
                }}
              >
                {result.available ? "Available" : "Taken"}
              </span>
            </div>

            <div style={styles.nameValue}>{result.name}</div>

            {/* ENS block */}
            {result.ens && (result.ens.name || result.ens.owner) && (
              <div style={styles.section}>
                <div style={styles.sectionTitle}>ENS (.eth)</div>

                {result.ens.avatar && (
                  <img
                    src={result.ens.avatar}
                    style={styles.avatar}
                    alt=""
                    onError={(e) =>
                      ((e.target as HTMLImageElement).style.display = "none")
                    }
                  />
                )}

                {result.ens.name && (
                  <div style={styles.row}>
                    <span style={styles.label}>Name</span>
                    <span>{result.ens.name}</span>
                  </div>
                )}

                {result.ens.owner && (
                  <div style={styles.row}>
                    <span style={styles.label}>Owner</span>
                    <span style={styles.mono}>
                      {shorten(result.ens.owner)}
                    </span>
                  </div>
                )}

                {result.ens.displayName && (
                  <div style={styles.row}>
                    <span style={styles.label}>Display</span>
                    <span>{result.ens.displayName}</span>
                  </div>
                )}
              </div>
            )}

            {/* FName block */}
            {result.farcaster &&
              (result.farcaster.username || result.farcaster.fid) && (
                <div style={styles.section}>
                  <div style={styles.sectionTitle}>Farcaster FName</div>

                  {result.farcaster.username && (
                    <div style={styles.row}>
                      <span style={styles.label}>Username</span>
                      <a
                        href={`https://warpcast.com/${result.farcaster.username}`}
                        target="_blank"
                        style={styles.link}
                      >
                        @{result.farcaster.username}
                      </a>
                    </div>
                  )}

                  {result.farcaster.fid !== undefined && (
                    <div style={styles.row}>
                      <span style={styles.label}>FID</span>
                      <span>{result.farcaster.fid}</span>
                    </div>
                  )}

                  {result.farcaster.custodyAddress && (
                    <div style={styles.row}>
                      <span style={styles.label}>Custody</span>
                      <span style={styles.mono}>
                        {shorten(result.farcaster.custodyAddress)}
                      </span>
                    </div>
                  )}

                  {result.farcaster.lastTransfer && (
                    <div style={styles.row}>
                      <span style={styles.label}>Last transfer</span>
                      <span>
                        {new Date(
                          result.farcaster.lastTransfer * 1000
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

function shorten(addr: string) {
  if (addr.length <= 12) return addr;
  return addr.slice(0, 6) + "…" + addr.slice(-4);
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#020617",
    color: "white",
    padding: "12px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    padding: "16px",
    borderRadius: "14px",
    background: "#0f172a",
    border: "1px solid #1e293b",
  },

  title: {
    fontSize: "20px",
    fontWeight: 700,
    marginBottom: "16px",
  },

  form: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },

  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "white",
    fontSize: "14px",
  },

  button: {
    padding: "10px 14px",
    borderRadius: "10px",
    background: "#2563eb",
    color: "white",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "8px",
  },

  resultBox: {
    marginTop: "12px",
    borderTop: "1px solid #1e293b",
    paddingTop: "12px",
  },

  nameRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
  },

  nameLabel: {
    opacity: 0.6,
    fontSize: "13px",
  },

  badge: {
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
  },

  badgeFree: {
    background: "#14532d",
    color: "#bbf7d0",
  },

  badgeTaken: {
    background: "#450a0a",
    color: "#fecaca",
  },

  nameValue: {
    fontSize: "18px",
    fontWeight: 600,
  },

  section: {
    marginTop: "14px",
    borderTop: "1px solid #1e293b",
    paddingTop: "10px",
  },

  sectionTitle: {
    fontSize: "13px",
    opacity: 0.9,
    marginBottom: "6px",
    fontWeight: 600,
  },

  avatar: {
    width: "70px",
    height: "70px",
    borderRadius: "50%",
    marginBottom: "8px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "4px",
  },

  label: {
    opacity: 0.6,
  },

  mono: {
    fontFamily: "monospace",
    fontSize: "12px",
  },

  link: {
    color: "#60a5fa",
    textDecoration: "none",
  },
};
