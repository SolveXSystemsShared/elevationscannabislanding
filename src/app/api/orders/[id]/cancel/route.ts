import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getMemberSession } from "@/lib/server/auth";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const o = db.orders.get(params.id);
  if (!o || o.member_id !== s.member_uid)
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (o.status === "out_for_delivery" || o.status === "delivered") {
    return NextResponse.json(
      { error: "too_late", message: "This order can no longer be cancelled." },
      { status: 409 },
    );
  }
  db.orders.updateStatus(o.id, "cancelled", s.member_uid);
  db.orders.update(o.id, { cancel_reason: "Cancelled by member" });
  return NextResponse.json({ ok: true });
}
