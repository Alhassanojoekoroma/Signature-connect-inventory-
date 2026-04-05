# Feature Documentation & User Guide

## Application Overview

**Signature Connect Inventory Tracker** is a mobile-first PWA designed for warehouse staff to:
- Track all inventory in real-time
- Log transactions directly to Google Sheets
- Scan QR codes for quick item lookup
- Manage stock levels with live status updates

## Complete Feature List

### 1. Authentication System

#### Login Screen
- **Access**: First-time users or after logout
- **Fields**:
  - Role selector (Admin / Staff dropdown)
  - Password input
  - Error messages for invalid credentials
  - Demo credentials badge

**Demo Credentials**:
```
Admin: password = admin123
Staff: password = staff123
```

**Features**:
- Session persistence (localStorage)
- Automatic token refresh (JWT)
- Logout available in profile menu (bottom nav, circle icon)

---

### 2. Dashboard Screen

## Layout
```
┌─────────────────────┐
│  Status Bar (9:41)  │
├─────────────────────┤
│  [Avatar] Mr Isaac  │     ← User & quick add button
│  Store Manager      │
├─────────────────────┤
│  Stock Overview     │     ← Summary Cards
│  Total: 7  In Stock: 4│
│ ┌─────┬──────┬──────┐│
│ │Low:1│Empty:1│Items:93
│ └─────┴──────┴──────┘│
├─────────────────────┤
│ [All][In Field]...  │     ← Filter pills
├─────────────────────┤
│  Recent Activity    │
│ [Avatar] Item Made  │
│          Serial... ·│
│          Issued     │
│          12 Mar ●   │
│ [Avatar] Item 2     │
│          Returned   │
│          13 Mar ●   │
├─────────────────────┤
│ ⌂ ⬡ ☰ ○             │     ← Bottom Navigation
└─────────────────────┘
```

**Key Elements**:
1. **User Card** - Shows logged-in user with avatar
   - Quick add stock button (+)
   - User role (Store Manager, Staff, Field Team)

2. **Stock Overview** - 4 Metrics
   - Total Products
   - In Stock Count (green)
   - Low Stock Count (orange)
   - Out of Stock Count (red)
   - Total Units

3. **Filter Tabs** - Filter recent activity
   - All
   - In Field
   - Returned
   - Received

4. **Recent Activity** - Timeline view
   - Product avatar
   - Product name & serial
   - Action type (Issued, Returned, Stock In)
   - Status with timestamp
   - Color-coded status dots

**Navigation**:
- Tap any recent activity item → Product Detail screen
- Tap + button → Add Stock screen
- Bottom nav → navigate to Products/Profile

---

### 3. Products Screen

## Layout
```
┌─────────────────────┐
│  Status Bar (9:41)  │
├─────────────────────┤
│  Products           │     ← Title
│  ⌕ Search products...│     ← Search bar
├─────────────────────┤
│  Product List       │
│ [Avatar] Product 1  │
│          Cat · 3 SN │
│          8        🟢│
│          In Stock   │
│ [Avatar] Product 2  │
│  ...                │
├─────────────────────┤
│ ⌂ ⬡ ☰ ○             │
└─────────────────────┘
```

**Features**:
1. **Search Bar**
   - Real-time filtering by product name
   - Search icon with input
   - Debounced search (optional optimization)

2. **Product Cards**
   - Avatar with product initials
   - Product name
   - Category & serial count
   - Stock quantity (large number)
   - Status badge with color (🟢 🟡 🔴)

