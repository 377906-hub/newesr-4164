import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Green Leaf Society — catalog, strain library, orders.
 * Apply with `bun run db:push` from packages/web.
 */

export const strains = sqliteTable("strains", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** indica | sativa | hybrid */
  type: text("type").notNull(),
  lineage: text("lineage").notNull(),
  /** comma-separated terpene list */
  terpenes: text("terpenes").notNull(),
  /** comma-separated effect list */
  effects: text("effects").notNull(),
  thcLow: real("thc_low").notNull(),
  thcHigh: real("thc_high").notNull(),
  flavorNotes: text("flavor_notes").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
});

export const products = sqliteTable("products", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  /** screw-ons | disposables */
  category: text("category").notNull(),
  strainSlug: text("strain_slug").notNull(),
  /** indica | sativa | hybrid — denormalized for fast filtering */
  strainType: text("strain_type").notNull(),
  /** e.g. "1g", "2g" */
  size: text("size").notNull(),
  priceCents: integer("price_cents").notNull(),
  compareAtCents: integer("compare_at_cents"),
  thc: real("thc").notNull(),
  cbd: real("cbd").notNull().default(0),
  hardware: text("hardware").notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  /** comma-separated */
  badges: text("badges").notNull().default(""),
  inStock: integer("in_stock", { mode: "boolean" }).notNull().default(true),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const testimonials = sqliteTable("testimonials", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  handle: text("handle").notNull(),
  role: text("role").notNull(),
  city: text("city").notNull(),
  quote: text("quote").notNull(),
  productSlug: text("product_slug"),
  rating: integer("rating").notNull().default(5),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const orders = sqliteTable("orders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  code: text("code").notNull().unique(),
  customerName: text("customer_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  addressLine: text("address_line").notNull(),
  city: text("city").notNull(),
  zip: text("zip").notNull(),
  notes: text("notes"),
  subtotalCents: integer("subtotal_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").notNull().default("received"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const orderItems = sqliteTable("order_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull(),
  productSlug: text("product_slug").notNull(),
  productName: text("product_name").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
});

export const inquiries = sqliteTable("inquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  kind: text("kind").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});
