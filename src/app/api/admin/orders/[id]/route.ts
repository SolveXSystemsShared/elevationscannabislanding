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

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const o = db.orders.archive(params.id);
  if (!o) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ order: o });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body && body.restore === true) {
    const o = db.orders.restore(params.id);
    if (!o) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: o });
  }
  return NextResponse.json({ error: "unsupported" }, { status: 400 });
}
