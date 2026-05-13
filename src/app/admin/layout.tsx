import { headers } from "next/headers";
import { AdminShell } from "@/components/site/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const h = await headers();
  const pathname = h.get("x-pathname") || "";
  // Login page renders standalone (no shell)
  if (pathname.endsWith("/admin/login")) return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
