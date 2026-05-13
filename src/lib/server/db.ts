import { SEED_PRODUCTS, SEED_MEMBERS, SEED_ORDERS, SEED_GRADES } from "@/lib/seed";
import type { Product, Member, Order, OrderStatus } from "@/lib/types";

/**
 * In-memory store for the demo build.
 * On the v0/Vercel deploy this would be backed by Postgres via Prisma + Supabase.
 */
declare global {
  // eslint-disable-next-line no-var
  var __ELV_DB__:
    | {
        products: Product[];
        members: Member[];
        orders: Order[];
        grades: typeof SEED_GRADES;
        statusLog: {
          id: string;
          order_id: string;
          from_status: OrderStatus | null;
          to_status: OrderStatus;
          changed_at: string;
          changed_by: string;
        }[];
      }
    | undefined;
}

function init() {
  if (!globalThis.__ELV_DB__) {
    globalThis.__ELV_DB__ = {
      products: structuredClone(SEED_PRODUCTS),
      members: structuredClone(SEED_MEMBERS),
      orders: structuredClone(SEED_ORDERS),
      grades: structuredClone(SEED_GRADES),
      statusLog: [],
    };
  }
  return globalThis.__ELV_DB__!;
}

export const db = {
  products: {
    list: (opts?: { adminView?: boolean; category?: string }) => {
      const all = init().products.filter((p) => !("deleted_at" in p) || !p);
      let filtered = opts?.adminView ? all : all.filter((p) => p.status === "in_stock");
      if (opts?.category) {
        filtered = filtered.filter((p) => p.category === opts.category);
      }
      return filtered.sort((a, b) => a.display_order - b.display_order);
    },
    get: (id: string) => init().products.find((p) => p.id === id),
    create: (input: Omit<Product, "id" | "created_at" | "updated_at">) => {
      const p: Product = {
        ...input,
        id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      init().products.push(p);
      return p;
    },
    update: (id: string, patch: Partial<Product>) => {
      const list = init().products;
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) return null;
      list[i] = { ...list[i], ...patch, updated_at: new Date().toISOString() };
      return list[i];
    },
    softDelete: (id: string) => {
      const list = init().products;
      const i = list.findIndex((p) => p.id === id);
      if (i < 0) return false;
      list.splice(i, 1);
      return true;
    },
  },
  members: {
    list: () => init().members,
    get: (id: string) => init().members.find((m) => m.id === id),
    getByMemberId: (memberId: string) =>
      init().members.find((m) => m.member_id === memberId),
    getByCellOrEmail: (cellOrEmail: string) => {
      const v = cellOrEmail.toLowerCase().trim();
      return init().members.find(
        (m) => m.cell === v.replace(/\D/g, "") || m.email.toLowerCase() === v,
      );
    },
    create: (input: Omit<Member, "id" | "created_at" | "last_active">) => {
      const m: Member = {
        ...input,
        id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
      };
      init().members.push(m);
      return m;
    },
    update: (id: string, patch: Partial<Member>) => {
      const list = init().members;
      const i = list.findIndex((m) => m.id === id);
      if (i < 0) return null;
      list[i] = { ...list[i], ...patch };
      return list[i];
    },
    setStatus: (id: string, status: "active" | "suspended") => {
      const m = init().members.find((x) => x.id === id);
      if (m) m.status = status;
      return m;
    },
  },
  orders: {
    list: (opts?: { memberId?: string; status?: OrderStatus }) => {
      let list = init().orders;
      if (opts?.memberId) list = list.filter((o) => o.member_id === opts.memberId);
      if (opts?.status) list = list.filter((o) => o.status === opts.status);
      return list.sort(
        (a, b) => new Date(b.placed_at).getTime() - new Date(a.placed_at).getTime(),
      );
    },
    get: (id: string) => init().orders.find((o) => o.id === id || o.reference === id),
    create: (input: Omit<Order, "id" | "reference" | "placed_at" | "updated_at">) => {
      const ref = `ELV-${(init().orders.length + 248).toString().padStart(5, "0")}`;
      const o: Order = {
        ...input,
        id: `o_${Date.now()}`,
        reference: ref,
        placed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      init().orders.push(o);
      init().statusLog.push({
        id: `sl_${Date.now()}`,
        order_id: o.id,
        from_status: null,
        to_status: o.status,
        changed_at: o.placed_at,
        changed_by: input.member_id,
      });
      return o;
    },
    updateStatus: (id: string, status: OrderStatus, by: string) => {
      const o = init().orders.find((x) => x.id === id || x.reference === id);
      if (!o) return null;
      const prev = o.status;
      o.status = status;
      o.updated_at = new Date().toISOString();
      init().statusLog.push({
        id: `sl_${Date.now()}`,
        order_id: o.id,
        from_status: prev,
        to_status: status,
        changed_at: o.updated_at,
        changed_by: by,
      });
      return o;
    },
    update: (id: string, patch: Partial<Order>) => {
      const o = init().orders.find((x) => x.id === id || x.reference === id);
      if (!o) return null;
      Object.assign(o, patch, { updated_at: new Date().toISOString() });
      return o;
    },
  },
  grades: {
    list: () => init().grades.sort((a, b) => a.display_order - b.display_order),
    create: (label: string) => {
      const g = {
        id: `g_${Date.now()}`,
        label,
        display_order: init().grades.length + 1,
      };
      init().grades.push(g);
      return g;
    },
    update: (id: string, label: string) => {
      const g = init().grades.find((x) => x.id === id);
      if (g) g.label = label;
      return g;
    },
    remove: (id: string) => {
      const i = init().grades.findIndex((x) => x.id === id);
      if (i < 0) return false;
      init().grades.splice(i, 1);
      return true;
    },
  },
  reports: {
    revenue: (from: Date, to: Date) => {
      const orders = init().orders.filter((o) => {
        const d = new Date(o.placed_at);
        return d >= from && d <= to && o.status === "delivered";
      });
      const revenue = orders.reduce((s, o) => s + o.total_retail, 0);
      const cost = orders.reduce((s, o) => s + o.total_cost, 0);
      return { revenue, cost, margin: revenue - cost, orderCount: orders.length };
    },
  },
};
