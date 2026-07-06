"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Atom } from "lucide-react";
import { CATEGORY_LABEL, type Product } from "@/lib/types";
import { formatZAR } from "@/lib/utils";
import { useCart } from "@/lib/store";

const CATEGORY_GRADIENTS: Record<string, string> = {
  flower: "linear-gradient(135deg, #0E140A 0%, #142318 50%, #24391A 100%)",
  preroll: "linear-gradient(135deg, #060706 0%, #142318 55%, #33501F 100%)",
  moonstick: "linear-gradient(135deg, #0A0C0A 0%, #142318 45%, #2A3A16 100%)",
  vape: "linear-gradient(135deg, #060706 0%, #0E140A 55%, #22371A 100%)",
};

// Element symbol + atomic number per category — the periodic-tile motif.
const CATEGORY_ELEMENT: Record<string, { symbol: string; n: string }> = {
  flower: { symbol: "Fl", n: "01" },
  preroll: { symbol: "Pr", n: "05" },
  moonstick: { symbol: "Mo", n: "07" },
  vape: { symbol: "Va", n: "09" },
};

export function ProductTile({
  product,
  interactive = false,
}: {
  product: Product;
  interactive?: boolean;
}) {
  const add = useCart((s) => s.add);
  const hasBundles = product.bundles && product.bundles.length > 1;
  const element = CATEGORY_ELEMENT[product.category] ?? { symbol: "Bu", n: "00" };

  const Tile = (
    <div className="group relative overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5 hover:border-purple/30">
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: CATEGORY_GRADIENTS[product.category] }}
      >
        <div className="absolute inset-0 grain opacity-40" />
        {/* Periodic-tile motif — atomic number + faint symbol */}
        <span className="absolute top-3 left-3 font-mono text-[11px] text-purple/70">
          {element.n}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center font-display text-[110px] font-bold text-purple/10 group-hover:text-purple/20 transition-colors"
        >
          {element.symbol}
        </span>
        <div className="absolute top-3 right-3">
          <Badge
            variant="default"
            className="bg-fume/70 backdrop-blur text-purple border border-purple/20"
          >
            {product.thc_percent}% THC
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-ink">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-wider text-purple/80">
              {CATEGORY_LABEL[product.category]} · {product.grade}
            </p>
            <p className="font-display text-2xl font-bold uppercase leading-tight tracking-tight">
              {product.name}
            </p>
          </div>
          <Atom className="h-5 w-5 text-purple opacity-80 group-hover:rotate-12 transition-transform" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {product.effects.slice(0, 3).map((e) => (
            <span
              key={e}
              className="font-mono text-[10px] uppercase tracking-wider text-purple bg-purple/10 rounded-full px-2 py-0.5 font-medium"
            >
              {e}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            {hasBundles && (
              <p className="text-[10px] uppercase tracking-wider text-muted font-semibold">
                from
              </p>
            )}
            <p className="font-display text-lg font-semibold leading-tight">
              {formatZAR(product.retail_price)}
              {product.unit_label === "g" && (
                <span className="ml-1 text-xs font-normal text-muted">/g</span>
              )}
            </p>
          </div>
          {interactive ? (
            <Button
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                add(product, { qty: 1, bundle: product.bundles?.[0] });
              }}
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </Button>
          ) : (
            <Button size="sm" variant="ghost" asChild>
              <span>View</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  if (interactive) {
    return (
      <Link href={`/product/${product.id}`} className="block ring-focus rounded-card">
        {Tile}
      </Link>
    );
  }
  return Tile;
}
