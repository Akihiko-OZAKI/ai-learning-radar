import type { TermDetail, ScoreHistory } from "@/types";

interface HotNewsItem {
  title: string;
  score: number;
  comments: number;
  collected_at: string;
  hn_id: number;
}
import { getThemeColor, getThemeKeyFromName } from "@/lib/theme-colors";
import ThemeBadge from "@/components/ThemeBadge";
import RankChange from "@/components/RankChange";
import RiseReason from "@/components/RiseReason";
import ScoreChart from "@/components/ScoreChart";
import { notFound } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function fetchTerm(slug: string): Promise<TermDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/api/term/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchNews(slug: string, days: number): Promise<HotNewsItem[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/term/${encodeURIComponent(slug)}/news?days=${days}&limit=10`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

async function fetchHistory(
  slug: string,
  days: number
): Promise<ScoreHistory[]> {
  try {
    const res = await fetch(
      `${API_BASE}/api/term/${encodeURIComponent(slug)}/history?days=${days}`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.history ?? [];
  } catch {
    return [];
  }
}

export default async function TermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const termName = decodeURIComponent(slug);

  const [term, history30, news] = await Promise.all([
    fetchTerm(termName),
    fetchHistory(termName, 30),
    fetchNews(termName, 30),
  ]);

  if (!term) notFound();

  const themeKey = term.theme_key ?? getThemeKeyFromName(term.theme_name);
  const { color: themeColor } = getThemeColor(themeKey);

  return (
    <div style={{ maxWidth: "900px" }}>
      {/* パンくず */}
      <div
        style={{
          fontSize: "12px",
          color: "var(--text-muted)",
          marginBottom: "12px",
        }}
      >
        <a href="/" style={{ color: "var(--text-muted)" }}>
          ランキング
        </a>{" "}
        / {term.term_name}
      </div>

      {/* 用語ヘッダー */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {term.term_name}
            </h1>
            {term.is_permanent === 1 && (
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(63,185,80,0.15)",
                  color: "var(--accent-green)",
                  fontWeight: 700,
                  border: "1px solid rgba(63,185,80,0.3)",
                }}
              >
                永続登録済み
              </span>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <ThemeBadge themeName={term.theme_name} themeKey={themeKey} />
            {term.category && (
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  padding: "2px 8px",
                  border: "1px solid var(--border)",
                  borderRadius: "4px",
                }}
              >
                {term.category}
              </span>
            )}
          </div>
        </div>

        {/* 今日のスコアサマリー */}
        {term.today && (
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            <StatBox label="現在順位" value={`#${term.today.rank ?? "-"}`} />
            <StatBox
              label="総合スコア"
              value={term.today.total_score.toLocaleString()}
            />
            <StatBox
              label="順位変動"
              valueNode={<RankChange change={term.today.rank_change} />}
            />
          </div>
        )}
      </div>

      {/* 説明文 */}
      {term.description && (
        <div
          className="card"
          style={{ marginBottom: "16px" }}
        >
          <div className="card-header">📝 説明</div>
          <div
            style={{
              padding: "14px 16px",
              fontSize: "14px",
              lineHeight: "1.7",
              color: "var(--text-primary)",
            }}
          >
            {term.description}
          </div>
        </div>
      )}

      {/* スコア推移グラフ */}
      <div className="card" style={{ marginBottom: "16px" }}>
        <div className="card-header">
          📈 スコア推移
          <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
            過去30日
          </span>
        </div>
        <div style={{ padding: "16px" }}>
          <ScoreChart history={history30} />
        </div>
      </div>

      {/* メタ情報 */}
      <div className="card">
        <div className="card-header">ℹ️ 詳細情報</div>
        <div style={{ padding: "14px 16px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <tbody>
              <MetaRow label="初観測日" value={term.first_seen} />
              <MetaRow label="最終観測日" value={term.last_seen} />
              <MetaRow
                label="過去最高順位"
                value={term.peak_rank != null ? `#${term.peak_rank}` : "-"}
              />
              {term.today && (
                <>
                  <MetaRow
                    label="GitHubスコア"
                    value={term.today.github_score.toLocaleString()}
                  />
                  <MetaRow
                    label="HNスコア"
                    value={term.today.hn_score.toLocaleString()}
                  />
                  <MetaRow
                    label="上昇理由"
                    valueNode={<RiseReason reason={term.today.rise_reason} />}
                  />
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hot News */}
      {news.length > 0 && (
        <div className="card" style={{ marginTop: "20px" }}>
          <div className="card-header">
            🔥 Hot News
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              Hacker News 過去30日
            </span>
          </div>
          <div style={{ padding: "8px 0" }}>
            {news.map((item, i) => (
              <a
                key={i}
                href={`https://news.ycombinator.com/item?id=${item.hn_id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  padding: "10px 16px",
                  borderBottom: i < news.length - 1 ? "1px solid var(--border)" : "none",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-secondary)")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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
        </div>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  valueNode,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "10px 16px",
        textAlign: "center",
        minWidth: "90px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: "var(--text-muted)",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: "var(--text-primary)",
          fontFamily: "monospace",
        }}
      >
        {valueNode ?? value}
      </div>
    </div>
  );
}

function MetaRow({
  label,
  value,
  valueNode,
}: {
  label: string;
  value?: string;
  valueNode?: React.ReactNode;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "6px 0",
          color: "var(--text-muted)",
          width: "140px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {label}
      </td>
      <td
        style={{
          padding: "6px 0",
          color: "var(--text-primary)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {valueNode ?? value ?? "-"}
      </td>
    </tr>
  );
}
