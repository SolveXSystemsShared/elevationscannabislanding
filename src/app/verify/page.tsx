import { redirect } from "next/navigation";
import { LOGIN_URL } from "@/lib/constants";

/**
 * OTP verification is handled by the external member portal.
 * Any visit to `/verify` is redirected there immediately.
 */
export default function VerifyRedirect() {
  redirect(LOGIN_URL);
}
