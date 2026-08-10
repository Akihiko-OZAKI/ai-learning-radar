"use client";

import { useState, useRef } from "react";

interface Props {
  termName: string;
  description: string | null;
  href: string;
}

export default function TermTooltip({ termName, description, href }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setVisible(true);
    updatePos(e);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updatePos(e);
  };

  const handleMouseLeave = () => {
    setVisible(false);
  };

  const updatePos = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
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
        <div
          style={{
            position: "fixed",
            left: pos.x + 14,
            top: pos.y + 14,
            zIndex: 9999,
            maxWidth: "280px",
            backgroundColor: "var(--bg-card, #1e2433)",
            border: "1px solid var(--border, #30363d)",
            borderRadius: "8px",
            padding: "10px 14px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            pointerEvents: "none",
          }}
        >
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
