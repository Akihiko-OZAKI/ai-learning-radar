interface Props {
  reason: string | null;
}

export default function RiseReason({ reason }: Props) {
  if (!reason) return <span style={{ color: "var(--text-muted)" }}>-</span>;
  return <span className="rise-reason">{reason}</span>;
}
