import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { Pill } from "./ui/pill";

const LINKS = [
  { label: "All Products", href: "/shop" },
  { label: "Disposables", href: "/shop/disposables" },
  { label: "Screw-Ons", href: "/shop/screw-ons" },
  { label: "Strains", href: "/strains" },
];

/** Marks a nav link active for its own route and any nested child route. */
function isActive(location: string, href: string) {
  if (href === "/shop") return location === "/shop";
  return location === href || location.startsWith(`${href}/`);
}

export function Nav() {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const cart = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-line bg-void/80 backdrop-blur-xl"
            : "border-b border-transparent",
        )}
      >
        <div className="shell flex h-[68px] items-center justify-between gap-4 md:h-[76px]">
          {/* Wordmark */}
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2.5"
            aria-label="Green Leaf Society home"
          >
            <img
              src="/images/logo-seal.png"
              alt=""
              width={320}
              height={320}
              decoding="async"
              className="size-10 shrink-0 rounded-full md:size-11"
            />
            <span className="font-display text-[0.9375rem] font-bold uppercase leading-none tracking-[-0.01em] text-bone">
              Green Leaf
              <span className="block text-[0.625rem] font-semibold tracking-[0.22em] text-acid">
                Society
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const active = isActive(location, link.href);
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-[0.8125rem] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void",
                    active
                      ? "bg-panel-2 text-bone"
                      : "text-bone/65 hover:bg-panel hover:text-bone",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Pill
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex"
              asChild
            >
              <Link to="/contact">Contact</Link>
            </Pill>

            <button
              type="button"
              onClick={cart.openDrawer}
              aria-label={`Open cart (${cart.count} items)`}
              className="relative grid size-11 place-items-center rounded-full border border-line bg-panel text-bone transition-colors hover:border-bone/25 hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void"
            >
              <ShoppingBag className="size-4" strokeWidth={2} />
              {cart.count > 0 && (
                <span className="absolute -right-1 -top-1 grid min-w-5 place-items-center rounded-full bg-acid px-1 text-[0.625rem] font-bold leading-5 text-void">
                  {cart.count}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="grid size-11 place-items-center rounded-full border border-line bg-panel text-bone transition-colors hover:bg-panel-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void lg:hidden"
            >
              <Menu className="size-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile sheet */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Dismiss menu"
            className="absolute inset-0 size-full cursor-default bg-void/95 backdrop-blur-xl"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex h-full flex-col px-6 pb-10 pt-6">
            <div className="flex items-center justify-between">
              <span className="label-xs text-acid">Menu</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="grid size-11 place-items-center rounded-full border border-line bg-panel text-bone transition-colors hover:bg-panel-2"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="mt-10 flex flex-col gap-1">
              {[...LINKS, { label: "Contact", href: "/contact" }].map((link) => {
                const active = isActive(location, link.href);
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "display-md border-b border-line py-4 transition-colors hover:text-acid",
                      active ? "text-acid" : "text-bone",
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto pt-8">
              <Pill variant="acid" size="lg" className="w-full" asChild>
                <Link to="/shop/disposables">Shop Disposables</Link>
              </Pill>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
