export function money(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

/** "$42" when whole dollars, "$42.50" otherwise — for display in grids. */
export function moneyShort(cents: number) {
  return cents % 100 === 0 ? `$${cents / 100}` : money(cents);
}

export const STRAIN_TYPE_LABEL: Record<string, string> = {
  indica: "Indica",
  sativa: "Sativa",
  hybrid: "Hybrid",
};

export const CATEGORY_LABEL: Record<string, string> = {
  "screw-ons": "Screw-Ons",
  disposables: "Disposables",
};

export function splitList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}
