import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { DEMO, signMemberToken, setMemberCookie } from "@/lib/server/auth";

const Schema = z.object({
  member_uid: z.string().min(1),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }

  if (parsed.data.otp !== DEMO.MEMBER_OTP) {
    return NextResponse.json(
      { error: "otp_invalid", message: "Incorrect OTP. Try again." },
      { status: 401 },
    );
  }

  const m = db.members.get(parsed.data.member_uid);
  if (!m) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
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

  db.members.update(m.id, { last_active: new Date().toISOString() });

  const token = signMemberToken({
    member_id: m.member_id,
    member_uid: m.id,
    email: m.email,
    full_name: `${m.first_name} ${m.last_name}`,
  });
  await setMemberCookie(token);

  return NextResponse.json({
    ok: true,
    member: {
      member_id: m.member_id,
      member_uid: m.id,
      full_name: `${m.first_name} ${m.last_name}`,
      email: m.email,
    },
  });
}
