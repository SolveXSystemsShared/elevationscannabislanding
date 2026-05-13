import { NextResponse } from "next/server";
import { clearMemberCookie } from "@/lib/server/auth";

export async function POST() {
  await clearMemberCookie();
  return NextResponse.json({ ok: true });
}
