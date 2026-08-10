import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Lock, ShoppingBag, Truck } from "lucide-react";
import { PageHero } from "../components/page-hero";
import { Pill } from "../components/ui/pill";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { money } from "@/lib/format";
import { amountToFreeDeliveryCents, deliveryFeeCents } from "@/lib/delivery";
import { useCartPricing } from "../queries/catalog";
import { useCreateOrder } from "../queries/orders";

const inputClass =
  "w-full rounded-2xl border border-line bg-panel-2 px-5 py-3.5 text-sm text-bone placeholder:text-ash/70 outline-none transition-colors focus:border-acid/50 focus-visible:ring-2 focus-visible:ring-acid/30";

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="label-xs text-ash">{label}</span>
      <div className="mt-3">{children}</div>
    </label>
  );
}

function Checkout() {
  const [, navigate] = useLocation();
  const cart = useCart();
  const pricing = useCartPricing(cart.lines.map((l) => l.slug));
  const createOrder = useCreateOrder();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const server = new Map((pricing.data ?? []).map((p) => [p.slug, p]));
  const subtotalCents = cart.lines.reduce((sum, line) => {
    const live = server.get(line.slug);
    return sum + (live?.priceCents ?? line.priceCents) * line.quantity;
  }, 0);
  const deliveryCents = deliveryFeeCents(subtotalCents);
  const toFreeCents = amountToFreeDeliveryCents(subtotalCents);
  const totalCents = subtotalCents + deliveryCents;

  if (cart.lines.length === 0 && !createOrder.isPending) {
    return (
      <>
        <PageHero
          eyebrow="Checkout"
          title="Your bag is empty"
          blurb="Add something first and we'll get the order in. Nothing is charged on this site — you pay the driver in cash on delivery."
        >
          <Pill variant="acid" size="lg" asChild>
            <Link to="/shop">Browse the catalog</Link>
          </Pill>
        </PageHero>
        <section className="shell section-b-lg">
          <div className="panel flex flex-col items-center px-6 py-16 text-center md:px-8 md:py-20">
            <span className="grid size-16 place-items-center rounded-full border border-line bg-panel-2 text-ash">
              <ShoppingBag className="size-6" />
            </span>
            <p className="display-sm mt-7 text-bone">Nothing to check out</p>
          </div>
        </section>
      </>
    );
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (customerName.trim().length < 2) return setError("Add your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Add a valid email for your order confirmation.");
    if (phone.replace(/\D/g, "").length < 7)
      return setError("Add a phone number we can reach you on.");
    if (!orderConfirmed)
      return setError("Confirm your order details are correct to place the order.");
    if (!(addressLine.trim() && city.trim() && zip.trim()))
      return setError("Fill in the full delivery address.");

    createOrder.mutate(
      {
        customerName: customerName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        zip: zip.trim(),
        notes: notes.trim() || undefined,
        orderConfirmed: true,
        items: cart.lines.map((l) => ({ slug: l.slug, quantity: l.quantity })),
      },
      {
        onSuccess: (result) => {
          cart.clear();
          navigate(`/order/${result.code}`);
        },
        onError: (err) =>
          setError(err.message || "We couldn't place that order. Try again."),
      },
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Checkout"
        title="Reserve your order"
        blurb="We bring it to your door and you pay the driver in cash. Cash only — no cards, and no payment details are collected or stored on this site."
      />

      <section className="shell section-b">
        <form onSubmit={onSubmit} noValidate className="grid gap-5 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7 xl:col-span-8 md:gap-5">
            {/* Delivery */}
            <div className="panel panel-sheen p-7 md:p-8">
              <span className="label-xs text-acid">01 — Where it's going</span>

              <div className="mt-6 flex items-start gap-4 rounded-2xl border border-acid bg-acid/8 p-5">
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-acid text-void">
                  <Truck className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-bone">Thu · Sat · Sun, 1–10pm</p>
                  <p className="text-ash mt-1.5 text-[0.75rem] leading-relaxed">
                    Across most of San Diego, Thursdays, Saturdays, and Sundays between
                    1pm and 10pm — order on a delivery day and it lands the same day. $5
                    flat under $60, free above it.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Street address" className="sm:col-span-2">
                  <input
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    aria-label="Street address"
                    placeholder="1832 E 1st St, Apt 4"
                    autoComplete="street-address"
                    className={inputClass}
                  />
                </Field>
                <Field label="City">
                  <input
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    aria-label="City"
                    placeholder="San Diego"
                    autoComplete="address-level2"
                    className={inputClass}
                  />
                </Field>
                <Field label="ZIP">
                  <input
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    aria-label="ZIP code"
                    placeholder="90033"
                    autoComplete="postal-code"
                    className={inputClass}
                  />
                </Field>
              </div>
            </div>

            {/* Contact */}
            <div className="panel panel-sheen p-7 md:p-8">
              <span className="label-xs text-acid">02 — Your details</span>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" className="sm:col-span-2">
                  <input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    aria-label="Full name"
                    placeholder="Jordan Reyes"
                    autoComplete="name"
                    className={inputClass}
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    aria-label="Email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    type="tel"
                    aria-label="Phone number"
                    placeholder="(213) 555-0142"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </Field>
                <Field label="Order notes (optional)" className="sm:col-span-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    aria-label="Order notes"
                    rows={3}
                    placeholder="Gate code, buzzer, or anything the driver should know."
                    className={cn(inputClass, "resize-y")}
                  />
                </Field>
              </div>

              <label className="mt-6 flex cursor-pointer items-start gap-3.5 rounded-2xl border border-line bg-panel-2 p-5">
                <input
                  type="checkbox"
                  checked={orderConfirmed}
                  onChange={(e) => setOrderConfirmed(e.target.checked)}
                  aria-label="Confirm your order details are correct"
                  className="mt-0.5 size-4 shrink-0 accent-acid"
                />
                <span className="text-[0.8125rem] leading-relaxed text-bone/85">
                  I've reviewed my order and confirm the items, quantities, and contact
                  details above are correct.
                </span>
              </label>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="panel panel-sheen sticky top-28 p-7 md:p-8">
              <span className="label-xs text-acid">03 — Your order</span>

              <ul className="mt-6 space-y-3.5">
                {cart.lines.map((line) => {
                  const unit = server.get(line.slug)?.priceCents ?? line.priceCents;
                  return (
                    <li key={line.slug} className="flex items-center gap-3.5">
                      <span className="size-12 shrink-0 overflow-hidden rounded-xl bg-panel-2">
                        <img
                          src={line.image}
                          alt={line.name}
                          className="size-full object-cover"
                          width={1100}
                          height={1100}
                          decoding="async"
                          loading="lazy"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.8125rem] font-bold text-bone">
                          {line.name}
                        </span>
                        <span className="text-ash block text-[0.6875rem]">
                          {line.size} · ×{line.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-bone">
                        {money(unit * line.quantity)}
                      </span>
                    </li>
                  );
                })}
              </ul>

              <dl className="mt-7 space-y-3 border-t border-line pt-6 text-sm">
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
                    Due in cash on delivery
                  </dt>
                  <dd className="font-display text-2xl font-bold text-acid">
                    {money(totalCents)}
                  </dd>
                </div>
              </dl>

              {toFreeCents > 0 ? (
                <p className="mt-6 rounded-2xl border border-amber/35 bg-amber/10 px-5 py-3.5 text-[0.75rem] leading-relaxed text-amber">
                  {money(deliveryCents)} delivery on orders under $60 — add{" "}
                  {money(toFreeCents)} more to drop it.
                </p>
              ) : null}

              {error ? (
                <p className="mt-6 rounded-2xl border border-destructive/40 bg-destructive/10 px-5 py-3.5 text-sm text-bone">
                  {error}
                </p>
              ) : null}

              <Pill
                type="submit"
                variant="acid"
                size="lg"
                className="mt-6 w-full"
                disabled={createOrder.isPending}
              >
                {createOrder.isPending ? "Placing order…" : "Place order"}
              </Pill>

              <p className="text-ash/80 mt-5 flex items-start gap-2 text-[0.6875rem] leading-relaxed">
                <Lock className="mt-0.5 size-3 shrink-0" />
                No payment is taken online. We hold the order and you settle up in
                cash at handover. Cash only — we can't take cards.
              </p>

              <Link
                to="/cart"
                className="text-ash mt-6 inline-flex items-center gap-1.5 text-xs transition-colors hover:text-bone"
              >
                <ArrowLeft className="size-3.5" />
                Back to bag
              </Link>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default Checkout;
