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

  function addToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    <Link
      to={`/product/${product.slug}`}
      className={cn(
        "panel panel-sheen group flex flex-col p-3 transition-all duration-300 hover:-translate-y-1 hover:border-acid/35 md:p-4",
        !product.inStock && "opacity-70",
        className,
      )}
    >
      {/* Image well */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-panel-2">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
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
          <div className="mb-2 flex flex-wrap gap-1.5">
            {badges.slice(0, 2).map((b) => (
              <span
                key={b}
                className="label-xs rounded-full bg-amber/12 px-2 py-1 text-amber"
              >
                {b}
              </span>
            ))}
          </div>
        )}

        <h3 className="display-sm text-bone">{product.name}</h3>
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
            <span className="text-ash/80 text-[0.6875rem]">
              {product.size}
            </span>
          </div>

          <button
            type="button"
            onClick={addToCart}
            disabled={!product.inStock}
            aria-label={`Add ${product.name} to cart`}
            className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-panel-2 text-bone transition-all hover:border-acid hover:bg-acid hover:text-void disabled:pointer-events-none disabled:opacity-40"
          >
            <Plus className="size-4" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="panel animate-pulse p-3 md:p-4">
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
