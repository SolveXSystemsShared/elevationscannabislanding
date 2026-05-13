"use client";

import Link from "next/link";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Activity,
  ArrowRight,
} from "lucide-react";
import {
  STATUS_LABEL,
  type Member,
  type Order,
} from "@/lib/types";
import { formatZAR, formatDateTime } from "@/lib/utils";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminDashboard() {
  const { data: m } = useSWR<{ members: Member[] }>("/api/admin/members", fetcher);
  const { data: o } = useSWR<{ orders: Order[] }>("/api/admin/orders", fetcher);

  const members = m?.members ?? [];
  const orders = o?.orders ?? [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const isToday = (d: string) => new Date(d).getTime() >= today.getTime();
  const isThisMonth = (d: string) => new Date(d).getTime() >= monthStart.getTime();

  const stats = [
    { label: "Total Members", value: members.length.toString(), icon: Users },
    {
      label: "New (7d)",
      value: members
        .filter((mb) => Date.now() - new Date(mb.created_at).getTime() < 7 * 86400_000)
        .length.toString(),
      icon: TrendingUp,
    },
    { label: "Total Orders", value: orders.length.toString(), icon: ShoppingBag },
    { label: "Orders Today", value: orders.filter((x) => isToday(x.placed_at)).length.toString(), icon: Activity },
    {
      label: "Revenue Today",
      value: formatZAR(
        orders
          .filter((x) => isToday(x.placed_at) && x.status === "delivered")
          .reduce((s, x) => s + x.total_retail, 0),
      ),
      icon: TrendingUp,
    },
    {
      label: "Revenue This Month",
      value: formatZAR(
        orders
          .filter((x) => isThisMonth(x.placed_at) && x.status === "delivered")
          .reduce((s, x) => s + x.total_retail, 0),
      ),
      icon: TrendingUp,
    },
    {
      label: "Active Orders",
      value: orders
        .filter((x) => x.status !== "delivered" && x.status !== "cancelled")
        .length.toString(),
      icon: ShoppingBag,
    },
  ];

  const recentOrders = [...orders].slice(0, 10);
  const recentMembers = [...members]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Live snapshot — members, orders, revenue."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                    {s.label}
                  </p>
                  <Icon className="h-4 w-4 text-purple/70" />
                </div>
                <p className="mt-2 font-display text-xl font-bold leading-tight">
                  {s.value}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent orders</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wider text-muted bg-background/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Reference</th>
                    <th className="px-6 py-3 font-medium">Member</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                    <th className="px-6 py-3 font-medium text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t border-line hover:bg-purple/[0.02]"
                    >
                      <td className="px-6 py-3 font-mono">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="text-purple hover:underline"
                        >
                          {o.reference}
                        </Link>
                      </td>
                      <td className="px-6 py-3 text-ink">{o.member_name}</td>
                      <td className="px-6 py-3">
                        <Badge
                          variant={
                            o.status === "delivered"
                              ? "success"
                              : o.status === "cancelled"
                                ? "danger"
                                : "subtle"
                          }
                        >
                          {STATUS_LABEL[o.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-3 text-right font-semibold">
                        {formatZAR(o.total_retail)}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-muted">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent members</CardTitle>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/members">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentMembers.map((mb) => (
              <Link
                key={mb.id}
                href={`/admin/members/${mb.id}`}
                className="flex items-center gap-3 rounded-btn p-2 hover:bg-purple/5"
              >
                <div className="h-10 w-10 rounded-full bg-purple/10 text-purple flex items-center justify-center text-sm font-semibold">
                  {mb.first_name[0]}
                  {mb.last_name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {mb.first_name} {mb.last_name}
                  </p>
                  <p className="text-xs text-muted truncate">
                    {formatDateTime(mb.created_at)}
                  </p>
                </div>
                <Badge variant="subtle" className="font-mono shrink-0">
                  {mb.member_id}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
