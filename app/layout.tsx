import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI変化観測所",
  description:
    "世界のAI開発コミュニティを観測し、今どこにエネルギーが流れているかを可視化する。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border)",
            padding: "0 16px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <a
            href="/"
            style={{
              color: "var(--text-primary)",
              fontWeight: 700,
              fontSize: "16px",
              letterSpacing: "0.02em",
              textDecoration: "none",
            }}
          >
            🔭 AI変化観測所
          </a>
          <nav style={{ display: "flex", gap: "16px", fontSize: "13px" }}>
            <a href="/" style={{ color: "var(--text-secondary)" }}>
              ランキング
            </a>
          </nav>
        </header>
        <main
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "16px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
