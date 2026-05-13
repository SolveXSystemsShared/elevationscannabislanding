import { NextResponse } from "next/server";
import { db } from "@/lib/server/db";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const p = db.products.get(params.id);
  if (!p) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ product: p });
}
