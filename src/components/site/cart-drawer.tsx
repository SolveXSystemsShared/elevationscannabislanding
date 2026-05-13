"use client";

import * as React from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart, lineKey } from "@/lib/store";
import { formatZAR, cn } from "@/lib/utils";
import { Minus, Plus, Trash2, X, ShoppingBag } from "lucide-react";

export function CartDrawer() {
  const cart = useCart();

  return (
    <Dialog.Root open={cart.isOpen} onOpenChange={(o) => (o ? cart.open() : cart.close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-purple-dark/40 backdrop-blur-sm data-[state=open]:animate-fade-in-slow" />
        <Dialog.Content
          className={cn(
            "fixed right-0 top-0 bottom-0 z-50 flex flex-col w-full sm:max-w-md bg-surface shadow-card-hover",
            "data-[state=open]:animate-fade-in",
          )}
        >
          <header className="flex items-center justify-between p-5 border-b border-line">
            <Dialog.Title className="font-display text-xl font-semibold">
              Your cart
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 text-muted hover:bg-line/40 hover:text-ink">
              <X className="h-4 w-4" />
            </Dialog.Close>
          </header>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cart.items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 rounded-full bg-purple/5 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-7 w-7 text-purple/40" />
                </div>
                <p className="font-medium">Nothing here yet.</p>
                <p className="mt-1 text-sm text-muted">
                  Browse the store and add something curated.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/store" onClick={cart.close}>
                    Open the store
                  </Link>
                </Button>
              </div>
            ) : (
              cart.items.map((item) => {
                const key = lineKey(item.product_id, item.bundle_label);
                return (
                  <div
                    key={key}
                    className="flex gap-3 rounded-card border border-line bg-background p-3"
                  >
                    <div className="h-20 w-20 shrink-0 rounded-btn bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display text-2xl font-bold shadow-card">
                      {item.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{item.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {item.bundle_label && (
                              <Badge variant="subtle">{item.bundle_label}</Badge>
                            )}
                            <Badge variant="muted">{item.thc_percent}% THC</Badge>
                          </div>
                        </div>
                        <button
                          onClick={() => cart.remove(key)}
                          className="text-muted hover:text-danger"
                          aria-label="Remove"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-btn border border-line">
                          <button
                            className="p-2 text-muted hover:text-purple"
                            onClick={() => cart.setQty(key, item.qty - 1)}
                            aria-label="Decrease"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.qty}
                          </span>
                          <button
                            className="p-2 text-muted hover:text-purple"
                            onClick={() => cart.setQty(key, item.qty + 1)}
                            aria-label="Increase"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-display font-semibold">
                          {formatZAR(item.qty * item.unit_price)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {cart.items.length > 0 && (
            <footer className="border-t border-line p-5 space-y-3 bg-background">
              <div className="flex items-center justify-between text-sm text-muted">
                <span>Subtotal</span>
                <span>{formatZAR(cart.totalAmount())}</span>
              </div>
              <div className="flex items-center justify-between font-display text-lg font-semibold">
                <span>Total</span>
                <span>{formatZAR(cart.totalAmount())}</span>
              </div>
              <p className="text-xs text-muted">
                Delivery is free for members in Stellenbosch. Final billing happens
                at secure Yoco checkout.
              </p>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout" onClick={cart.close}>
                  Checkout securely
                </Link>
              </Button>
            </footer>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
