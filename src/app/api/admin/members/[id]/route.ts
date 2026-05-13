import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const member = db.members.get(params.id);
  if (!member) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const orders = db.orders.list({ memberId: member.id });
  return NextResponse.json({ member, orders });
}
