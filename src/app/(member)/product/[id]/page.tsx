"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/store";
import { useToast } from "@/components/ui/toaster";
import { CATEGORY_LABEL, type Bundle, type Product } from "@/lib/types";
import { formatZAR, cn } from "@/lib/utils";
import { ArrowLeft, Minus, Plus, ShoppingCart, Sparkles, Leaf } from "lucide-react";

const fetcher = (u: string) => fetch(u).then((r) => r.json());
const GRADIENTS: Record<string, string> = {
  flower: "linear-gradient(135deg, #0E140A 0%, #142318 50%, #24391A 100%)",
  preroll: "linear-gradient(135deg, #060706 0%, #142318 55%, #33501F 100%)",
  moonstick: "linear-gradient(135deg, #0A0C0A 0%, #142318 45%, #2A3A16 100%)",
  vape: "linear-gradient(135deg, #060706 0%, #0E140A 55%, #22371A 100%)",
};
const ELEMENT: Record<string, string> = {
  flower: "Fl",
  preroll: "Pr",
  moonstick: "Mo",
  vape: "Va",
};

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const add = useCart((s) => s.add);
  const [qty, setQty] = React.useState(1);
  const [bundleIdx, setBundleIdx] = React.useState(0);

  const { data, error, isLoading } = useSWR<{ product: Product }>(
    `/api/products/${params.id}`,
    fetcher,
  );
  const p = data?.product;

  if (isLoading) {
    return (
      <div className="container-wide py-12">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square rounded-card bg-purple/10 animate-pulse-soft" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-line rounded animate-pulse-soft" />
            <div className="h-4 w-1/3 bg-line rounded animate-pulse-soft" />
            <div className="h-32 bg-line rounded animate-pulse-soft" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !p) {
    return (
      <div className="container-wide py-24 text-center">
        <p className="text-muted">Product not found.</p>
        <Button asChild variant="ghost" className="mt-4">
          <Link href="/store">
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>
        </Button>
      </div>
    );
  }

  const bundles: Bundle[] = p.bundles ?? [];
  const hasBundles = bundles.length > 0;
  const selected: Bundle | undefined = hasBundles ? bundles[bundleIdx] : undefined;
  const unitPrice = selected?.price ?? p.retail_price;
  const totalLabel = selected
    ? `${qty} × ${selected.label}`
    : `${qty} × ${p.unit_label}`;

  return (
    <div className="container-wide py-8 sm:py-12">
      <Link
        href="/store"
        className="inline-flex items-center gap-2 text-sm text-muted hover:text-purple mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to store
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div
          className="relative aspect-square rounded-card overflow-hidden shadow-card-hover"
          style={{ background: GRADIENTS[p.category] }}
        >
          <div className="absolute inset-0 grain opacity-40" />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 30%, rgba(180,240,0,0.12), transparent 55%)",
            }}
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-display text-[220px] font-bold text-purple/10"
          >
            {ELEMENT[p.category] ?? "Bu"}
          </span>
          <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
            <Badge className="bg-purple/15 text-purple border border-purple/25">
              {CATEGORY_LABEL[p.category]}
            </Badge>
            <Badge className="bg-fume/70 text-purple border border-purple/20 backdrop-blur">
              {p.thc_percent}% THC
            </Badge>
            {p.cbd_percent !== undefined && p.cbd_percent > 0 && (
              <Badge className="bg-fume/70 text-purple border border-purple/20 backdrop-blur">
                {p.cbd_percent}% CBD
              </Badge>
            )}
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-ink">
            <p className="font-mono text-[11px] uppercase tracking-wider text-purple/80">
              {p.grade} · {p.type}
            </p>
            <p className="font-display uppercase text-5xl font-bold leading-tight tracking-tight mt-1">
              {p.name}
            </p>
          </div>
          <Sparkles className="absolute top-6 right-6 h-6 w-6 text-purple/70" />
        </div>

        <div>
          <h1 className="sr-only">{p.name}</h1>
          <p className="text-[11px] uppercase tracking-[0.22em] text-purple font-semibold">
            {CATEGORY_LABEL[p.category]} · {p.grade}
          </p>
          <h2 className="mt-2 font-display text-h2 leading-tight font-semibold tracking-tight">
            {p.name}
          </h2>
          <p className="mt-2 text-2xl font-display font-semibold">
            {formatZAR(unitPrice)}
            {p.unit_label === "g" && !selected && (
              <span className="ml-1 text-base font-normal text-muted">/g</span>
            )}
            {selected && (
              <span className="ml-1 text-base font-normal text-muted">
                · {selected.label}
              </span>
            )}
          </p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {p.effects.map((e) => (
              <Badge key={e} variant="subtle">
                {e}
              </Badge>
            ))}
          </div>

          <p className="mt-6 text-pretty text-muted leading-relaxed">
            {p.description}
          </p>

          {p.terpenes.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-3 flex items-center gap-2">
                  <Leaf className="h-3.5 w-3.5" /> Terpene profile
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.terpenes.map((t) => (
                    <Badge key={t} variant="outline">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {hasBundles && (
            <>
              <Separator className="my-6" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-muted font-semibold mb-3">
                  Choose your bundle
                </p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {bundles.map((b, i) => {
                    const active = i === bundleIdx;
                    return (
                      <button
                        key={b.label}
                        type="button"
                        onClick={() => setBundleIdx(i)}
                        className={cn(
                          "rounded-card border p-3 text-left transition-all ring-focus",
                          active
                            ? "border-purple bg-purple/5 shadow-card-hover"
                            : "border-line hover:border-purple/40",
                        )}
                      >
                        <p
                          className={cn(
                            "text-[11px] uppercase tracking-wider font-semibold",
                            active ? "text-purple" : "text-muted",
                          )}
                        >
                          {b.label}
                        </p>
                        <p className="mt-1 font-display text-xl font-semibold">
                          {formatZAR(b.price)}
                        </p>
                        {b.saving ? (
                          <p className="text-[11px] text-success font-medium mt-0.5">
                            Save {formatZAR(b.saving)}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted mt-0.5">&nbsp;</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          <Separator className="my-6" />

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Strain type
              </p>
              <p className="mt-1 font-medium capitalize">{p.type}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Grade
              </p>
              <p className="mt-1 font-medium">{p.grade}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">
                Stock
              </p>
              <p
                className={cn(
                  "mt-1 font-medium",
                  p.status === "in_stock" ? "text-success" : "text-danger",
                )}
              >
                {p.status === "in_stock" ? "In stock" : "Out of stock"}
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center rounded-btn border border-line">
              <button
                className="p-3 text-muted hover:text-purple"
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Decrease"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qty}</span>
              <button
                className="p-3 text-muted hover:text-purple"
                onClick={() => setQty(qty + 1)}
                aria-label="Increase"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1"
              onClick={() => {
                add(p, { qty, bundle: selected });
                toast({
                  kind: "success",
                  title: "Added to cart",
                  description: `${totalLabel} · ${p.name}`,
                });
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              Add to cart · {formatZAR(qty * unitPrice)}
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted text-pretty">
            Discreet packaging. Member ID required at delivery. 24/7 anywhere in
            Stellenbosch.
          </p>
        </div>
      </div>
    </div>
  );
}
