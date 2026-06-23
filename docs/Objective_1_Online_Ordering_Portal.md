# Objective 1: Online Ordering Portal

## 📝 Module Overview
The **Online Ordering Portal** is a core customer-facing module of the **CakeLytics** ecosystem developed for **Aileen and Niculus Bake Shop**. This portal streamlines the end-to-end consumer journey, enabling users to seamlessly browse products, manage their shopping carts, choose specialized fulfillment types, settle payments, and secure a verification QR code for swift in-store pickup.

---

## 👥 Owner
* **Team Member:** Daluz, Michelle D.
* **Role:** Frontend & Integration Developer (Objective 1)

---

## 🚀 Key Features
* **Interactive Product Catalog:** Category filtering system tailored for *Pastry*, *Package*, and *Celebration Material*.
* **Flexible Fulfillment Controls:** Intuitive selection between **Pick-up Now** or date/time scheduled **Pre-Orders**.
* **Adaptive Payment Options:** Support for split-payment workflows (**50% Deposit** or **Full Payment** configurations).
* **Fulfillment Verification:** Instant creation of digital receipts appended with a unique **QR code** for secure storefront verification.
* **Supabase Backend Linkage:** Real-time synchronization of active inventory listings and incoming customer receipts.

---

## 🗺️ 6-Week Implementation Timeline

### Week 1: Core Interface Architecture
* **Day 1: Customer Homepage and Product Card Components**
  * **Sub-tasks:** Create homepage layout with brand banner; build navigation menus; add "How to Order" guide section; create product card component with stock status indicator and also footer.
  * **Deliverables:** Homepage UI, Navigation Component, Step-by-Step Order Guide, Static Product Card Component.

### Week 2: Catalog Assembly & Interactive Cart
* **Day 1: Product Catalog & Category Filtering**
  * **Sub-tasks:** Assemble structural catalog page wrapper; design filter controls for categories (All, Pastry, Package, Celebration Material); formulate raw cart page layouts.
  * **Deliverables:** Product Catalog Page, Category Filter Component, Cart Page layout.
* **Day 2: Shopping Cart & Step Progress Indicator**
  * **Sub-tasks:** Append quantity increment/decrement controls; construct total/subtotal price summary calculators; integrate a 4-phase step indicator (*Select Items, Details, Payment, Complete*).
  * **Deliverables:** Quantity Control Component, Cart Summary Component, Step Progress Indicator.

### Week 3: Data Integrity & Backend Configuration
* **Day 1: Order Details & Payment Interface with Supabase Integration**
  * **Sub-tasks:** Build Pick-up Now / Pre-Order conditional forms; implement localized date/time picker fields; initialize live database client bridges via Supabase.
  * **Deliverables:** Pick-up/Pre-Order Form, Payment Option Selector, Supabase Configuration.
* **Day 2: Product and Order Data Models**
  * **Sub-tasks:** Design and implement structural database schemas for product profiles and active purchase requests required for the workflow.
  * **Deliverables:** Product Data Model, Order Data Model.

### Week 4: End-to-End Data Integration
* **Day 1: Connect Product Catalog to Database**
  * **Sub-tasks:** Link UI catalog pages with real database tables; establish transactional read scripts to query and display dynamic, live item inventories.
  * **Deliverables:** Live Supabase-connected Catalog, Dynamic Product Fetch Drivers.
* **Day 2: Implement Order Submission Function**
  * **Sub-tasks:** Construct submission functions to store customer information; validate product availability prior to confirmation; calculate and record selected payment records.
  * **Deliverables:** Order Submission Function, Customer Information Storage, Product Availability Check.

### Week 5: Output Generation & System Verification
* **Day 1: Generate Order Receipt and QR Code**
  * **Sub-tasks:** Program a unique transaction tracking ID generator; integrate a QR matrix generator for pick-up data strings; build final receipt page with order details.
  * **Deliverables:** Order ID Generator, QR Code Generator, Digital Receipt Page.
* **Day 2: Perform Full System Testing**
  * **Sub-tasks:** Test complete ordering process from product selection to receipt generation using stored database records; verify input field validations and error handling.
  * **Deliverables:** Ordering Workflow Test Report, Database Test Report, Error Handling Report.

### Week 6: System Polishing & Deployment Preparation
* **Day 1: Finalize System and Prepare Deployment**
  * **Sub-tasks:** Fix reported bugs and user edge cases; clean and document source code; prepare deployment-ready production build.
  * **Deliverables:** Final Online Ordering Portal Module, Clean and Documented Source Code, Deployment Build.
---

## 🧪 Instructor Pull Request (PR) Acceptance Criteria

Your pull requests for this objective will be verified against the following strict behavior metrics:

| Phase | Target Requirement Criteria |
| :--- | :--- |
| **Interface Elements** | <ul><li>Renders the storefront landing page with active brand banners seamlessly.</li><li>Maintains absolute routes across Home, Cart, and Catalog components.</li><li>Displays dynamic product cards displaying prices, titles, and live stock statuses.</li></ul> |
| **Logic & Calculation** | <ul><li>Dynamically shifts step components upon processing forward wizard steps.</li><li>Recalculates cart subtotals and overall grand totals instantaneously during quantity shifts.</li><li>Enforces dynamic checkout balances reflecting selected payment models (50% Deposit vs Full Payment).</li></ul> |
| **Integration & Database** | <ul><li>Executes accurate target database reads and writes via Supabase.</li><li>Blocks checkout attempts if requested items exceed real-time available quantities.</li><li>Generates individual unique verification tracking IDs matching the corresponding customer QR code content.</li></ul> |
| **Stability & Standards** | <ul><li>Passes all workspace structural lint checks with zero formatting or type errors.</li><li>Displays readable front-end error alerts upon missing mandatory inputs or timeout errors.</li></ul> |

---

## 🛠️ Technology Stack
* **Frontend Framework:** Next.js / React (TypeScript)
* **Styling:** Tailwind CSS
* **Database & Auth Platform:** Supabase (PostgreSQL)
* **QR Generation:** `qrcode.react` / Standard JS matrix library