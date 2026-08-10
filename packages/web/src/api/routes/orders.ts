import { z } from "zod";
import { eq, inArray } from "drizzle-orm";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { deliveryFeeCents } from "../lib/delivery";
import { sendEmail } from "../services/email";
import { receiptHtml, receiptSubject, receiptText } from "../services/order-receipt";


function orderCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `GLS-${out}`;
}

export const orders = {
  create: base
    .input(
      z.object({
        customerName: z.string().min(2).max(120),
        email: z.string().email(),
        phone: z.string().min(7).max(32),
        addressLine: z.string().min(4).max(200),
        city: z.string().min(2).max(120),
        zip: z.string().min(4).max(16),
        notes: z.string().max(1000).optional(),
        orderConfirmed: z.literal(true),
        items: z
          .array(z.object({ slug: z.string(), quantity: z.number().int().min(1).max(12) }))
          .min(1)
          .max(50),
      }),
    )
    .handler(async ({ input }) => {
      // Price server-side — never trust client totals.
      const slugs = input.items.map((i) => i.slug);
      const rows = await db
        .select()
        .from(schema.products)
        .where(inArray(schema.products.slug, slugs));

      const bySlug = new Map(rows.map((r) => [r.slug, r]));
      const priced = input.items.map((item) => {
        const product = bySlug.get(item.slug);
        if (!product) {
          throw new ORPCError("BAD_REQUEST", { message: `Unknown product: ${item.slug}` });
        }
        if (!product.inStock) {
          throw new ORPCError("CONFLICT", { message: `${product.name} is sold out.` });
        }
        return {
          productSlug: product.slug,
          productName: product.name,
          unitPriceCents: product.priceCents,
          quantity: item.quantity,
        };
      });

      const subtotalCents = priced.reduce(
        (sum, i) => sum + i.unitPriceCents * i.quantity,
        0,
      );
      // Tax is not applied. Delivery is $5 under $55, free at or above it.
      const taxCents = 0;
      const deliveryCents = deliveryFeeCents(subtotalCents);
      const totalCents = subtotalCents + deliveryCents;

      const [order] = await db
        .insert(schema.orders)
        .values({
          code: orderCode(),
          customerName: input.customerName,
          email: input.email,
          phone: input.phone,
          addressLine: input.addressLine,
          city: input.city,
          zip: input.zip,
          notes: input.notes ?? null,
          subtotalCents,
          taxCents,
          deliveryCents,
          totalCents,
        })
        .returning();

      await db
        .insert(schema.orderItems)
        .values(priced.map((i) => ({ ...i, orderId: order.id })));

      // Receipt email. Never let a mail failure lose a confirmed order — the
      // order is already committed, so we log and move on.
      const receipt = {
        code: order.code,
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        addressLine: input.addressLine,
        city: input.city,
        zip: input.zip,
        notes: input.notes ?? null,
        items: priced.map((i) => ({
          productName: i.productName,
          quantity: i.quantity,
          unitPriceCents: i.unitPriceCents,
        })),
        subtotalCents,
        deliveryCents,
        totalCents,
        placedAt: new Date(),
      };

      let receiptEmailed = false;
      try {
        receiptEmailed = await sendEmail({
          to: input.email,
          bcc: process.env.ORDER_BCC_EMAIL?.trim() || undefined,
          subject: receiptSubject(receipt),
          text: receiptText(receipt),
          html: receiptHtml(receipt),
          replyTo: process.env.ORDER_REPLY_TO?.trim() || undefined,
        });
      } catch (error) {
        console.error(`[orders] receipt email failed for ${order.code}:`, error);
      }

      if (receiptEmailed) {
        await db
          .update(schema.orders)
          .set({ receiptSentAt: new Date() })
          .where(eq(schema.orders.id, order.id));
      }

      return {
        code: order.code,
        subtotalCents,
        taxCents,
        deliveryCents,
        totalCents,
        receiptEmailed,
      };
    }),

  get: base.input(z.object({ code: z.string() })).handler(async ({ input }) => {
    const [order] = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.code, input.code));
    if (!order) throw new ORPCError("NOT_FOUND", { message: "Order not found" });

    const items = await db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, order.id));

    return { order, items };
  }),
};
