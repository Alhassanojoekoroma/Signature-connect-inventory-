# Signature Connect — Inventory Tracking Web App
## Product Requirements Document (PRD) · Version 2.0
**Prepared for:** Signature Connect Team  
**Last updated:** April 2026  
**Status:** Ready for Development

---

## 1. Objective

Build a mobile-first progressive web application (PWA) that allows Signature Connect staff to:

- Track all inventory movements — incoming stock, field issues, and returns
- Scan per-unit QR codes linked to individual device serial numbers
- Automatically log every transaction into the existing Google Sheets database in real time
- Monitor live stock levels, item conditions, and field deployment status
- Operate reliably on mobile phones with no app installation required

---

## 2. Users & Roles

| Role | Access Level | Primary Actions |
|---|---|---|
| **Admin** (Store Manager) | Full access | Add stock, manage products, generate QR codes, view all logs |
| **Staff** (Office) | Standard | Issue items, log returns, view stock |
| **Field Team** | Limited | Receive items, mark returns |
| **Management** | Read-only | View dashboard, Google Sheets |

---

## 3. Google Sheets — Source of Truth

The app writes directly to the existing Signature Connect Team Inventory Google Sheet. **No separate database is used.** The sheet structure is preserved exactly as-is.

### Sheet 1 — Main Sheet (Master Dashboard)
Auto-calculated. The app **never writes directly to this sheet.** All totals update automatically via existing SUMIFS formulas.

| Column | Description |
|---|---|
| Product Name | Canonical product name (must match exactly across all sheets) |
| Unit | e.g. Pcs, Boxes |
| Opening Stock | Set once at setup |
| Old / Used Product | Pre-existing used units |
| Total Received ↓ | Auto-summed from Items Received sheet |
| Total Issued ↑ | Auto-summed from Supplied Field Team sheet |
| Total Returned ↓ | Auto-summed from Items Received sheet (Returned from Field) |
| Faulty Units | Manually flagged faults |
| Outstanding Balance | Calculated: Opening + Old + Received − Issued + Returned − Faulty |
| Status | 🟢 In Stock / 🟡 Low Stock (≤3) / 🔴 Out of Stock / ⛔ CHECK DATA |

### Sheet 2 — Items Received (Store Record)
Written to when: **new stock arrives** or **field team returns items**.

| Column | Written by App |
|---|---|
| Date | Auto (today) |
| Products Name | Auto (from QR scan) |
| Transaction Type | "New Stock Received" or "Returned from Field" |
| Unit | Auto (from product record) |
| Quantity In | Staff input |
| Serial Number(s) | Auto (from QR scan) |
| Request / Returned By | Staff selects from dropdown |
| Received By | Staff selects from dropdown |
| Condition | Staff selects: Good Condition / Faulty / Damaged / New in Box / New in Pack |

### Sheet 3 — Supplied Field Team (Field Record)
Written to when: **items are issued out of the store**.

| Column | Written by App |
|---|---|
| Date | Auto (today) |
| Product Name | Auto (from QR scan) |
| Category | Staff selects (required) |
| Unit | Auto (from product record) |
| Qty Out | Staff input or 1 per scan |
| Serial Number(s) | Auto (from QR scan) |
| Customer Name | Staff input |
| Issued To | Staff selects from dropdown |
| Auth. By | Staff selects from dropdown |
| Status | Auto: "Active - In Field" |

---

## 4. QR Code System

### 4.1 Scope — Per Unit, Not Per Product Type
Each QR code represents **one individual device** identified by its unique serial number.

> Example: If there are 11 × 769XR XPON Routers in stock, there are 11 separate QR codes — one per unit, each encoding that unit's serial number.

For consumables (Fiber Connectors, Cable Clips, Clamps, etc.) that have no serial numbers, one QR code per product type is acceptable.

### 4.2 QR Code Data Format
Each QR encodes a URL:
```
https://yourapp.com/item/{serial_number}
```

