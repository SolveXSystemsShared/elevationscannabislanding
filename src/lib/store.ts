"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bundle, CartItem, Product } from "./types";

/**
 * Cart line key — products with bundles are tracked per (product_id, bundle_label)
 * so a member can have separate lines for "Blue Pave · 1g" and "Blue Pave · 3g".
 */
export function lineKey(productId: string, bundleLabel?: string) {
  return bundleLabel ? `${productId}::${bundleLabel}` : productId;
}

interface AddOptions {
  qty?: number;
  bundle?: Bundle;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  add: (product: Product, opts?: AddOptions) => void;
  remove: (key: string) => void;
  setQty: (key: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      add: (product, opts = {}) => {
        const qty = opts.qty ?? 1;
        const bundle = opts.bundle;
        const key = lineKey(product.id, bundle?.label);
        const existing = get().items.find(
          (i) => lineKey(i.product_id, i.bundle_label) === key,
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i.product_id, i.bundle_label) === key
                ? { ...i, qty: i.qty + qty }
                : i,
            ),
            isOpen: true,
          });
        } else {
          set({
            items: [
              ...get().items,
              {
                product_id: product.id,
                name: product.name,
                category: product.category,
                image_url: product.image_url,
                qty,
                unit_price: bundle?.price ?? product.retail_price,
                thc_percent: product.thc_percent,
                bundle_label: bundle?.label,
                bundle_qty: bundle?.qty,
              },
            ],
            isOpen: true,
          });
        }
      },
      remove: (key) =>
        set({
          items: get().items.filter(
            (i) => lineKey(i.product_id, i.bundle_label) !== key,
          ),
        }),
      setQty: (key, qty) => {
        if (qty <= 0) {
          set({
            items: get().items.filter(
              (i) => lineKey(i.product_id, i.bundle_label) !== key,
            ),
          });
          return;
        }
        set({
          items: get().items.map((i) =>
            lineKey(i.product_id, i.bundle_label) === key ? { ...i, qty } : i,
          ),
        });
      },
      clear: () => set({ items: [] }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set({ isOpen: !get().isOpen }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.qty, 0),
      totalAmount: () => get().items.reduce((sum, i) => sum + i.qty * i.unit_price, 0),
    }),
    { name: "elevations-cart" },
  ),
);

interface SessionState {
  memberId: string | null;
  memberUid: string | null;
  fullName: string | null;
  email: string | null;
  isAdmin: boolean;
  setMember: (data: { memberId: string; memberUid: string; fullName: string; email: string }) => void;
  setAdmin: (email: string) => void;
  clear: () => void;
}

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      memberId: null,
      memberUid: null,
      fullName: null,
      email: null,
      isAdmin: false,
      setMember: (data) =>
        set({
          memberId: data.memberId,
          memberUid: data.memberUid,
          fullName: data.fullName,
          email: data.email,
          isAdmin: false,
        }),
      setAdmin: (email) =>
        set({
          isAdmin: true,
          email,
          memberId: null,
          memberUid: null,
          fullName: "Admin",
        }),
      clear: () =>
        set({
          memberId: null,
          memberUid: null,
          fullName: null,
          email: null,
          isAdmin: false,
        }),
    }),
    { name: "elevations-session" },
  ),
);
