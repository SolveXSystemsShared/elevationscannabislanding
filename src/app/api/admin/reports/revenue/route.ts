import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(req: Request) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const range = url.searchParams.get("range") ?? "month";

  const now = new Date();
  let from: Date;
  if (range === "today") {
    from = new Date(now);
    from.setHours(0, 0, 0, 0);
  } else if (range === "week") {
    from = new Date(now);
    from.setDate(now.getDate() - 7);
  } else if (range === "year") {
    from = new Date(now);
    from.setFullYear(now.getFullYear() - 1);
  } else {
    from = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const summary = db.reports.revenue(from, now);
  const allOrders = db.orders.list();
  const inRange = allOrders.filter(
    (o) =>
      new Date(o.placed_at) >= from &&
      new Date(o.placed_at) <= now &&
      o.status === "delivered",
  );

  // By category
  const byCat: Record<string, number> = {};
  for (const o of inRange) {
    for (const i of o.items) {
      const p = db.products.get(i.product_id);
      const cat = p?.category ?? "other";
      byCat[cat] = (byCat[cat] ?? 0) + i.qty * i.unit_price;
    }
  }

  // Top products
  const productAgg: Record<
    string,
    { name: string; revenue: number; volume: number }
  > = {};
  for (const o of inRange) {
    for (const i of o.items) {
      const cur = productAgg[i.product_id] ?? {
        name: i.name,
        revenue: 0,
        volume: 0,
      };
      cur.revenue += i.qty * i.unit_price;
      cur.volume += i.qty;
      productAgg[i.product_id] = cur;
    }
  }
  const topRevenue = Object.values(productAgg)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const topVolume = Object.values(productAgg)
    .sort((a, b) => b.volume - a.volume)
    .slice(0, 5);

  // Status counts
  const statuses: Record<string, number> = {};
  for (const o of allOrders.filter(
    (x) => new Date(x.placed_at) >= from && new Date(x.placed_at) <= now,
  )) {
    statuses[o.status] = (statuses[o.status] ?? 0) + 1;
  }

  return NextResponse.json({
    summary,
    byCategory: byCat,
    topRevenue,
    topVolume,
    statuses,
    range,
  });
}