When scanned, the app opens and auto-loads:
- Product Name
- Category
- Serial Number
- Current status (In Store / In Field / Returned / Faulty)

### 4.3 QR Code Generation
- Admin generates QR codes from the web app
- QR codes are exported as a printable PDF sheet (multiple per page)
- Labels include: Product Name, Serial Number, QR code image
- Laminated stickers recommended for field durability

---

## 5. Core Features

### 5.1 QR Scan & Log

**When a QR is scanned:**

The app auto-fetches:
- Product Name
- Serial Number
- Current status of this unit

The staff then:
1. Selects the action: **Issue** / **Return** / **Mark Faulty**
2. Fills in the required fields (see Section 3)
3. Submits → row appended to correct Google Sheet instantly

---

### 5.2 Feature: Issue Item

**Trigger:** Item leaving the store to field team or customer.

**Form fields:**

| Field | Type | Required |
|---|---|---|
| Product Name | Auto (from QR) | ✅ |
| Serial Number | Auto (from QR) | ✅ |
| Category | Dropdown: Installation / Replacement / Connectors | ✅ |
| Quantity Out | Number (default: 1) | ✅ |
| Customer Name | Text input | Optional |
| Issued To | Dropdown: Fred / Foday / OJOE / Emmanuel / Other | ✅ |
| Auth. By | Dropdown: Isaac / Susan / Foday / Other | ✅ |

**On submit:** Appends one row to **Supplied Field Team** sheet.

---

### 5.3 Feature: Return Item

**Trigger:** Field team returning an item to the store.

**Form fields:**

| Field | Type | Required |
|---|---|---|
| Product Name | Auto (from QR) | ✅ |
| Serial Number | Auto (from QR) | ✅ |
| Quantity Returned | Number (default: 1) | ✅ |
| Returned By | Dropdown: Fred / Foday / OJOE / Emmanuel / Other | ✅ |
| Received By | Dropdown: Isaac / OJOE / Emmanuel / Other | ✅ |
| Condition | Dropdown: Good Condition / Faulty / Damaged / New in Box / New in Pack | ✅ |

**On submit:** Appends one row to **Items Received** sheet with Transaction Type = "Returned from Field".

> If Condition = "Faulty" or "Damaged", the admin is prompted to manually update the Faulty Units column in the Master Sheet.

---

### 5.4 Feature: Add New Stock

**Trigger:** New stock arriving from supplier.

**Form fields (Admin only):**

| Field | Type | Required |
|---|---|---|
| Product Name | Dropdown (existing) or new text | ✅ |
| Unit | Dropdown: Pcs / Boxes | ✅ |
| Serial Number | Text input (one per unit, or comma-separated for batch) | For serialised items |
| Quantity | Number | ✅ |
| Received By | Dropdown | ✅ |
| Condition | Dropdown | ✅ |

**On submit:**
1. Appends to **Items Received** sheet with Transaction Type = "New Stock Received"
2. Generates QR codes for each new serialised unit
3. Prompts admin to print and attach labels

---

### 5.5 Feature: Dashboard (Home Screen)

A clean summary view, visible on login. Live data pulled from Google Sheets.

**Cards displayed:**

| Card | Description |
|---|---|
| 🟢 Total In Stock | Sum of all outstanding balances |
| 📤 Items Issued Today | Rows added to Field sheet today |
| 📥 Items Returned Today | Rows added to Items Received (Return type) today |
| 🟡 Low Stock Alerts | All products where Outstanding Balance ≤ 3 |
| ⛔ Data Errors | Products where balance went negative |

**Additional:** A searchable product list showing each item's status badge (🟢 🟡 🔴).

---

### 5.6 Feature: Item Status Lookup

Admin or staff can search any serial number or product to see:
- Which unit is in the field or in store
- Who it was issued to
- Date issued
- Return condition (if returned)

---

## 6. System Architecture

