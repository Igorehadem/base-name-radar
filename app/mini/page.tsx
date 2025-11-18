"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/mini-apps-sdk";

let sdk: any = null;
try {
  sdk = require("@farcaster/mini-apps-sdk").sdk;
} catch (e) {
}

function normalizeStatus(obj: any) {
  if (!obj) return "error";
  if (obj.error) return "error";
  return obj.available ? "free" : "taken";
}
useEffect(() => {
  try {
    sdk.actions.ready();
  } catch (e) {
    console.warn("Mini App ready() unavailable outside Warpcast");
  }
}, []);

export default function MiniCheckPage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runCheck() {
    const n = name.trim().toLowerCase();
    if (!n) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const r = await fetch(`/api/name/${n}`);
      const json = await r.json();
      if (!r.ok) {
        setError(json.error || "Unknown API error");
      } else {
        setResult(json);
      }
    } catch (e: any) {
      setError(e?.message || "Network error");
    }

    setLoading(false);
  }

  function onKeyDown(e: any) {
    if (e.key === "Enter") runCheck();
  }

  const ensStatus = result ? normalizeStatus(result.ens) : null;
  const fnameStatus = result ? normalizeStatus(result.fname) : null;

  return (
    <div style={styles.wrap}>
      <h1 style={styles.h1}>Mini Name Checker</h1>

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
          Error: {error}
        </div>
      )}

      {result && !error && (
        <div style={styles.card}>
          <div style={styles.label}>Name:</div>
          <div style={styles.value}>{result.name}</div>

          <div style={{ marginTop: 20 }}>
            <StatusLine
              label="ENS"
              status={ensStatus}
              link={buildEnsLink(result)}
            />

            <StatusLine
              label="FName"
              status={fnameStatus}
              link={buildFnameLink(result)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function StatusLine({ label, status, link }: any) {
  const color =
    status === "free"
      ? "#16a34a"
      : status === "taken"
      ? "#dc2626"
      : "#9ca3af";

  return (
    <div style={{ marginBottom: 12 }}>
      <span style={{ fontWeight: 600 }}>{label}:</span>{" "}
      <span style={{ color, fontWeight: 600 }}>{status}</span>
      {link && (
        <>
          {" "}
          <a
            href={link}
            target="_blank"
            style={{ color: "#60a5fa", fontSize: 14, marginLeft: 6 }}
          >
            open →
          </a>
        </>
      )}
    </div>
  );
}

function buildEnsLink(result: any) {
  if (!result?.ens) return null;
  if (result.ens.available) return "https://app.ens.domains/";
  if (result.ens.address)
    return `https://etherscan.io/address/${result.ens.address}`;
  return null;
}

function buildFnameLink(result: any) {
  if (!result?.fname) return null;
  if (result.fname.available) return null;
  if (result.fname.currentOwnerFid)
    return `https://warpcast.com/~/profiles/${result.fname.currentOwnerFid}`;
  return null;
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    maxWidth: 480,
    margin: "0 auto",
    padding: 24,
    textAlign: "center",
  },
  h1: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #444",
    outline: "none",
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
    padding: 12,
    borderRadius: 10,
    background: "#450a0a",
    color: "#fecaca",
    fontSize: 14,
    marginBottom: 16,
  },
  card: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 12,
    border: "1px solid #334155",
    textAlign: "left",
  },
  label: {
    fontSize: 14,
    opacity: 0.7,
  },
  value: {
    fontSize: 20,
    fontWeight: 700,
  },
};
