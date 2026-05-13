import { redirect } from "next/navigation";
import { LOGIN_URL } from "@/lib/constants";

/**
 * Authentication is handled by an external member portal.
 * Any visit to `/login` is redirected there immediately —
 * this catches bookmarks, deep links, and any leftover internal
 * references that still point at this route.
 */
export default function LoginRedirect() {
  redirect(LOGIN_URL);
}
