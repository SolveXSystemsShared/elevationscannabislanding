export type Category = "flower" | "preroll" | "moonstick" | "vape";
export type StrainType = "sativa" | "hybrid" | "indica";
export type StockStatus = "in_stock" | "out_of_stock";
export type MemberStatus = "active" | "suspended";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "packing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

/**
 * Bundle pricing — Elevations sells most products in a tiered ladder.
 * Flower / preroll: 1g / 2g / 3g.
 * Moonstick: 1 unit / 2 units.
 * Vape: per-unit only (no ladder).
 */
export interface Bundle {
  qty: number; // 1, 2, 3
  label: string; // "1g", "2g", "3g", "1 unit", "2 units"
  price: number; // bundle total in ZAR
  saving?: number; // optional saving vs n × per-unit price
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  grade: string;
  type: StrainType;
  thc_percent: number;
  cbd_percent?: number;
  effects: [string, string, string];
  terpenes: string[];
  description: string;
  image_url: string;
  retail_price: number; // single-unit price (1g for flower/preroll; 1 unit for moonstick/vape)
  cost_price: number; // single-unit cost (per gram or per unit)
  unit_label: string; // "g" for flower/preroll; "unit" for moonstick/vape
  bundles?: Bundle[]; // optional bundle ladder
  stock_qty?: number; // grams on hand (or units for moonstick/vape) — informational
  status: StockStatus;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  member_id: string;
  first_name: string;
  last_name: string;
  cell: string;
  email: string;
  id_number: string;
  address_street: string;
  address_suburb: string;
  address_city: string;
  referral_source: string;
  status: MemberStatus;
  agreed_to_terms: boolean;
  created_at: string;
  last_active: string;
}

export interface OrderItem {
  product_id: string;
  name: string;
  qty: number;
  unit_price: number;
}

export interface Order {
  id: string;
  reference: string;
  member_id: string;
  member_name?: string;
  status: OrderStatus;
  delivery_address: {
    street: string;
    suburb: string;
    city: string;
  };
  items: OrderItem[];
  total_retail: number;
  total_cost: number;
  yoco_payment_id?: string;
  delivery_note?: string;
  internal_note?: string;
  cancel_reason?: string;
  placed_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  name: string;
  category: Category;
  image_url: string;
  qty: number; // number of bundles
  unit_price: number; // bundle price (or single-unit price if no bundle selected)
  thc_percent: number;
  bundle_label?: string; // e.g. "2g" — present when a bundle was selected
  bundle_qty?: number; // grams or units inside one bundle (1, 2, 3, …)
}

export interface Session {
  member_id: string;
  member_uid: string;
  email: string;
  full_name: string;
  exp: number;
}

export interface AdminSession {
  admin_id: string;
  email: string;
  role: "director" | "manager";
  exp: number;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  flower: "Flower",
  preroll: "Pre-Rolls",
  moonstick: "Moonsticks",
  vape: "Vapes",
};

export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "Placed",
  confirmed: "Confirmed",
  packing: "Packing",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_PIPELINE: OrderStatus[] = [
  "placed",
  "confirmed",
  "packing",
  "out_for_delivery",
  "delivered",
];
