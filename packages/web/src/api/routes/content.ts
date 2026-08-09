import { z } from "zod";
import { asc } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const content = {
  testimonials: base.handler(() =>
    db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.sortOrder)),
  ),

  submitInquiry: base
    .input(
      z.object({
        name: z.string().min(2).max(120),
        email: z.string().email(),
        company: z.string().max(160).optional(),
        message: z.string().min(10).max(4000),
      }),
    )
    .handler(async ({ input }) => {
      const [row] = await db
        .insert(schema.inquiries)
        .values({
          kind: "general",
          name: input.name,
          email: input.email,
          company: input.company ?? null,
          message: input.message,
        })
        .returning({ id: schema.inquiries.id });
      return { ok: true as const, id: row.id };
    }),
};
