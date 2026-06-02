import { getThemeColor } from "@/lib/theme-colors";

interface Props {
  themeName: string | null;
  themeKey?: string | null;
}

export default function ThemeBadge({ themeName, themeKey }: Props) {
  const key = themeKey ?? "other";
  const { bg, color } = getThemeColor(key);
  return (
    <span
      className="theme-badge"
      style={{ backgroundColor: bg, color }}
    >
      {themeName ?? "Other"}
    </span>
  );
}
