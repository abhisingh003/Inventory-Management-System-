interface BadgeProps {
  label: string;
  color?: "success" | "warning" | "danger" | "neutral";
}

const colorMap = {
  success: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/20",
  warning: "bg-amber-500/15 text-amber-200 border border-amber-500/20",
  danger: "bg-rose-500/15 text-rose-200 border border-rose-500/20",
  neutral: "bg-slate-700/70 text-slate-200 border border-slate-600",
};

export default function Badge({ label, color = "neutral" }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${colorMap[color]}`}>{label}</span>;
}
