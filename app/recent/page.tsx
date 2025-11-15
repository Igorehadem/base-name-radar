"use client";
import { default as useSWR } from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function RecentPage() {
  const { data, isLoading } = useSWR("/api/radar", fetcher, {
    refreshInterval: 15000, // auto-refresh every 15 seconds
  });

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Recently Freed Names</h1>

      {isLoading && <p style={styles.loading}>Loading...</p>}

      {!isLoading && (!data || data.length === 0) && (
        <p style={styles.empty}>No recently freed names yet.</p>
      )}

      <div style={styles.grid}>
        {data?.map((item: any, i: number) => (
          <div key={i} style={styles.card}>
            <div style={styles.name}>{item.name}</div>

            <div style={styles.meta}>
              Freed: {new Date(item.timestamp).toLocaleString()}
            </div>

            <a
              href={`/check?name=${item.name}`}
              style={styles.link}
            >
              Check this name →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: Record<string, any> = {
  container: {
    padding: "40px",
    maxWidth: "900px",
    margin: "0 auto",
    color: "#eee",
  },
  title: {
    fontSize: "36px",
    fontWeight: "600",
    marginBottom: "30px",
    textAlign: "center",
  },
  loading: {
    textAlign: "center",
    opacity: 0.7,
  },
  empty: {
    textAlign: "center",
    opacity: 0.5,
    fontSize: "20px",
    marginTop: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #333",
  },
  name: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "10px",
  },
  meta: {
    fontSize: "14px",
    opacity: 0.7,
    marginBottom: "12px",
  },
  link: {
    fontSize: "16px",
    color: "#3b82f6",
    textDecoration: "none",
    fontWeight: "500",
  },
};
