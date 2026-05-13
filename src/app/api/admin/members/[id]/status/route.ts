import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

const Schema = z.object({ status: z.enum(["active", "suspended"]) });

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const s = await getAdminSession();
  if (!s) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = Schema.safeParse(await req.json());
  if (!parsed.success)
    return NextResponse.json({ error: "validation" }, { status: 400 });
  const m = db.members.setStatus(params.id, parsed.data.status);
  if (!m) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ member: m });
}
