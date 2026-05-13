import { redirect } from "next/navigation";
import { JOIN_URL } from "@/lib/constants";

/**
 * Registration is handled by an external onboarding flow.
 * Any visit to `/register` is redirected there immediately —
 * this catches bookmarks, deep links, and any leftover internal
 * references that still point at this route.
 */
export default function RegisterRedirect() {
  redirect(JOIN_URL);
}
