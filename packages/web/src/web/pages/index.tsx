import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Pill } from "../components/ui/pill";
import { Marquee } from "../components/marquee";
import { Reveal, RevealItem } from "../components/reveal";
import { SectionHeader } from "../components/section-header";
import { ProductCard, ProductCardSkeleton } from "../components/product-card";
import { useProducts } from "../queries/catalog";

const MARQUEE_ITEMS = [
  "Muha Meds",
  "Live resin",
  "Arcadia Fusion",
  "Liquid live diamonds",
  "Sherbinskis",
  "Lab tested",
  "Thu · Sat · Sun delivery",
];

function Hero() {
  return (
    <section className="relative overflow-hidden nav-offset">
      {/* Graffiti wall texture, straight off the seal artwork */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[720px]" aria-hidden="true">
        <img
          src="/images/graffiti-wall.jpg"
          alt=""
          className="size-full object-cover opacity-[0.28] saturate-[0.85]"
          width={1440}
          height={1080}
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/80 to-void" />
      </div>
      <div className="haze -top-32 left-1/2 h-[560px] w-[900px] -translate-x-1/2" />

      <div className="shell relative pt-14 md:pt-20">
        <Reveal viewport={false} className="flex flex-col items-center text-center">
          <RevealItem className="mb-8">
            <img
              src="/images/logo-seal.png"
              alt="Green Leaf Society seal"
              className="size-28 rounded-full md:size-36"
              width={320}
              height={320}
              decoding="async"
              fetchPriority="high"
            />
          </RevealItem>
          <RevealItem>
            <span className="label-xs inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 text-center tracking-[0.11em] text-bone/80 sm:tracking-[0.18em]">
              <span className="block size-1.5 rounded-full bg-acid" />
              Online only — Thu, Sat & Sun · 1–10pm
            </span>
          </RevealItem>

          <RevealItem className="mt-8">
            <h1 className="display-xl text-bone">
              The shop for
              <br />
              <span className="text-acid">every brand</span>
            </h1>
          </RevealItem>

          <RevealItem className="mt-7">
            <p className="text-ash mx-auto max-w-[54ch] text-base leading-relaxed md:text-lg">
              Where cannabis, art, and culture collide. Screw-on carts, 2g rechargeable
              disposables, and liquid live diamonds — Muha Meds, Arcadia Fusion, and
              Sherbinskis on the shelf now, every one sealed and listed with its full
              terpene panel.
            </p>
          </RevealItem>

          <RevealItem className="mt-9">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Pill variant="acid" size="lg" asChild>
                <Link to="/shop/disposables">
                  Shop Disposables <ArrowRight className="size-4" />
                </Link>
              </Pill>
              <Pill variant="ghost" size="lg" asChild>
                <Link to="/shop">Shop everything</Link>
              </Pill>
            </div>
          </RevealItem>
        </Reveal>

        {/* Hero image panel */}
        <Reveal viewport={false} className="mt-14 md:mt-20">
          <RevealItem>
            <div className="panel relative aspect-[16/10] w-full md:aspect-[16/8]">
              <img
                src="/images/cart-lifestyle.jpg"
                alt="A 510-thread live resin cartridge standing on black marble"
                className="size-full object-cover"
                width={1100}
                height={619}
                decoding="async"
                fetchPriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />

              {/* Clickable jump into the product panel */}
              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <Link
                  to="/shop"
                  className="group flex items-center justify-between gap-4 rounded-2xl border border-line bg-void/70 px-5 py-4 backdrop-blur-md transition-all duration-300 hover:border-acid/50 hover:bg-void/85 md:px-7 md:py-5"
                >
                  <span>
                    <span className="block font-display text-lg font-bold leading-none text-acid md:text-2xl">
                      Shop all products
                    </span>
                    <span className="label-xs mt-2 block leading-[1.5] text-bone/60">
                      Carts, disposables &amp; everything in rotation
                    </span>
                  </span>
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-acid text-void transition-transform duration-300 group-hover:translate-x-1 md:size-12">
                    <ArrowRight className="size-5" />
                  </span>
                </Link>
              </div>
            </div>
          </RevealItem>
        </Reveal>
      </div>
    </section>
  );
}

function ProductShelf() {
  const products = useProducts({ sort: "featured" });
  const items = products.data ?? [];

  return (
    <section id="products" className="shell section-y-lg">
      <SectionHeader
        eyebrow="On the shelf"
        title={
          <>
            The
            <br />
            products
          </>
        }
        blurb="Every product we carry, in one place — Muha Meds All-In-One disposables, Arcadia Fusion liquid live diamonds, and Sherbinskis live resin carts."
      />

      <div className="mt-14 md:mt-16">
        {products.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.isError ? (
          <div className="panel px-6 py-16 text-center md:px-8 md:py-20">
            <p className="display-sm text-bone">Couldn't load the shelf</p>
            <p className="text-ash mt-3 text-sm">Refresh the page to try again.</p>
          </div>
        ) : items.length === 0 ? (
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
              way — check back shortly or message us to get told the day it lands.
            </p>
            <Pill variant="ghost" className="mt-8" asChild>
              <Link to="/contact">Get notified</Link>
            </Pill>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-5">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function DeliveryStrip() {
  const perks = [
    { title: "Thu · Sat · Sun", copy: "Same-day drops between 1pm and 10pm." },
    { title: "Free over $60", copy: "$5 flat delivery under sixty dollars, free above it." },
    { title: "Live tracking", copy: "Your driver texts a window before they roll out." },
    { title: "Cash only", copy: "Pay the driver at the door. Nothing is charged online." },
  ];

  return (
    <section className="shell section-b">
      <div className="panel relative overflow-hidden">
        <img
          src="/images/atmosphere.jpg"
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          width={1600}
          height={907}
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-void via-void/85 to-void/40" />

        <div className="relative grid gap-10 p-7 md:p-12 lg:grid-cols-2 lg:p-16">
          <div>
            <span className="label-xs text-acid">Delivery only</span>
            <h2 className="display-lg mt-5 max-w-[14ch] text-bone">
              We come to you
            </h2>
            <p className="text-bone/70 mt-5 max-w-[46ch] text-sm leading-relaxed">
              Online only — no storefront, no queue. We run same-day delivery across
              most of San Diego on Thursdays, Saturdays, and Sundays, 1pm to 10pm.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Pill variant="acid" asChild>
                <Link to="/shop/disposables">
                  Start an order <ArrowRight className="size-4" />
                </Link>
              </Pill>
              <Pill variant="ghost" asChild>
                <Link to="/contact">Check your area</Link>
              </Pill>
            </div>
          </div>

          <ul className="space-y-2.5">
            {perks.map((perk) => (
              <li
                key={perk.title}
                className="rounded-2xl border border-line bg-void/50 px-5 py-4 backdrop-blur-sm"
              >
                <p className="text-sm font-bold text-bone">{perk.title}</p>
                <p className="text-ash mt-0.5 text-xs">{perk.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function CategorySplit() {
  const cards = [
    {
      title: "Disposables",
      href: "/shop/disposables",
      image: "/images/mm-galactic-diesel.jpg",
      copy: "2g all-in-ones from Muha Meds and Arcadia Fusion. Sealed, rechargeable, nothing to screw on.",
    },
    {
      title: "Screw-ons",
      href: "/shop/screw-ons",
      image: "/images/sherbinskis-headset.jpg",
      copy: "510-thread live resin carts. Full-terp, no additives, fits the battery you already own.",
    },
  ];

  return (
    <section className="shell pb-4 md:pb-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.href}
            className="panel group relative flex min-h-[300px] flex-col justify-end overflow-hidden p-7 transition-all duration-300 hover:-translate-y-1 hover:border-acid/35 md:min-h-[360px] md:p-9"
          >
            <img
              src={card.image}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              width={1100}
              height={1100}
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void via-void/70 to-void/10" />

            <div className="relative">
              <h3 className="display-md text-bone">{card.title}</h3>
              <p className="text-bone/70 mt-3 max-w-[38ch] text-sm leading-relaxed">
                {card.copy}
              </p>
              <span className="label-xs mt-6 inline-flex items-center gap-2 text-acid">
                Browse {card.title.toLowerCase()} <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Index() {
  return (
    <>
      <Hero />
      <Marquee items={MARQUEE_ITEMS} accent className="mt-16 md:mt-24" />
      <ProductShelf />
      <CategorySplit />
      <Marquee
        items={["Where cannabis, art & culture collide", "Lab tested · Sealed · Verified"]}
        duration={44}
        reverse
      />
      <DeliveryStrip />
    </>
  );
}

export default Index;
