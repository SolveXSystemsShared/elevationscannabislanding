import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

const Schema = z.object({
  status: z.enum([
    "placed",
    "confirmed",
    "packing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ]),
  delivery_note: z.string().optional(),
  internal_note: z.string().optional(),
  cancel_reason: z.string().optional(),
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "validation" }, { status: 400 });
  const order = db.orders.updateStatus(params.id, parsed.data.status, "admin");
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (parsed.data.delivery_note !== undefined || parsed.data.internal_note !== undefined || parsed.data.cancel_reason !== undefined) {
    db.orders.update(params.id, {
      delivery_note: parsed.data.delivery_note ?? order.delivery_note,
      internal_note: parsed.data.internal_note ?? order.internal_note,
      cancel_reason: parsed.data.cancel_reason ?? order.cancel_reason,
    });
  }
  return NextResponse.json({ order });
}
