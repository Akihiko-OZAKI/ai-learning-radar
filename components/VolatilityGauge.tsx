"use client";

import type { VolatilityIndex } from "@/types";

interface Props {
  data: VolatilityIndex | null;
}

const LABEL_STYLES: Record<string, { color: string; glow: string; gradient: string }> = {
  "安定":             { color: "#3fb950", glow: "rgba(63,185,80,0.4)",   gradient: "linear-gradient(90deg, #3fb950 0%, #58a6ff 100%)" },
  "活発":             { color: "#58a6ff", glow: "rgba(88,166,255,0.4)",  gradient: "linear-gradient(90deg, #3fb950 0%, #58a6ff 60%, #f0883e 100%)" },
  "急変":             { color: "#f0883e", glow: "rgba(240,136,62,0.4)",  gradient: "linear-gradient(90deg, #3fb950 0%, #58a6ff 40%, #f0883e 80%, #f85149 100%)" },
  "パラダイムシフト": { color: "#f85149", glow: "rgba(248,81,73,0.5)",   gradient: "linear-gradient(90deg, #3fb950 0%, #58a6ff 33%, #f0883e 66%, #f85149 100%)" },
};

const COMPONENT_LABELS: Record<string, string> = {
  surge_rate:       "急上昇率",
  rank_change_rate: "ランキング入替率",
  new_term_rate:    "新規用語出現率",
  volume_change:    "総言及量変化",
};

const COMPONENT_ICONS: Record<string, string> = {
  surge_rate:       "🚀",
  rank_change_rate: "🔄",
  new_term_rate:    "✨",
  volume_change:    "📊",
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
  const style = LABEL_STYLES[label] ?? LABEL_STYLES["安定"];
  const barPercent = Math.min(score, 100);

  return (
    <div style={{ padding: "16px" }}>
      {/* スコア + ラベル */}
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "16px" }}>
        {/* 大きなスコア数値 */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 700,
              fontFamily: "monospace",
              color: style.color,
              lineHeight: 1,
              textShadow: `0 0 20px ${style.glow}`,
              letterSpacing: "-2px",
            }}
          >
            {Math.round(score)}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "center", marginTop: "2px" }}>
            / 100
          </div>
        </div>

        {/* ラベルと説明 */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "20px",
              backgroundColor: `${style.color}22`,
              color: style.color,
              border: `1px solid ${style.color}66`,
              fontWeight: 700,
              fontSize: "16px",
              marginBottom: "8px",
              boxShadow: `0 0 12px ${style.glow}`,
            }}
          >
            {label === "安定" && "🟢"}
            {label === "活発" && "🔵"}
            {label === "急変" && "🟠"}
            {label === "パラダイムシフト" && "🔴"}
            {label}
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-muted)", lineHeight: 1.6 }}>
            AI技術トレンドの変化速度を示す指数
          </div>
        </div>
      </div>

      {/* グラデーションゲージバー */}
      <div style={{ marginBottom: "6px" }}>
        <div
          style={{
            height: "12px",
            backgroundColor: "var(--bg-secondary)",
            borderRadius: "6px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            position: "relative",
          }}
        >
          {/* グラデーションバー */}
          <div
            style={{
              height: "100%",
              width: `${barPercent}%`,
              background: style.gradient,
              borderRadius: "6px",
              transition: "width 0.6s ease",
              boxShadow: `0 0 8px ${style.glow}`,
            }}
          />
          {/* 目盛り線（20/50/80） */}
          {[20, 50, 80].map((mark) => (
            <div
              key={mark}
              style={{
                position: "absolute",
                left: `${mark}%`,
                top: 0,
                height: "100%",
                width: "1px",
                backgroundColor: "var(--border)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
        {/* 目盛りラベル */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "10px",
            color: "var(--text-muted)",
            marginTop: "3px",
            padding: "0 2px",
          }}
        >
          <span>0</span>
          <span style={{ marginLeft: "calc(20% - 8px)" }}>安定</span>
          <span style={{ marginLeft: "calc(30% - 8px)" }}>活発</span>
          <span style={{ marginLeft: "calc(30% - 8px)" }}>急変</span>
          <span>100</span>
        </div>
      </div>

      {/* 成分内訳 */}
      <div style={{ marginTop: "14px" }}>
        <div style={{ color: "var(--text-muted)", fontSize: "11px", fontWeight: 600, marginBottom: "8px" }}>
          指数の内訳
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
          {Object.entries(components).map(([key, value]) => {
            const weight = weights[key as keyof typeof weights];
            const contribution = value * weight * 100;
            const barW = Math.min(value * 100, 100);
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
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px" }}>{COMPONENT_ICONS[key]}</span>
                  <span style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                    {COMPONENT_LABELS[key]}
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "10px", marginLeft: "auto" }}>
                    ×{Math.round(weight * 100)}%
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div
                    style={{
                      flex: 1,
                      height: "5px",
                      backgroundColor: "var(--border)",
                      borderRadius: "3px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${barW}%`,
                        background: style.gradient,
                        opacity: 0.85,
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: contribution > 5 ? style.color : "var(--text-secondary)",
                      minWidth: "28px",
                      textAlign: "right",
                    }}
                  >
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
