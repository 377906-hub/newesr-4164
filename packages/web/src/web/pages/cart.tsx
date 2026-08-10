import { Link } from "wouter";
import { AlertTriangle, ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { PageHero } from "../components/page-hero";
import { Pill } from "../components/ui/pill";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { amountToFreeDeliveryCents, deliveryFeeCents } from "@/lib/delivery";
import { useCartPricing } from "../queries/catalog";

function CartPage() {
  const cart = useCart();
  const slugs = cart.lines.map((l) => l.slug);
  const pricing = useCartPricing(slugs);

  const server = new Map((pricing.data ?? []).map((p) => [p.slug, p]));

  /** Authoritative subtotal — falls back to the stored price until pricing lands. */
  const subtotalCents = cart.lines.reduce((sum, line) => {
    const live = server.get(line.slug);
    return sum + (live?.priceCents ?? line.priceCents) * line.quantity;
  }, 0);

  const deliveryCents = deliveryFeeCents(subtotalCents);
  const toFreeCents = amountToFreeDeliveryCents(subtotalCents);
  const totalCents = subtotalCents + deliveryCents;

  const soldOut = cart.lines.filter((l) => server.get(l.slug)?.inStock === false);
  const repriced = cart.lines.filter((l) => {
    const live = server.get(l.slug);
    return live !== undefined && live.priceCents !== l.priceCents;
  });

  if (cart.lines.length === 0) {
    return (
      <>
        <PageHero
          eyebrow="Your bag"
          title="Nothing in the bag yet"
          blurb="Most people start with a 2g rechargeable disposable — it's the whole brand in one device. Screw-ons if you already run a 510 battery."
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <Pill variant="acid" size="lg" asChild>
              <Link to="/shop/disposables">Shop Disposables</Link>
            </Pill>
            <Pill variant="ghost" size="lg" asChild>
              <Link to="/shop/screw-ons">Shop Screw-Ons</Link>
            </Pill>
          </div>
        </PageHero>

        <section className="shell section-b-lg">
          <div className="panel flex flex-col items-center px-6 py-16 text-center md:px-8 md:py-20">
            <span className="grid size-16 place-items-center rounded-full border border-line bg-panel-2 text-ash">
              <ShoppingBag className="size-6" />
            </span>
            <p className="display-sm mt-7 text-bone">Empty bag, full catalog</p>
            <p className="text-ash mt-3 max-w-[42ch] text-sm leading-relaxed">
              Twelve products across two lines, all pressed from single-farm flower.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Your bag"
        title={`${cart.count} item${cart.count === 1 ? "" : "s"} ready`}
        blurb="Prices are re-checked against live inventory. Add your delivery address on the next step — nothing is charged on this site."
      />

      <section className="shell section-b">
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Lines */}
          <div className="lg:col-span-7 xl:col-span-8">
            {soldOut.length > 0 && (
              <div className="mb-4 flex items-start gap-3.5 rounded-2xl border border-amber/40 bg-amber/10 p-5 md:mb-5">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber" />
                <p className="text-[0.8125rem] leading-relaxed text-bone/90">
                  {soldOut.map((l) => l.name).join(", ")} sold out while sitting in your
                  bag. Remove {soldOut.length === 1 ? "it" : "them"} to continue to
                  checkout.
                </p>
              </div>
            )}

            <ul className="space-y-4 md:space-y-5">
              {cart.lines.map((line) => {
                const live = server.get(line.slug);
                const unit = live?.priceCents ?? line.priceCents;
                const out = live?.inStock === false;

                return (
                  <li
                    key={line.slug}
                    className="panel panel-sheen flex flex-col gap-5 p-5 sm:flex-row md:p-6"
                  >
                    <Link
                      to={`/product/${line.slug}`}
                      className="h-32 w-full shrink-0 overflow-hidden rounded-2xl bg-panel-2 sm:size-32"
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
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            to={`/product/${line.slug}`}
                            className="display-sm block truncate text-bone transition-colors hover:text-acid"
                          >
                            {line.name}
                          </Link>
                          <p className="text-ash mt-2 text-xs">
                            {line.size} · {money(unit)} each
                            {out ? (
                              <span className="ml-2 text-amber">Sold out</span>
                            ) : null}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => cart.remove(line.slug)}
                          aria-label={`Remove ${line.name}`}
                          className="text-ash grid size-10 shrink-0 -mr-2 -mt-2 place-items-center rounded-full transition-colors hover:bg-panel-2 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                        <div className="flex items-center gap-1 rounded-full border border-line bg-void p-1.5">
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.slug, line.quantity - 1)}
                            aria-label={`Decrease quantity of ${line.name}`}
                            className="grid size-10 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                          >
                            <Minus className="size-4" />
                          </button>
                          <span className="min-w-7 text-center text-sm font-bold text-bone">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => cart.setQuantity(line.slug, line.quantity + 1)}
                            aria-label={`Increase quantity of ${line.name}`}
                            className="grid size-10 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                          >
                            <Plus className="size-4" />
                          </button>
                        </div>

                        <span className="font-display text-xl font-bold text-bone">
                          {money(unit * line.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <Pill variant="ghost" size="sm" asChild>
                <Link to="/shop">Keep shopping</Link>
              </Pill>
              <button
                type="button"
                onClick={cart.clear}
                className="text-xs text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
              >
                Empty the bag
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="panel panel-sheen sticky top-28 p-7 md:p-8">
              <span className="label-xs text-acid">Order summary</span>

              <dl className="mt-7 space-y-3.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ash">Subtotal</dt>
                  <dd className="text-bone">{money(subtotalCents)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ash">Delivery</dt>
                  <dd className={deliveryCents === 0 ? "text-acid" : "text-bone"}>
                    {deliveryCents === 0 ? "Free" : money(deliveryCents)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between border-t border-line pt-4">
                  <dt className="font-display text-base font-bold uppercase text-bone">
                    Total
                  </dt>
                  <dd className="font-display text-2xl font-bold text-acid">
                    {money(totalCents)}
                  </dd>
                </div>
              </dl>

              {toFreeCents > 0 ? (
                <p className="mt-5 rounded-2xl border border-amber/35 bg-amber/10 px-5 py-3.5 text-[0.75rem] leading-relaxed text-amber">
                  Add {money(toFreeCents)} more and delivery is free.
                </p>
              ) : null}

              <Pill
                variant="acid"
                size="lg"
                className="mt-7 w-full"
                disabled={soldOut.length > 0}
                asChild={soldOut.length === 0}
              >
                {soldOut.length === 0 ? (
                  <Link to="/checkout">
                    Continue to checkout <ArrowRight className="size-4" />
                  </Link>
                ) : (
                  <>Remove sold-out items</>
                )}
              </Pill>

              <p className="text-ash/80 mt-5 text-[0.6875rem] leading-relaxed">
                Nothing is charged online. You'll pay the driver on delivery — cash
                only. We deliver Thu, Sat & Sun, 1–10pm.
              </p>

              {repriced.length > 0 ? (
                <p className="mt-4 text-[0.6875rem] leading-relaxed text-amber">
                  Prices were updated to match current inventory.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CartPage;
