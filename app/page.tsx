import type {
  RankingItem,
  ThemeRankingItem,
  NewTermItem,
  StatusResponse,
  VolatilityIndex,
} from "@/types";
import { getThemeKeyFromName } from "@/lib/theme-colors";
import ThemeBadge from "@/components/ThemeBadge";
import RankChange from "@/components/RankChange";
import RiseReason from "@/components/RiseReason";
import ThemeRankingCard from "@/components/ThemeRankingCard";
import VolatilityGauge from "@/components/VolatilityGauge";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8000";

async function fetchData<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: 300 }, // 5分キャッシュ
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const [status, popular, rising, themes, newTerms, volatility] = await Promise.all([
    fetchData<StatusResponse>("/api/status"),
    fetchData<{ date: string; items: RankingItem[] }>("/api/ranking/popular?limit=20"),
    fetchData<{ date: string; items: RankingItem[] }>("/api/ranking/rising?limit=20"),
    fetchData<{ date: string; items: ThemeRankingItem[] }>("/api/ranking/themes"),
    fetchData<{ items: NewTermItem[] }>("/api/ranking/new?days=30&limit=10"),
    fetchData<VolatilityIndex>("/api/volatility"),
  ]);

  const popularItems = popular?.items ?? [];
  const risingItems = rising?.items ?? [];
  const themeItems = themes?.items ?? [];
  const newItems = newTerms?.items ?? [];
  const lastUpdated = status?.last_updated ?? "-";

  return (
    <div>
      {/* ステータスバー */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "16px",
          padding: "8px 12px",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "6px",
          border: "1px solid var(--border)",
          fontSize: "12px",
          color: "var(--text-secondary)",
        }}
      >
        <span>最終更新: <strong style={{ color: "var(--text-primary)" }}>{lastUpdated}</strong></span>
        <span>登録用語数: <strong style={{ color: "var(--text-primary)" }}>{status?.total_terms ?? "-"}</strong></span>
        <span>永続登録: <strong style={{ color: "var(--accent-green)" }}>{status?.permanent_terms ?? "-"}</strong></span>
        <span style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
          データソース: GitHub / Hacker News
        </span>
      </div>

      {/* AI変動指数 */}
      <section style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-header">
            ⚡ AI変動指数
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              AI業界の変化速度（0〜100）
            </span>
          </div>
          <VolatilityGauge data={volatility} />
        </div>
      </section>

      {/* AIテーマランキング */}
      <section style={{ marginBottom: "20px" }}>
        <div className="card">
          <div className="card-header">
            📊 AIテーマランキング
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              テーマ別スコア合計
            </span>
          </div>
          <div style={{ padding: "12px" }}>
            {themeItems.length === 0 ? (
              <EmptyState message="データがありません" />
            ) : (
              <ThemeRankingCard items={themeItems} />
            )}
          </div>
        </div>
      </section>

      {/* 2カラムレイアウト: 人気 + 急上昇 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        {/* 人気ランキング */}
        <div className="card">
          <div className="card-header">
            🔥 人気ランキング
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              TOP 20
            </span>
          </div>
          {popularItems.length === 0 ? (
            <div style={{ padding: "20px" }}><EmptyState message="データがありません" /></div>
          ) : (
            <table className="rank-table">
              <thead>
                <tr>
                  <th style={{ width: "36px" }}>#</th>
                  <th>用語</th>
                  <th>テーマ</th>
                  <th style={{ textAlign: "right" }}>スコア</th>
                  <th style={{ textAlign: "right" }}>変動</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {popularItems.map((item) => (
                  <tr key={item.term_name}>
                    <td>
                      <span
                        className={`rank-badge${item.rank === 1 ? " top1" : item.rank === 2 ? " top2" : item.rank === 3 ? " top3" : ""}`}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`/term/${encodeURIComponent(item.term_name)}`}
                        style={{ color: "var(--text-primary)", fontWeight: 500 }}
                      >
                        {item.term_name}
                      </a>
                    </td>
                    <td>
                      <ThemeBadge
                        themeName={item.theme_name}
                        themeKey={getThemeKeyFromName(item.theme_name)}
                      />
                    </td>
                    <td style={{ textAlign: "right", fontFamily: "monospace" }}>
                      {item.total_score.toLocaleString()}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <RankChange change={item.rank_change} />
                    </td>
                    <td>
                      <RiseReason reason={item.rise_reason} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 急上昇ランキング */}
        <div className="card">
          <div className="card-header">
            🚀 急上昇ランキング
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              TOP 20
            </span>
          </div>
          {risingItems.length === 0 ? (
            <div style={{ padding: "20px" }}>
              <EmptyState message="2日目以降に表示されます" />
            </div>
          ) : (
            <table className="rank-table">
              <thead>
                <tr>
                  <th style={{ width: "36px" }}>#</th>
                  <th>用語</th>
                  <th>テーマ</th>
                  <th style={{ textAlign: "right" }}>上昇幅</th>
                  <th>理由</th>
                </tr>
              </thead>
              <tbody>
                {risingItems.map((item, i) => (
                  <tr key={item.term_name}>
                    <td>
                      <span className={`rank-badge${i === 0 ? " top1" : i === 1 ? " top2" : i === 2 ? " top3" : ""}`}>
                        {i + 1}
                      </span>
                    </td>
                    <td>
                      <a
                        href={`/term/${encodeURIComponent(item.term_name)}`}
                        style={{ color: "var(--text-primary)", fontWeight: 500 }}
                      >
                        {item.term_name}
                      </a>
                    </td>
                    <td>
                      <ThemeBadge
                        themeName={item.theme_name}
                        themeKey={getThemeKeyFromName(item.theme_name)}
                      />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <span className="change-up">+{item.rank_change}</span>
                    </td>
                    <td>
                      <RiseReason reason={item.rise_reason} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* 新規発見 */}
      <section>
        <div className="card">
          <div className="card-header">
            ✨ 新規発見
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 400 }}>
              過去30日以内に初登場した用語
            </span>
          </div>
          {newItems.length === 0 ? (
            <div style={{ padding: "20px" }}><EmptyState message="データがありません" /></div>
          ) : (
            <table className="rank-table">
              <thead>
                <tr>
                  <th>用語</th>
                  <th>テーマ</th>
                  <th>カテゴリ</th>
                  <th>初観測日</th>
                  <th style={{ textAlign: "right" }}>スコア</th>
                </tr>
              </thead>
              <tbody>
                {newItems.map((item) => (
                  <tr key={item.term_name}>
                    <td>
                      <a
                        href={`/term/${encodeURIComponent(item.term_name)}`}
                        style={{ color: "var(--text-primary)", fontWeight: 500 }}
                      >
                        {item.term_name}
                      </a>
                      <span
                        style={{
                          marginLeft: "6px",
                          fontSize: "10px",
                          color: "var(--accent-orange)",
                          fontWeight: 700,
                        }}
                      >
                        NEW
                      </span>
                    </td>
                    <td>
                      <ThemeBadge
                        themeName={item.theme_name}
                        themeKey={getThemeKeyFromName(item.theme_name)}
                      />
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                      {item.category ?? "-"}
                    </td>
                    <td style={{ color: "var(--text-secondary)", fontSize: "12px" }}>
                      {item.first_seen}
                    </td>
                    <td
                      style={{
                        textAlign: "right",
                        fontFamily: "monospace",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {item.total_score != null ? item.total_score.toLocaleString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        color: "var(--text-muted)",
        padding: "20px",
        fontSize: "13px",
      }}
    >
      {message}
    </div>
  );
}
