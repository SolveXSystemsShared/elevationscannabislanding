import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getMemberSession } from "@/lib/server/auth";

export async function GET() {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const orders = db.orders.list({ memberId: s.member_uid });
  return NextResponse.json({ orders });
}
