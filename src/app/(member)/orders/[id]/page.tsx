"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import {
  STATUS_LABEL,
  STATUS_PIPELINE,
  type Order,
  type OrderStatus,
} from "@/lib/types";
import { formatZAR, formatDateTime, cn } from "@/lib/utils";
import { ArrowLeft, MapPin, MessageSquare, Phone } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data, isLoading, mutate } = useSWR<{ order: Order }>(
    `/api/member/orders/${params.id}`,
    fetcher,
    { refreshInterval: 12000 },
  );
  const o = data?.order;

  if (isLoading || !o) {
    return (
      <div className="container-wide py-12">
        <div className="h-32 rounded-card bg-line animate-pulse-soft" />
      </div>
    );
  }

  const cancel = async () => {
    if (!confirm("Cancel this order?")) return;
    const res = await fetch(`/api/orders/${o.id}/cancel`, { method: "POST" });
    const data = await res.json();
    if (!res.ok) {
      toast({ kind: "error", title: data.message || "Could not cancel" });
      return;
    }
    toast({ kind: "success", title: "Order cancelled" });
    mutate();
  };

  const currentIdx = STATUS_PIPELINE.indexOf(o.status as OrderStatus);
  const cancelled = o.status === "cancelled";

  return (
    <div className="container-wide py-8 sm:py-12">
      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm text-muted">{o.reference}</p>
          <h1 className="mt-1 font-display text-h2 font-semibold tracking-tight">
            Order details
          </h1>
          <p className="mt-1 text-muted">Placed {formatDateTime(o.placed_at)}</p>
        </div>
        <Badge
          variant={
            cancelled
              ? "danger"
              : o.status === "delivered"
                ? "success"
                : "subtle"
          }
          className="text-sm"
        >
          {STATUS_LABEL[o.status]}
        </Badge>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Status tracker */}
          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Tracking</h2>
            {cancelled ? (
              <div className="mt-5 rounded-btn bg-danger/8 border border-danger/20 p-4 text-sm text-danger">
                This order was cancelled.
                {o.cancel_reason && (
                  <p className="mt-1 text-xs opacity-80">{o.cancel_reason}</p>
                )}
              </div>
            ) : (
              <ol className="mt-6 grid grid-cols-5 gap-2">
                {STATUS_PIPELINE.map((s, i) => {
                  const done = i <= currentIdx;
                  const active = i === currentIdx;
                  return (
                    <li key={s} className="flex flex-col items-center text-center">
                      <span
                        className={cn(
                          "h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors",
                          done
                            ? "bg-purple text-white border-purple"
                            : "bg-surface text-muted border-line",
                          active && "ring-4 ring-purple/15",
                        )}
                      >
                        {i + 1}
                      </span>
                      {i < STATUS_PIPELINE.length - 1 && (
                        <span
                          className={cn(
                            "h-0.5 w-full mt-[-22px] mb-[14px] -z-10",
                            done && i < currentIdx ? "bg-purple" : "bg-line",
                          )}
                        />
                      )}
                      <span
                        className={cn(
                          "mt-2 text-[10px] uppercase tracking-wide font-semibold",
                          done ? "text-purple" : "text-muted",
                        )}
                      >
                        {STATUS_LABEL[s]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            )}
            {o.delivery_note && !cancelled && (
              <div className="mt-6 rounded-btn bg-purple/5 border border-purple/15 p-3 text-sm flex gap-2">
                <MessageSquare className="h-4 w-4 text-purple shrink-0 mt-0.5" />
                <p>{o.delivery_note}</p>
              </div>
            )}
          </section>

          {/* Items */}
          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Items</h2>
            <ul className="mt-4 space-y-3">
              {o.items.map((i) => (
                <li
                  key={i.product_id}
                  className="flex items-center gap-3 text-sm"
                >
                  <div className="h-12 w-12 shrink-0 rounded-btn bg-gradient-to-br from-purple to-purple-dark flex items-center justify-center text-white font-display text-base font-bold">
                    {i.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{i.name}</p>
                    <p className="text-xs text-muted">
                      {i.qty} × {formatZAR(i.unit_price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatZAR(i.qty * i.unit_price)}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Address */}
          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Delivery address</h2>
            <div className="mt-3 flex items-start gap-3 text-sm">
              <MapPin className="h-4 w-4 text-muted mt-1" />
              <div>
                <p>{o.delivery_address.street}</p>
                <p className="text-muted">
                  {o.delivery_address.suburb}, {o.delivery_address.city}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="rounded-card border border-line bg-surface p-6 shadow-card h-fit space-y-4 lg:sticky lg:top-24">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted font-semibold">
              Total paid
            </p>
            <p className="mt-1 font-display text-3xl font-semibold">
              {formatZAR(o.total_retail)}
            </p>
            {o.yoco_payment_id && (
              <p className="mt-1 text-xs text-muted">
                Yoco · {o.yoco_payment_id}
              </p>
            )}
          </div>
          <Separator />
          <div className="space-y-3">
            <Button asChild variant="ghost" className="w-full">
              <a href="mailto:hello@elevations247.co.za">
                <MessageSquare className="h-4 w-4" /> Contact support
              </a>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <a href="tel:+27000000000">
                <Phone className="h-4 w-4" /> Call concierge
              </a>
            </Button>
            {!cancelled && o.status !== "delivered" && o.status !== "out_for_delivery" && (
              <Button variant="danger" className="w-full" onClick={cancel}>
                Cancel order
              </Button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
