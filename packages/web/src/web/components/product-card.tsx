import { Link } from "wouter";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import { moneyShort, money, STRAIN_TYPE_LABEL } from "@/lib/format";
import type { Product } from "../queries/catalog";
import { cn } from "@/lib/utils";

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const cart = useCart();
  const badges = product.badges ? product.badges.split(",").filter(Boolean) : [];

  function addToCart() {
    if (!product.inStock) return;
    cart.add({
      slug: product.slug,
      name: product.name,
      priceCents: product.priceCents,
      image: product.image,
      size: product.size,
    });
  }

  return (
    /* The whole card is clickable via a stretched overlay link, so the
       "add to bag" button stays a real sibling button — a <button> nested
       inside an <a> is invalid HTML and breaks keyboard users. */
    <article
      className={cn(
        "panel panel-sheen group relative flex flex-col p-3 transition-all duration-300 focus-within:border-acid/45 hover:-translate-y-1 hover:border-acid/35 md:p-4",
        !product.inStock && "opacity-70",
        className,
      )}
    >
      {/* Image well */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-panel-2">
        <img
          src={product.image}
          alt={product.name}
          width={1100}
          height={1100}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />

        <span className="label-xs absolute left-3 top-3 rounded-full bg-void/75 px-2.5 py-1.5 text-bone/85 backdrop-blur">
          {STRAIN_TYPE_LABEL[product.strainType] ?? product.strainType}
        </span>

        <span className="label-xs absolute right-3 top-3 rounded-full bg-acid px-2.5 py-1.5 text-void">
          {product.thc.toFixed(1)}%
        </span>

        {!product.inStock && (
          <span className="label-xs absolute inset-x-3 bottom-3 rounded-full bg-void/85 py-2 text-center text-bone/80 backdrop-blur">
            Sold out
          </span>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col px-1 pb-1 pt-4">
        {badges.length > 0 && (
          <div className="mb-2 flex flex-nowrap gap-1.5 overflow-hidden">
            {badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="label-xs shrink-0 truncate rounded-full bg-amber/12 px-2 py-1 text-amber"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <h3 className="display-sm text-bone">
          <Link
            to={`/product/${product.slug}`}
            className="rounded-sm outline-none after:absolute after:inset-0 after:z-10 after:content-[''] focus-visible:underline focus-visible:decoration-acid focus-visible:decoration-2 focus-visible:underline-offset-4"
          >
            {product.name}
          </Link>
        </h3>
        <p className="text-ash mt-1.5 line-clamp-2 text-[0.8125rem] leading-snug">
          {product.tagline}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-xl font-semibold text-bone">
                {moneyShort(product.priceCents)}
              </span>
              {product.compareAtCents ? (
                <span className="text-ash/70 text-xs line-through">
                  {money(product.compareAtCents)}
                </span>
              ) : null}
            </div>
            <span className="text-ash/80 text-[0.6875rem]">{product.size}</span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to bag`}
            className="relative z-20 grid size-11 shrink-0 place-items-center rounded-full border border-line bg-panel-2 text-bone transition-all hover:border-acid hover:bg-acid hover:text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="panel animate-pulse p-3 md:p-4" aria-hidden="true">
      <div className="aspect-square w-full rounded-[14px] bg-panel-2" />
      <div className="space-y-3 px-1 pb-1 pt-4">
        <div className="h-5 w-3/5 rounded bg-panel-2" />
        <div className="h-3 w-full rounded bg-panel-2" />
        <div className="h-3 w-2/3 rounded bg-panel-2" />
        <div className="h-8 w-1/3 rounded bg-panel-2" />
      </div>
    </div>
  );
}