```
Mobile Browser (PWA)
        │
        ▼
   React.js Frontend
   Tailwind CSS (mobile-first)
   html5-qrcode (scanner)
        │
        ▼
   Node.js + Express Backend
        │
        ▼
   Google Sheets API (googleapis)
   ┌────────────────────────────┐
   │  Sheet 1: Main Dashboard   │  ← Read only (formulas handle this)
   │  Sheet 2: Items Received   │  ← Append rows
   │  Sheet 3: Field Supplied   │  ← Append rows
   └────────────────────────────┘
```

### Frontend Stack
- **React.js** — component-based UI
- **React Router** — page navigation
- **Tailwind CSS** — mobile-first styling
- **Axios** — API calls to backend
- **html5-qrcode** — camera-based QR scanner
- **qrcode** — generate QR images for printing

### Backend Stack
- **Node.js + Express** — REST API
- **googleapis** — Google Sheets read/write
- **dotenv** — secrets management
- **cors** — cross-origin support

---

## 7. Application Pages / Screens

| Screen | URL | Access |
|---|---|---|
| Login | `/login` | All |
| Dashboard | `/` | All |
| Scan & Act | `/scan` | Staff, Admin |
| Issue Item (form) | `/issue/:serial` | Staff, Admin |
| Return Item (form) | `/return/:serial` | Staff, Admin |
| Add New Stock | `/stock/add` | Admin only |
| Item Lookup | `/item/:serial` | All |
| Product List | `/products` | All |
| QR Generator | `/qr/generate` | Admin only |
| QR Print Sheet | `/qr/print` | Admin only |

---

## 8. UI/UX Requirements

- **Mobile-first** — designed for phones, not desktops
- **Large touch targets** — buttons minimum 48px height
- **Dropdown menus** — no free-text for staff names or conditions (prevents typos and data mismatch with Google Sheets)
- **Auto-populated fields** — product name and serial number never typed manually after a scan
- **Instant feedback** — success/error toast notification after every submission
- **Minimal steps** — scan → confirm action → fill 3–4 fields → submit
- **Clear status badges** — 🟢 🟡 🔴 ⛔ always visible on product cards
- **Fast loading** — no heavy assets; optimised for slow connections

---

## 9. Authentication

Simple role-based login:

| Role | Permissions |
|---|---|
| **Admin** | All actions + Add Stock + Generate QR + View logs |
| **Staff** | Issue, Return, view Dashboard |

- Session-based login (JWT tokens stored in memory)
- No email/password reset needed initially — Admin sets credentials
- Staff accounts: one shared passcode per role is acceptable for v1

---

## 10. Smart Logic & Validation Rules

| Rule | Detail |
|---|---|
| Serial uniqueness | No two items share the same QR / serial number |
| Product name consistency | Dropdown enforces exact match with Master Sheet product names |
| Scan → pre-fill | QR scan auto-fills Product Name, Serial, Unit — staff cannot edit these |
| Quantity default | Defaults to 1; editable for consumables |
| Staff name dropdown | All "Issued To", "Auth. By", "Received By" fields are dropdowns, never free text |
| Category required | Category must be selected before issue form can be submitted |
| Condition required | Condition must be selected on every return |
| Faulty flag | If condition is Faulty/Damaged, admin sees a warning to update the Faulty Units column |
| Data error detection | If Outstanding Balance < 0, dashboard shows ⛔ CHECK DATA |

---

## 11. Google Sheets Integration — Setup Steps

1. Go to **Google Cloud Console** → Create a new project
2. Enable **Google Sheets API** and **Google Drive API**
3. Create a **Service Account** → Download JSON credentials
4. Share the Signature Connect Google Sheet with the service account email (Editor access)
5. Store credentials in `.env` file on the backend server (never in frontend code)
6. Backend reads sheet data on request and appends rows using the Sheets API

**Security note:** The Google credentials JSON file must never be committed to version control. Add it to `.gitignore`.

