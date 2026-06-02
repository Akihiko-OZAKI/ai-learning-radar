"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ScoreHistory } from "@/types";

interface Props {
  history: ScoreHistory[];
}

export default function ScoreChart({ history }: Props) {
  if (history.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          padding: "40px",
          fontSize: "13px",
        }}
      >
        推移データがありません
      </div>
    );
  }

  const data = history.map((h) => ({
    date: h.date.slice(5), // MM-DD 表示
    "総合スコア": h.total_score,
    "GitHubスコア": h.github_score,
    "HNスコア": h.hn_score,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
        <XAxis
          dataKey="date"
          tick={{ fill: "#8b949e", fontSize: 11 }}
          axisLine={{ stroke: "#30363d" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8b949e", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1c2128",
            border: "1px solid #30363d",
            borderRadius: "6px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "#e6edf3" }}
        />
        <Legend
          wrapperStyle={{ fontSize: "12px", color: "#8b949e" }}
        />
        <Line
          type="monotone"
          dataKey="総合スコア"
          stroke="#58a6ff"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="GitHubスコア"
          stroke="#3fb950"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 2"
        />
        <Line
          type="monotone"
          dataKey="HNスコア"
          stroke="#f0883e"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 2"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
