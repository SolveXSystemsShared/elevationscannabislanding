import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(req: Request) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const includeArchived = url.searchParams.get("includeArchived") === "1";
  const products = db.products.list({ adminView: true, includeArchived });
  return NextResponse.json({ products });
}

const BundleSchema = z.object({
  qty: z.number().int().min(1),
  label: z.string().min(1),
  price: z.number().min(0),
  saving: z.number().min(0).optional(),
});

const Schema = z.object({
  name: z.string().min(1),
  category: z.enum(["flower", "preroll", "moonstick", "vape"]),
  grade: z.string().min(1),
  type: z.enum(["sativa", "hybrid", "indica"]),
  thc_percent: z.number().min(0).max(100),
  cbd_percent: z.number().min(0).max(100).optional(),
  effects: z.tuple([z.string(), z.string(), z.string()]),
  terpenes: z.array(z.string()).default([]),
  description: z.string().min(1),
  image_url: z.string().default(""),
  retail_price: z.number().min(0),
  cost_price: z.number().min(0),
  unit_label: z.string().default("g"),
  bundles: z.array(BundleSchema).optional(),
  stock_qty: z.number().min(0).optional(),
  status: z.enum(["in_stock", "out_of_stock"]).default("in_stock"),
  display_order: z.number().int().default(99),
});

export async function POST(req: Request) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "validation", issues: parsed.error.issues }, { status: 400 });
  const product = db.products.create(parsed.data);
  return NextResponse.json({ product });
}
