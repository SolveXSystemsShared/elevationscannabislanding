import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getMemberSession } from "@/lib/server/auth";

const Item = z.object({
  product_id: z.string(),
  qty: z.number().int().min(1),
  bundle_label: z.string().optional(),
  bundle_qty: z.number().int().min(1).optional(),
  unit_price: z.number().min(0).optional(), // client-supplied (verified server-side)
});

const Schema = z.object({
  items: z.array(Item).min(1),
  delivery_address: z.object({
    street: z.string().min(2),
    suburb: z.string().min(2),
    city: z.string().min(2),
  }),
});

export async function GET() {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const list = db.orders.list({ memberId: s.member_uid });
  return NextResponse.json({ orders: list });
}

export async function POST(req: Request) {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  // Resolve & verify each line server-side. Trust the bundle the client claims
  // only if it actually exists on the product; fall back to per-unit price.
  const items = parsed.data.items.map((i) => {
    const p = db.products.get(i.product_id);
    if (!p) throw new Error(`Unknown product: ${i.product_id}`);

    const bundle =
      i.bundle_label && p.bundles
        ? p.bundles.find((b) => b.label === i.bundle_label)
        : undefined;

    const unit_price = bundle ? bundle.price : p.retail_price;
    const bundleQty = bundle?.qty ?? 1;
    const name = bundle ? `${p.name} · ${bundle.label}` : p.name;

    return {
      product_id: p.id,
      name,
      qty: i.qty,
      unit_price,
      _bundle_qty: bundleQty,
      _cost_price: p.cost_price,
    };
  });

  const total_retail = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  // Cost uses underlying grams/units inside each bundle
  const total_cost = items.reduce(
    (s, i) => s + i.qty * i._bundle_qty * i._cost_price,
    0,
  );

  const order = db.orders.create({
    member_id: s.member_uid,
    member_name: s.full_name,
    status: "placed",
    delivery_address: parsed.data.delivery_address,
    items: items.map((i) => ({
      product_id: i.product_id,
      name: i.name,
      qty: i.qty,
      unit_price: i.unit_price,
    })),
    total_retail,
    total_cost,
    yoco_payment_id: `yc_${Math.random().toString(36).slice(2, 10)}`,
  });

  return NextResponse.json({ ok: true, order });
}
