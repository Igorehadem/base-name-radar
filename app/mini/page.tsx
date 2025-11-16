"use client";

import { useEffect, useState } from "react";
import { sdk } from "@farcaster/mini-apps";

export default function MiniApp() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    sdk.actions.ready();
  }, []);

  return (
    <main
      style={{
        background: "#0d0d0d",
        color: "white",
        minHeight: "100vh",
        padding: "32px",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 16 }}>Base Name Radar</h1>

      <p style={{ fontSize: 18, opacity: 0.7 }}>
        Check if a Base name is available.
      </p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="enter name"
        style={{
          marginTop: 24,
          padding: "12px 16px",
          fontSize: 18,
          borderRadius: 12,
          width: "100%",
          border: "1px solid #333",
          background: "#1a1a1a",
          color: "white",
        }}
      />

      <button
        onClick={async () => {
          if (!name.trim()) {
            setResult("Enter a name.");
            return;
          }
        
          setResult("Checking...");
          try {
            const res = await fetch(`/api/name/${name}`);
            if (!res.ok) {
              setResult("Error checking name.");
              return;
            }
        
            const data = await res.json();
        
            if (data.available) {
              setResult(`"${name}" is AVAILABLE 🎉`);
            } else {
              setResult(`"${name}" is TAKEN ❌`);
            }
          } catch (err) {
            setResult("Network error.");
          }
        }}
        style={{
          marginTop: 16,
          padding: "12px 16px",
          fontSize: 18,
          borderRadius: 12,
          width: "100%",
          background: "#3b82f6",
          color: "white",
          border: "none",
        }}
      >
        Check
      </button>

      {result && (
        <p style={{ marginTop: 24, fontSize: 18, opacity: 0.9 }}>{result}</p>
      )}
    </main>
  );
}
