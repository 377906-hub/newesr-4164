import { Link, useParams } from "wouter";
import { ChevronRight } from "lucide-react";
import { Pill } from "../components/ui/pill";
import { ProductCard } from "../components/product-card";
import { Reveal, RevealItem } from "../components/reveal";
import { STRAIN_TYPE_LABEL, splitList } from "@/lib/format";
import { useStrain } from "../queries/catalog";

function StrainDetail() {
  const params = useParams<{ slug: string }>();
  const query = useStrain(params.slug ?? "");

  if (query.isLoading) {
    return (
      <section className="shell section-b nav-offset pt-[calc(68px+4rem)] md:pt-[calc(76px+6rem)]">
        <div className="panel h-[360px] animate-pulse" />
        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="panel h-48 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (query.isError || !query.data) {
    return (
      <section className="shell flex min-h-[60vh] flex-col items-center justify-center pt-[68px] text-center md:pt-[76px]">
        <span className="label-xs text-acid">Not found</span>
        <h1 className="display-md mt-6 text-bone">No profile for that strain</h1>
        <Pill variant="acid" className="mt-8" asChild>
          <Link to="/strains">Browse the library</Link>
        </Pill>
      </section>
    );
  }

  const { strain, products } = query.data;
  const terpenes = splitList(strain.terpenes);
  const effects = splitList(strain.effects);

  return (
    <>
      <section className="relative overflow-hidden nav-offset">
        <div className="haze -right-40 -top-24 h-[440px] w-[620px]" />

        <div className="shell relative section-y-sm">
          <nav
            aria-label="Breadcrumb"
            className="text-ash flex items-center gap-1.5 text-xs"
          >
            <Link to="/strains" className="transition-colors hover:text-bone">
              Strain library
            </Link>
            <ChevronRight className="size-3" />
            <span className="text-bone/70">{strain.name}</span>
          </nav>

          <Reveal viewport={false} className="mt-8 grid gap-5 lg:grid-cols-12">
            <RevealItem className="lg:col-span-7">
              <div className="panel relative h-full min-h-[320px]">
                <img
                  src={strain.image}
                  alt={strain.name}
                  className="absolute inset-0 size-full object-cover"
                  width={1100}
                  height={1100}
                  decoding="async"
                  fetchPriority="high"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                <div className="relative flex h-full flex-col justify-end p-7 md:p-10">
                  <span className="label-xs text-acid">
                    {STRAIN_TYPE_LABEL[strain.type] ?? strain.type}
                    {strain.featured ? " · House pick" : ""}
                  </span>
                  <h1 className="display-page mt-5 text-balance text-bone">{strain.name}</h1>
                  <p className="text-bone/70 mt-4 text-sm">{strain.lineage}</p>
                </div>
              </div>
            </RevealItem>

            <RevealItem className="lg:col-span-5">
              <div className="flex h-full flex-col gap-4 md:gap-5">
                <div className="panel panel-sheen flex-1 p-7 md:p-8">
                  <span className="label-xs text-ash">Potency range</span>
                  <p className="mt-4 font-display text-5xl font-bold leading-none text-acid">
                    {strain.thcLow}–{strain.thcHigh}
                    <span className="text-2xl">%</span>
                  </p>
                  <p className="text-ash mt-4 text-[0.8125rem] leading-relaxed">
                    Total THC across the batches we've pressed from this cut. Every box
                    carries its own batch number and COA.
                  </p>
                </div>

                <div className="panel panel-sheen p-7 md:p-8">
                  <span className="label-xs text-ash">Tastes like</span>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-bone/90">
                    {strain.flavorNotes}
                  </p>
                </div>
              </div>
            </RevealItem>
          </Reveal>
        </div>
      </section>

      {/* Profile */}
      <section className="shell section-y-sm">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="panel panel-sheen p-7 md:p-10 lg:col-span-7">
            <span className="label-xs text-acid">The write-up</span>
            <h2 className="display-md mt-5 text-bone">What to expect</h2>
            <p className="text-ash mt-5 text-[0.9375rem] leading-relaxed">
              {strain.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-5 md:gap-5">
            <div className="panel p-7 md:p-8">
              <h3 className="label-xs text-ash">Dominant terpenes</h3>
              <ul className="mt-5 space-y-3">
                {terpenes.map((t, i) => (
                  <li key={t} className="flex items-center gap-4">
                    <span className="min-w-[10ch] text-sm font-bold text-bone">{t}</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-panel-2">
                      <span
                        className="block h-full rounded-full bg-acid"
                        style={{ width: `${Math.max(24, 92 - i * 22)}%` }}
                      />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="panel p-7 md:p-8">
              <h3 className="label-xs text-ash">Reported effects</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {effects.map((e) => (
                  <span
                    key={e}
                    className="rounded-full bg-acid/12 px-3.5 py-2 text-[0.8125rem] font-medium text-acid"
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="shell section-y">
        <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="label-xs text-acid">Available in</span>
            <h2 className="display-md mt-4 text-bone">
              {products.length > 0
                ? `${strain.name} in the catalog`
                : `${strain.name} is between presses`}
            </h2>
          </div>
          <Pill variant="ghost" size="sm" className="shrink-0" asChild>
            <Link to="/shop">Shop everything</Link>
          </Pill>
        </div>

        {products.length > 0 ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="panel mt-10 px-6 py-14 text-center md:px-8 md:py-16">
            <p className="text-ash mx-auto max-w-[46ch] text-sm leading-relaxed">
              This cut isn't in a current run. Join the drop list and we'll
              flag you when it presses again.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default StrainDetail;
