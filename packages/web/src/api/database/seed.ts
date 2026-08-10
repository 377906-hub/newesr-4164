import { db } from "./index";
import * as schema from "./schema";

/**
 * Seeds the catalog. Run: bun --env-file=../../.env src/api/database/seed.ts
 *
 * Current lineup is built from the brands actually in rotation:
 *   - Muha Meds All-In-One 2g disposables (Sweet Dreams OG, Horchata,
 *     Watermelon Moonshine, Frozen Pomegranate, Galactic Diesel)
 *   - Arcadia Fusion 2g Liquid Live Diamonds disposable (MAC 1 x Jack Herer)
 *   - Sherbinskis 1g Live Resin 510 cart (Headset)
 *
 * Product photography lives in packages/web/public/images/ and is shot in-house.
 * Potency figures come off the batch COA where we have the panel in hand (Sherbinskis
 * Headset, batch 252706SBL5HST) and are placeholders elsewhere — swap them per drop.
 */

const strainRows: (typeof schema.strains.$inferInsert)[] = [
  {
    slug: "sweet-dreams-og",
    name: "Sweet Dreams OG",
    type: "indica",
    lineage: "OG Kush x Granddaddy Purple",
    terpenes: "Myrcene, Linalool, Limonene",
    effects: "Hazy, Relaxed, Sleepy",
    thcLow: 84,
    thcHigh: 91,
    flavorNotes: "Earthy, citrusy, a soft pine finish",
    description:
      "A night-shift OG. Earthy and citrus-forward on the inhale with a heavy, hazy landing — the one you reach for when the day is already over.",
    image: "/images/mm-sweet-dreams-og.jpg",
    featured: true,
  },
  {
    slug: "horchata",
    name: "Horchata",
    type: "indica",
    lineage: "Mochi Gelato x Jet Fuel Gelato",
    terpenes: "Caryophyllene, Limonene, Humulene",
    effects: "Hazy, Relaxed, Calm",
    thcLow: 82,
    thcHigh: 90,
    flavorNotes: "Smooth, creamy, cinnamon and rice milk",
    description:
      "Dessert-adjacent and genuinely smooth. Creamy cinnamon on the exhale, a slow body drop behind it — heavy without knocking you out.",
    image: "/images/mm-horchata.jpg",
    featured: false,
  },
  {
    slug: "watermelon-moonshine",
    name: "Watermelon Moonshine",
    type: "hybrid",
    lineage: "Watermelon Zkittlez x Moonshine Haze",
    terpenes: "Terpinolene, Myrcene, Ocimene",
    effects: "Balanced, Euphoric, Social",
    thcLow: 83,
    thcHigh: 90,
    flavorNotes: "Fresh, juicy, candy-melon rind",
    description:
      "The daytime crowd-pleaser. Fresh juicy melon up front, an even euphoric lift that never tips over into jittery.",
    image: "/images/mm-watermelon-moonshine.jpg",
    featured: true,
  },
  {
    slug: "frozen-pomegranate",
    name: "Frozen Pomegranate",
    type: "sativa",
    lineage: "Pomegranate Punch x Ice Cream Cake",
    terpenes: "Limonene, Terpinolene, Pinene",
    effects: "Tingly, Awake, Bright",
    thcLow: 84,
    thcHigh: 92,
    flavorNotes: "Tangy, icy, tart red fruit with a cold exit",
    description:
      "Tart pomegranate with a menthol-cold finish. Tingly and awake — a morning or mid-shift sativa that keeps you moving.",
    image: "/images/mm-frozen-pomegranate.jpg",
    featured: false,
  },
  {
    slug: "galactic-diesel",
    name: "Galactic Diesel",
    type: "indica",
    lineage: "Sour Diesel x Purple Punch",
    terpenes: "Caryophyllene, Myrcene, Limonene",
    effects: "Hazy, Relaxed, Weighted",
    thcLow: 85,
    thcHigh: 92,
    flavorNotes: "Pungent, dank, sharp fuel over grape",
    description:
      "Loud in the room and louder on the exhale. Pungent fuel with a dank grape underside, then a weighted indica settle.",
    image: "/images/mm-galactic-diesel.jpg",
    featured: true,
  },
  {
    slug: "mac-1-x-jack-herer",
    name: "MAC 1 x Jack Herer",
    type: "sativa",
    lineage: "MAC 1 (Alien Cookies x Starfighter) x Jack Herer",
    terpenes: "Terpinolene, Pinene, Caryophyllene",
    effects: "Clear, Energetic, Focused",
    thcLow: 86,
    thcHigh: 93,
    flavorNotes: "Sweet citrus, cracked pepper, herbal pine",
    description:
      "A true sativa cross run as single-source liquid live diamonds. Clear-headed, sharp, and citrus-peppery — this is the one for a full workday.",
    image: "/images/arcadia-mac1-jack.jpg",
    featured: true,
  },
  {
    slug: "headset",
    name: "Headset",
    type: "hybrid",
    lineage: "Sour Diesel x OG",
    terpenes: "Caryophyllene, Limonene, Myrcene",
    effects: "Heady, Loose, Even",
    thcLow: 80,
    thcHigh: 86,
    flavorNotes: "Sour fuel, lemon rind, kush funk",
    description:
      "Sour Diesel crossed into OG and pulled as live resin — sour fuel and lemon rind with the full kush funk still intact. Heady first, loose after.",
    image: "/images/sherbinskis-headset.jpg",
    featured: false,
  },
];

