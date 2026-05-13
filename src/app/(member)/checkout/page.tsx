"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Field } from "@/components/site/field";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/ui/toaster";
import { formatZAR } from "@/lib/utils";
import { Lock, ShoppingBag, ShieldCheck } from "lucide-react";
import type { Member } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCart();
  const { toast } = useToast();
  const [submitting, setSubmitting] = React.useState(false);
  const [member, setMember] = React.useState<Member | null>(null);
  const [address, setAddress] = React.useState({ street: "", suburb: "", city: "Stellenbosch" });

  React.useEffect(() => {
    fetch("/api/member/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d.member) {
          setMember(d.member);
          setAddress({
            street: d.member.address_street,
            suburb: d.member.address_suburb,
            city: d.member.address_city,
          });
        }
      });
  }, []);

  const submit = async () => {
    if (cart.items.length === 0) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: cart.items.map((i) => ({
            product_id: i.product_id,
            qty: i.qty,
            bundle_label: i.bundle_label,
            bundle_qty: i.bundle_qty,
            unit_price: i.unit_price,
          })),
          delivery_address: address,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ kind: "error", title: "Could not place order" });
        return;
      }
      cart.clear();
      toast({
        kind: "success",
        title: "Order confirmed",
        description: `Reference: ${data.order.reference}`,
      });
      router.push(`/orders/${data.order.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container-wide py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-purple/8 flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-purple/40" />
        </div>
        <h1 className="mt-6 font-display text-h2 font-semibold">Nothing to checkout.</h1>
        <Button asChild className="mt-6">
          <Link href="/store">Open the store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">Checkout</h1>
      <p className="text-muted mt-1">
        Confirm delivery details, then pay securely with Yoco.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_420px]">
        <div className="space-y-8">
          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Member</h2>
            {member ? (
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-purple/10 text-purple flex items-center justify-center font-semibold">
                  {member.first_name[0]}
                  {member.last_name[0]}
                </div>
                <div>
                  <p className="font-medium">{member.first_name} {member.last_name}</p>
                  <p className="text-sm text-muted flex items-center gap-2">
                    <Badge variant="subtle" className="font-mono">
                      {member.member_id}
                    </Badge>
                    {member.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">Loading...</p>
            )}
          </section>

          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Delivery address</h2>
            <p className="mt-1 text-sm text-muted">
              Pre-filled from your profile. Edit for this order only.
            </p>
            <div className="mt-5 grid gap-4">
              <Field label="Street address" required>
                <Input
                  value={address.street}
                  onChange={(e) => setAddress((a) => ({ ...a, street: e.target.value }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Suburb" required>
                  <Input
                    value={address.suburb}
                    onChange={(e) => setAddress((a) => ({ ...a, suburb: e.target.value }))}
                  />
                </Field>
                <Field label="City" required hint="Stellenbosch only">
                  <Input value={address.city} readOnly />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold">Payment</h2>
            <p className="mt-1 text-sm text-muted">
              We use Yoco — South Africa&apos;s PCI-compliant payment processor.
              We never see your card details.
            </p>
            <div className="mt-5 rounded-card bg-purple/5 border border-purple/20 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-purple" />
                <div>
                  <p className="font-semibold">Pay Securely via Yoco</p>
                  <p className="text-xs text-muted">Opens hosted checkout in a new tab.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="rounded-card border border-line bg-surface p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <ul className="mt-4 space-y-3">
            {cart.items.map((i, idx) => (
              <li
                key={`${i.product_id}-${i.bundle_label ?? idx}`}
                className="flex justify-between gap-3 text-sm"
              >
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {i.name}
                    {i.bundle_label && (
                      <span className="ml-1 text-muted font-normal">
                        · {i.bundle_label}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    Qty {i.qty} · {formatZAR(i.unit_price)} each
                  </p>
                </div>
                <p className="font-semibold whitespace-nowrap">
                  {formatZAR(i.qty * i.unit_price)}
                </p>
              </li>
            ))}
          </ul>
          <Label className="block mt-5">Subtotal</Label>
          <p className="mt-1 text-sm flex justify-between">
            <span className="text-muted">Subtotal</span>
            <span>{formatZAR(cart.totalAmount())}</span>
          </p>
          <p className="mt-1 text-sm flex justify-between">
            <span className="text-muted">Delivery</span>
            <span className="text-success font-medium">Free</span>
          </p>
          <div className="mt-3 pt-3 border-t border-line flex justify-between font-display text-xl font-semibold">
            <span>Total</span>
            <span>{formatZAR(cart.totalAmount())}</span>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={submit}
            disabled={submitting}
          >
            <Lock className="h-4 w-4" />
            {submitting ? "Placing order..." : `Pay Securely via Yoco`}
          </Button>
          <p className="mt-3 text-xs text-muted text-center">
            Demo build · clicking finalises the order with a simulated payment.
          </p>
        </aside>
      </div>
    </div>
  );
}
