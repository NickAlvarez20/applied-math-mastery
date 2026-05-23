export function formatSalary(usd: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function formatXP(xp: number): string {
  return xp >= 1000 ? `${(xp / 1000).toFixed(1)}k` : String(xp);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function difficultyLabel(d: number): string {
  return (
    ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"][d] ??
    "Unknown"
  );
}
