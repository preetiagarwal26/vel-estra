export function money(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: digits,
  }).format(value || 0);
}

export function pct(value: number, digits = 1) {
  return `${(value || 0).toFixed(digits)}%`;
}
