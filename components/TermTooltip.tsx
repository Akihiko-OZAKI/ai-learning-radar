"use client";

import { useState, useRef } from "react";

interface Props {
  termName: string;
  description: string | null;
  href: string;
}

const TOOLTIP_WIDTH = 280;
const TOOLTIP_HEIGHT_ESTIMATE = 120; // ポップアップの推定高さ（px）
const MARGIN = 16; // 画面端からの余白

export default function TermTooltip({ termName, description, href }: Props) {
  const [visible, setVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLSpanElement>(null);

  const calcPosition = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // 水平方向: カーソル右に表示、右端に近ければ左に表示
    let left: number | undefined;
    let right: number | undefined;
    if (x + TOOLTIP_WIDTH + MARGIN + 14 > vw) {
      // 右端に近い → カーソルの左側に表示
      right = vw - x + 8;
      left = undefined;
    } else {
      left = x + 14;
      right = undefined;
    }

    // 垂直方向: カーソル下に表示、下端に近ければ上に表示
    let top: number | undefined;
    let bottom: number | undefined;
    if (y + TOOLTIP_HEIGHT_ESTIMATE + MARGIN + 14 > vh) {
      // 下端に近い → カーソルの上側に表示
      bottom = vh - y + 8;
      top = undefined;
    } else {
      top = y + 14;
      bottom = undefined;
    }

    setTooltipStyle({
      position: "fixed",
      left: left !== undefined ? left : undefined,
      right: right !== undefined ? right : undefined,
      top: top !== undefined ? top : undefined,
      bottom: bottom !== undefined ? bottom : undefined,
      zIndex: 9999,
      maxWidth: `${TOOLTIP_WIDTH}px`,
      backgroundColor: "var(--bg-card, #1e2433)",
      border: "1px solid var(--border, #30363d)",
      borderRadius: "8px",
      padding: "10px 14px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      pointerEvents: "none",
    });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    calcPosition(e);
    setVisible(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    calcPosition(e);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  const tooltipText = description && description.trim()
    ? description
    : "説明文なし（詳細ページで確認）";

  return (
    <span
      ref={containerRef}
      style={{ position: "relative", display: "inline" }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <a
        href={href}
        style={{ color: "var(--text-primary)", fontWeight: 500 }}
      >
        {termName}
      </a>

      {visible && (
        <div style={tooltipStyle}>
          {/* 用語名 */}
          <div
            style={{
              fontWeight: 700,
              fontSize: "13px",
              color: "var(--text-primary, #e6edf3)",
              marginBottom: "6px",
              borderBottom: "1px solid var(--border, #30363d)",
              paddingBottom: "6px",
            }}
          >
            {termName}
          </div>
          {/* 説明文 */}
          <div
            style={{
              fontSize: "12px",
              lineHeight: "1.6",
              color: description && description.trim()
                ? "var(--text-secondary, #8b949e)"
                : "var(--text-muted, #6e7681)",
              fontStyle: description && description.trim() ? "normal" : "italic",
            }}
          >
            {tooltipText}
          </div>
        </div>
      )}
    </span>
  );
}
