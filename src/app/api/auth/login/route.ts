import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";

const Schema = z.object({
  identifier: z.string().min(3),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  const m = db.members.getByCellOrEmail(parsed.data.identifier);
  if (!m) {
    return NextResponse.json(
      { error: "not_found", message: "No account found for that cell or email." },
      { status: 404 },
    );
  }
  if (m.status === "suspended") {
    return NextResponse.json(
      {
        error: "suspended",
        message: "Your account has been suspended. Please contact support.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, member_uid: m.id, member_id: m.member_id });
}
