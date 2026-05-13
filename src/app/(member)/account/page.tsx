"use client";

import * as React from "react";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/site/field";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toaster";
import { useSession } from "@/lib/store";
import { useRouter } from "next/navigation";
import { formatCell } from "@/lib/utils";
import type { Member } from "@/lib/types";
import { LogOut, ShieldCheck } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function AccountPage() {
  const { data, mutate } = useSWR<{ member: Member }>("/api/member/profile", fetcher);
  const { toast } = useToast();
  const session = useSession();
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState({
    email: "",
    address_street: "",
    address_suburb: "",
    address_city: "Stellenbosch",
  });

  React.useEffect(() => {
    if (data?.member) {
      setDraft({
        email: data.member.email,
        address_street: data.member.address_street,
        address_suburb: data.member.address_suburb,
        address_city: data.member.address_city,
      });
    }
  }, [data]);

  const m = data?.member;

  const save = async () => {
    const res = await fetch("/api/member/profile", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (!res.ok) {
      toast({ kind: "error", title: "Could not save" });
      return;
    }
    toast({ kind: "success", title: "Profile saved" });
    setEditing(false);
    mutate();
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    session.clear();
    router.push("/");
  };

  if (!m) {
    return (
      <div className="container-wide py-14">
        <div className="h-40 rounded-card bg-line animate-pulse-soft" />
      </div>
    );
  }

  return (
    <div className="container-wide py-10 sm:py-14 max-w-4xl">
      <h1 className="font-display text-h2 font-semibold tracking-tight">My account</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-[200px_1fr] items-start">
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card">
          <div className="mx-auto h-20 w-20 rounded-full bg-purple/10 text-purple flex items-center justify-center font-display text-3xl font-bold">
            {m.first_name[0]}
            {m.last_name[0]}
          </div>
          <p className="mt-4 font-semibold">
            {m.first_name} {m.last_name}
          </p>
          <Badge variant="subtle" className="mt-1 font-mono">
            {m.member_id}
          </Badge>
          <p className="mt-3 text-xs text-muted">Member since</p>
          <p className="text-xs">{new Date(m.created_at).toLocaleDateString("en-ZA")}</p>
        </div>

        <div className="space-y-6">
          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Profile</h2>
              {!editing ? (
                <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={save}>
                    Save
                  </Button>
                </div>
              )}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Cell">
                <Input value={formatCell(m.cell)} readOnly />
              </Field>
              <Field label="Email">
                <Input
                  value={editing ? draft.email : m.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  readOnly={!editing}
                />
              </Field>
              <Field label="ID number">
                <Input value={`${m.id_number.slice(0, 6)}*******`} readOnly />
              </Field>
              <Field label="Referral source">
                <Input value={m.referral_source} readOnly />
              </Field>
              <Field label="Street" className="sm:col-span-2">
                <Input
                  value={editing ? draft.address_street : m.address_street}
                  onChange={(e) =>
                    setDraft({ ...draft, address_street: e.target.value })
                  }
                  readOnly={!editing}
                />
              </Field>
              <Field label="Suburb">
                <Input
                  value={editing ? draft.address_suburb : m.address_suburb}
                  onChange={(e) =>
                    setDraft({ ...draft, address_suburb: e.target.value })
                  }
                  readOnly={!editing}
                />
              </Field>
              <Field label="City">
                <Input value={m.address_city} readOnly />
              </Field>
            </div>
          </section>

          <section className="rounded-card border border-line bg-surface p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold">Privacy & data</h2>
            <p className="mt-2 text-sm text-muted text-pretty">
              Elevations247 handles your data under POPIA. You may request access
              to, correction of, or deletion of your information at any time.
            </p>
            <div className="mt-4 flex items-start gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-purple shrink-0 mt-0.5" />
              <span>
                Encrypted at rest. Never shared. POPIA-compliant in line with the
                Protection of Personal Information Act, 2013.
              </span>
            </div>
          </section>

          <Separator />

          <Button variant="ghost" onClick={logout} className="text-danger hover:text-danger">
            <LogOut className="h-4 w-4" /> Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
