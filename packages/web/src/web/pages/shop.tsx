import { Link, useParams, useSearchParams } from "wouter";
import { SlidersHorizontal } from "lucide-react";
import { PageHero } from "../components/page-hero";
import { ProductCard, ProductCardSkeleton } from "../components/product-card";
import { Pill } from "../components/ui/pill";
import { Marquee } from "../components/marquee";
import { cn } from "@/lib/utils";
import {
  useProducts,
  type Category,
  type ProductSort,
  type StrainType,
} from "../queries/catalog";

const CATEGORY_TABS: { label: string; href: string; value?: Category }[] = [
  { label: "Everything", href: "/shop" },
  { label: "Screw-Ons", href: "/shop/screw-ons", value: "screw-ons" },
  { label: "Disposables", href: "/shop/disposables", value: "disposables" },
];

const TYPES: StrainType[] = ["indica", "sativa", "hybrid"];

const SORTS: { label: string; value: ProductSort }[] = [
  { label: "Featured", value: "featured" },
  { label: "Price: low to high", value: "price-asc" },
  { label: "Price: high to low", value: "price-desc" },
  { label: "Highest THC", value: "thc-desc" },
];

const COPY: Record<string, { eyebrow: string; title: string; blurb: string }> = {
  "screw-ons": {
    eyebrow: "510-thread carts",
    title: "Screw-Ons",
    blurb:
      "Glass tanks, ceramic cores, live resin only. Screw one onto any 510 battery and taste the difference a single-farm press makes.",
  },
  disposables: {
    eyebrow: "All-in-one",
    title: "Disposables",
    blurb:
      "2g rechargeable bodies with adjustable airflow and USB-C. Nothing to buy, nothing to charge on day one — just pull.",
  },
  all: {
    eyebrow: "The full catalog",
    title: "Shop everything",
    blurb:
      "Both lines, every strain currently in rotation. Small batches — when a run is gone it's gone until the next press.",
  },
};

function isType(value: string): value is StrainType {
  return TYPES.includes(value as StrainType);
}

function isSort(value: string): value is ProductSort {
  return SORTS.some((s) => s.value === value);
}

function Shop() {
  const params = useParams<{ category?: string }>();
  const [search, setSearch] = useSearchParams();

  const category =
    params.category === "screw-ons" || params.category === "disposables"
      ? (params.category as Category)
      : undefined;

  const activeTypes = (search.get("type") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isType);

  const sortParam = search.get("sort") ?? "";
  const sort: ProductSort = isSort(sortParam) ? sortParam : "featured";

  const products = useProducts({ category, strainTypes: activeTypes, sort });
  const copy = COPY[category ?? "all"];

  function toggleType(type: StrainType) {
    const next = activeTypes.includes(type)
      ? activeTypes.filter((t) => t !== type)
      : [...activeTypes, type];
    setSearch(
      (prev) => {
        const out = new URLSearchParams(prev);
        if (next.length) out.set("type", next.join(","));
        else out.delete("type");
        return out;
      },
      { replace: true },
    );
  }

  function setSort(value: string) {
    setSearch(
      (prev) => {
        const out = new URLSearchParams(prev);
        if (value === "featured") out.delete("sort");
        else out.set("sort", value);
        return out;
      },
      { replace: true },
    );
  }

  function clearFilters() {
    setSearch(new URLSearchParams(), { replace: true });
  }

  const count = products.data?.length ?? 0;

  return (
    <>
      <PageHero eyebrow={copy.eyebrow} title={copy.title} blurb={copy.blurb}>
        <div className="flex flex-wrap gap-2">
          {CATEGORY_TABS.map((tab) => (
            <Pill
              key={tab.href}
              variant={tab.value === category ? "acid" : "ghost"}
              asChild
            >
              <Link to={tab.href}>{tab.label}</Link>
            </Pill>
          ))}
        </div>
      </PageHero>

      {/* Filter bar */}
      <div className="shell">
        <div className="panel flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="label-xs mr-2 hidden items-center gap-2 text-ash md:inline-flex">
              <SlidersHorizontal className="size-3.5" />
              Type
            </span>
            {TYPES.map((type) => {
              const active = activeTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleType(type)}
                  aria-pressed={active}
                  className={cn(
                    "min-h-10 rounded-full border px-4 py-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-panel",
                    active
                      ? "border-acid bg-acid text-void"
                      : "border-line text-bone/70 hover:border-bone/25 hover:text-bone",
                  )}
                >
                  {type}
                </button>
              );
            })}
            {activeTypes.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="ml-1 text-xs text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-ash hidden text-xs sm:inline">
              {products.isLoading ? "Loading…" : `${count} product${count === 1 ? "" : "s"}`}
            </span>
            <label className="flex items-center gap-2">
              <span className="label-xs text-ash">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="cursor-pointer rounded-full border border-line bg-panel-2 px-4 py-2.5 text-[0.8125rem] font-medium text-bone outline-none transition-colors hover:border-bone/25 focus-visible:ring-2 focus-visible:ring-acid/60"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="shell section-y-sm">
        {products.isError ? (
          <div className="panel px-6 py-16 text-center md:px-8 md:py-20">
            <p className="display-sm text-bone">Couldn't load the catalog</p>
            <p className="text-ash mt-3 text-sm">Refresh the page to try again.</p>
          </div>
        ) : products.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : count === 0 && activeTypes.length > 0 ? (
          <div className="panel px-6 py-16 text-center md:px-8 md:py-20">
            <p className="display-sm text-bone">Nothing matches that filter</p>
            <p className="text-ash mx-auto mt-3 max-w-[40ch] text-sm">
              Try a different strain type, or clear the filter to see the whole run.
            </p>
            <Pill variant="ghost" className="mt-7" onClick={clearFilters}>
              Clear filters
            </Pill>
          </div>
        ) : count === 0 ? (
          <div className="panel panel-sheen flex min-h-[360px] flex-col items-center justify-center px-6 py-14 text-center md:px-8 md:py-16">
            <img
              src="/images/logo-seal.png"
              alt=""
              className="size-20 rounded-full opacity-70 md:size-24"
              width={320}
              height={320}
              decoding="async"
              loading="lazy"
            />
            <p className="display-md mt-8 text-bone">Shelf is being restocked</p>
            <p className="text-ash mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed">
              We're clearing the case for a new lineup. The first disposable drop is on its
              way — message us and we'll tell you the day it lands.
            </p>
            <Pill variant="ghost" className="mt-8" asChild>
              <Link to="/contact">Get notified</Link>
            </Pill>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {products.data?.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </section>

      <Marquee
        items={["Lab tested every batch", "No cutting agents", "Artist-designed panels"]}
        duration={40}
        accent
      />

      {/* Reassurance strip */}
      <section className="shell section-y">
        <div className="grid gap-4 md:grid-cols-3 md:gap-5">
          {[
            {
              title: "Batch-level COAs",
              copy: "Every press gets third-party tested for potency, pesticides, and residual solvents. Batch code is on the box.",
            },
            {
              title: "Hardware warranty",
              copy: "Clogged, leaking, or dead on arrival? Message us with the batch code and we replace it, no receipt hunting.",
            },
            {
              title: "Thu · Sat · Sun delivery",
              copy: "We deliver Thursdays, Saturdays, and Sundays between 1pm and 10pm across most of San Diego. Order on a delivery day and it lands the same day.",
            },
          ].map((item) => (
            <div key={item.title} className="panel panel-sheen p-7 md:p-8">
              <h3 className="display-sm text-bone">{item.title}</h3>
              <p className="text-ash mt-3 text-[0.875rem] leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Shop;
