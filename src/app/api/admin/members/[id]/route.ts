import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const member = db.members.get(params.id);
  if (!member) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const orders = db.orders.list({ memberId: member.id, includeArchived: true });
  return NextResponse.json({ member, orders });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const m = db.members.archive(params.id);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ member: m });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (body && body.restore === true) {
    const m = db.members.restore(params.id);
    if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ member: m });
  }
  return NextResponse.json({ error: "unsupported" }, { status: 400 });
}
