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

    const res = await fetch(`/api/name/${name}`);
    const json = await res.json();
    setResult(json);
    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Check Base Name</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter a name"
        style={styles.input}
      />

      <button onClick={checkName} style={styles.button}>
        {loading ? "Checking..." : "Check"}
      </button>

      {result && (
        <div style={styles.card}>
          {result.available ? (
            <div style={styles.free}>AVAILABLE 🎉</div>
          ) : (
            <div style={styles.taken}>TAKEN 🔒</div>
          )}

          <div style={styles.resultName}>{result.name}</div>

          {!result.available && (
            <>
              <img
                src={result.pfp}
                alt="pfp"
                style={styles.avatar}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />

              <a
                href={`https://warpcast.com/${result.username}`}
                target="_blank"
                style={styles.link}
              >
                Open in Warpcast →
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    padding: "40px",
    maxWidth: "500px",
    margin: "0 auto",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "18px",
    background: "#222",
    border: "1px solid #444",
    borderRadius: "8px",
    color: "#eee",
    marginBottom: "15px",
  },
  button: {
    width: "100%",
    padding: "12px",
    fontSize: "18px",
    background: "#3b82f6",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    color: "white",
  },
  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  free: {
    fontSize: "20px",
    color: "#22c55e",
    marginBottom: "10px",
  },
  taken: {
    fontSize: "20px",
    color: "#ef4444",
    marginBottom: "10px",
  },
  resultName: {
    fontSize: "26px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    margin: "10px auto",
    display: "block",
  },
  link: {
    display: "inline-block",
    marginTop: "10px",
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "500",
  },
};
