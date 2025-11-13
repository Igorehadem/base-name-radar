"use client";

import { useState } from "react";

export default function CheckPage() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function checkName() {
    if (!name) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/name/${name}`);
      const json = await res.json();
      setResult(json);
    } catch (err) {
      setResult({ error: "Request failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h1>Check Name</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a name"
        style={{
          padding: 8,
          width: "100%",
          marginBottom: 12,
          fontSize: 16,
        }}
      />

      <button
        onClick={checkName}
        style={{
          padding: "8px 12px",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        Check
      </button>

      {loading && <p>Checking...</p>}

      {result && (
        <pre
          style={{
            marginTop: 16,
            padding: 12,
            background: "#111",
            color: "#eee",
            borderRadius: 8,
            overflowX: "auto",
          }}
        >
{JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
