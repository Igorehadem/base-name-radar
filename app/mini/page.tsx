"use client";

import { useState } from "react";

export default function MiniCheckPage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCheck() {
    const trimmed = name.trim().toLowerCase();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/name/${trimmed}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || "API error");
        return;
      }

      setResult(json);
    } catch (e: any) {
      setError(e.message || "Network error");
    }

    setLoading(false);
  }

  function onKeyDown(e: any) {
    if (e.key === "Enter") runCheck();
  }

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Mini ENS + FName Checker</h1>

      <input
        style={styles.input}
        placeholder="enter name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={onKeyDown}
      />

      <button style={styles.btn} onClick={runCheck} disabled={loading}>
        {loading ? "Checking..." : "Check"}
      </button>

      {error && (
        <div style={styles.errorBox}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {result && (
        <div style={styles.resultBox}>
          <div style={styles.section}>
            <h3>ENS (.eth)</h3>
            {result.ens?.error && <p>❌ Error: {result.ens.error}</p>}
            {!result.ens?.error && result.ens.available && <p>🟢 Available</p>}
            {!result.ens?.error && !result.ens.available && (
              <p>🔴 Taken by {short(result.ens.address)}</p>
            )}
          </div>

          <div style={styles.section}>
            <h3>FName (Farcaster)</h3>
            {result.fname?.error && <p>❌ Error: {result.fname.error}</p>}
            {!result.fname?.error && result.fname.available && <p>🟢 Available</p>}
            {!result.fname?.error && !result.fname.available && (
              <p>🔴 Taken (FID {result.fname.currentOwnerFid})</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function short(addr?: string) {
  if (!addr) return "";
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 480,
    margin: "0 auto",
    padding: "24px",
    textAlign: "center",
  },
  h1: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #444",
    background: "#020617",
    color: "#fff",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    padding: "12px",
    fontSize: 16,
    borderRadius: 8,
    border: "none",
    background: "#3b82f6",
    color: "#fff",
    cursor: "pointer",
    marginBottom: 20,
  },
  errorBox: {
    marginTop: 20,
    padding: 10,
    borderRadius: 8,
    background: "#450a0a",
    border: "1px solid #b91c1c",
    color: "#fecaca",
  },
  resultBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#0f172a",
    textAlign: "left",
  },
  section: {
    marginBottom: 16,
  },
};
