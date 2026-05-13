"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { AdminPageHeader } from "@/components/site/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Member } from "@/lib/types";
import { formatCell, formatDate } from "@/lib/utils";
import { Download, Search } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function MembersAdminPage() {
  const { data, isLoading } = useSWR<{ members: Member[] }>(
    "/api/admin/members",
    fetcher,
  );
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "suspended">("all");

  const members = data?.members ?? [];
  const filtered = members.filter((m) => {
    if (filter !== "all" && m.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !m.member_id.includes(q) &&
        !`${m.first_name} ${m.last_name}`.toLowerCase().includes(q) &&
        !m.email.toLowerCase().includes(q) &&
        !m.cell.includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <>
      <AdminPageHeader
        title="Members"
        description="View, manage, and export the full member register."
        action={
          <Button asChild variant="ghost">
            <a href="/api/admin/members/export">
              <Download className="h-4 w-4" /> Export CSV
            </a>
          </Button>
        }
      />

      <div className="rounded-card border border-line bg-surface shadow-card overflow-hidden">
        <div className="px-5 py-3 border-b border-line bg-background/40 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <Input
              placeholder="Search by name, ID, email, cell"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1">
            {(["all", "active", "suspended"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={
                  "px-3 py-1.5 rounded-btn text-xs font-medium transition-colors " +
                  (filter === f
                    ? "bg-purple text-white"
                    : "border border-line text-ink hover:border-purple/30")
                }
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background/30 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Member ID</th>
                <th className="px-5 py-3 text-left font-medium">Name</th>
                <th className="px-5 py-3 text-left font-medium">Cell</th>
                <th className="px-5 py-3 text-left font-medium">Email</th>
                <th className="px-5 py-3 text-left font-medium">Joined</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
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
              {filtered.map((m) => (
                <tr
                  key={m.id}
                  className="border-t border-line hover:bg-purple/[0.02]"
                >
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/members/${m.id}`}
                      className="font-mono text-purple hover:underline"
                    >
                      {m.member_id}
                    </Link>
                  </td>
                  <td className="px-5 py-3 font-medium">
                    {m.first_name} {m.last_name}
                  </td>
                  <td className="px-5 py-3 font-mono text-muted">
                    {formatCell(m.cell)}
                  </td>
                  <td className="px-5 py-3 text-muted truncate max-w-[200px]">
                    {m.email}
                  </td>
                  <td className="px-5 py-3 text-muted">{formatDate(m.created_at)}</td>
                  <td className="px-5 py-3">
                    <Badge variant={m.status === "active" ? "success" : "danger"}>
                      {m.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted">
                    No members match those filters.
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
