import { useEffect } from "react";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { Pill } from "./ui/pill";

export function CartDrawer() {
  const cart = useCart();
  const open = cart.drawerOpen;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cart.closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, cart]);

  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-[80] m-0 h-full max-h-full w-full max-w-full border-0 bg-transparent p-0"
      aria-modal="true"
      aria-label="Cart"
    >
      <button
        type="button"
        aria-label="Dismiss cart"
        className="absolute inset-0 size-full cursor-default bg-void/80 backdrop-blur-sm"
        onClick={cart.closeDrawer}
      />

      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col border-l border-line bg-panel">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <span className="label-xs text-acid">Your bag</span>
            <p className="display-sm mt-1.5 text-bone">
              {cart.count} {cart.count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={cart.closeDrawer}
            aria-label="Close cart"
            className="grid size-11 place-items-center rounded-full border border-line bg-panel-2 text-bone transition-colors hover:border-bone/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Lines */}
        {cart.lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-16 place-items-center rounded-full border border-line bg-panel-2 text-ash">
              <ShoppingBag className="size-6" />
            </span>
            <div>
              <p className="display-sm text-bone">Nothing in the bag</p>
              <p className="text-ash mt-2 text-sm">
                Start with a 2g rechargeable — it's how most people find us.
              </p>
            </div>
            <Pill variant="acid" onClick={cart.closeDrawer} asChild>
              <Link to="/shop/disposables">Shop Disposables</Link>
            </Pill>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <ul className="space-y-4">
                {cart.lines.map((line) => (
                  <li
                    key={line.slug}
                    className="flex gap-4 rounded-2xl border border-line bg-panel-2 p-3"
                  >
                    <Link
                      to={`/product/${line.slug}`}
                      onClick={cart.closeDrawer}
                      className="size-20 shrink-0 overflow-hidden rounded-xl bg-void"
                    >
                      <img
                        src={line.image}
                        alt={line.name}
                        className="size-full object-cover"
                        width={1100}
                        height={1100}
                        decoding="async"
                        loading="lazy"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-bone">
                            {line.name}
                          </p>
                          <p className="text-ash mt-0.5 text-xs">
                            {line.size} · {money(line.priceCents)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => cart.remove(line.slug)}
                          aria-label={`Remove ${line.name}`}
                          className="text-ash grid size-9 shrink-0 place-items-center rounded-full transition-colors hover:bg-panel-2 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                        <div className="flex items-center gap-1 rounded-full border border-line bg-void p-1">
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.slug, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${line.name}`}
                            className="grid size-9 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                          >
                            <Minus className="size-3.5" />
                          </button>
                          <span className="min-w-6 text-center text-sm font-bold text-bone">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.slug, line.quantity + 1)}
                            aria-label={`Increase quantity of ${line.name}`}
                            className="grid size-9 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                          >
                            <Plus className="size-3.5" />
                          </button>
                        </div>

                        <span className="font-display text-base font-semibold text-bone">
                          {money(line.priceCents * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Summary */}
            <div className="border-t border-line px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ash">Subtotal</dt>
                  <dd className="text-bone">{money(cart.subtotalCents)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3">
                  <dt className="font-display text-base font-semibold uppercase text-bone">
                    Total
                  </dt>
                  <dd className="font-display text-lg font-bold text-acid">
                    {money(cart.subtotalCents)}
                  </dd>
                </div>
              </dl>

              <Pill
                variant="acid"
                size="lg"
                className="mt-5 w-full"
                onClick={cart.closeDrawer}
                asChild
              >
                <Link to="/checkout">Checkout</Link>
              </Pill>

              <button
                type="button"
                onClick={cart.closeDrawer}
                className="mt-3 w-full text-center text-xs text-ash transition-colors hover:text-bone"
              >
                Keep shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </dialog>
  );
}