---

## 12. Product List — Pre-loaded from Your Sheet

The following products are already in your inventory and should be pre-loaded into the app:

| # | Product Name | Category | Has Serial Numbers |
|---|---|---|---|
| 1 | 769XR XPON Router | Router | ✅ |
| 2 | Cody Router | Router | ✅ |
| 3 | Tender Router | Router | ✅ |
| 4 | D-Link Router | Router | ✅ |
| 5 | Black ONT | ONT | ✅ |
| 6 | Nokia ONU | ONU | ✅ |
| 7 | Sig. Connect ONT (122 XR) | ONT | ✅ |
| 8 | ONU | ONU | ✅ |
| 9 | Mikrotik 951 | Router | ✅ |
| 10 | Starlink Mesh Router Gen-3 | Router | ✅ |
| 11 | Desktop Switch | Switch | ✅ |
| 12 | 8 Port Gigabit POE Switch | Switch | ✅ |
| 13 | Tp-Link Load Balancer | Networking | ✅ |
| 14 | Lite Beam-Gen 2 | Wireless | ✅ |
| 15 | Fiber Connectors | Consumable | ❌ |
| 16 | Cable Clip-10mm | Consumable | ❌ |
| 17 | Clamps | Consumable | ❌ |

---

## 13. Staff Dropdowns — Pre-loaded

Based on your existing sheet records, pre-load these names into all dropdowns:

**Issued To / Received By:** Fred, Foday, OJOE, Emmanuel, Mr Isaac, Susan, Other

**Auth. By:** Mr Isaac, Susan, Foday, OJOE, Other

> Admin can add or remove names from a settings page without code changes.

---

## 14. Required npm Packages

**Frontend:**
```
react, react-router-dom, axios, tailwindcss, html5-qrcode, qrcode, react-hot-toast
```

**Backend:**
```
express, cors, dotenv, googleapis, jsonwebtoken
```

---

## 15. Future Improvements (Phase 2)

| Feature | Description |
|---|---|
| Low stock notifications | WhatsApp or email alert when stock drops to ≤ 3 |
| Export PDF reports | Monthly issue/return summary for management |
| Offline sync mode | Queue transactions when internet is down; sync on reconnect |
| Analytics dashboard | Charts — most issued items, busiest days, top staff |
| Barcode support | For items that already have barcodes instead of QR |
| Faulty items workflow | Dedicated screen for logging and tracking damaged equipment |
| Expected Return tracking | Alert manager when field items are overdue |

---

## 16. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Internet dependency | Display cached dashboard; queue submissions offline (Phase 2) |
| QR code damage | Laminate all sticker labels; store backup QR PDF |
| Typos in product names | Enforce dropdowns everywhere — no free-text product names |
| Duplicate serial numbers | App validates uniqueness before saving |
| Google Sheets formula breakage | App only appends rows — never edits existing cells or formulas |
| Credential leak | .env file on server only; never exposed to frontend |

---

## 17. Success Criteria

| Metric | Target |
|---|---|
| Time to log an issue | Under 10 seconds from scan to submit |
| Missing records | Zero — every item movement logged |
| Google Sheets accuracy | Real-time update within 2 seconds of submission |
| Mobile compatibility | Works on Chrome/Safari on Android & iPhone |
| Staff training time | Under 15 minutes for any new staff member |

---

## 18. Development Phases

### Phase 1 — MVP (4–6 weeks)
- QR scan → Issue & Return flows
- Google Sheets integration (all 3 sheets)
- Dashboard with live stock levels
- Basic login (Admin / Staff)
- QR code generator + print sheet

### Phase 2 — Enhancements (after MVP)
- Faulty item workflow
- Offline mode
- Low stock notifications
- Analytics and export

---

*This PRD is based on the actual Signature Connect Team Inventory Google Sheet (last updated 11 March 2026) and supersedes the original draft PRD.*