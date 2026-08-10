# Green Leaf Society — build log

## Approved plan
Hybrid brand + shop. Dark/neon-green, streetwear-premium. Reference: bento panels, big centered
display type, marquees, pill buttons (from user's attached image, darkened).
Checkout = order capture only, no Stripe. Age gate 21+. Guest checkout, no auth.

## Steps
- [x] app_init
- [x] design.md
- [x] 12 images generated → packages/web/public/images/
- [ ] schema + db:push
- [ ] seed content
- [ ] api routes: catalog, orders, content
- [ ] fonts + tokens in styles.css / index.html
- [ ] shell: Nav, Footer, AgeGate, Marquee, Panel, cart context
- [ ] home
- [ ] shop grids + product detail + cart + checkout
- [ ] strains, society, locations, contact
- [ ] lint + build + browser walkthrough
- [ ] deliver

## Decisions
- Fonts: Chillax (display) + Satoshi (body) via Fontshare CDN.
- Product names invented in the Muha/Sherbinskis lane — no real trademarks.
- Cart in localStorage; order POSTed at checkout, returns confirmation code.
- Images: 3 cart shots + 3 disposable shots reused across 12 SKUs (normal for real brands).

## Resume log (page build)
- [x] app.tsx wired: CartProvider, AgeGate, Nav, CartDrawer, Footer, ScrollManager, all routes + 404
- [x] components/page-hero.tsx
- [x] pages/shop.tsx, product.tsx, strains.tsx, strain.tsx, society.tsx, locations.tsx
- [ ] pages/contact.tsx, cart.tsx, checkout.tsx, order-confirmation.tsx
- [ ] lint / typecheck / build
- [ ] browser walkthrough (375 / 768 / desktop)
- [ ] deliver

## Verification — complete
- typecheck: pass (web/mobile/desktop)
- oxlint packages/web: 0 warnings, 0 errors
- build: pass (web 902kb js / 59kb css)
- lint (root): 1 pre-existing template error in untouched packages/mobile/app/_layout.tsx (rule expects components/ErrorBoundary, template ships __ErrorBoundary). Cannot fix — __ file.
- Browser walkthrough (1440 + 375): age gate -> home -> shop/screw-ons -> filters -> product detail -> add to cart -> cart -> checkout -> order placed (GLS-U3UK4A) -> confirmation. 0 console/page errors.
- API smoke: catalog.products/featured/strains, content.locations/testimonials all return data.

## Round: logo integration + multi-brand front + Society removal
- Logo seal cut out to `logo-seal.png`; graffiti wall inpainted to `graffiti-wall.png`; favicon regenerated from the seal.
- Accents repalletted to the seal's mint / deep green / sage (see design.md).
- Seal now renders in nav wordmark, footer wordmark, and above the hero headline.
- `/society` page deleted: `pages/society.tsx` removed, route + import dropped from `app.tsx`, nav item removed, footer columns rebuilt as Shop / Browse / Support (Lab Results → /contact). Footer bleed wordmark "The Society" → "Green Leaf". Strains is the surviving library page.
- Homepage copy rewritten as a neutral multi-brand retailer: hero "The shop for every brand", marquees, stat strip (COA / Every batch), three-way split card 03 → Strains, curation block replaced the Boyle Heights origin story, "41 gallery nights" stat → "12 products in rotation", testimonials header → "What our customers say".
- All 2019 / Boyle Heights / origin-story references gone. Legit product copy using "press"/`aria-pressed` on other pages left alone per "keep every other page as is for now".
- Verified: `bun run typecheck` 3/3, `bunx oxlint packages/web --deny-warnings` 0 warnings 0 errors, `bun run build` OK, Playwright pass on 4200 (home/shop/strains/contact/society-404 + 375px) with zero console errors.
- Removed the "Curated, not stocked" / how-we-buy section (CultureBlock) from the homepage entirely, along with its image collage and the now-unused Leaf/Zap icon imports. Strain teaser now flows straight into testimonials. typecheck/oxlint/build pass, homepage renders with no console errors.
- Location scrub (online-only, San Diego): removed all California / LA / Long Beach / Santa Ana multi-city claims and the license number. Now reads "Online only — delivering across San Diego" (hero badge), "Online only — no storefront, no queue. Same-day delivery across most of San Diego" (delivery strip), and matching copy on shop, product, checkout, contact, footer. Checkout city placeholder → San Diego. Testimonial city line removed from the homepage render; seed cities all set to San Diego and the "every 2g on Melrose" quote reworded. Reseeded (8 strains, 12 products, 6 testimonials). typecheck/oxlint/build pass, browser pass clean.
- Hero stat strip (88% Peak THC / 2g / Same day / COA) replaced with a single clickable bar linking to /shop ("Shop all products — carts, disposables & everything in rotation") with an acid arrow button and hover lift. Verified the click navigates to /shop; typecheck/oxlint/build pass, 375px checked.
- Front page cut down: removed "Pick your lane" (ThreeWaySplit), "This month's drops" (FeaturedDrops), the strain panel (StrainTeaser), and the testimonials block (its quotes referenced the now-deleted products). Front page is now Hero → marquee → ProductShelf → marquee → DeliveryStrip. Hero secondary CTA → /shop.
- New `ProductShelf` section (`id="products"`) renders live from `useProducts({sort:"featured"})`, so it fills automatically as products are added. With an empty catalog it shows a "Shelf is being restocked" panel (seal mark + Get notified → /contact). Same empty state added to /shop for the no-filter/zero-product case; the existing filter-specific empty state still shows when a strain-type filter is active.
- Catalog emptied: `seed.ts` now has empty strainRows/productRows/testimonialRows with guarded inserts and a comment explaining products get added per brand. Ran seed → "Seeded 0 strains, 0 products, 0 testimonials."
- Verified: typecheck 3/3, oxlint 0/0, build OK, Playwright on 4200 for /, /shop, /strains with zero console errors.
- PENDING: first disposable product = Muha Meds. Need real specs (exact display name, strain/type, size, price, THC/CBD, description, image) before adding.

## Round — delivery days & window
- Delivery policy is now **Thursday, Saturday, Sunday only, same-day, 1pm–10pm**. All "order by 6pm / seven days a week" copy removed.
- Updated: `pages/index.tsx` (marquee item, hero badge, DeliveryStrip perk + body copy), `pages/shop.tsx` (perk card), `pages/product.tsx` (delivery line), `pages/checkout.tsx` (delivery callout), `pages/cart.tsx` (footnote), `pages/order-confirmation.tsx` (driver note), `components/footer.tsx` (blurb + copyright line), `pages/contact.tsx` (new "Delivery days" row, Clock icon).
- Verified: typecheck 3/3, oxlint 0 warnings/errors, build 2/2, Playwright home/shop/contact/cart/checkout → ERRORS: none.

## Round — real catalog loaded from brand photography
- Cropped the 10 supplied product photos to square (1100×1100) product images + one 16:9 lifestyle shot, all in `packages/web/public/images/`:
  `mm-sweet-dreams-og.jpg`, `mm-horchata.jpg`, `mm-watermelon-moonshine.jpg`, `mm-frozen-pineapple.jpg`, `mm-galactic-diesel.jpg`, `arcadia-mac1-jack.jpg`, `arcadia-fusion-back.jpg`, `sherbinskis-headset.jpg`, `cart-lifestyle.jpg`.
- `seed.ts` now seeds **7 strains + 7 products**:
  - Disposables — Muha Meds All-In-One 2g (Sweet Dreams OG · indica, Horchata · indica, Watermelon Moonshine · hybrid, Frozen Pineapple · sativa, Galactic Diesel · indica) at $40 (was $50); Arcadia Fusion 2G Liquid Live Diamonds MAC 1 x Jack Herer · sativa at $45 (was $55).
  - Screw-ons — Sherbinskis 1G Live Resin 510 cart, Headset (Sour Diesel x OG) · hybrid at $50.
  - Strain/type/effect/flavor data taken off the box art. **THC numbers are placeholders** pending real COAs.
- Front page: hero image swapped to `cart-lifestyle.jpg`, marquee now names the brands, shelf blurb names the three lines, new `CategorySplit` section (Disposables / Screw-ons tiles) between the shelf and the second marquee.
- Verified: seed → `Seeded 7 strains, 7 products`; typecheck 3/3, oxlint clean, build 2/2; Playwright home/shop/disposables/screw-ons/strains/product/cart/strain + 375px → ERRORS: none. Add-to-bag confirmed ($40 line in cart).

## Round — Frozen Pomegranate correction + Sherbinskis real COA
- 4th Muha Meds box confirmed as **Frozen Pomegranate** (not Pineapple). Renamed image to `mm-frozen-pomegranate.jpg`; strain slug `frozen-pomegranate`, lineage "Pomegranate Punch x Ice Cream Cake", flavor "Tangy, icy, tart red fruit with a cold exit"; product slug `muha-meds-all-in-one-frozen-pomegranate`. No `frozen-pineapple` references remain.
- Sherbinskis Headset now carries **real COA data** from the supplied back-panel photo: 83.59% total THC, 86.57% total cannabinoids, CBD <2mg (0.2), batch 252706SBL5HST — cited in the description. Strain range widened to 80–86%. Back panel saved as `sherbinskis-headset-coa.jpg`.
- Verified: seed 7/7, typecheck 3/3, oxlint clean, build 2/2, Playwright shop/product×2/strain → ERRORS: none.

## Round — cash only
- Payment is now **cash only**; all "cash or debit" / "no card is charged" copy replaced.
- `pages/index.tsx` perk "Cash or debit" → "Cash only"; `pages/cart.tsx` footnote; `pages/checkout.tsx` hero blurb, empty-cart blurb, delivery/payment note ("Cash only — we can't take cards"), and total label "Due on delivery" → "Due in cash on delivery"; `pages/order-confirmation.tsx` same total label + "Cash only — have it ready at handover."
- Verified: typecheck 3/3, oxlint clean, build 2/2, Playwright product → add to bag → home/cart/checkout → ERRORS: none. Checkout screenshot shows "DUE IN CASH ON DELIVERY $50.00".

## Round — $5 delivery fee under $60
- Rules live in `packages/web/src/api/lib/delivery.ts` (server authority: `DELIVERY_FEE_CENTS = 500`, `FREE_DELIVERY_THRESHOLD_CENTS = 6000`, `deliveryFeeCents()`), mirrored for display in `packages/web/src/web/lib/delivery.ts` (adds `amountToFreeDeliveryCents()`). Keep the two in sync.
- `schema.ts`: orders gained `deliveryCents` (integer, default 0). Applied with `cd packages/web && bun --env-file=../../.env drizzle-kit push --force`.
- `routes/orders.ts`: recomputes the fee server-side from the re-priced subtotal, stores it, and `totalCents = subtotal + deliveryCents`. Returned in the create payload.
- Cart + checkout summaries show Delivery as `$5.00` or `Free`, total includes the fee, plus an amber nudge ("Add $20.00 more and delivery is free"). Order confirmation shows a Delivery row from `order.deliveryCents`.
- Copy updated: home perk "Free over $60" → "$5 flat delivery under sixty dollars, free above it"; product page line "$5 under $60, free above"; checkout delivery callout.
- Verified: typecheck 3/3, oxlint clean, build 2/2. Two real orders placed via Playwright — GLS-Q2UQ46 ($40 subtotal → $5 delivery → **$45.00 due in cash**) and GLS-UV44AP ($80 subtotal → **Delivery Free**). ERRORS: none.

## Round — site-wide UI/UX polish pass

### Weight and loading
- **Deleted 11 unused legacy images** (`hero.png`, `flatlay.png`, `lifestyle.png`, `society.png`, `strain-macro.png`, `cart-{amber,rose,violet}.png`, `disp-{amber,mint,ruby}.png`) plus two orphan JPGs (`sherbinskis-headset-coa.jpg`, `arcadia-fusion-back.jpg`). Sources still in `/home/user/Attachments/` if they're ever needed again.
- **Re-encoded the three heavy in-use assets:** `store.png` 3.1MB → `atmosphere.jpg` 218KB (renamed — it is atmosphere, not a storefront, and the shop is online-only); `graffiti-wall.png` 1.76MB → `graffiti-wall.jpg` 310KB; `logo-seal.png` 704KB → 32KB (320×320 PNG8, 128 colours — verified visually identical against the original at render size).
- `public/images/` went from **23MB → 2.1MB**.
- Replaced the 6.5MB template `og-image.png` with a purpose-built **1200×630 `og-card.jpg`** (150KB) — graffiti wall, seal, wordmark, and the delivery window. Added `og:type`, `og:site_name`, and the full `twitter:*` card set.
- `index.html`: added `preconnect` for `cdn.fontshare.com` (font files were on an unwarmed connection) and `preload` for the seal.
- **Route-level code splitting** in `app.tsx` — only the landing page ships in the entry chunk, every other route is a `lazy()` import behind a `<Suspense>` fallback sized to the nav offset so a route swap never jumps. Entry chunk **849KB → 727KB**, with cart/checkout/product/strains now on demand.
- Every `<img>` on the site now carries explicit `width`/`height` (kills layout shift) and `decoding="async"`. Above-the-fold images (home hero art, home seal, home lifestyle panel, product image, strain hero) use `fetchPriority="high"`; everything else is `loading="lazy"`.

### Spacing rhythm
- Section padding was ad hoc across pages (`py-12/16`, `py-14/20`, `py-16/24`, `py-20/28`, six different bottom bands). Replaced with **one scale** in `styles.css`: `section-y-sm`, `section-y`, `section-y-lg`, bottom-only `section-b` / `section-b-lg`, and `nav-offset` for the fixed-header clearance. Applied across all nine pages and `page-hero.tsx`.
- Empty-state panels went from `px-8` to `px-6 md:px-8` so they breathe at 375px.
- **Footer double-gap fixed** — the footer carried its own `mt-24 md:mt-32` on top of each page's bottom band, producing ~224px of dead space (very visible on the cart page). Footer margin removed; pages own their bottom rhythm.

### Typography and colour
- **Fixed a stale palette value:** `pill.tsx` `acid` variant still hovered to `#c8ff5f`, a leftover from the pre-logo lime palette. Now `#8ff0bb`, derived from `--color-acid`.
- Added **`display-page`** (clamp 1.875–3.25rem) and moved the product and strain `<h1>` off `display-lg`. `display-lg` at up to 5rem uppercase was swallowing long names like "Muha Meds All-In-One — Frozen Pomegranate"; the homepage `display-xl` is now unambiguously the largest type on the site.
- **`label-xs` line-height 1 → 1.3.** At 1 any wrapped label collided with itself — clearly visible on the mobile hero badge. Hero badge also gets tighter tracking below `sm` so it holds one line at 375px.
- Product card badge row is now single-line (`flex-nowrap` + truncate) so titles share a baseline across the grid.
- Confirmed exactly one `<h1>` per page, no skipped heading levels.

### Accessibility
- **Fixed invalid HTML in `product-card.tsx`:** the add-to-bag `<button>` was nested inside the card's `<a>`. Rebuilt as an `<article>` with the link stretched over the card via an `after:` pseudo-element, so the button is a real sibling. Keyboard users can now reach both, and `focus-within` lights the card border.
- Global `:focus-visible` outline in acid, plus explicit focus rings on nav links, nav icon buttons, footer links, shop filter chips, quantity steppers, remove buttons, and the card's add button.
- **Skip-to-content link** ahead of the nav, targeting `<main id="main">`.
- `aria-current="page"` on active nav links (desktop and mobile sheet), with nested-route matching so `/shop/disposables` highlights correctly.
- Escape now closes the mobile nav sheet (the cart drawer already did).
- **Cart changes are announced** — `CartProvider` renders an `aria-live="polite"` region; opening the drawer was a visual-only cue before.
- Ambiguous repeated labels fixed: "Decrease quantity" → "Decrease quantity of {item}".
- Tap targets raised: nav buttons and product-card add button to 44px, product quantity steppers to 44px, cart steppers 32→40px, bare trash icons given 36–40px hit areas, filter chips `min-h-10`.
- `prefers-reduced-motion` now also neutralises transitions and animations, not just the marquee.
- Loading skeletons marked `aria-hidden`.

### Navigation
- Added **All Products → /shop** to the nav (and the mobile sheet), which had no route to the full catalog before.
- Reordered to Disposables before Screw-Ons — disposables are the lead product everywhere else in the copy.

### Verified
- `bun run typecheck` 3/3, `bunx oxlint packages/web --deny-warnings` 0/0, `bun run build` 2/2.
- Playwright at 1440px and 375px across home, shop, disposables, strains, product, cart, contact → **ERRORS: none**; all images report `complete` with non-zero `naturalWidth`.
- Two full orders placed end to end after the refactor: **GLS-K96Y68** ($40 → $5 delivery → $45.00) and **GLS-VVRWLH** ($80 → Free). Mobile sheet opens, Escape closes it.

### Still open
- **Prices ($40 / $45 / $50) and THC % for the five Muha Meds and the Arcadia product are placeholders.** Only Sherbinskis has real COA numbers.
- `/strains` in the nav — the library has 7 real strains now, so it is no longer empty; kept, but never explicitly confirmed.

## Round: price + delivery threshold update
- Muha Meds All-In-One (all 5 flavors): $40 → **$25** (compare-at $50 → $30, kept proportional).
- Sherbinskis 1G Live Resin Headset: $50 → **$40** (no compare-at).
- Arcadia Fusion 2G MAC 1 x Jack Herer: $45 → **$30** (compare-at $55 → $36).
- Free delivery threshold: $60 → **$55** (`FREE_DELIVERY_THRESHOLD_CENTS = 5500` in both `src/api/lib/delivery.ts` and `src/web/lib/delivery.ts`). $5 flat fee below it, unchanged.
- Copy updated: `index.tsx` ("Free over $55"), `product.tsx`, `checkout.tsx` (x2), `orders.ts` comment.
- Verified: reseed 7/7, typecheck 3/3, oxlint 0 warnings/0 errors, build 2/2.
- Playwright orders: **GLS-TBGMTH** ($25 subtotal → $5 delivery → $30.00 due in cash) and **GLS-W76DNF** ($65 subtotal → Free delivery). Console errors: none.

## Round: contact email + order receipt emails
- Contact page "Direct lines": two `.example` addresses collapsed into one row — **greenleafsocietyworld@yahoo.com**.
- Arcadia Fusion repriced $45 → $30 (compare-at $36).
- Email stack: `resend@6.18.1` added to `packages/web`.
  - `src/api/services/email.ts` — `sendEmail()`, `emailFrom()`, `emailEnabled()`. No `RESEND_API_KEY` = send is skipped and returns false, never throws. `text` + `html` both required (Resend's typed union rejects neither).
  - `src/api/services/order-receipt.ts` — `receiptSubject/receiptText/receiptHtml`. Table layout + inline styles, brand palette, HTML-escaped user input, PT timestamps. Includes items, qty, unit price, subtotal, delivery, cash total, full delivery address, phone, email, notes, delivery days, cash-only + safety notices.
  - `routes/orders.ts` — sends after the order commits, inside try/catch: a mail failure logs and never loses the order. BCC via `ORDER_BCC_EMAIL`, reply-to via `ORDER_REPLY_TO`.
  - `schema.ts` — `orders.receiptSentAt` (timestamp, nullable), set only on a real send. Pushed with `drizzle-kit push --force` → `[✓] Changes applied`.
  - `order-confirmation.tsx` — copy branches on `receiptSentAt`; no longer claims an email was sent when it wasn't. Also fixed stale "bring it with you" → "quote the code to your driver" (delivery-only).
- Env: `ORDER_FROM_EMAIL=GLS@greenleafsociety.store`, `ORDER_BCC_EMAIL`/`ORDER_REPLY_TO=greenleafsocietyworld@yahoo.com` in `.env`; all four keys added to `.env.template`.
- Verified: typecheck 3/3, oxlint 0/0, build 2/2, receipt rendered to /tmp/z/receipt.png and reviewed, live orders **GLS-UUFNNX** ($30) and **GLS-M7A3CJ** (free delivery) placed with email disabled — no console errors, no server errors.
- **BLOCKED:** needs `RESEND_API_KEY` + DNS verification of `greenleafsociety.store` in Resend before receipts actually send.

## Round: Resend key added — send BLOCKED on DNS
- `RESEND_API_KEY` saved to `.env` (sending-only scope; `/domains` API returns 401 by design).
- Direct API probe: `POST /emails` from `GLS@greenleafsociety.store` → **403 `validation_error`: "The greenleafsociety.store domain is not verified."** Sending stays blocked until DNS is verified in Resend.
- Failure path verified live: orders **GLS-V2XJQA** ($30) and **GLS-JK5D5N** (free delivery) both saved fine with the send failing. Server logged `[orders] receipt email failed for ...`; zero browser console errors; `receiptSentAt` stayed null; confirmation page correctly rendered the "We've saved your order under ..." copy instead of falsely claiming an email was sent.
- No code changes needed — the graceful-degradation design works as intended. Next action is on the user: verify the domain's DNS records in Resend.
