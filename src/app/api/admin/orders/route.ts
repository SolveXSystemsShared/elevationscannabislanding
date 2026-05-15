import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(req: Request) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const includeArchived = url.searchParams.get("includeArchived") === "1";
  const orders = db.orders.list({ includeArchived });
  return NextResponse.json({ orders });
}
