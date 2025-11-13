"use client";

import { useEffect, useState } from "react";

export default function RecentPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/radar");
        const json = await res.json();
        setItems(json);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ padding: 24, maxWidth: 500 }}>
      <h1>Recently Freed Names</h1>

      {loading && <p>Loading...</p>}

      {!loading && items.length === 0 && (
        <p>No recently freed names yet.</p>
      )}

      {!loading &&
        items.length > 0 &&
        items.map((item, idx) => (
          <div
            key={idx}
            style={{
              padding: "8px 12px",
              marginBottom: 8,
              background: "#111",
              color: "#eee",
              borderRadius: 6,
            }}
          >
            <strong>{item.name}</strong>
            <br />
            <small>{item.freedAt}</small>
          </div>
        ))}
    </div>
  );
}
