import { Link, useParams } from "wouter";
import { ArrowRight, Check, Truck } from "lucide-react";
import { Pill } from "../components/ui/pill";
import { Reveal, RevealItem } from "../components/reveal";
import { money } from "@/lib/format";
import { useOrder } from "../queries/orders";

function OrderConfirmation() {
  const params = useParams<{ code: string }>();
  const code = params.code ?? "";
  const query = useOrder(code);

  if (query.isLoading) {
    return (
      <section className="shell section-b-lg nav-offset pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <div className="panel h-[420px] animate-pulse" />
      </section>
    );
  }

  if (query.isError || !query.data) {
    return (
      <section className="shell flex min-h-[60vh] flex-col items-center justify-center pt-[68px] text-center md:pt-[76px]">
        <span className="label-xs text-acid">Not found</span>
        <h1 className="display-md mt-6 text-bone">No order under {code}</h1>
        <p className="text-ash mt-4 max-w-[42ch] text-sm leading-relaxed">
          Double-check the code in your confirmation email, or reach out to us
          and we'll find it.
        </p>
        <Pill variant="acid" className="mt-8" asChild>
          <Link to="/contact">Get help</Link>
        </Pill>
      </section>
    );
  }

  const { order, items } = query.data;

  return (
    <section className="relative overflow-hidden nav-offset">
      <div className="haze -top-40 left-1/2 h-[460px] w-[720px] -translate-x-1/2" />

      <div className="shell relative section-b-lg pt-14 md:pt-20">
        <Reveal viewport={false} className="flex flex-col items-center text-center">
          <RevealItem>
            <span className="grid size-16 place-items-center rounded-full bg-acid text-void">
              <Check className="size-7" strokeWidth={2.5} />
            </span>
          </RevealItem>

          <RevealItem className="mt-8">
            <span className="label-xs text-acid">Order received</span>
          </RevealItem>

          <RevealItem className="mt-5">
            <h1 className="display-lg text-bone">You're in, {order.customerName.split(" ")[0]}</h1>
          </RevealItem>

          <RevealItem className="mt-6">
            <p className="text-ash mx-auto max-w-[52ch] text-[0.95rem] leading-relaxed">
              {order.receiptSentAt ? (
                <>
                  Your receipt is on its way to{" "}
                  <span className="text-bone">{order.email}</span> — it has your items,
                  your address and the cash total. Quote the code below to your driver.
                </>
              ) : (
                <>
                  We've saved your order under{" "}
                  <span className="text-bone">{order.email}</span>. Quote the code below
                  to your driver.
                </>
              )}
            </p>
          </RevealItem>

          <RevealItem className="mt-8">
            <div className="panel px-8 py-6">
              <span className="label-xs text-ash">Order code</span>
              <p className="mt-3 font-display text-3xl font-bold tracking-[0.06em] text-acid md:text-4xl">
                {order.code}
              </p>
            </div>
          </RevealItem>
        </Reveal>

        <div className="mt-14 grid gap-5 md:mt-16 lg:grid-cols-12">
          {/* Fulfilment */}
          <div className="panel panel-sheen p-7 md:p-9 lg:col-span-5">
            <span className="grid size-11 place-items-center rounded-full border border-line bg-panel-2 text-acid">
              <Truck className="size-4" />
            </span>

            <h2 className="display-sm mt-6 text-bone">Delivering to</h2>

            <div className="mt-5">
              <p className="text-ash text-[0.8125rem] leading-relaxed">
                {order.addressLine}
                <br />
                {order.city} {order.zip}
              </p>
              <p className="text-ash mt-6 border-t border-line pt-5 text-[0.8125rem] leading-relaxed">
                A driver will text {order.phone} with a delivery window. We run drops on
                Thursdays, Saturdays, and Sundays between 1pm and 10pm — someone needs to
                be there to sign for the order.
              </p>
            </div>

            {order.notes ? (
              <div className="mt-7 rounded-2xl border border-line bg-panel-2 p-5">
                <span className="label-xs text-ash">Your note</span>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-bone/85">
                  {order.notes}
                </p>
              </div>
            ) : null}
          </div>

          {/* Receipt */}
          <div className="panel panel-sheen p-7 md:p-9 lg:col-span-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="label-xs text-acid">What you ordered</span>
                <h2 className="display-sm mt-4 text-bone">
                  {items.length} line{items.length === 1 ? "" : "s"}
                </h2>
              </div>
              <span className="label-xs shrink-0 rounded-full bg-acid/12 px-3 py-2 text-acid">
                {order.status}
              </span>
            </div>

            <ul className="mt-7 divide-y divide-[color:var(--color-line)]">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-4 py-4 first:pt-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-bone">
                      {item.productName}
                    </p>
                    <p className="text-ash mt-1 text-xs">
                      {money(item.unitPriceCents)} × {item.quantity}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-base font-semibold text-bone">
                    {money(item.unitPriceCents * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-6 space-y-3 border-t border-line pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-ash">Subtotal</dt>
                <dd className="text-bone">{money(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ash">Delivery</dt>
                <dd className={order.deliveryCents === 0 ? "text-acid" : "text-bone"}>
                  {order.deliveryCents === 0 ? "Free" : money(order.deliveryCents)}
                </dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-line pt-4">
                <dt className="font-display text-base font-bold uppercase text-bone">
                  Due in cash on delivery
                </dt>
                <dd className="font-display text-2xl font-bold text-acid">
                  {money(order.totalCents)}
                </dd>
              </div>
            </dl>

            <p className="text-ash/80 mt-6 text-[0.6875rem] leading-relaxed">
              Nothing has been charged. Cash only — have it ready at handover. Orders are
              held for 48 hours before they go back on the shelf.
            </p>

            <div className="mt-8 flex flex-col gap-3 border-t border-line pt-7 sm:flex-row">
              <Pill variant="acid" asChild>
                <Link to="/shop">
                  Keep shopping <ArrowRight className="size-4" />
                </Link>
              </Pill>
              <Pill variant="ghost" asChild>
                <Link to="/contact">Change this order</Link>
              </Pill>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OrderConfirmation;
