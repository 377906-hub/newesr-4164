import { Link } from "wouter";
import { ArrowRight, FlaskConical, Leaf, Palette, Users } from "lucide-react";
import { PageHero } from "../components/page-hero";
import { Pill } from "../components/ui/pill";
import { Marquee } from "../components/marquee";
import { Reveal, RevealItem } from "../components/reveal";
import { SectionHeader } from "../components/section-header";
import { cn } from "@/lib/utils";

const GALLERY = [
  {
    src: "/images/society.png",
    alt: "A Green Leaf Society gallery night in East LA",
    caption: "Gallery night 41",
    meta: "Every third Thursday",
    span: "md:col-span-7 aspect-[16/10]",
  },
  {
    src: "/images/flatlay.png",
    alt: "Packaging flatlay with artist panels",
    caption: "Artist panels",
    meta: "Current packaging run",
    span: "md:col-span-5 aspect-[4/5]",
  },
  {
    src: "/images/strain-macro.png",
    alt: "Macro shot of trichome-covered flower",
    caption: "Macro",
    meta: "Single-harvest flower",
    span: "md:col-span-5 aspect-[4/5]",
  },
  {
    src: "/images/store.png",
    alt: "Jars and hardware on a lit counter",
    caption: "The counter",
    meta: "Batch jars, hand-labelled",
    span: "md:col-span-7 aspect-[16/10]",
  },
  {
    src: "/images/lifestyle.png",
    alt: "A member of the Society holding a disposable",
    caption: "Members",
    meta: "Studio session, print swap",
    span: "md:col-span-6 aspect-[3/2]",
  },
  {
    src: "/images/hero.png",
    alt: "Green Leaf Society hardware lineup",
    caption: "The lineup",
    meta: "Screw-ons & disposables",
    span: "md:col-span-6 aspect-[3/2]",
  },
];

const VALUES = [
  {
    Icon: Leaf,
    title: "Single-source, always",
    copy: "One farm, one harvest, per batch. We never blend lots to hit a potency number on a label.",
  },
  {
    Icon: FlaskConical,
    title: "Test it, then print it",
    copy: "No number goes on a box before the COA comes back. If the batch fails, the batch dies.",
  },
  {
    Icon: Palette,
    title: "Artists get paid",
    copy: "Every packaging run features one artist who gets the panel, the credit, and a percentage.",
  },
  {
    Icon: Users,
    title: "The room is the point",
    copy: "Gallery nights, print swaps, and studio sessions. The product funds the culture, not the other way round.",
  },
];

