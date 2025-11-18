"use client";

import { useState, useEffect, FormEvent } from "react";
import { sdk } from "@farcaster/mini-apps-sdk"; // ← правильный SDK ДЛЯ MINI APP

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

  // 🚀 Сообщаем Warpcast, что контент мини-аппы готов
  useEffect(() => {
    sdk.actions.ready();
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

        {/* FORM */}
        <form onSubmit={handleCheck} style={s.form}>
          <input
            style={s.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name (e.g. igoreha)"
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
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <span>ENS (.eth)</span>
                <span
                  style={{
                    ...s.badgeSmall,
                    ...(result.ens.available ? s.smallFree : s.smallTaken),
                  }}
                >
                  {result.ens.available ? "Available" : "Taken"}
                </span>
              </div>

              <div style={s.value}>{result.ens.domain}</div>

              {!result.ens.available && (
                <>
                  {result.ens.avatar && (
                    <img
                      src={result.ens.avatar}
                      style={s.avatar}
                      alt=""
                      onError={(e) =>
                        ((e.target as HTMLImageElement).style.display = "none")
                      }
                    />
                  )}

                  <div style={s.row}>
                    <span style={s.label}>Owner</span>
                    <span style={s.mono}>{short(result.ens.address!)}</span>
                  </div>

                  {result.ens.displayName && (
                    <div style={s.row}>
                      <span style={s.label}>Display</span>
                      <span>{result.ens.displayName}</span>
                    </div>
                  )}
                </>
              )}

              {result.ens.available && (
                <div style={s.availableHint}>ENS name is free</div>
              )}
            </div>

            {/* FNAME */}
            <div style={s.section}>
              <div style={s.sectionHeader}>
                <span>Farcaster FName</span>
                <span
                  style={{
                    ...s.badgeSmall,
                    ...(result.fname.available ? s.smallFree : s.smallTaken),
                  }}
                >
                  {result.fname.available ? "Available" : "Taken"}
                </span>
              </div>

              <div style={s.value}>@{result.fname.name}</div>

              {!result.fname.available && (
                <>
                  <div style={s.row}>
                    <span style={s.label}>FID</span>
                    <span>{result.fname.currentOwnerFid}</span>
                  </div>

                  <div style={s.row}>
                    <span style={s.label}>Custody</span>
                    <span style={s.mono}>
                      {short(result.fname.ownerAddress!)}
                    </span>
                  </div>

                  {result.fname.lastTransferTimestamp && (
                    <div style={s.row}>
                      <span style={s.label}>Last transfer</span>
                      <span>
                        {new Date(
                          result.fname.lastTransferTimestamp * 1000
                        ).toLocaleString()}
                      </span>
                    </div>
                  )}
                </>
              )}

              {result.fname.available && (
                <div style={s.availableHint}>FName is free</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function short(addr: string, l = 6, r = 4) {
  return `${addr.slice(0, l)}…${addr.slice(-r)}`;
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#020617",
    padding: 12,
    display: "flex",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 480,
    background: "#0f172a",
    borderRadius: 16,
    padding: 16,
    border: "1px solid #1e293b",
    color: "white",
  },

  title: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 16,
  },

  form: {
    display: "flex",
    gap: 8,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 10,
    background: "#1e293b",
    border: "1px solid #334155",
    color: "white",
    fontSize: 14,
  },

  button: {
    padding: "10px 14px",
    borderRadius: 10,
    background: "#2563eb",
    border: "none",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  error: {
    color: "#f87171",
    fontSize: 13,
    marginBottom: 8,
  },

  resultRoot: {
    marginTop: 8,
  },

  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 14,
    opacity: 0.8,
  },

  resultName: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
  },

  badge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
  },

  badgeFree: { background: "#14532d", color: "#bbf7d0" },
  badgeTaken: { background: "#450a0a", color: "#fecaca" },

  section: {
    borderTop: "1px solid #1e293b",
    paddingTop: 12,
    marginTop: 12,
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 4,
    fontSize: 15,
    fontWeight: 600,
  },

  badgeSmall: {
    padding: "2px 8px",
    borderRadius: 999,
    fontSize: 11,
  },

  smallFree: { background: "#166534", color: "#bbf7d0" },
  smallTaken: { background: "#7f1d1d", color: "#fecaca" },

  value: {
    fontSize: 16,
    fontWeight: 600,
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 6,
    fontSize: 14,
  },

  label: { opacity: 0.6 },

  mono: {
    fontFamily: "monospace",
    fontSize: 12,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: "50%",
    marginTop: 8,
    marginBottom: 8,
  },

  availableHint: {
    fontSize: 13,
    marginTop: 6,
    opacity: 0.8,
    color: "#4ade80",
  },
};
