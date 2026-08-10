import { Link, useSearchParams } from "wouter";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "../components/page-hero";
import { Reveal, RevealItem } from "../components/reveal";
import { Marquee } from "../components/marquee";
import { cn } from "@/lib/utils";
import { STRAIN_TYPE_LABEL, splitList } from "@/lib/format";
import { useStrains, type StrainType } from "../queries/catalog";

const TYPES: StrainType[] = ["indica", "sativa", "hybrid"];

function isType(value: string): value is StrainType {
  return TYPES.includes(value as StrainType);
}

function Strains() {
  const [search, setSearch] = useSearchParams();
  const active = (search.get("type") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(isType);

  const strains = useStrains(active);

  function toggle(type: StrainType) {
    const next = active.includes(type)
      ? active.filter((t) => t !== type)
      : [...active, type];
    setSearch(
      () => {
        const out = new URLSearchParams();
        if (next.length) out.set("type", next.join(","));
        return out;
      },
      { replace: true },
    );
  }

  return (
    <>
      <PageHero
        eyebrow="The strain library"
        title="Read the panel, not the hype"
        blurb="Every strain we press gets a full write-up: lineage, dominant terpenes, effects, THC range, and what it actually tastes like. No vague 'uplifting' nonsense."
      >
        <div className="flex flex-wrap items-center gap-2">
          {TYPES.map((type) => {
            const on = active.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggle(type)}
                aria-pressed={on}
                className={cn(
                  "rounded-full border px-5 py-2.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] transition-all",
                  on
                    ? "border-acid bg-acid text-void"
                    : "border-line text-bone/70 hover:border-bone/25 hover:text-bone",
                )}
              >
                {STRAIN_TYPE_LABEL[type]}
              </button>
            );
          })}
          {active.length > 0 && (
            <button
              type="button"
              onClick={() => setSearch(new URLSearchParams(), { replace: true })}
              className="ml-1 text-xs text-ash underline-offset-4 transition-colors hover:text-bone hover:underline"
            >
              Show all
            </button>
          )}
        </div>
      </PageHero>

      <section className="shell section-b">
        {strains.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="panel h-[420px] animate-pulse" />
            ))}
          </div>
        ) : strains.isError ? (
          <div className="panel px-6 py-16 text-center md:px-8 md:py-20">
            <p className="display-sm text-bone">Couldn't load the library</p>
            <p className="text-ash mt-3 text-sm">Refresh the page to try again.</p>
          </div>
        ) : (
          <Reveal className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
            {strains.data?.map((strain) => (
              <RevealItem key={strain.slug}>
                <Link
                  to={`/strains/${strain.slug}`}
                  className="panel panel-sheen group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:border-acid/35"
                >
                  <div className="relative h-56 w-full shrink-0 overflow-hidden">
                    <img
                      src={strain.image}
                      alt={strain.name}
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
                      width={1100}
                      height={1100}
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-panel via-transparent to-transparent" />
                    <span className="label-xs absolute left-4 top-4 rounded-full bg-void/75 px-3 py-2 text-bone/85 backdrop-blur">
                      {STRAIN_TYPE_LABEL[strain.type] ?? strain.type}
                    </span>
                    {strain.featured ? (
                      <span className="label-xs absolute right-4 top-4 rounded-full bg-acid px-3 py-2 text-void">
                        House pick
                      </span>
                    ) : null}
                  </div>

                  <div className="flex flex-1 flex-col p-6 md:p-7">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="display-sm text-bone">{strain.name}</h2>
                      <span className="font-display text-sm font-bold text-acid">
                        {strain.thcLow}–{strain.thcHigh}%
                      </span>
                    </div>

                    <p className="text-ash mt-2 text-xs">{strain.lineage}</p>

                    <p className="text-ash mt-4 line-clamp-3 text-[0.8125rem] leading-relaxed">
                      {strain.description}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                      {splitList(strain.terpenes)
                        .slice(0, 3)
                        .map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-line px-2.5 py-1 text-[0.6875rem] text-bone/70"
                          >
                            {t}
                          </span>
                        ))}
                    </div>

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.8125rem] font-bold text-acid">
                      Full profile
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </span>
                  </div>
                </Link>
              </RevealItem>
            ))}
          </Reveal>
        )}

        {strains.data?.length === 0 && (
          <div className="panel px-6 py-16 text-center md:px-8 md:py-20">
            <p className="display-sm text-bone">No strains in that lane right now</p>
            <p className="text-ash mt-3 text-sm">Clear the filter to see the full library.</p>
          </div>
        )}
      </section>

      <Marquee
        items={["Limonene", "Caryophyllene", "Myrcene", "Linalool", "Terpinolene", "Humulene"]}
        duration={38}
      />

      <section className="shell section-y">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Indica",
              copy: "Heavier body load, later in the day. Usually myrcene- and linalool-forward. Good for winding down, bad for a deadline.",
            },
            {
              title: "Sativa",
              copy: "Head-first and talkative. Terpinolene and limonene tend to lead. Great for a gallery night, risky if you're anxious.",
            },
            {
              title: "Hybrid",
              copy: "The honest middle. We label lean where it's real instead of calling everything a balanced 50/50.",
            },
          ].map((item) => (
            <div key={item.title} className="panel panel-sheen p-7 md:p-9">
              <h3 className="display-sm text-acid">{item.title}</h3>
              <p className="text-ash mt-4 text-[0.875rem] leading-relaxed">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Strains;
