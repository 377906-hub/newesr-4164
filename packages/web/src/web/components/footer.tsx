import { Link } from "wouter";
import { Instagram, Youtube, Music2 } from "lucide-react";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Screw-Ons", href: "/shop/screw-ons" },
      { label: "Disposables", href: "/shop/disposables" },
      { label: "Strain Library", href: "/strains" },
    ],
  },
  {
    title: "Browse",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Strain Library", href: "/strains" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Lab Results", href: "/contact" },
      { label: "Delivery", href: "/shop" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-void">
      <div className="haze -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2" />

      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/images/logo-seal.png"
                alt=""
                className="size-12 shrink-0 rounded-full"
                width={320}
                height={320}
                decoding="async"
                loading="lazy"
              />
              <span className="font-display text-base font-bold uppercase leading-none text-bone">
                Green Leaf
                <span className="block text-[0.625rem] font-semibold tracking-[0.22em] text-acid">
                  Society
                </span>
              </span>
            </div>

            <p className="text-ash mt-6 max-w-[42ch] text-sm leading-relaxed">
              A curated online cannabis shop — screw-on carts, rechargeable disposables,
              and the brands worth carrying. Lab-tested, sealed, and delivered same day
              across most of San Diego on Thursdays, Saturdays, and Sundays, 1–10pm. Where cannabis, art, and culture collide.
            </p>

            <div className="mt-7 flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
                { Icon: Music2, label: "TikTok", href: "https://tiktok.com" },
                { Icon: Youtube, label: "YouTube", href: "https://youtube.com" },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-line bg-panel text-bone/70 transition-colors hover:border-acid/40 hover:text-acid"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="grid gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="label-xs text-ash">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="rounded-sm text-sm text-bone/75 transition-colors hover:text-acid focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance */}
        <div className="mt-16 border-t border-line pt-8">
          <p className="text-ash/70 max-w-[92ch] text-[0.6875rem] leading-relaxed">
            For adult use only. Keep out of reach of children and pets. Cannabis products may
            be habit forming. Do not drive a motor vehicle or operate heavy machinery
            while using cannabis. This product has not been analyzed or approved by the
            FDA. There is limited information on the side effects of using this product,
            and there may be associated health risks. Cannabis use during pregnancy or
            while breastfeeding may be harmful. All product names, strains, prices, lab
            figures, and testimonials shown on this site are illustrative
            placeholder content.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-[0.6875rem] text-ash/70 sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Green Leaf Society. Online delivery only — Thu, Sat & Sun, 1–10pm.</span>
            <div className="flex gap-5">
              {["Privacy", "Terms", "Accessibility"].map((label) => (
                <Link
                  key={label}
                  to="/contact"
                  className="transition-colors hover:text-bone"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Oversized bleeding wordmark */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span className="block translate-y-[22%] whitespace-nowrap text-center font-display text-[15vw] font-bold uppercase leading-[0.8] tracking-[-0.04em] text-bone/[0.055]">
          Green Leaf
        </span>
      </div>
    </footer>
  );
}
