# 📦 Objective 1: Online Ordering Portal

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
  * **Sub-tasks:** Create the Home page layout with promotional headings, description context, a featured cake image asset, and an "Explore Menu" call-to-action button. Formulate a global navigation bar complete with business branding assets and explicit home/menu pathing. Construct a responsive grid-based "How to Order" pipeline section. Create the structural layout for the catalog view utilizing reusable product cards, setup layout footers, and link structural routes into the application router shell.
  * **Deliverables:** Home Page Layout View, Global Navigation Bar Interface, How To Order Guide Section, Product Card Structural States, Reusable Catalog Core Shell, Order Progress Status Wizard, Layout Footer.
  * **PR Acceptance Criteria:**
    * Component must successfully mount and display promotional headings, descriptions, hero imagery, and operational CTA controls.
    * Navigation bar must dynamically handle relative routes (`/home`, `/menu`) across all views without layout degradation.
    * "How to Order" cards must automatically break across fluid, responsive CSS grids matching alternate device query windows.
    * Step indicators must change active style traits dynamically based on the parent component's numerical view context.

---

### Week 2: Content Galleries, Reactive Shopping Cart, and Checkout Subsystems
* **Day 1: Galleries, Showcases, Filters, and Cart Controls**
  * **Sub-tasks:** Build a dynamic media portfolio loading cake image assets out of public asset scopes. Construct category display selectors supporting specialized targeted scopes (*Celebration Packages* & *Filipino Common Pastries*). Build interactive category buttons driving reactive array filtering systems. Build the shopping cart slide-out overlay component featuring count modification buttons, automatic subtotal math tracking scripts, and route navigation blockers.
  * **Deliverables:** Past Creations Gallery, Promotional Order CTA Module, Featured Category Boards, Category Filter Selector Engine, Reactive Shopping Cart Core Shell.
  * **PR Acceptance Criteria:**
    * Past creations component must accurately map text strings and layout details against mock public photo arrays on render.
    * Category selectors must trigger state modifications that properly truncate or expand product catalogs instantly.
    * Shopping cart actions must handle structural count boundaries (blocking reductions under 1 unit, calculating sums accurately, and throwing block states if empty checkout is attempted).

* **Day 2: Checkout Views, Payment Selection, Completion Panels, Receipts & Utilities**
  * **Sub-tasks:** Formulate checkout data forms requiring consumer identity fields, variable fulfillment selectors, and current balance maps. Build the billing processing interface split selectors (*50% Deposit* or *Full Payment*). Construct post-order success completion cards with deep-link elements. Build invoice layouts reading storage objects and generating canvas-drawn QR pick codes. Program viewport tracking hooks resetting client coordinates to the topmost layout border on routing actions.
  * **Deliverables:** Checkout Form Layout, Payment Configuration Interface, Success Confirmation Panel, Digital Invoice Sheet, Programmatic Scroll Viewport Reset Hook.
  * **PR Acceptance Criteria:**
    * Checkout validations must actively prevent submission routines if required contact details fail pattern match tests.
    * Fulfillment choices must conditionally alter visibility parameters (revealing timestamp pickers exclusively during *Pre-Order* selections).
    * Invoice sheets must generate clean, scannable QR tags and export high-resolution bitmap file images securely via canvas elements.
    * The scroll-to-top script must trap any navigation updates, instantly flashing scroll heights to `0` across consecutive views.

---

### Week 3: Backend Initialization, Database Architecture & Unit Testing
* **Day 1: Order and Product Database Schemes & Functional Unit Verifications**
  * **Sub-tasks:** Implement backend file models defining structural object shapes for products and transactions. Construct service managers to process read/write operations against database endpoints. Secure environment keys using `dotenvx` and code specialized test scripts validating record lifecycle routines under mock conditions.
  * **Deliverables:** `product.model.js`, `product.service.js`, `order.model.js`, `order.service.js`, Automated Model/Service Test Files.
  * **PR Acceptance Criteria:**
    * Product models must capture, type-check, and enforce schema integrity across product identities and prices.
    * Order calculation methods must compute transactional mathematical bounds correctly while protecting base business logic.
    * Core testing architectures must cleanly complete all execution tasks via Vitest without throwing unexpected crash blocks.

