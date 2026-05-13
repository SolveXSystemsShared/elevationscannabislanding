"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/toaster";
import {
  STATUS_LABEL,
  type Order,
  type OrderStatus,
} from "@/lib/types";
import { formatZAR, formatDateTime } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminOrderDetail() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data, mutate } = useSWR<{ order: Order }>(
    `/api/admin/orders/${params.id}`,
    fetcher,
  );
  const o = data?.order;
  const [status, setStatus] = React.useState<OrderStatus>("placed");
  const [delivery, setDelivery] = React.useState("");
  const [internal, setInternal] = React.useState("");
  const [cancelReason, setCancelReason] = React.useState("");

  React.useEffect(() => {
    if (o) {
      setStatus(o.status);
      setDelivery(o.delivery_note ?? "");
      setInternal(o.internal_note ?? "");
      setCancelReason(o.cancel_reason ?? "");
    }
  }, [o]);

  if (!o) {
    return (
      <>
        <AdminPageHeader title="Order" />
        <div className="h-32 rounded-card bg-line animate-pulse-soft" />
      </>
    );
  }

  const save = async () => {
    const res = await fetch(`/api/admin/orders/${o.id}/status`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        status,
        delivery_note: delivery,
        internal_note: internal,
        cancel_reason: status === "cancelled" ? cancelReason : undefined,
      }),
    });
    if (!res.ok) {
      toast({ kind: "error", title: "Save failed" });
      return;
    }
    toast({ kind: "success", title: "Order updated" });
    mutate();
  };

  return (
    <>
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> All orders
      </Link>
      <AdminPageHeader
        title={`Order ${o.reference}`}
        description={`Placed ${formatDateTime(o.placed_at)} by ${o.member_name}`}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Items</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                {o.items.map((i) => (
                  <tr key={i.product_id} className="border-b border-line last:border-0">
                    <td className="py-2.5">
                      <p className="font-medium">{i.name}</p>
                    </td>
                    <td className="py-2.5 text-right text-muted">
                      {i.qty} × {formatZAR(i.unit_price)}
                    </td>
                    <td className="py-2.5 text-right font-semibold w-24">
                      {formatZAR(i.qty * i.unit_price)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 font-semibold" colSpan={2}>
                    Total retail
                  </td>
                  <td className="pt-3 text-right font-display font-bold">
                    {formatZAR(o.total_retail)}
                  </td>
                </tr>
                <tr>
                  <td className="text-xs text-muted" colSpan={2}>
                    Total cost (admin)
                  </td>
                  <td className="text-right text-xs text-muted">
                    {formatZAR(o.total_cost)}
                  </td>
                </tr>
                <tr>
                  <td className="text-xs text-muted" colSpan={2}>
                    Margin
                  </td>
                  <td className="text-right text-xs text-success font-medium">
                    {formatZAR(o.total_retail - o.total_cost)}
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Delivery</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <p>{o.delivery_address.street}</p>
            <p className="text-muted">
              {o.delivery_address.suburb}, {o.delivery_address.city}
            </p>
            <p className="mt-3 text-xs text-muted">
              Yoco payment ID: {o.yoco_payment_id ?? "—"}
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Status & notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
                  Status
                </p>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as OrderStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placed">{STATUS_LABEL.placed}</SelectItem>
                    <SelectItem value="confirmed">{STATUS_LABEL.confirmed}</SelectItem>
                    <SelectItem value="packing">{STATUS_LABEL.packing}</SelectItem>
                    <SelectItem value="out_for_delivery">
                      {STATUS_LABEL.out_for_delivery}
                    </SelectItem>
                    <SelectItem value="delivered">{STATUS_LABEL.delivered}</SelectItem>
                    <SelectItem value="cancelled">{STATUS_LABEL.cancelled}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
                  Current
                </p>
                <Badge>{STATUS_LABEL[o.status]}</Badge>
              </div>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
                Member-visible delivery note
              </p>
              <Textarea
                value={delivery}
                onChange={(e) => setDelivery(e.target.value)}
                placeholder="ETA 25 min · driver en route"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
                Internal note (admin only)
              </p>
              <Textarea
                value={internal}
                onChange={(e) => setInternal(e.target.value)}
                placeholder="Confirmed driver assignment"
              />
            </div>
            {status === "cancelled" && (
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-2">
                  Cancel reason
                </p>
                <Textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            )}
            <Button onClick={save}>Save changes</Button>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Member</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <Link
              href={`/admin/members/${o.member_id}`}
              className="text-purple font-medium hover:underline"
            >
              {o.member_name}
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
