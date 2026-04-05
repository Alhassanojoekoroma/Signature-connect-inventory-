export interface Product {
  id: number
  name: string
  cat: string
  serials: string[]
  stock: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
}

export interface Transaction {
  product: string
  serial: string | null
  action: "Issued" | "Returned" | "Stock In"
  to?: string
  by?: string
  qty?: number
  date: string
  status: "In Field" | "Returned" | "Received" | "Faulty" | "Damaged"
  cond?: string
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "769XR XPON Router", cat: "Router", serials: ["XPONDD87A2D2", "XPONDD87A3A2", "XPONDD87A432"], stock: 8, status: "In Stock" },
  { id: 2, name: "Nokia ONU", cat: "ONU", serials: ["NK-ONU-001", "NK-ONU-002"], stock: 10, status: "In Stock" },
  { id: 3, name: "Mikrotik 951", cat: "Router", serials: ["HKB0AMS5SH3", "HKB0AVX59HR"], stock: 2, status: "Low Stock" },
  { id: 4, name: "Black ONT", cat: "ONT", serials: ["ALCLF9DE9961"], stock: 1, status: "Low Stock" },
  { id: 5, name: "Fiber Connectors", cat: "Consumable", serials: [], stock: 60, status: "In Stock" },
  { id: 6, name: "D-Link Router", cat: "Router", serials: ["DL-WR001"], stock: 0, status: "Out of Stock" },
  { id: 7, name: "Sig. Connect ONT 122XR", cat: "ONT", serials: ["SC-122XR-001", "SC-122XR-002"], stock: 2, status: "Low Stock" },
]

export const TRANSACTIONS: Transaction[] = [
  {
    product: "769XR XPON Router",
    serial: "XPONDD87A2D2",
    action: "Issued",
    to: "Fred",
    date: "12 Mar",
    status: "In Field",
  },
  {
    product: "Tender Router",
    serial: "230368950110005593",
    action: "Returned",
    by: "Foday",
    date: "13 Mar",
    status: "Returned",
    cond: "Faulty",
  },
  {
    product: "Fiber Connectors",
    serial: null,
    action: "Stock In",
    qty: 50,
    date: "12 Mar",
    status: "Received",
  },
  {
    product: "Black ONT",
    serial: "ALCLF9DE9961",
    action: "Returned",
    by: "Foday",
    date: "13 Mar",
    status: "Returned",
    cond: "Good Condition",
  },
]

export const STAFF = ["Mr Isaac", "Susan", "Fred", "Foday", "OJOE", "Emmanuel"]
export const CATEGORIES = ["Installation", "Replacement", "Connectors", "General"]
export const CONDITIONS = ["Good Condition", "Faulty", "Damaged", "New in Box", "New in Pack"]

export const STATUS_COLORS: Record<string, string> = {
  "In Stock": "#4CD964",
  "In Field": "#FF9F0A",
  "Low Stock": "#FF9F0A",
  "Out of Stock": "#FF3B30",
  "Returned": "#5AC8FA",
  "Received": "#4CD964",
  "Faulty": "#FF3B30",
  "Damaged": "#FF3B30",
  "Active": "#FF9F0A",
}
