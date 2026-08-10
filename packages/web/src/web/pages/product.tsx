import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  ArrowRight,
  BatteryCharging,
  Check,
  ChevronRight,
  FlaskConical,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Pill } from "../components/ui/pill";
import { ProductCard } from "../components/product-card";
import { Reveal, RevealItem } from "../components/reveal";
import { useCart } from "@/lib/cart";
import {
  CATEGORY_LABEL,
  STRAIN_TYPE_LABEL,
  money,
  splitList,
} from "@/lib/format";
import { useProduct } from "../queries/catalog";

function Crumbs({ category, name }: { category: string; name: string }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="text-ash flex items-center gap-1.5 text-xs"
    >
      <Link to="/shop" className="transition-colors hover:text-bone">
        Shop
      </Link>
      <ChevronRight className="size-3" />
      <Link to={`/shop/${category}`} className="transition-colors hover:text-bone">
        {CATEGORY_LABEL[category] ?? category}
      </Link>
      <ChevronRight className="size-3" />
      <span className="truncate text-bone/70">{name}</span>
    </nav>
  );
}

function ProductDetail() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const query = useProduct(slug);
  const cart = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (query.isLoading) {
    return (
      <section className="shell section-b nav-offset pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="panel aspect-square animate-pulse" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded-full bg-panel" />
            <div className="h-5 w-1/2 animate-pulse rounded-full bg-panel" />
            <div className="h-40 animate-pulse rounded-3xl bg-panel" />
          </div>
        </div>
      </section>
    );
  }

  if (query.isError || !query.data) {
    return (
      <section className="shell flex min-h-[60vh] flex-col items-center justify-center pt-[68px] text-center md:pt-[76px]">
        <span className="label-xs text-acid">Not found</span>
        <h1 className="display-md mt-6 text-bone">That one's not in rotation</h1>
        <p className="text-ash mt-4 max-w-[42ch] text-sm">
          It may have sold out and rolled off the site. Here's what's pressing now.
        </p>
        <Pill variant="acid" className="mt-8" asChild>
          <Link to="/shop">Back to shop</Link>
        </Pill>
      </section>
    );
  }

  const { product, strain, related } = query.data;
  const badges = splitList(product.badges);

  function add() {
    cart.add(
      {
        slug: product.slug,
        name: product.name,
        priceCents: product.priceCents,
        image: product.image,
        size: product.size,
      },
      quantity,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <>
      <section className="relative overflow-hidden nav-offset">
        <div className="haze -left-40 -top-32 h-[460px] w-[640px]" />

        <div className="shell relative section-y-sm">
          <Crumbs category={product.category} name={product.name} />

          <Reveal viewport={false} className="mt-8 grid gap-5 lg:grid-cols-2">
            {/* Visual */}
            <RevealItem>
              <div className="panel relative aspect-square w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="size-full object-cover"
                  width={1100}
                  height={1100}
                  decoding="async"
                  fetchPriority="high"
                />
                <span className="label-xs absolute left-4 top-4 rounded-full bg-void/75 px-3 py-2 text-bone/85 backdrop-blur">
                  {STRAIN_TYPE_LABEL[product.strainType] ?? product.strainType}
                </span>
                <span className="label-xs absolute right-4 top-4 rounded-full bg-acid px-3 py-2 text-void">
                  {product.thc.toFixed(1)}% THC
                </span>
                {!product.inStock && (
                  <span className="label-xs absolute inset-x-4 bottom-4 rounded-full bg-void/85 py-2.5 text-center text-bone/85 backdrop-blur">
                    Sold out — next press soon
                  </span>
                )}
              </div>
            </RevealItem>

            {/* Buy box */}
            <RevealItem>
              <div className="flex h-full flex-col">
                <span className="label-xs text-acid">
                  {CATEGORY_LABEL[product.category] ?? product.category} · {product.size}
                </span>

                <h1 className="display-page mt-5 text-balance text-bone">{product.name}</h1>
                <p className="text-ash mt-4 text-[0.95rem] leading-relaxed md:text-base">
                  {product.tagline}
                </p>

                {badges.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {badges.map((b) => (
                      <span
                        key={b}
                        className="label-xs rounded-full bg-amber/12 px-3 py-2 text-amber"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-8 flex items-end gap-4">
                  <span className="font-display text-4xl font-bold leading-none text-bone md:text-5xl">
                    {money(product.priceCents)}
                  </span>
                  {product.compareAtCents ? (
                    <span className="text-ash pb-1 text-sm line-through">
                      {money(product.compareAtCents)}
                    </span>
                  ) : null}
                </div>

                {/* Quantity + add */}
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center justify-between gap-2 rounded-full border border-line bg-panel p-1.5 sm:justify-start">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      className="grid size-11 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center font-display text-lg font-bold text-bone">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(12, q + 1))}
                      aria-label="Increase quantity"
                      className="grid size-11 place-items-center rounded-full text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>

                  <Pill
                    variant="acid"
                    size="lg"
                    className="flex-1"
                    onClick={add}
                    disabled={!product.inStock}
                  >
                    {added ? (
                      <>
                        <Check className="size-4" /> Added to bag
                      </>
                    ) : product.inStock ? (
                      <>Add to bag — {money(product.priceCents * quantity)}</>
                    ) : (
                      <>Sold out</>
                    )}
                  </Pill>
                </div>

                <p className="text-ash mt-4 text-xs">
                  Same-day delivery Thu, Sat & Sun, 1–10pm — $5 under $60, free above
                </p>

                {/* Spec grid */}
                <dl className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {[
                    { label: "THC", value: `${product.thc.toFixed(1)}%` },
                    { label: "CBD", value: `${product.cbd.toFixed(1)}%` },
                    { label: "Size", value: product.size },
                    {
                      label: "Type",
                      value: STRAIN_TYPE_LABEL[product.strainType] ?? product.strainType,
                    },
                  ].map((spec) => (
                    <div
                      key={spec.label}
                      className="rounded-2xl border border-line bg-panel px-4 py-3.5"
                    >
                      <dt className="label-xs text-ash">{spec.label}</dt>
                      <dd className="mt-2 font-display text-xl font-bold leading-none text-acid">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="mt-8 grid gap-3 border-t border-line pt-7 sm:grid-cols-2">
                  {[
                    { Icon: FlaskConical, text: "Third-party lab tested" },
                    { Icon: BatteryCharging, text: product.hardware },
                    { Icon: ShieldCheck, text: "Hardware replacement warranty" },
                    { Icon: Truck, text: "Discreet, odour-sealed packaging" },
                  ].map((item) => (
                    <li
                      key={item.text}
                      className="text-ash flex items-start gap-2.5 text-[0.8125rem] leading-snug"
                    >
                      <item.Icon className="mt-0.5 size-4 shrink-0 text-acid" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* Description + strain */}
      <section className="shell section-y">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="panel panel-sheen p-7 md:p-10 lg:col-span-7">
            <span className="label-xs text-acid">The oil</span>
            <h2 className="display-md mt-5 text-bone">What you're inhaling</h2>
            <p className="text-ash mt-5 text-[0.9375rem] leading-relaxed">
              {product.description}
            </p>

            <div className="mt-8 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <h3 className="label-xs text-ash">Hardware</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/85">
                  {product.hardware}
                </p>
              </div>
              <div>
                <h3 className="label-xs text-ash">How to run it</h3>
                <p className="mt-3 text-sm leading-relaxed text-bone/85">
                  Start with a two-second pull on the low airflow setting. Live resin is
                  denser than distillate — you need less than you think.
                </p>
              </div>
            </div>
          </div>

          {strain ? (
            <div className="panel relative flex flex-col lg:col-span-5">
              <div className="relative h-52 w-full shrink-0 overflow-hidden">
                <img
                  src={strain.image}
                  alt={strain.name}
                  loading="lazy"
                  className="size-full object-cover"
                  width={1100}
                  height={1100}
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-panel via-panel/30 to-transparent" />
              </div>

              <div className="flex flex-1 flex-col p-7 md:p-8">
                <span className="label-xs text-acid">The strain</span>
                <h2 className="display-md mt-4 text-bone">{strain.name}</h2>
                <p className="text-ash mt-3 text-xs">{strain.lineage}</p>

                <div className="mt-6 space-y-5">
                  <div>
                    <h3 className="label-xs text-ash">Dominant terpenes</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {splitList(strain.terpenes).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line px-3 py-1.5 text-[0.75rem] text-bone/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="label-xs text-ash">Effects</h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {splitList(strain.effects).map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-acid/12 px-3 py-1.5 text-[0.75rem] font-medium text-acid"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="label-xs text-ash">Tastes like</h3>
                    <p className="mt-3 text-sm leading-relaxed text-bone/85">
                      {strain.flavorNotes}
                    </p>
                  </div>
                </div>

                <Pill variant="ghost" size="sm" className="mt-8 self-start" asChild>
                  <Link to={`/strains/${strain.slug}`}>
                    Full strain profile <ArrowRight className="size-3.5" />
                  </Link>
                </Pill>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="shell section-b">
          <div className="flex items-end justify-between gap-6">
            <h2 className="display-md text-bone">
              More {CATEGORY_LABEL[product.category] ?? product.category}
            </h2>
            <Pill variant="ghost" size="sm" className="shrink-0" asChild>
              <Link to={`/shop/${product.category}`}>View all</Link>
            </Pill>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {related.map((item) => (
              <ProductCard key={item.slug} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export default ProductDetail;
