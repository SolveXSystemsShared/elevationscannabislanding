import { NextResponse } from "next/server";
import { z } from "zod";
import { DEMO, signAdminToken, setAdminCookie, clearAdminCookie } from "@/lib/server/auth";

const Schema = z.object({
  password: z.string().min(1),
  otp: z.string().length(6),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "validation" }, { status: 400 });
  }
  if (parsed.data.password !== DEMO.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "credentials", message: "Incorrect password." },
      { status: 401 },
    );
  }
  if (parsed.data.otp !== DEMO.ADMIN_OTP) {
    return NextResponse.json(
      { error: "otp", message: "Incorrect admin OTP." },
      { status: 401 },
    );
  }

  const token = signAdminToken({
    admin_id: "admin_root",
    email: DEMO.ADMIN_EMAIL,
    role: "director",
  });
  await setAdminCookie(token);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
