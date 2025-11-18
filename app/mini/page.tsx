"use client";

import React, { useState, FormEvent } from "react";

type NameResult = {
  name: string;
  available: boolean;
  ens?: {
    name?: string;
    owner?: string;
    displayName?: string;
    avatar?: string;
  };
  fname?: {
    username?: string;
    fid?: number;
    custodyAddress?: string;
    lastTransfer?: number;
  };
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
      setErrorMsg("Network error, please try again");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.card}>
        <h1 style={styles.title}>Base ENS + FName Checker</h1>
        <p style={styles.subtitle}>
          Check if a name is taken on ENS (.eth) and as a Farcaster fname.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a name, e.g. igoreha"
            autoComplete="off"
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.button}
            disabled={loading || !input.trim()}
          >
            {loading ? "Checking…" : "Check"}
          </button>
        </form>

        {errorMsg && <p style={styles.error}>{errorMsg}</p>}

        {result && (
          <div style={styles.resultBlock}>
            <div style={styles.resultHeader}>
              <span style={styles.resultLabel}>Name</span>
              <span
                style={{
                  ...styles.badge,
                  ...(result.available ? styles.badgeFree : styles.badgeTaken),
                }}
              >
                {result.available ? "Available" : "Taken"}
              </span>
            </div>
            <div style={styles.resultName}>{result.name}</div>

            {result.ens && (result.ens.name || result.ens.owner) && (
              <div style={styles.section}>
                <div style={styles.sectionTitle}>ENS (.eth)</div>
                {result.ens.name && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Name:</span>
                    <span>{result.ens.name}</span>
                  </div>
                )}
                {result.ens.owner && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Owner:</span>
                    <span style={styles.mono}>
                      {shorten(result.ens.owner)}
                    </span>
                  </div>
                )}
                {result.ens.displayName && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Display:</span>
                    <span>{result.ens.displayName}</span>
                  </div>
                )}
              </div>
            )}

            {result.fname && (result.fname.username || result.fname.fid) && (
              <div style={styles.section}>
                <div style={styles.sectionTitle}>Farcaster fname</div>
                {result.fname.username && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Username:</span>
                    <a
                      href={`https://warpcast.com/${result.fname.username}`}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      @{result.fname.username}
                    </a>
                  </div>
                )}
                {result.fname.fid !== undefined && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>FID:</span>
                    <span>{result.fname.fid}</span>
                  </div>
                )}
                {result.fname.custodyAddress && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Custody:</span>
                    <span style={styles.mono}>
                      {shorten(result.fname.custodyAddress)}
                    </span>
                  </div>
                )}
                {result.fname.lastTransfer && (
                  <div style={styles.row}>
                    <span style={styles.rowLabel}>Last transfer:</span>
                    <span>
                      {new Date(
                        result.fname.lastTransfer * 1000
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

function shorten(addr: string, left = 6, right = 4) {
  if (addr.length <= left + right + 3) return addr;
  return `${addr.slice(0, left)}…${addr.slice(-right)}`;
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "16px",
    backgroundColor: "#020617",
    color: "#f9fafb",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    marginTop: "16px",
    padding: "16px",
    borderRadius: "16px",
    backgroundColor: "#020617",
    border: "1px solid #1f2937",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: "4px",
  },
  subtitle: {
    fontSize: "14px",
    opacity: 0.75,
    marginBottom: "16px",
  },
  form: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: "999px",
    border: "1px solid #374151",
    backgroundColor: "#020617",
    color: "#f9fafb",
    fontSize: "14px",
    outline: "none",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "999px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "#f9fafb",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  error: {
    fontSize: "13px",
    color: "#f97373",
    marginBottom: "8px",
  },
  resultBlock: {
    marginTop: "8px",
    paddingTop: "8px",
    borderTop: "1px solid #1f2937",
  },
  resultHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "4px",
  },
  resultLabel: {
    fontSize: "13px",
    opacity: 0.7,
  },
  badge: {
    padding: "2px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 600,
  },
  badgeFree: {
    backgroundColor: "#14532d",
    color: "#bbf7d0",
  },
  badgeTaken: {
    backgroundColor: "#450a0a",
    color: "#fecaca",
  },
  resultName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "10px",
  },
  section: {
    marginTop: "10px",
    paddingTop: "8px",
    borderTop: "1px solid #1f2937",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: 600,
    marginBottom: "6px",
    opacity: 0.9,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "2px",
    gap: "8px",
  },
  rowLabel: {
    opacity: 0.7,
  },
  mono: {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    fontSize: "12px",
  },
  link: {
    fontSize: "13px",
    color: "#60a5fa",
    textDecoration: "none",
  },
};
