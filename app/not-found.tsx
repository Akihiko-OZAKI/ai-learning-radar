export default function NotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
        color: "var(--text-muted)",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔭</div>
      <h2 style={{ fontSize: "20px", color: "var(--text-secondary)", marginBottom: "8px" }}>
        用語が見つかりません
      </h2>
      <p style={{ fontSize: "14px", marginBottom: "24px" }}>
        まだ辞書DBに登録されていないか、URLが間違っている可能性があります。
      </p>
      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "8px 20px",
          backgroundColor: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          color: "var(--text-primary)",
          fontSize: "14px",
        }}
      >
        ランキングに戻る
      </a>
    </div>
  );
}
