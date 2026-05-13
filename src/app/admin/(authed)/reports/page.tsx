"use client";

import * as React from "react";
import useSWR from "swr";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChartFrame } from "@/components/site/chart-frame";
import { formatZAR } from "@/lib/utils";
import { CATEGORY_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

const COLORS = ["#6C3FC5", "#9B72E8", "#3D1F8A", "#C9A961", "#B392E3"];

const RANGES = [
  { v: "today", label: "Today" },
  { v: "week", label: "Week" },
  { v: "month", label: "Month" },
  { v: "year", label: "Year" },
];

export default function ReportsPage() {
  const [range, setRange] = React.useState<"today" | "week" | "month" | "year">(
    "month",
  );
  const { data: rev } = useSWR<{
    summary: { revenue: number; cost: number; margin: number; orderCount: number };
    byCategory: Record<string, number>;
    topRevenue: { name: string; revenue: number; volume: number }[];
    topVolume: { name: string; revenue: number; volume: number }[];
    statuses: Record<string, number>;
  }>(`/api/admin/reports/revenue?range=${range}`, fetcher);

  const { data: act } = useSWR<{
    days: { date: string; orders: number; members: number }[];
    topMembers: { id: string; name: string; member_id: string; count: number }[];
    referrals: Record<string, number>;
  }>("/api/admin/reports/activity", fetcher);

  const days = act?.days ?? [];
  const referrals = act?.referrals ?? {};
  const topMembers = act?.topMembers ?? [];

  const refData = Object.entries(referrals).map(([name, value]) => ({ name, value }));
  const catData = Object.entries(rev?.byCategory ?? {}).map(([k, v]) => ({
    name: CATEGORY_LABEL[k as keyof typeof CATEGORY_LABEL] ?? k,
    value: v,
  }));

  return (
    <>
      <AdminPageHeader
        title="Reports"
        description="Revenue, activity, and member insights."
        action={
          <div className="flex gap-1">
            {RANGES.map((r) => (
              <button
                key={r.v}
                onClick={() => setRange(r.v as typeof range)}
                className={cn(
                  "px-3 py-1.5 rounded-btn text-xs font-medium transition-colors",
                  range === r.v
                    ? "bg-purple text-white"
                    : "border border-line text-ink hover:border-purple/30",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue" value={formatZAR(rev?.summary.revenue ?? 0)} />
        <Stat label="Cost" value={formatZAR(rev?.summary.cost ?? 0)} muted />
        <Stat
          label="Margin"
          value={formatZAR(rev?.summary.margin ?? 0)}
          accent="success"
        />
        <Stat
          label="Delivered orders"
          value={(rev?.summary.orderCount ?? 0).toString()}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Activity (last 14 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={days}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6C3FC5" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#6C3FC5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#C9A961" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#C9A961" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#6C3FC5"
                    strokeWidth={2}
                    fill="url(#g1)"
                    name="Orders"
                  />
                  <Area
                    type="monotone"
                    dataKey="members"
                    stroke="#C9A961"
                    strokeWidth={2}
                    fill="url(#g2)"
                    name="New members"
                  />
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </ChartFrame>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Referral sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={refData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={88}
                    dataKey="value"
                    label
                  >
                    {refData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartFrame>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Revenue by category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartFrame>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={catData}>
                  <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `R${v / 1000}k`}
                  />
                  <Tooltip formatter={(v) => formatZAR(Number(v))} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6C3FC5" />
                </BarChart>
              </ResponsiveContainer>
            </ChartFrame>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Top by revenue</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-line">
              {(rev?.topRevenue ?? []).map((p, i) => (
                <li key={p.name} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="font-display text-base font-bold text-purple/60 w-6">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{p.name}</span>
                  <span className="font-semibold">{formatZAR(p.revenue)}</span>
                </li>
              ))}
              {(rev?.topRevenue ?? []).length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-muted">
                  No data for this period.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Most active members</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-line">
              {topMembers.map((m, i) => (
                <li key={m.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                  <span className="font-display text-base font-bold text-purple/60 w-6">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium">{m.name}</p>
                    <Badge variant="subtle" className="font-mono mt-0.5">
                      {m.member_id}
                    </Badge>
                  </div>
                  <span className="font-semibold">{m.count} orders</span>
                </li>
              ))}
              {topMembers.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-muted">
                  No data yet.
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Button variant="ghost" asChild>
          <a href="/api/admin/members/export">Export member CSV</a>
        </Button>
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  muted,
  accent,
}: {
  label: string;
  value: string;
  muted?: boolean;
  accent?: "success";
}) {
  return (
    <Card className="shadow-card">
      <CardContent className="p-5">
        <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">
          {label}
        </p>
        <p
          className={cn(
            "mt-2 font-display text-2xl font-bold leading-tight",
            muted && "text-muted",
            accent === "success" && "text-success",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