3. **Color Coding**
   - Avatar background:
     - Green (#AAEF35) if In Stock
     - Orange (#FF9F0A) if Low Stock
     - Red (#FF3B30) if Out of Stock

**Interactions**:
- Tap any product → Detail screen
- Search updates list in real-time

---

### 4. Product Detail Screen

## Layout
```
┌─────────────────────┐
│  ‹  Details       □ │     ← Back & close
├─────────────────────┤
│  Product Info       │
│  769XR XPON Router  │
│  Serial: XPON...    │ Category: Router
│  Status: In Stock ● │
│  
│  Outstanding: 8 pcs │
├─────────────────────┤
│  [Issue Item]       │     ← Primary action
├─────────────────────┤
│  [↩ Return]  [⚠Faulty] │
├─────────────────────┤
│  QR Code Section    │
│  ↓ Download QR Code │
│  [  QR Image  ]     │
│  XPONDD87A2D2       │
├─────────────────────┤
│              (nav)  │
└─────────────────────┘
```

**Information Cards**:
1. **Product Information**
   - Product name (large, bold)
   - Serial number (selectable, wrappable)
   - Category
   - Status with color indicator

2. **Outstanding Balance**
   - Large number display
   - Units (pcs)

**Action Buttons**:
1. **Issue Item** (Primary)
   - Green accent button
   - Takes to Issue form

2. **Return** (Secondary)
   - Outline button
   - Takes to Return form

3. **Mark Faulty** (Secondary)
   - Outline button
   - For immediate faulty flag

**QR Section**:
- Preview of QR code
- Serial number below for reference
- Download button (Phase 2)

**Navigation**:
- Back arrow → Products or Dashboard
- Bottom nav normal

---

### 5. Issue Item Screen

## Complete Form Layout
```
┌─────────────────────┐
│  ‹  Issue Item    □ │
├─────────────────────┤
│ [Avatar] Product    │     ← Quick reference
│          Serial 16  │
├─────────────────────┤
│ Category *          │
│ [Installation ▼]    │
├─────────────────────┤
│ Quantity *          │
│ [−] 1 [+]           │
├─────────────────────┤
│ Issued To *         │
│ [Fred ▼]            │
├─────────────────────┤
│ Authorized By *     │
│ [Mr Isaac ▼]        │
├─────────────────────┤
│ Customer (optional) │
│ [John Doe...]       │
├─────────────────────┤
│ [Submit → Sheets]   │
├─────────────────────┤
│              (nav)  │
└─────────────────────┘
```

**Form Fields**:

1. **Product Reference** (Auto-filled, read-only)
   - Avatar with product name
   - Serial number preview

2. **Category** *(Required)*
   - Dropdown selection
   - Options: Installation, Replacement, Connectors, General
   - Default: Installation

3. **Quantity** *(Required)*
   - Number input
   - Increment/Decrement buttons (±)
   - Minimum: 1
   - No maximum

4. **Issued To** *(Required)*
   - Dropdown selection
   - Predefined staff list
   - Default: Fred

5. **Authorized By** *(Required)*
   - Dropdown selection
   - Approval staff list
   - Default: Mr Isaac

6. **Customer Name** *(Optional)*
   - Free text input
   - Placeholder: "e.g. John Doe"
   - Use case: End customer for installation items

**Submit Button**:
- "Submit → Log to Sheets"
- Green accent color
- Disabled until all required fields filled
- On success: Toast + Return to Dashboard

**Google Sheets Output**:
- Sheet: "Supplied Field Team"
- Columns: Date, Product Name, Category, Serial, Qty Out, Issued To, Auth. By, Status (Active)

---

### 6. Return Item Screen

## Layout
```
┌─────────────────────┐
│  ‹  Return Item   □ │
├─────────────────────┤
│ [Avatar] Product    │     ← Quick reference
│          Serial 16  │
├─────────────────────┤
│ Returned By *       │
│ [Fred ▼]            │
├─────────────────────┤
│ Received By *       │
│ [Mr Isaac ▼]        │
├─────────────────────┤
│ Condition *         │
│ [Good Condition]    │
│ [Faulty] [Damaged]  │
│ [New in Box] [Pack] │
├─────────────────────┤
│ ⚠ Faulty/Damaged    │  ← Conditional
│ Admin will be       │    Alert (if selected)
│ prompted to update  │
│ Faulty Units column │
├─────────────────────┤
│ [Submit → Sheets]   │
├─────────────────────┤
│              (nav)  │
└─────────────────────┘
```

**Form Fields**:

1. **Returned By** *(Required)*
   - Dropdown: Field team member
   - Who brought the item back

2. **Received By** *(Required)*
   - Dropdown: Store staff
   - Who received it

3. **Condition** *(Required)*
   - Button group (5 options)
   - Options:
     - Good Condition (default)
     - Faulty
     - Damaged
     - New in Box
     - New in Pack
   - Selected: Green border, bold text
   - Unselected: Gray border, light text

4. **Faulty/Damaged Alert** *(Conditional)*
   - Yellow warning box
   - Shows if condition = "Faulty" or "Damaged"
   - Text: "Admin will be prompted to update the Faulty Units column in Google Sheets"

**Submit Button**:
- "Submit → Log to Sheets"
- After submission: Toast + Dashboard

**Google Sheets Output**:
- Sheet: "Items Received"
- Transaction Type: "Returned from Field"
- Columns: Date, Product, Serial, Qty, Returned By, Received By, Condition

---

### 7. Add New Stock Screen

## Layout
```
┌─────────────────────┐
│  ‹  Add New Stock □ │
├─────────────────────┤
│ Product Name *      │
│ [769XR XPON ▼]      │
├─────────────────────┤
│ Quantity *          │
│ [−] 5 [+]           │
├─────────────────────┤
│ Serial Number(s)    │
│ [SN001,SN002...]    │
├─────────────────────┤
│ Received By *       │
│ [Mr Isaac ▼]        │
├─────────────────────┤
│ Condition *         │
│ [Good Condition]... │
├─────────────────────┤
│ [Submit → QR Codes] │
├─────────────────────┤
│              (nav)  │
└─────────────────────┘
```

**Form Fields**:

1. **Product Name** *(Required)*
   - Dropdown: Select from existing products
   - Prevents typos, ensures consistency

2. **Quantity** *(Required)*
   - Increment/Decrement input
   - Minimum: 1
   - How many units arriving

3. **Serial Numbers** *(Optional)*
   - Multi-line compatible
   - Format: "SN001" or "SN001, SN002, SN003"
   - For consumables: Leave blank for single QR

4. **Received By** *(Required)*
   - Dropdown: Store staff receiving stock
   - Default: Mr Isaac

5. **Condition** *(Required)*
   - Button group (5 options)
   - Default: "New in Box"
   - Same options as Returns

**Submit Button**:
- "Submit → Generate QR Codes"
- On success: Generates QR codes, shows download link
- Toast: "✅ Stock added — QR codes generated!"

**Google Sheets Output**:
- Sheet: "Items Received"
- Transaction Type: "New Stock Received"
- Auto-generates QR codes with serial numbers

**Next Step** (Phase 2):
- Admin downloads QR PDF
- Prints sheet of stickers
- Applies to physical items
- Laminate for durability

---

## Bottom Navigation Behavior

```
⌂ Home     → Dashboard
⬡ Scan     → Products (search/scan mode)
☰ Products → Full product inventory
○ Profile  → Logout
```

- Always visible except in Issue/Return/Stock forms
- Light color in dark screens, dark color in light screens
- Active button highlighted in accent green

---

## Screen Theme Colors

### Dark Screens (Dashboard, Products)
- Background: #0F0F0F
- Cards: #1B1B1B or #252525
- Text: White
- Secondary: #717171
- Borders: #2D2D2D

### Light Screens (Detail, Issue, Return, Stock)
- Background: #F4F4F4
- Cards: #FFFFFF
- Text: #111111
- Secondary: #888888
- Borders: #E8E8E8 or #EBEBEB

---

## Responsive Design

### Width: 375px (Primary Target)
- All mockups designed for iPhone 12 width
- Touch targets minimum 48px

### Tablet/Desktop (Responsive)
- Max width: 600px
- Centered on screen
- Same frame styling

### Orientation
- Portrait only (optimized)
- Can support landscape with CSS media queries

---

## Validation Rules

| Field | Validation |
|-------|-----------|
| Password | Min 6 chars (configurable) |
| Category | Required, dropdown only |
| Quantity | 1-999, number only |
| Serial | Optional, comma-separated |
| Staff Dropdowns | Required, no free text |
| Condition | Required, button selection |
| Customer Name | Optional, max 100 chars |
| Condition | Required, button selection |

---

## Data Flow Examples

### Issuing an Item
```
1. Dashboard/Products → Select product
2. Detail → Click "Issue Item"
3. IssuePage → Fill form
4. Submit → POST /api/sheets/issue
5. Backend → Append to "Supplied Field Team" sheet
6. Success → Toast + Dashboard
```

### Returning an Item
```
1. Detail → Click "Return"
2. ReturnPage → Select condition
3. Submit → POST /api/sheets/return
4. Backend → Append to "Items Received" sheet
5. If Faulty → Show admin warning
6. Success → Toast + Dashboard
```

### Adding Stock
```
1. Dashboard + → Add New Stock
2. StockPage → Select product, qty, serials
3. Submit → POST /api/sheets/stock
4. Backend → Generate QR codes
5. Response → QR PDF download link
6. Success → Print and apply labels
```

---

## Future Phase Features (Not in MVP)

### Phase 2 - QR Integration
- Add QR scanner to products screen
- Auto-fill product/serial on scan
- QR generation and batch printing

### Phase 3 - Analytics
- Charts: Most issued items
- Timeline: Daily transactions
- Staff performance
- Trending products

### Phase 4 - Offline Mode
- Service worker implementation
- Queue transactions offline
- Auto-sync on connection
- Background notifications

### Phase 5 - Advanced Features
- Expected return tracking
- Low stock notifications (WhatsApp/Email)
- Multi-location support
- Audit logs and history
- Barcode scanning (alternative to QR)

---

**Last Updated**: April 2026
**Version**: 1.0 MVP
**Status**: Production Ready
