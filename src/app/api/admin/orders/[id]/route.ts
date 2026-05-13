import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const order = db.orders.get(params.id);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order });
}
