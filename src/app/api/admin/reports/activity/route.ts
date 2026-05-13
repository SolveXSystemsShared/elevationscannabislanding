import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET() {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const orders = db.orders.list();
  const members = db.members.list();

  // 14 days
  const days: { date: string; orders: number; members: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const next = new Date(d);
    next.setDate(d.getDate() + 1);
    days.push({
      date: d.toISOString().slice(5, 10),
      orders: orders.filter(
        (o) => new Date(o.placed_at) >= d && new Date(o.placed_at) < next,
      ).length,
      members: members.filter(
        (m) => new Date(m.created_at) >= d && new Date(m.created_at) < next,
      ).length,
    });
  }

  // Most active members (by order count)
  const orderCount: Record<string, number> = {};
  for (const o of orders) orderCount[o.member_id] = (orderCount[o.member_id] ?? 0) + 1;
  const top = Object.entries(orderCount)
    .map(([id, count]) => {
      const m = members.find((x) => x.id === id);
      return m
        ? { id, name: `${m.first_name} ${m.last_name}`, member_id: m.member_id, count }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => (b!.count - a!.count))
    .slice(0, 5);

  // Referral source breakdown
  const referrals: Record<string, number> = {};
  for (const m of members) {
    referrals[m.referral_source] = (referrals[m.referral_source] ?? 0) + 1;
  }

  return NextResponse.json({
    days,
    topMembers: top,
    referrals,
  });
}
