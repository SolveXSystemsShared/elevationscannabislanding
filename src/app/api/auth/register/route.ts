import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/server/db";
import { isValidSAID, generateMemberId } from "@/lib/utils";

const Schema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  cell: z.string().regex(/^0\d{9}$/, "Use SA cell format e.g. 0823456789"),
  email: z.string().email(),
  id_number: z.string().refine(isValidSAID, "Invalid SA ID number"),
  address_street: z.string().min(2),
  address_suburb: z.string().min(2),
  address_city: z.string().min(2),
  referral_source: z.enum(["Instagram", "WhatsApp", "Word of Mouth", "Other"]),
  agreed_to_terms: z.literal(true),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const cell = parsed.data.cell.replace(/\D/g, "");
  const existing = db.members.list().find(
    (m) => m.cell === cell || m.email.toLowerCase() === parsed.data.email.toLowerCase(),
  );
  if (existing) {
    return NextResponse.json(
      { error: "duplicate", message: "An account already exists for that cell or email." },
      { status: 409 },
    );
  }

  // Ensure unique member_id
  let member_id = generateMemberId(cell);
  while (db.members.getByMemberId(member_id)) {
    member_id = generateMemberId(cell);
  }

  const m = db.members.create({
    member_id,
    first_name: parsed.data.first_name,
    last_name: parsed.data.last_name,
    cell,
    email: parsed.data.email,
    id_number: parsed.data.id_number,
    address_street: parsed.data.address_street,
    address_suburb: parsed.data.address_suburb,
    address_city: parsed.data.address_city,
    referral_source: parsed.data.referral_source,
    status: "active",
    agreed_to_terms: true,
  });

  return NextResponse.json({
    ok: true,
    member_id: m.member_id,
    member_uid: m.id,
    next: "verify",
  });
}
