"use client";

import Link from "next/link";
import { useCart, lineKey } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatZAR } from "@/lib/utils";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

export default function CartPage() {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="container-wide py-24 text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-purple/8 flex items-center justify-center">
          <ShoppingBag className="h-9 w-9 text-purple/40" />
        </div>
        <h1 className="mt-6 font-display text-h2 font-semibold">Your cart is empty.</h1>
        <p className="mt-2 text-muted">Browse the store to add something curated.</p>
        <Button asChild className="mt-6">
          <Link href="/store">Open the store</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">Your cart</h1>
      <p className="text-muted mt-1">
        {cart.items.length} item{cart.items.length === 1 ? "" : "s"}
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-3">
          {cart.items.map((i) => {
            const key = lineKey(i.product_id, i.bundle_label);
            return (
              <div
                key={key}
                className="flex gap-4 rounded-card border border-line bg-surface p-4 shadow-card"
              >
                <div className="h-24 w-24 shrink-0 rounded-btn bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display text-3xl font-bold">
                  {i.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/product/${i.product_id}`}
                        className="font-semibold hover:text-purple"
                      >
                        {i.name}
                      </Link>
                      <div className="mt-1 flex gap-1.5">
                        {i.bundle_label && (
                          <Badge variant="subtle">{i.bundle_label}</Badge>
                        )}
                        <Badge variant="muted">{i.thc_percent}% THC</Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => cart.remove(key)}
                      className="text-muted hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-btn border border-line">
                      <button
                        className="p-2 text-muted hover:text-purple"
                        onClick={() => cart.setQty(key, i.qty - 1)}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm font-semibold">
                        {i.qty}
                      </span>
                      <button
                        className="p-2 text-muted hover:text-purple"
                        onClick={() => cart.setQty(key, i.qty + 1)}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-lg font-semibold">
                      {formatZAR(i.qty * i.unit_price)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="rounded-card border border-line bg-surface p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-semibold">Order summary</h2>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-muted">
              <span>Subtotal</span>
              <span>{formatZAR(cart.totalAmount())}</span>
            </div>
            <div className="flex items-center justify-between text-muted">
              <span>Delivery</span>
              <span className="text-success font-medium">Free</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-line flex items-center justify-between font-display text-lg font-semibold">
            <span>Total</span>
            <span>{formatZAR(cart.totalAmount())}</span>
          </div>
          <Button asChild size="lg" className="mt-6 w-full">
            <Link href="/checkout">
              Continue to checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="mt-3 text-xs text-muted text-pretty">
            Secure payment via Yoco. Delivery within Stellenbosch only.
          </p>
        </aside>
      </div>
    </div>
  );
}
