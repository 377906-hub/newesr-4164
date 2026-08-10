/**
 * Delivery fee rules — the server is the authority on these numbers.
 *
 * $5 flat delivery fee on any order under $60. Free at $60 and above.
 * The client mirrors these constants in src/web/lib/delivery.ts for display only;
 * keep the two in sync, and never trust the client's figure.
 */

export const DELIVERY_FEE_CENTS = 500;
export const FREE_DELIVERY_THRESHOLD_CENTS = 6000;

/** Delivery fee owed on a given subtotal, in cents. */
export function deliveryFeeCents(subtotalCents: number) {
  return subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;
}
