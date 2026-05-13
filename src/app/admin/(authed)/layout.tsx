import { AdminShell } from "@/components/site/admin-shell";

export default function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
