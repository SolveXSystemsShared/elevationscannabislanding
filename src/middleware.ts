import { NextResponse, type NextRequest } from "next/server";

const MEMBER_PROTECTED = [
  "/store",
  "/product",
  "/cart",
  "/checkout",
  "/orders",
  "/account",
];
const ADMIN_PROTECTED = ["/admin"];
const ADMIN_PUBLIC = ["/admin/login"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const memberToken = req.cookies.get("elv_member")?.value;
  const adminToken = req.cookies.get("elv_admin")?.value;

  if (
    ADMIN_PROTECTED.some((p) => pathname.startsWith(p)) &&
    !ADMIN_PUBLIC.some((p) => pathname === p || pathname.startsWith(p + "/")) &&
    !adminToken
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  if (
    MEMBER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/")) &&
    !memberToken
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/store/:path*",
    "/product/:path*",
    "/cart",
    "/checkout",
    "/orders/:path*",
    "/account",
    "/admin/:path*",
  ],
};
