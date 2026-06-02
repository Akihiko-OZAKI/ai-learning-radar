export const THEME_COLORS: Record<string, { bg: string; color: string }> = {
  llm:              { bg: "rgba(188,140,255,0.15)", color: "#bc8cff" },
  ai_coding:        { bg: "rgba(63,185,80,0.15)",  color: "#3fb950" },
  ai_agent:         { bg: "rgba(88,166,255,0.15)", color: "#58a6ff" },
  tool_integration: { bg: "rgba(240,136,62,0.15)", color: "#f0883e" },
  retrieval:        { bg: "rgba(255,215,0,0.12)",  color: "#d4a017" },
  ai_infra:         { bg: "rgba(248,81,73,0.15)",  color: "#f85149" },
  multimodal:       { bg: "rgba(255,121,198,0.15)",color: "#ff79c6" },
  ai_framework:     { bg: "rgba(80,250,123,0.12)", color: "#50fa7b" },
  other:            { bg: "rgba(139,148,158,0.15)",color: "#8b949e" },
};

export function getThemeColor(themeKey: string | null | undefined) {
  return THEME_COLORS[themeKey ?? "other"] ?? THEME_COLORS["other"];
}

export function getThemeKeyFromName(themeName: string | null): string {
  if (!themeName) return "other";
  const map: Record<string, string> = {
    "LLM": "llm",
    "AI Coding": "ai_coding",
    "AI Agent": "ai_agent",
    "Tool Integration": "tool_integration",
    "Retrieval": "retrieval",
    "AI Infra": "ai_infra",
    "Multimodal": "multimodal",
    "AI Framework": "ai_framework",
    "Other": "other",
  };
  return map[themeName] ?? "other";
}
