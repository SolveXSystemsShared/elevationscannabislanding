"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toaster";
import { formatCell, formatDateTime, formatZAR } from "@/lib/utils";
import { STATUS_LABEL, type Member, type Order } from "@/lib/types";
import { ArrowLeft, ShieldCheck, ShieldOff } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AdminMemberPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data, mutate } = useSWR<{ member: Member; orders: Order[] }>(
    `/api/admin/members/${params.id}`,
    fetcher,
  );
  const m = data?.member;
  const orders = data?.orders ?? [];

  if (!m) {
    return (
      <>
        <AdminPageHeader title="Member" />
        <div className="h-32 rounded-card bg-line animate-pulse-soft" />
      </>
    );
  }

  const setStatus = async (status: "active" | "suspended") => {
    const res = await fetch(`/api/admin/members/${m.id}/status`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast({ kind: "error", title: "Could not change status" });
      return;
    }
    toast({
      kind: status === "suspended" ? "info" : "success",
      title: status === "suspended" ? "Member suspended" : "Member reactivated",
    });
    mutate();
  };

  return (
    <>
      <Link
        href="/admin/members"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple mb-4"
      >
        <ArrowLeft className="h-4 w-4" /> All members
      </Link>
      <AdminPageHeader
        title={`${m.first_name} ${m.last_name}`}
        description={`Member ID ${m.member_id} · joined ${formatDateTime(m.created_at)}`}
        action={
          m.status === "active" ? (
            <Button variant="ghost" onClick={() => setStatus("suspended")} className="text-danger">
              <ShieldOff className="h-4 w-4" /> Suspend
            </Button>
          ) : (
            <Button onClick={() => setStatus("active")}>
              <ShieldCheck className="h-4 w-4" /> Reactivate
            </Button>
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <Row label="Status">
              <Badge variant={m.status === "active" ? "success" : "danger"}>{m.status}</Badge>
            </Row>
            <Row label="Cell">{formatCell(m.cell)}</Row>
            <Row label="Email">{m.email}</Row>
            <Row label="ID number" mono>{m.id_number}</Row>
            <Row label="Address">
              {m.address_street}, {m.address_suburb}, {m.address_city}
            </Row>
            <Row label="Referral source">{m.referral_source}</Row>
            <Row label="Last active">{formatDateTime(m.last_active)}</Row>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Order history</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-background/30 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-5 py-3 text-left font-medium">Reference</th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-left font-medium">Placed</th>
                  <th className="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t border-line hover:bg-purple/[0.02]">
                    <td className="px-5 py-3 font-mono">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-purple hover:underline"
                      >
                        {o.reference}
                      </Link>
                    </td>
                    <td className="px-5 py-3">
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
                    <td className="px-5 py-3 text-muted text-xs">
                      {formatDateTime(o.placed_at)}
                    </td>
                    <td className="px-5 py-3 text-right font-semibold">
                      {formatZAR(o.total_retail)}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-muted">
                      No orders yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function Row({
  label,
  children,
  mono,
}: {
  label: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-3">
      <span className="text-[11px] uppercase tracking-wider text-muted font-semibold">
        {label}
      </span>
      <span className={mono ? "font-mono" : ""}>{children}</span>
    </div>
  );
}
