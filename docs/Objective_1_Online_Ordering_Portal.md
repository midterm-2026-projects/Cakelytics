# Objective 1: Online Ordering Portal

## 📝 Module Overview
The **Online Ordering Portal** serves as the customer-facing system for **CakeLytics**, developed for **Aileen and Niculus Bake Shop**. This application module empowers patrons to browse menu selections, filter items dynamically by categories, manage an interactive shopping cart, step through a multi-stage checkout process, choose fulfillment criteria, allocate payment splits, automatically manage scroll window contexts during route transitions, and review digital receipts embedded with unique verification QR codes.

---

## 👥 Owner
* **Team Member:** Daluz, Michelle D.
* **Role:** Frontend & Integration Developer (Objective 1)

---

## 🚀 Key Features
* **Global Core Shell Elements:** Core UI scaffolding containing a promotional home page, application navigation controls, an order progress tracking wizard, user guide segments, and complete footer frameworks.
* **Modular Collection Showcases:** Dedicated local visual layout carousels for historical past creations along with interactive category filtering systems and targeted boards (*Celebration Packages* & *Filipino Common Pastries*).
* **Multi-Stage Checkout Architecture:** Tracks ordering paths continuously across dedicated visual sub-pages (*Checkout Form*, *Payment Selection Panel*, *Order Completion Banner*, and *Digital Invoice Sheet*).
* **Layout Navigation Utilities:** Integrates a programmatic scroll-to-top utility to automatically reset the user's viewport perspective back to the top during layout routing transitions.
* **Local Context Resilience:** Manages temporary client data buffers safely, handling storage cleanup upon home page returns and applying navigation blockers before document acquisition.
* **Persistent Database Sync:** Transitions frontend states into active records mapped to live backend tables using Supabase.

---

## 🗺️ 6-Week Implementation Timeline

### Week 1: Core Layout Architecture & Structural Views
* **Day 1: Base Application Shell, Route Wrappers, and Visual Scaffolding**
  * **Sub-tasks:** Build the Home page layout with promotional headings, cake images, and menu buttons. Formulate a global navigation bar with branding assets. Construct a grid-based "How to Order" section. Create the structural layout for the menu page with reusable card states. Assemble a numbered order progress step tracking wizard and standard system footer elements.
  * **Deliverables:** Home Page Component & Layout, Navigation Bar Component & Interface, How To Order Component & Guide Section, Menu Page Component & Catalog, Order Progress Component & Progress Tracker, Standard Layout Footer.

### Week 2: Content Galleries, Reactive Shopping Cart, and Checkout Subsystems
* **Day 1: Galleries, Showcases, Filters, and Cart Controls**
  * **Sub-tasks:** Build a dynamic media portfolio rendering cake assets from local public directories. Code theme-aligned conversion blocks. Implement showcase boards for targeted groups featuring hover styling rules. Construct category selection controls to drive sorting filters and build interactive shopping cart displays featuring item increment/decrement controls and math scripts.
  * **Deliverables:** Past Creations Gallery Component, Order CTA Component & Section, Featured Categories Component & Showcase Section, Category Filter Component & Product Filtering Functionality, Shopping Cart Component & Cart Management Functionality.
* **Day 2: Checkout Views, Payment Selection, Completion Panels, Receipts & Utilities**
  * **Sub-tasks:** Formulate the core checkout layout with user input fields, fulfillment selection toggles, order balance parameters, a dedicated payment gateway layout, and an automated post-order success completion banner. Build a digital invoice layout showing order parameters and dynamic QR code tags with local image canvas download capabilities. Program location tracking observers that automatically reset page viewport position coordinates to the topmost layout layer on route alterations.
  * **Deliverables:** Checkout Page Component & Input Form, Payment Page Component & Interface, Order Completion Page Component & Post-Order Interface, Receipt Page Component & Invoicing Display, Scroll To Top Component & Navigation Scroll Manager.

### Week 3: Backend Initialization and Database Architecture
* **Day 1: Supabase Environment Setup & Configuration**
  * **Sub-tasks:** Establish the backend server environment configurations, initialize the remote repository syncs, and map environment keys securely within the web platform framework.
  * **Deliverables:** Supabase Configuration Module, Server Connection Validation.
* **Day 2: Structural Data Object Schemas**
  * **Sub-tasks:** Design and implement data models defining required product profiles and long-term transactional records to support the ordering workflow.
  * **Deliverables:** Product Data Model, Order Data Model.

