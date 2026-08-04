const RECENT_KEY = "bee-recent";
const COMPARE_KEY = "bee-compare";

export function getRecentIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export function trackRecentView(productId: number) {
  if (typeof window === "undefined") return;
  const next = [productId, ...getRecentIds().filter((id) => id !== productId)].slice(0, 12);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function getCompareIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(COMPARE_KEY) ?? "[]") as number[];
  } catch {
    return [];
  }
}

export function toggleCompare(productId: number): number[] {
  const current = getCompareIds();
  const next = current.includes(productId)
    ? current.filter((id) => id !== productId)
    : [...current, productId].slice(0, 3);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  return next;
}
