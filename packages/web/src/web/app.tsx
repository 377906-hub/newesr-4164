import { lazy, Suspense, useEffect } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import { Provider } from "./components/provider";
import { AgentFeedback, RunableBadge } from "@runablehq/website-runtime";
import { CartProvider } from "./lib/cart";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { CartDrawer } from "./components/cart-drawer";
import { Pill } from "./components/ui/pill";

import Index from "./pages/index";

/* The landing page ships in the entry chunk; every other route is split out so
   a first visit doesn't download the checkout flow it may never reach. */
const Shop = lazy(() => import("./pages/shop"));
const ProductDetail = lazy(() => import("./pages/product"));
const Strains = lazy(() => import("./pages/strains"));
const StrainDetail = lazy(() => import("./pages/strain"));
const Contact = lazy(() => import("./pages/contact"));
const CartPage = lazy(() => import("./pages/cart"));
const Checkout = lazy(() => import("./pages/checkout"));
const OrderConfirmation = lazy(() => import("./pages/order-confirmation"));

/** Holds the nav offset and viewport height so a route swap never jumps. */
function RouteFallback() {
  return (
    <div className="shell nav-offset flex min-h-[70vh] items-center justify-center">
      <span className="sr-only">Loading</span>
      <span className="size-8 animate-spin rounded-full border-2 border-line border-t-acid" />
    </div>
  );
}

/** Reset scroll on navigation; honour #hash targets. */
function ScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);

  return null;
}

function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col items-center justify-center pt-[68px] text-center md:pt-[76px]">
      <span className="label-xs text-acid">404</span>
      <h1 className="display-lg mt-6 text-bone">Nothing here</h1>
      <p className="text-ash mt-5 max-w-[44ch] text-sm leading-relaxed">
        That page moved, sold out, or never existed. The good stuff is one tap away.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Pill variant="acid" size="lg" asChild>
          <Link to="/shop/disposables">Shop Disposables</Link>
        </Pill>
        <Pill variant="ghost" size="lg" asChild>
          <Link to="/">Back home</Link>
        </Pill>
      </div>
    </section>
  );
}

function App() {
  return (
    <Provider>
      <CartProvider>
        <a
          href="#main"
          className="label-xs sr-only rounded-full bg-acid px-5 py-3 text-void focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90]"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">
          <ScrollManager />
          <Suspense fallback={<RouteFallback />}>
            <Switch>
              <Route path="/" component={Index} />
              <Route path="/shop" component={Shop} />
              <Route path="/shop/:category" component={Shop} />
              <Route path="/product/:slug" component={ProductDetail} />
              <Route path="/strains" component={Strains} />
              <Route path="/strains/:slug" component={StrainDetail} />
              <Route path="/contact" component={Contact} />
              <Route path="/cart" component={CartPage} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/order/:code" component={OrderConfirmation} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </main>
        <Footer />
        <CartDrawer />
        {/* Do not remove — off by default, activated by parent iframe via postMessage */}
        {import.meta.env.DEV && <AgentFeedback />}
        {/* "Made with Runable" badge - if user asks to remove the runable badge, remove this code as well as comment */}
        {<RunableBadge />}
      </CartProvider>
    </Provider>
  );
}

export default App;