function Society() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A brand, not a shelf"
        blurb="Rooms, runs, and the people in them. Artist panels, gallery nights, single-harvest flower, and the hardware we put our name on."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Pill variant="acid" size="lg" asChild>
            <Link to="/shop/disposables">
              Shop the current run <ArrowRight className="size-4" />
            </Link>
          </Pill>
          <Pill variant="ghost" size="lg" asChild>
            <Link to="/contact">Get in touch</Link>
          </Pill>
        </div>
      </PageHero>

      {/* Image bento */}
      <section className="shell pb-16 md:pb-24">
        <Reveal className="grid gap-4 md:grid-cols-12 md:gap-5">
          <RevealItem className="md:col-span-7">
            <div className="panel relative aspect-[16/10] w-full">
              <img
                src="/images/society.png"
                alt="A Green Leaf Society gallery night"
                loading="lazy"
                className="size-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void/85 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-9">
                <span className="label-xs text-acid">Gallery night 41</span>
                <p className="display-sm mt-3 max-w-[24ch] text-bone">
                  Every third Thursday, somewhere in East LA
                </p>
              </div>
            </div>
          </RevealItem>

          <RevealItem className="md:col-span-5">
            <div className="flex h-full flex-col gap-4 md:gap-5">
              <div className="panel panel-sheen flex flex-1 flex-col justify-center p-7 md:p-9">
                <p className="font-display text-6xl font-bold leading-none text-acid">41</p>
                <p className="text-ash mt-4 text-sm leading-relaxed">
                  gallery nights funded — artists paid, walls filled, nobody asked to
                  work for exposure.
                </p>
              </div>
              <div className="panel relative aspect-[4/3] w-full">
                <img
                  src="/images/flatlay.png"
                  alt="Packaging flatlay with artist panels"
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </section>

      <Marquee
        items={["Where cannabis, art & culture collide", "Green Leaf Society"]}
        duration={46}
        accent
      />

      {/* Gallery grid */}
      <section className="shell py-20 md:py-28">
        <SectionHeader
          align="left"
          eyebrow="The gallery"
          title={
            <>
              Rooms, runs
              <br />
              &amp; the people in them
            </>
          }
          blurb="Shot on the nights and in the rooms where the work actually happens. No stock, no studio gloss."
        />

        <Reveal className="mt-14 grid gap-4 md:mt-16 md:grid-cols-12 md:gap-5">
          {GALLERY.map((shot) => (
            <RevealItem key={shot.src + shot.caption} className={shot.span.split(" ")[0]}>
              <figure
                className={cn(
                  "panel group relative w-full overflow-hidden",
                  shot.span.split(" ")[1],
                )}
              >
                <img
                  src={shot.src}
                  alt={shot.alt}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-void/85 via-void/10 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-7">
                  <span className="label-xs text-acid">{shot.caption}</span>
                  <p className="text-bone/80 mt-2 text-[0.8125rem]">{shot.meta}</p>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Reveal>
      </section>

      {/* Values */}
      <section className="shell pb-20 md:pb-28">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="panel relative min-h-[340px] lg:col-span-5">
            <img
              src="/images/lifestyle.png"
              alt="A member of the Society holding a disposable"
              loading="lazy"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/80 to-transparent" />
            <div className="relative flex h-full flex-col justify-end p-7 md:p-9">
              <span className="label-xs text-acid">What we stand on</span>
              <h2 className="display-md mt-4 max-w-[14ch] text-bone">Four rules we don't bend</h2>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7 md:gap-5">
            {VALUES.map((value) => (
              <div key={value.title} className="panel panel-sheen p-7 md:p-8">
                <span className="grid size-11 place-items-center rounded-full border border-line bg-panel-2 text-acid">
                  <value.Icon className="size-4" />
                </span>
                <h3 className="display-sm mt-6 text-bone">{value.title}</h3>
                <p className="text-ash mt-3 text-[0.875rem] leading-relaxed">
                  {value.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lab testing — linked from the footer as /society#testing */}
      <section id="testing" className="shell scroll-mt-28 pb-20 md:pb-28">
        <div className="panel panel-sheen p-7 md:p-12 lg:p-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <span className="label-xs text-acid">Lab results</span>
              <h2 className="display-lg mt-5 max-w-[16ch] text-bone">
                Every batch, on paper
              </h2>
              <p className="text-ash mt-6 max-w-[52ch] text-[0.9375rem] leading-relaxed">
                Each press is sent to a licensed third-party lab before it's packed. We
                test for cannabinoid potency, full terpene profile, pesticides, residual
                solvents, heavy metals, and microbials. The batch number printed on your
                box pulls up that exact report.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Pill variant="acid" asChild>
                  <Link to="/contact">
                    Request a COA <ArrowRight className="size-4" />
                  </Link>
                </Pill>
                <Pill variant="ghost" asChild>
                  <Link to="/strains">See strain panels</Link>
                </Pill>
              </div>

              <p className="text-ash/70 mt-8 text-[0.6875rem] leading-relaxed">
                Lab figures shown across this site are illustrative placeholder content
                for this build and do not represent real test results.
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-4 self-start">
              {[
                { label: "Potency", value: "100%", note: "of batches tested" },
                { label: "Pesticides", value: "0", note: "detected, 2026 runs" },
                { label: "Additives", value: "None", note: "no MCT, PG, or VG" },
                { label: "Turnaround", value: "9 days", note: "press to shelf" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-line bg-panel-2 p-5 md:p-6"
                >
                  <dt className="label-xs text-ash">{stat.label}</dt>
                  <dd className="mt-3 font-display text-3xl font-bold leading-none text-acid">
                    {stat.value}
                  </dd>
                  <p className="text-ash mt-2.5 text-[0.6875rem]">{stat.note}</p>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}

export default Society;