const productRows: (typeof schema.products.$inferInsert)[] = [
  /* ---------- Disposables ---------- */
  {
    slug: "muha-meds-all-in-one-sweet-dreams-og",
    name: "Muha Meds All-In-One — Sweet Dreams OG",
    category: "disposables",
    strainSlug: "sweet-dreams-og",
    strainType: "indica",
    size: "2g",
    priceCents: 2500,
    compareAtCents: 3000,
    thc: 88.6,
    cbd: 0.2,
    hardware: "2g all-in-one, USB-C rechargeable, adjustable airflow",
    tagline: "Hazy, relaxed indica. Earthy and citrusy — built for the end of the night.",
    description:
      "Muha Meds' All-In-One in Sweet Dreams OG: 2000mg of indica in a sealed rechargeable unit, no cart to screw on and nothing to leak in a pocket. Earthy citrus on the draw, a hazy relaxed landing after. Charge it over USB-C and run it flat.",
    image: "/images/mm-sweet-dreams-og.jpg",
    badges: "2000mg,Rechargeable",
    inStock: true,
    featured: true,
    sortOrder: 10,
  },
  {
    slug: "muha-meds-all-in-one-horchata",
    name: "Muha Meds All-In-One — Horchata",
    category: "disposables",
    strainSlug: "horchata",
    strainType: "indica",
    size: "2g",
    priceCents: 2500,
    compareAtCents: 3000,
    thc: 86.9,
    cbd: 0.2,
    hardware: "2g all-in-one, USB-C rechargeable, adjustable airflow",
    tagline: "Smooth and creamy indica — cinnamon on the exhale, weight behind it.",
    description:
      "2000mg of Horchata in Muha Meds' sealed All-In-One. Creamy cinnamon and rice milk on the exhale, one of the smoothest draws on the shelf, and a slow indica body drop that doesn't rush you. USB-C rechargeable.",
    image: "/images/mm-horchata.jpg",
    badges: "2000mg,Smooth draw",
    inStock: true,
    featured: false,
    sortOrder: 20,
  },
  {
    slug: "muha-meds-all-in-one-watermelon-moonshine",
    name: "Muha Meds All-In-One — Watermelon Moonshine",
    category: "disposables",
    strainSlug: "watermelon-moonshine",
    strainType: "hybrid",
    size: "2g",
    priceCents: 2500,
    compareAtCents: 3000,
    thc: 87.4,
    cbd: 0.3,
    hardware: "2g all-in-one, USB-C rechargeable, adjustable airflow",
    tagline: "Balanced, euphoric hybrid. Fresh and juicy, easy all day.",
    description:
      "The daytime pick of the All-In-One lineup. Watermelon Moonshine runs fresh and juicy with an even euphoric lift — balanced enough to keep going, loud enough to notice. 2000mg sealed, USB-C rechargeable.",
    image: "/images/mm-watermelon-moonshine.jpg",
    badges: "2000mg,Daytime",
    inStock: true,
    featured: true,
    sortOrder: 30,
  },
  {
    slug: "muha-meds-all-in-one-frozen-pomegranate",
    name: "Muha Meds All-In-One — Frozen Pomegranate",
    category: "disposables",
    strainSlug: "frozen-pomegranate",
    strainType: "sativa",
    size: "2g",
    priceCents: 2500,
    compareAtCents: 3000,
    thc: 89.1,
    cbd: 0.2,
    hardware: "2g all-in-one, USB-C rechargeable, adjustable airflow",
    tagline: "Tangy, icy sativa — tingly and awake from the first pull.",
    description:
      "Frozen Pomegranate is the sativa end of the All-In-One range: tart red fruit with a cold menthol finish, tingly and awake without the edge. 2000mg sealed unit, USB-C rechargeable.",
    image: "/images/mm-frozen-pomegranate.jpg",
    badges: "2000mg,Sativa",
    inStock: true,
    featured: false,
    sortOrder: 40,
  },
  {
    slug: "muha-meds-all-in-one-galactic-diesel",
    name: "Muha Meds All-In-One — Galactic Diesel",
    category: "disposables",
    strainSlug: "galactic-diesel",
    strainType: "indica",
    size: "2g",
    priceCents: 2500,
    compareAtCents: 3000,
    thc: 90.2,
    cbd: 0.2,
    hardware: "2g all-in-one, USB-C rechargeable, adjustable airflow",
    tagline: "Pungent, dank indica. The loudest one in the case.",
    description:
      "Galactic Diesel is the loud one — sharp fuel over a dank grape base, hazy and heavily relaxed once it lands. Highest potency in the All-In-One lineup at 2000mg. USB-C rechargeable.",
    image: "/images/mm-galactic-diesel.jpg",
    badges: "2000mg,Highest THC",
    inStock: true,
    featured: true,
    sortOrder: 50,
  },
  {
    slug: "arcadia-fusion-mac-1-x-jack-herer",
    name: "Arcadia Fusion 2G — MAC 1 x Jack Herer",
    category: "disposables",
    strainSlug: "mac-1-x-jack-herer",
    strainType: "sativa",
    size: "2g",
    priceCents: 3000,
    compareAtCents: 3600,
    thc: 91.3,
    cbd: 0.4,
    hardware: "2g disposable, USB-C rechargeable, ceramic core",
    tagline: "Single-source liquid live diamonds. Clear, energetic sativa.",
    description:
      "Arcadia Fusion runs single-source liquid live diamonds — one farm, one batch, diamonds back into their own live sauce. MAC 1 crossed with Jack Herer gives you sweet citrus and cracked pepper with a clear, focused energy. 2g rechargeable disposable.",
    image: "/images/arcadia-mac1-jack.jpg",
    badges: "Liquid live diamonds,Single source",
    inStock: true,
    featured: true,
    sortOrder: 60,
  },

  /* ---------- Screw-ons (510 carts) ---------- */
  {
    slug: "sherbinskis-live-resin-headset",
    name: "Sherbinskis 1G Live Resin — Headset",
    category: "screw-ons",
    strainSlug: "headset",
    strainType: "hybrid",
    size: "1g",
    priceCents: 4000,
    compareAtCents: null,
    thc: 83.59,
    cbd: 0.2,
    hardware: "510-thread cart, ceramic core, glass tank",
    tagline: "Sour Diesel x OG pulled as live resin. Full-terp, no additives.",
    description:
      "A 1g live resin 510 cart from Sherbinskis. Headset is Sour Diesel crossed into OG — sour fuel, lemon rind, and the kush funk left where it belongs. Live resin means the terpene profile comes off the fresh-frozen plant, so there's nothing added to make it taste like anything. Batch 252706SBL5HST tested at 83.59% total THC and 86.57% total cannabinoids, CBD under 2mg. Screws onto any 510 battery.",
    image: "/images/sherbinskis-headset.jpg",
    badges: "Live resin,510 thread",
    inStock: true,
    featured: true,
    sortOrder: 70,
  },
];

const testimonialRows: (typeof schema.testimonials.$inferInsert)[] = [];

async function seed() {
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.inquiries);
  await db.delete(schema.testimonials);
  await db.delete(schema.products);
  await db.delete(schema.strains);

  if (strainRows.length) await db.insert(schema.strains).values(strainRows);
  if (productRows.length) await db.insert(schema.products).values(productRows);
  if (testimonialRows.length)
    await db.insert(schema.testimonials).values(testimonialRows);

  console.log(
    `Seeded ${strainRows.length} strains, ${productRows.length} products, ` +
      `${testimonialRows.length} testimonials.`,
  );
}

await seed();