* **Day 2: Customer and Order Item Sub-Schema Relations & Testing Integrity**
  * **Sub-tasks:** Implement auxiliary model modules defining properties for customer registries and line-item order fragments. Write transaction service layers enforcing logical data mapping constraints. Compose automated unit coverage blocks verifying entity interaction routines.
  * **Deliverables:** `customer.model.js`, `customer.service.js`, `orderItem.model.js`, `orderItem.service.js`, Relational System Unit Test Suites.
  * **PR Acceptance Criteria:**
    * Customer identity profiles must validate field types correctly and guarantee structural record integrity upon mutation requests.
    * Line-item models must isolate and tie separate operational entities together across relational schema targets.
    * Vitest assertion passes must achieve zero failures, safely converting to a mock backend layer if live cluster credentials are absent.

---

### Week 4: API Architecture, Routers, Controllers, & Relational Sync
* **Day 1: Backend Controller Orchestration Layer Development**
  * **Sub-tasks:** Write decoupled controller handlers across application entities to transform raw incoming network payloads into clear data model actions. Wire up controllers directly against structural service boundaries and write test specs monitoring return code logic.
  * **Deliverables:** Product Controller, Customer Controller, Order Controller, Order Item Controller, Integrated Service Controller Pipeline, Controller Validation Test Suite.
  * **PR Acceptance Criteria:**
    * Controllers must parse network payloads accurately, yielding expected HTTP response entities and standard status flags.
    * System runtime faults or malformed client entries must throw structured semantic exceptions without crashing the main thread.
    * Mock requests handled in testing scripts must pass through the integration controller pipeline successfully.

* **Day 2: Network Express Routing Architecture & Validation Middlewares**
  * **Sub-tasks:** Build distinct application routes via Express router engines mapping endpoint routes. Construct rigid type parsing validation middleware to capture entry issues (`NaN` numbers, unpopulated keys, or illegal status options) before persistence routines fire.
  * **Deliverables:** Express Routing Blueprint Maps, Entity Endpoint Pipelines, Payload Type Schema Middleware, App-wide Route Registration.
  * **PR Acceptance Criteria:**
    * Interface requests must route clean traffic pipelines directly down into matching controller logic contexts.
    * Payload verification filters must drop invalid mutations, throwing clean error code logs back to the terminal prompt.
    * Route test files must register complete status success metrics across all targeted server paths.

---

### Week 5: Integration Enforcements & Full System Verification Tests
* **Day 1: Automated Integration Scopes & Workflow Audits**
  * **Sub-tasks:** Evaluate complete end-to-end user path journeys from selection matrices out into final invoices over connected test databases. Verify edge cases, evaluate business threshold rules, and compile validation log summaries.
  * **Deliverables:** End-to-End Pipeline Audit Report, Input Exception Bound Summary, Framework Performance Validation Logs.
  * **PR Acceptance Criteria:**
    * System operations must reliably track multi-step transaction steps without showing data state inconsistencies.
    * Validation intercept scripts must display legible warnings inside client screens when testing garbage entries.
    * Automated test suites must achieve zero fault logs across integration profiles.

* **Day 2: Full System State Synchronization Verification**
  * **Sub-tasks:** Execute full system tests driving actions across simultaneous operational fields (`Product`, `Customer`, `Order`, and `OrderItem`). Validate that calculations, availability figures, and persistent properties stay perfectly aligned across state boundaries.
  * **Deliverables:** Comprehensive Integration Log Report, Structural Consistency Metrics Sheet, Final API Gateway Validation Statement.
  * **PR Acceptance Criteria:**
    * The system must track customer configurations, inventory items, and order headers cleanly across multi-layer records.
    * Live queries must map perfectly against database storage frames with zero state desynchronization.

---

### Week 6: Production Hardening & Build Preparation
* **Day 1: System Refactoring, Lint Cleanup, and Artifact Compilation**
  * **Sub-tasks:** Patch outstanding issues, refactor syntax formatting down to match code style guidelines, remove old console trace structures, and compile finalized production assets.
  * **Deliverables:** Hardened Online Ordering Portal, Documented Source Trees, Optimized Production Build Artifacts.
  * **PR Acceptance Criteria:**
    * Next.js/Express production builds must compile completely without generating warnings or syntax failure blocks.
    * Code syntax configurations must clean-pass internal linting test rules.
    * The finalized portal module must clear all specified user features and acceptance criteria.

---

## 🧪 Quality Assurance & Verification Matrix

### **Automated Test Suite Status**
Our backend verification schema handles edge-case tracking effectively (generating intentional console trace-blocks when checking missing keys or bad field types) while seamlessly pivoting down to an isolated `Fake Client` environment if remote production strings are missing.