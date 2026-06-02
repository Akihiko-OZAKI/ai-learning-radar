interface Props {
  change: number | null;
}

export default function RankChange({ change }: Props) {
  if (change === null || change === undefined) {
    return <span className="change-new">NEW</span>;
  }
  if (change > 0) {
    return <span className="change-up">▲{change}</span>;
  }
  if (change < 0) {
    return <span className="change-down">▼{Math.abs(change)}</span>;
  }
  return <span className="change-same">—</span>;
}
