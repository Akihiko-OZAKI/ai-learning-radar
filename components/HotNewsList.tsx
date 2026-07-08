"use client";

interface HotNewsItem {
  title: string;
  score: number;
  comments: number;
  collected_at: string;
  hn_id: number;
}

interface Props {
  items: HotNewsItem[];
}

export default function HotNewsList({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div style={{ padding: "8px 0" }}>
      {items.map((item, i) => (
        <a
          key={i}
          href={`https://news.ycombinator.com/item?id=${item.hn_id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hot-news-item"
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "10px 16px",
            borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
            textDecoration: "none",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: "14px",
                color: "var(--text-primary)",
                fontWeight: 500,
                lineHeight: 1.4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.title}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "3px" }}>
              {item.collected_at}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexShrink: 0, fontSize: "12px" }}>
            <span style={{ color: "var(--accent-orange)" }}>▲ {item.score}</span>
            <span style={{ color: "var(--text-muted)" }}>💬 {item.comments}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
