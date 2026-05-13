import { db } from "@/lib/server/db";
import { getAdminSession } from "@/lib/server/auth";

function toCsv(rows: Record<string, string | number>[]) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ].join("\n");
}

export async function GET() {
  const s = await getAdminSession();
  if (!s) return new Response("unauthorized", { status: 401 });
  const csv = toCsv(
    db.members.list().map((m) => ({
      member_id: m.member_id,
      full_name: `${m.first_name} ${m.last_name}`,
      cell: m.cell,
      email: m.email,
      id_number: m.id_number,
      address: `${m.address_street}, ${m.address_suburb}, ${m.address_city}`,
      referral_source: m.referral_source,
      registration_date: m.created_at,
      status: m.status,
    })),
  );
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="elevations-members-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
