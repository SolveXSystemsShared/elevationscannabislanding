import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { Session, AdminSession } from "@/lib/types";

const SECRET = process.env.JWT_SECRET || "elevations-dev-secret-change-me";
const MEMBER_COOKIE = "elv_member";
const ADMIN_COOKIE = "elv_admin";

export const DEMO = {
  MEMBER_OTP: "123456",
  ADMIN_OTP: "000123",
  ADMIN_PASSWORD: "420420",
  ADMIN_EMAIL: "admin@elevations247.co.za",
};

export function signMemberToken(payload: Omit<Session, "exp">): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function signAdminToken(payload: Omit<AdminSession, "exp">): string {
  return jwt.sign(payload, SECRET, { expiresIn: "4h" });
}

export function verifyMember(token?: string): Session | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as Session;
  } catch {
    return null;
  }
}

export function verifyAdmin(token?: string): AdminSession | null {
  if (!token) return null;
  try {
    return jwt.verify(token, SECRET) as AdminSession;
  } catch {
    return null;
  }
}

export async function setMemberCookie(token: string) {
  const c = await cookies();
  c.set(MEMBER_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function setAdminCookie(token: string) {
  const c = await cookies();
  c.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4,
    path: "/",
  });
}

export async function clearMemberCookie() {
  const c = await cookies();
  c.delete(MEMBER_COOKIE);
}

export async function clearAdminCookie() {
  const c = await cookies();
  c.delete(ADMIN_COOKIE);
}

export async function getMemberSession(): Promise<Session | null> {
  const c = await cookies();
  return verifyMember(c.get(MEMBER_COOKIE)?.value);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const c = await cookies();
  return verifyAdmin(c.get(ADMIN_COOKIE)?.value);
}

export const AUTH_COOKIES = {
  MEMBER: MEMBER_COOKIE,
  ADMIN: ADMIN_COOKIE,
};
