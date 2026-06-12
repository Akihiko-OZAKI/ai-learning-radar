"use client";

import type { VolatilityIndex } from "@/types";

interface Props {
  data: VolatilityIndex | null;
}

const LABEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  "安定":             { bg: "rgba(63,185,80,0.12)",  color: "#3fb950", border: "rgba(63,185,80,0.4)" },
  "活発":             { bg: "rgba(88,166,255,0.12)", color: "#58a6ff", border: "rgba(88,166,255,0.4)" },
  "急変":             { bg: "rgba(240,136,62,0.12)", color: "#f0883e", border: "rgba(240,136,62,0.4)" },
  "パラダイムシフト": { bg: "rgba(248,81,73,0.12)",  color: "#f85149", border: "rgba(248,81,73,0.4)" },
};

const COMPONENT_LABELS: Record<string, string> = {
  surge_rate:       "急上昇率",
  rank_change_rate: "ランキング入替率",
  new_term_rate:    "新規用語出現率",
  volume_change:    "総言及量変化",
};

export default function VolatilityGauge({ data }: Props) {
  if (!data) {
    return (
      <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "20px", fontSize: "13px" }}>
        データがありません
      </div>
    );
  }

  const { score, label, components, weights } = data;
  const style = LABEL_COLORS[label] ?? LABEL_COLORS["安定"];

  // ゲージバーの幅（0〜100%）
  const barWidth = `${Math.min(score, 100)}%`;

  return (
    <div style={{ padding: "16px" }}>
      {/* スコア表示 */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "14px" }}>
        {/* 数値 */}
        <div
          style={{
            fontSize: "56px",
            fontWeight: 700,
            fontFamily: "monospace",
            color: style.color,
            lineHeight: 1,
            minWidth: "80px",
          }}
        >
          {score.toFixed(1)}
        </div>
        {/* ラベルと説明 */}
        <div>
          <div
            style={{
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: style.bg,
              color: style.color,
              border: `1px solid ${style.border}`,
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "4px",
            }}
          >
            {label}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            0〜20: 安定 / 20〜50: 活発 / 50〜80: 急変 / 80〜100: パラダイムシフト
          </div>
        </div>
      </div>

      {/* ゲージバー */}
      <div
        style={{
          height: "8px",
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "4px",
          overflow: "hidden",
          marginBottom: "16px",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            height: "100%",
            width: barWidth,
            backgroundColor: style.color,
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }}
        />
      </div>

      {/* 成分内訳 */}
      <div style={{ fontSize: "12px" }}>
        <div style={{ color: "var(--text-muted)", marginBottom: "6px", fontWeight: 600 }}>
          指数の内訳
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {Object.entries(components).map(([key, value]) => {
            const weight = weights[key as keyof typeof weights];
            const contribution = value * weight * 100;
            return (
              <div
                key={key}
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ color: "var(--text-muted)", fontSize: "11px", marginBottom: "2px" }}>
                  {COMPONENT_LABELS[key]} ({Math.round(weight * 100)}%)
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      flex: 1,
                      height: "4px",
                      backgroundColor: "var(--border)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${Math.min(value * 100, 100)}%`,
                        backgroundColor: style.color,
                        opacity: 0.7,
                      }}
                    />
                  </div>
                  <span style={{ fontFamily: "monospace", color: "var(--text-secondary)", minWidth: "32px" }}>
                    {contribution.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
