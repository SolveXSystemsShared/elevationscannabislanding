"use client";

import * as React from "react";
import useSWR from "swr";
import { ProductTile } from "@/components/site/product-tile";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CATEGORY_LABEL, type Category, type Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PackageOpen, Search } from "lucide-react";

type CatTab = "all" | Category;

const TABS: { value: CatTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "flower", label: CATEGORY_LABEL.flower },
  { value: "preroll", label: CATEGORY_LABEL.preroll },
  { value: "moonstick", label: CATEGORY_LABEL.moonstick },
  { value: "vape", label: CATEGORY_LABEL.vape },
];

const TYPES = [
  { value: "sativa", label: "Sativa" },
  { value: "hybrid", label: "Hybrid" },
  { value: "indica", label: "Indica" },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function StorePage() {
  const [tab, setTab] = React.useState<CatTab>("all");
  const [type, setType] = React.useState<string | null>(null);
  const [grade, setGrade] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");

  const { data, isLoading } = useSWR<{ products: Product[] }>(
    "/api/products",
    fetcher,
  );

  const all = data?.products ?? [];

  const filtered = React.useMemo(() => {
    return all.filter((p) => {
      if (tab !== "all" && p.category !== tab) return false;
      if (type && p.type !== type) return false;
      if (grade && p.grade !== grade) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.effects.some((e) => e.toLowerCase().includes(q))
        )
          return false;
      }
      return true;
    });
  }, [all, tab, type, grade, search]);

  const grades = Array.from(new Set(all.map((p) => p.grade)));

  return (
    <>
      {/* Top bar */}
      <section className="border-b border-line bg-gradient-to-b from-surface to-background">
        <div className="container-wide pt-10 pb-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
                The Menu
              </p>
              <h1 className="mt-2 font-display text-[34px] sm:text-h2 font-semibold tracking-tight">
                Curated, in stock, ready to deliver.
              </h1>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search strains or effects"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-1 overflow-x-auto scrollbar-hide -mx-2 px-2">
            {TABS.map((t) => {
              const active = tab === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setTab(t.value)}
                  className={cn(
                    "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    active
                      ? "bg-purple text-white shadow-card"
                      : "bg-surface border border-line text-ink hover:border-purple/30 hover:text-purple",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-wide py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters */}
          <aside className="lg:w-56 lg:shrink-0 space-y-6">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-3">
                Type
              </p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => {
                  const active = type === t.value;
                  return (
                    <button
                      key={t.value}
                      onClick={() => setType(active ? null : t.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                        active
                          ? "bg-purple/10 border-purple text-purple"
                          : "border-line text-ink/70 hover:border-purple/30",
                      )}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-3">
                Grade
              </p>
              <div className="flex flex-wrap gap-2">
                {grades.map((g) => {
                  const active = grade === g;
                  return (
                    <button
                      key={g}
                      onClick={() => setGrade(active ? null : g)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                        active
                          ? "bg-purple/10 border-purple text-purple"
                          : "border-line text-ink/70 hover:border-purple/30",
                      )}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {(type || grade) && (
              <button
                onClick={() => {
                  setType(null);
                  setGrade(null);
                }}
                className="text-xs text-purple underline"
              >
                Clear filters
              </button>
            )}
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-card border border-line bg-surface aspect-[4/5] animate-pulse-soft"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="h-16 w-16 rounded-full bg-purple/8 flex items-center justify-center mb-5">
                  <PackageOpen className="h-7 w-7 text-purple/50" />
                </div>
                <Badge variant="subtle" className="mb-3">
                  {tab === "all" ? "Nothing matches" : CATEGORY_LABEL[tab as Category]}
                </Badge>
                <p className="font-display text-[22px] font-semibold">
                  We&apos;re all out of stock right now.
                </p>
                <p className="mt-1 text-muted">
                  Stay tuned — we&apos;ll be back shortly.
                </p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductTile key={p.id} product={p} interactive />
                ))}
              </div>
            )}

            {filtered.length > 0 && (
              <p className="mt-6 text-center text-xs text-muted">
                Showing {filtered.length} of {all.length} products · prices in
                South African Rand
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
