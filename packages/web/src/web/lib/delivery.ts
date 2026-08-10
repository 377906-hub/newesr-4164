/**
 * Client-side mirror of the delivery fee rules in src/api/lib/delivery.ts.
 * Display only — the server re-computes the fee on every order.
 *
 * $5 flat delivery fee under $60, free at $60 and above.
 */

export const DELIVERY_FEE_CENTS = 500;
export const FREE_DELIVERY_THRESHOLD_CENTS = 6000;

export function deliveryFeeCents(subtotalCents: number) {
  return subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;
}

/** Cents still needed to reach free delivery, or 0 once it's earned. */
export function amountToFreeDeliveryCents(subtotalCents: number) {
  return Math.max(0, FREE_DELIVERY_THRESHOLD_CENTS - subtotalCents);
}
