import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getMemberSession } from "@/lib/server/auth";

export async function GET() {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const m = db.members.get(s.member_uid);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ member: m });
}

const Schema = z.object({
  email: z.string().email().optional(),
  address_street: z.string().min(2).optional(),
  address_suburb: z.string().min(2).optional(),
  address_city: z.string().min(2).optional(),
});

export async function PUT(req: Request) {
  const s = await getMemberSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "validation" }, { status: 400 });
  const m = db.members.update(s.member_uid, parsed.data);
  return NextResponse.json({ member: m });
}
