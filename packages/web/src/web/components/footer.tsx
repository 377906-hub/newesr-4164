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
    title: "Society",
    links: [
      { label: "Gallery", href: "/society" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Lab Results", href: "/society#testing" },
      { label: "Delivery", href: "/shop" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 overflow-hidden border-t border-line bg-void md:mt-32">
      <div className="haze -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2" />

      <div className="shell relative py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-acid">
                <span className="font-display text-sm font-bold text-void">G</span>
              </span>
              <span className="font-display text-base font-bold uppercase leading-none text-bone">
                Green Leaf
                <span className="block text-[0.625rem] font-semibold tracking-[0.22em] text-acid">
                  Society
                </span>
              </span>
            </div>

            <p className="text-ash mt-6 max-w-[42ch] text-sm leading-relaxed">
              Live-resin screw-ons and 2g rechargeable disposables, pressed in small
              batches in California. Where cannabis, art, and culture collide.
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
                        className="text-sm text-bone/75 transition-colors hover:text-acid"
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
            <span>© {new Date().getFullYear()} Green Leaf Society. Lic. C11-0000432-LIC</span>
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
        <span className="block translate-y-[22%] whitespace-nowrap text-center font-display text-[19vw] font-bold uppercase leading-[0.8] tracking-[-0.04em] text-bone/[0.055]">
          The Society
        </span>
      </div>
    </footer>
  );
}
