import { MemberNav } from "@/components/site/member-nav";
import { CartDrawer } from "@/components/site/cart-drawer";
import { Footer } from "@/components/site/footer";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <MemberNav />
      <main className="flex-1">{children}</main>
      <CartDrawer />
      <Footer />
    </div>
  );
}
