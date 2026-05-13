import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";
import type { Category } from "@/lib/types";

const VALID_CATS: Category[] = ["flower", "preroll", "moonstick", "vape"];

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category");
  const cat =
    category && VALID_CATS.includes(category as Category)
      ? (category as Category)
      : undefined;
  const list = db.products.list({ category: cat });
  return NextResponse.json({ products: list });
}
