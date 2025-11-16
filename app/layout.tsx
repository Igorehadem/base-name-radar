import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base Name Checker",
  description: "Instant Base Name availability checker",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png"
  },
  themeColor: "#000000"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#000",
          color: "#fff",
          fontFamily: "sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
