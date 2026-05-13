/**
 * Shared constants used across the public site.
 */

/**
 * External URL members are redirected to when they click any
 * "Join" / "Become a Member" CTA. Used by both the public
 * marketing pages and the legacy `/register` route, which
 * issues a server-side redirect.
 */
export const JOIN_URL = "https://ec.solvex.web.za/";

/**
 * External URL existing members are redirected to when they
 * click any "Log In" / "Member Sign In" CTA. The same portal
 * hosts both onboarding and authentication, so this currently
 * mirrors JOIN_URL but is kept separate so they can diverge
 * (e.g. ?action=login) without touching every call site.
 */
export const LOGIN_URL = "https://ec.solvex.web.za/";
