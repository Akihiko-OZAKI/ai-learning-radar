interface Props {
  change: number | null;
  showNewBadge?: boolean;
}

export default function RankChange({ change, showNewBadge = false }: Props) {
  if (change === null || change === undefined) {
    // showNewBadge=true の場合のみ「NEW」を表示（新規発見セクション等）
    // 人気ランキングでは初日は rank_change が null になるため「—」を表示
    if (showNewBadge) return <span className="change-new">NEW</span>;
    return <span className="change-same">—</span>;
  }
  if (change > 0) {
    return <span className="change-up">▲{change}</span>;
  }
  if (change < 0) {
    return <span className="change-down">▼{Math.abs(change)}</span>;
  }
  return <span className="change-same">—</span>;
}
