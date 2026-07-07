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

---

### Week 2: Content Galleries, Reactive Shopping Cart, and Checkout Subsystems

* **Day 1: Galleries, Showcases, Filters, and Cart Controls**
  * **Sub-tasks:** Build a dynamic media portfolio rendering cake assets from local public directories. Code theme-aligned conversion blocks. Implement showcase boards for targeted groups featuring hover styling rules. Construct category selection controls to drive sorting filters and build interactive shopping cart displays featuring item increment/decrement controls and math scripts.
  * **Deliverables:** Past Creations Gallery Component, Order CTA Component & Section, Featured Categories Component & Showcase Section, Category Filter Component & Product Filtering Functionality, Shopping Cart Component & Cart Management Functionality.

* **Day 2: Checkout Views, Payment Selection, Completion Panels, Receipts & Utilities**
  * **Sub-tasks:** Formulate the core checkout layout with user input fields, fulfillment selection toggles, order balance parameters, a dedicated payment gateway layout, and an automated post-order success completion banner. Build a digital invoice layout showing order parameters and dynamic QR code tags with local image canvas download capabilities. Program location tracking observers that automatically reset page viewport position coordinates to the topmost layout layer on route alterations.
  * **Deliverables:** Checkout Page Component & Input Form, Payment Page Component & Interface, Order Completion Page Component & Post-Order Interface, Receipt Page Component & Invoicing Display, Scroll To Top Component & Navigation Scroll Manager.

---

### Week 3: Backend Database Layer Architecture & Unit Testing

* **Day 1: Core Database Models, Services & Unit Testing**
  * **Sub-tasks:** Write core schema definitions for all system entities including product properties, transaction entities (orders), client profile mappings (customers), and individual transaction line-items (order items). Implement service handlers managing operational record creation, calculations, data retrieval utilities, and catalog rule checks. Write isolated unit testing frameworks and relational modules to verify database operations, schema constraints, and foreign key linkages.
  * **Deliverables:** `product.model.js`, `product.service.js`, `product.test.js`, `customer.model.js`, `customer.service.js`, `order.model.js`, `order.service.js`, `order.model.test.js`, `orderItem.model.js`, `orderItem.service.js`, and comprehensive Model & Service Unit Test Suites.

* **Day 2: Database Connection & Live Service Integration**
  * **Sub-tasks:** Establish the live connection initializer hooking up the application layer to the Supabase (PostgreSQL) instance. Write and execute SQL migration scripts to stand up tables matching the exact constraints of the Day 1 Models. Bind the Day 1 Service Handlers (`product.service.js`, `order.service.js`, etc.) to the live data pool, and run validation passes verifying that local javascript logic successfully executes transactions, commits persistent rows, and handles foreign key cascading down to the live remote tables.
  * **Deliverables:** `supabaseClient.js` (Central Connection Engine), `schema_migration.sql` (Tables & Relations Init Script), `catalog_seed.sql` (Initial Menu Data Ingestion), and Live Service Integration Verification Report.

---

### Week 4: Controller Integration & Route Architecture

* **Day 1: Business Logic Controllers**
  * **Sub-tasks:** Develop endpoint controllers handling products, customers, master invoices, and line-item baskets. Link the request processors directly into your underlying service layer abstractions and author controller unit tests.
  * **Deliverables:** `product.controller.js`, `customer.controller.js`, `order.controller.js`, `orderItem.controller.js`, Controller Test Suites.

* **Day 2: Express Routes & Request Validation Middleware**
  * **Sub-tasks:** Construct dedicated endpoint pipelines using the Express Router platform. Code structural validation middleware layers that intercept incoming payload items, handle data schema errors, and mount routers to the global root app workspace.
  * **Deliverables:** Product/Customer/Order/OrderItem API Routes, Request Validation Middleware, Global Express Router Configurations.

---

### Week 5: Quality Assurance Frameworks & System Verification

* **Day 1: Backend Integration & Module Testing**
  * **Sub-tasks:** Evaluate complete end-to-end purchasing workflows against local database testing configurations. Validate operational business rules, data conversion constraints, and logging sequences.
  * **Deliverables:** Backend Ordering Workflow Test Report, Validation Exception Logs.

* **Day 2: Full Stack System Integration Testing**
  * **Sub-tasks:** Run deep system verification passes tracking user paths starting from catalog additions down through digital receipt generation. Monitor state consistency across product, user, order, and line-item tables synchronously.
  * **Deliverables:** Full Stack System Integration Matrix, Data Consistency Validation Report.

---

### Week 6: Optimization & Deployment Hardening

* **Day 1: Code Optimization, Build Preparation, and Sign-Off**
  * **Sub-tasks:** Patch open bug queues and address behavioral edge cases across components. Clean up code formatting scripts, write inline module documentation, and compile clean, deployment-ready production builds.
  * **Deliverables:** Optimized Online Ordering Module, Clean and Documented Codebase, Verified Production Build Assets.

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