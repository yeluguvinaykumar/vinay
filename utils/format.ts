export function formatPrice(amount: number, purpose?: string | null, compact = false): string {
  const a = Number(amount) || 0;
  const suffix = purpose === "RENT" ? "/mo" : "";
  if (compact) {
    if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(a % 1_000_000 === 0 ? 0 : 1)}M${suffix}`;
    if (a >= 1_000) return `$${(a / 1_000).toFixed(a % 1_000 === 0 ? 0 : 1)}K${suffix}`;
    return `$${a}${suffix}`;
  }
  return `$${a.toLocaleString("en-US")}${suffix}`;
}

export function formatArea(area: number, unit = "sqft"): string {
  const a = Number(area) || 0;
  const value = a >= 1000 ? a.toLocaleString("en-US") : Math.round(a).toString();
  return `${value} ${unit}`;
}

export function formatDate(date: Date | string, withTime = false): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

export function timeAgo(date: Date | string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readTime(text: string): number {
  return Math.max(1, Math.round(wordCount(text) / 200));
}

export function readingTime(text: string): string {
  return `${readTime(text)} min read`;
}