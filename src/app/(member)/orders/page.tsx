"use client";

import Link from "next/link";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STATUS_LABEL, type Order } from "@/lib/types";
import { formatZAR, formatDateTime, cn } from "@/lib/utils";
import { ArrowRight, Package } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const statusVariant = (s: Order["status"]) =>
  s === "delivered"
    ? "success"
    : s === "cancelled"
      ? "danger"
      : s === "out_for_delivery" || s === "packing"
        ? "warning"
        : "subtle";

export default function OrdersPage() {
  const { data, isLoading } = useSWR<{ orders: Order[] }>("/api/member/orders", fetcher);
  const orders = data?.orders ?? [];

  return (
    <div className="container-wide py-10 sm:py-14">
      <h1 className="font-display text-h2 font-semibold tracking-tight">My orders</h1>
      <p className="text-muted mt-1">Live status, every step of the way.</p>

      <div className="mt-8 space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-28 rounded-card border border-line bg-surface animate-pulse-soft"
            />
          ))
        ) : orders.length === 0 ? (
          <div className="rounded-card border border-line bg-surface p-12 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-purple/8 flex items-center justify-center">
              <Package className="h-7 w-7 text-purple/40" />
            </div>
            <p className="mt-5 font-display text-xl font-semibold">No orders yet.</p>
            <p className="mt-1 text-muted">When you place an order, it&apos;ll appear here.</p>
            <Button asChild className="mt-5">
              <Link href="/store">Open the store</Link>
            </Button>
          </div>
        ) : (
          orders.map((o) => (
            <Link
              key={o.id}
              href={`/orders/${o.id}`}
              className={cn(
                "block rounded-card border border-line bg-surface p-5 shadow-card transition-all",
                "hover:shadow-card-hover hover:-translate-y-0.5 hover:border-purple/20",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-mono text-sm font-semibold">{o.reference}</p>
                    <Badge variant={statusVariant(o.status)}>
                      {STATUS_LABEL[o.status]}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateTime(o.placed_at)}
                  </p>
                  <p className="mt-1 text-sm">
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(" · ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-xl font-semibold">
                    {formatZAR(o.total_retail)}
                  </p>
                  <p className="mt-1 text-xs text-purple inline-flex items-center gap-1">
                    Track order <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