### Week 4: Relational Synchronization & Transaction Submission
* **Day 1: Live Relational Catalog Population**
  * **Sub-tasks:** Connect interface catalog files to remote tables, running read operations that fetch and display product records dynamically from database tables.
  * **Deliverables:** Product Database Connection, Dynamic Product Catalog UI, Product Fetching Function.
* **Day 2: Inventory-Checked Transactions Submission Engine**
  * **Sub-tasks:** Implement submission modules to save order logs and customer records. Code validation checks evaluating product availability and total split amounts prior to data transmission.
  * **Deliverables:** Order Submission Function, Customer Information Storage, Product Availability Check.

### Week 5: Output Utilities & System Verification
* **Day 1: Transaction Receipts & QR Matrix Generation**
  * **Sub-tasks:** Formulate generation scripts compiling individual unique transaction IDs. Integrate dynamic matrix drawing components outputting scannable pickup codes holding order information.
  * **Deliverables:** Order ID Generator, QR Code Generator, Digital Receipt Page Layout.
* **Day 2: System Validation Testing Runs**
  * **Sub-tasks:** Execute complete end-to-end user path tests tracing selections from product selection down through invoice generation. Audit input exception parameters and business rule validation banners.
  * **Deliverables:** Ordering Workflow Test Report, Database Test Report, Error Handling Validation Log.

### Week 6: Production Hardening & Build Preparation
* **Day 1: Code Optimization & Build Compilation**
  * **Sub-tasks:** Patch reported bugs and user edge cases. Refactor local component syntax to clear code style configurations, compile clean production artifacts, and certify all features meet the required criteria.
  * **Deliverables:** Final Online Ordering Portal Module, Clean and Documented Source Code, Production Deployment Build.

---

## 🧪 Pull Request (PR) Acceptance Criteria

Your pull requests will be audited against these explicit testing expectations and automated runtime parameters:

### 1. Presentation, Scaffolding & Component Integrity
* **Landing Page Execution:** The home page layout, navigation header, and brand footer must successfully mount and navigate to the menu page upon cursor interactions without layout errors.
* **Responsive Visual Grids:** Grid elements like the "How to Order" section and featured category cards must adapt fluidly across different screen sizes.
* **Active Style States:** All button elements, filtering selection tools, and category filters must reflect the correct active styling states instantly upon user engagement.

### 2. Functional State Mechanics & State Preservation
* **State Updates:** Modifying item targets within the shopping cart context must calculate subtotal parameters instantly, handle quantities correctly, and block transitions when the array is empty.
* **Cart Quantities Accumulation:** Selecting the same item multiple times must increment its total property inside the state manager instead of outputting separate array blocks.
* **Wizards Step Tracking:** The progress wizard tracker must render numbered badges and step interconnecting progress lines correctly based on the user's current step.

### 3. Dynamic Form Handling, Viewport Control, Persistence & Exits
* **Fulfillment Conditional Paths:** Selecting the *Pre-Order* option must dynamically reveal date/time pickers, while *Pick-up Now* choices must keep those inputs hidden.
* **Navigation Viewport Management:** Transitioning across alternate views must fire location tracking triggers, resetting window parameters to the topmost layout layer immediately after component mount scripts run.
* **Data Context Management:** Submitting checkout fields must update payment amounts according to chosen billing splits (*50% Deposit* or *Full Payment*), retrieve data accurately from local storage instances, and clear the cart state after order validation.
* **Exit Routing Interceptions:** The invoice screen must handle asset downloads safely, clear out order memory hooks upon route updates, and display loading views if local context structures are unpopulated.

### 4. Integration Enforcements & Build Stability
* **Relational Validation:** Product catalog components must execute live queries that display remote table values accurately and match database profiles perfectly.
* **Business Rules Enforcement:** Submission logic must process unique string indexing values, compute accurate matrix codes, and block inputs that violate basic database constraints.
* **Clean Build Output:** Compilation scripts must complete without errors, clear all lint formatting tests, and show a passing build status on GitHub.

---

## 🛠️ Technology Stack
* **Architecture Base:** Next.js / React (TypeScript)
* **Styling Framework:** Tailwind CSS
* **Backend Database & Platform Engines:** Supabase (PostgreSQL Object Framework)
* **Utility Engines:** Core Local Web Storage APIs / HTML-to-Image Canvas Wrappers / Integrated Canvas QR Engines