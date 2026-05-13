"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STATUS_LABEL, type Order } from "@/lib/types";
import { formatZAR, formatDateTime } from "@/lib/utils";
import { Search } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const VARIANT = (s: Order["status"]) =>
  s === "delivered"
    ? "success"
    : s === "cancelled"
      ? "danger"
      : s === "out_for_delivery" || s === "packing"
        ? "warning"
        : "subtle";

export default function AdminOrdersPage() {
  const { data, isLoading } = useSWR<{ orders: Order[] }>(
    "/api/admin/orders",
    fetcher,
    { refreshInterval: 12000 },
  );
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");

  const orders = data?.orders ?? [];
  const filtered = orders.filter((o) => {
    if (status !== "all" && o.status !== status) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !o.reference.toLowerCase().includes(q) &&
        !o.member_name?.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <>
      <AdminPageHeader
        title="Orders"
        description="Live order pipeline. Click any order to update status."
      />

      <div className="rounded-card border border-line bg-surface shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-background/40 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search by reference or member name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="w-44">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="placed">Placed</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="packing">Packing</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/30 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Reference</th>
                <th className="px-5 py-3 text-left font-medium">Member</th>
                <th className="px-5 py-3 text-left font-medium">Items</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Placed</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    Loading...
                  </td>
                </tr>
              )}
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-t border-line hover:bg-purple/[0.02] cursor-pointer"
                >
                  <td className="px-5 py-3 font-mono">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-purple hover:underline"
                    >
                      {o.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-3">{o.member_name}</td>
                  <td className="px-5 py-3 text-muted">
                    {o.items.reduce((s, i) => s + i.qty, 0)} items
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={VARIANT(o.status)}>
                      {STATUS_LABEL[o.status]}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-muted text-xs">
                    {formatDateTime(o.placed_at)}
                  </td>
                  <td className="px-5 py-3 text-right font-semibold">
                    {formatZAR(o.total_retail)}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No orders match those filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
