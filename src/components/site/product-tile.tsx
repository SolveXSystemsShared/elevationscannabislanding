"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Sparkles } from "lucide-react";
import { CATEGORY_LABEL, type Product } from "@/lib/types";
import { formatZAR } from "@/lib/utils";
import { useCart } from "@/lib/store";

const CATEGORY_GRADIENTS: Record<string, string> = {
  flower: "linear-gradient(135deg, #6C3FC5 0%, #9B72E8 50%, #B392E3 100%)",
  preroll: "linear-gradient(135deg, #3D1F8A 0%, #6C3FC5 50%, #9B72E8 100%)",
  moonstick:
    "linear-gradient(135deg, #1A1A2E 0%, #3D1F8A 40%, #C9A961 100%)",
  vape: "linear-gradient(135deg, #1A1A2E 0%, #3D1F8A 50%, #6C3FC5 100%)",
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

  const Tile = (
    <div className="group relative overflow-hidden rounded-card border border-line bg-surface shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
      <div
        className="relative aspect-[4/5] overflow-hidden"
        style={{ background: CATEGORY_GRADIENTS[product.category] }}
      >
        <div className="absolute inset-0 grain opacity-40" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 50%)",
          }}
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="default" className="bg-white/90 text-purple-dark">
            {CATEGORY_LABEL[product.category]}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Badge
            variant="default"
            className="bg-black/30 backdrop-blur text-white border border-white/10"
          >
            {product.thc_percent}% THC
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <p className="text-[10px] uppercase tracking-wider opacity-80">
              {product.grade} · {product.type}
            </p>
            <p className="font-display text-2xl font-bold leading-tight tracking-tight">
              {product.name}
            </p>
          </div>
          <Sparkles className="h-5 w-5 opacity-80 group-hover:rotate-12 transition-transform" />
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-1 mb-3">
          {product.effects.slice(0, 3).map((e) => (
            <span
              key={e}
              className="text-[10px] uppercase tracking-wider text-purple bg-purple/8 rounded-full px-2 py-0.5 font-medium"
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
