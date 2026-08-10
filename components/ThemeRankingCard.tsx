import type { ThemeRankingItem } from "@/types";
import { getThemeColor } from "@/lib/theme-colors";

interface Props {
  items: ThemeRankingItem[];
}

export default function ThemeRankingCard({ items }: Props) {
  const maxScore = Math.max(...items.map((i) => i.total_score), 1);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "8px",
      }}
    >
      {items.map((item, idx) => {
        const { bg, color } = getThemeColor(item.theme_key);
        const barWidth = Math.round((item.total_score / maxScore) * 100);
        return (
          <div
            key={item.theme_key}
            style={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "10px 12px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* バー背景 */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: "100%",
                width: `${barWidth}%`,
                backgroundColor: bg,
                opacity: 0.4,
                transition: "width 0.3s ease",
              }}
            />
            <div style={{ position: "relative" }}>
              {/* ヘッダー行: ランク + 用語数 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                  }}
                >
                  #{idx + 1}
                </span>
                <span
                  style={{ fontSize: "11px", color: "var(--text-muted)" }}
                >
                  {item.term_count}用語
                </span>
              </div>

              {/* テーマ名 */}
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "14px",
                  color,
                  marginBottom: "2px",
                }}
              >
                {item.theme_name}
              </div>

              {/* 合計スコア */}
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: "6px",
                }}
              >
                {Math.round(item.total_score).toLocaleString()}
              </div>

              {/* トップ用語 */}
              {item.top_term && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-secondary)",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  🏆 {item.top_term}
                </div>
              )}

              {/* 急上昇数 */}
              {item.rising_count != null && item.rising_count > 0 && (
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--accent-orange)",
                    fontWeight: 600,
                  }}
                >
                  ▲ {item.rising_count}件 急上昇中
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
