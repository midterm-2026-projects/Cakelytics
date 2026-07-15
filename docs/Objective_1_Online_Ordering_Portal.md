# Objective 1: Online Ordering Portal

## 📝 Module Overview

The **Online Ordering Portal** is the customer-facing module of **CakeLytics: A Web-based Decision Support System for Sales and Product Trend Forecasting with Stock Inventory Management System for Aileen and Niculus Bake Shop**.

This module enables customers to browse available bakery products, filter products by category, manage their shopping cart, complete a guided checkout process, choose between **Pick-up Now** or **Pre-order**, select either **50% Deposit** or **Full Payment**, and receive a digital receipt containing a QR code for pickup verification.

The Online Ordering Portal provides a complete ordering workflow while integrating both frontend and backend components to ensure a responsive, reliable, and user-friendly customer experience.

---

# 👤 Module Owner

**Team Member:** Daluz, Michelle D.

**Objective #:** 1

**Role:** Frontend Developer, Backend Developer, Integration & Testing

---

# 🚀 Major Features

## Customer Interface

- Promotional Home Page
- Responsive Navigation Bar
- How To Order Section
- Product Catalog
- Product Cards
- Featured Categories
- Past Creations Gallery
- Order Call-to-Action Section
- Shopping Cart
- Category Filtering
- Order Progress Tracker

---

## Checkout Workflow

- Customer Information Form
- Pick-up Now / Pre-order Selection
- Payment Method Selection
- Order Summary
- Checkout Validation
- Payment Page
- Order Completion Page
- Digital Receipt
- QR Code Generation
- Receipt Download
- Scroll-To-Top Navigation Utility

---

## Backend Features

- Product Model
- Product Service
- Customer Model
- Customer Service
- Order Model
- Order Service
- Product Controller
- Customer Controller
- Order Controller
- Product Routes
- Customer Routes
- Order Routes
- Validation Middleware
- Backend Integration Testing

---

# 📅 6-Week Development Timeline

## Week 1 — Core Frontend Components

### Day 1 — Develop Core Frontend Components

### Tasks

- Build Home Page
- Build Navigation Bar
- Build How To Order Section
- Build Menu Page
- Build Product Card Component
- Build Order Progress Component
- Build Footer Component

### Deliverables

- Home Page Component
- Navigation Bar
- How To Order Component
- Menu Page
- Product Card Component
- Order Progress Component
- Footer Component

### Acceptance Criteria

- Home page renders correctly
- Explore Menu button navigates properly
- Navigation links work correctly
- Product cards display complete information
- Add to Cart functions correctly
- Order Progress displays active step
- Footer navigation functions correctly

---

## Week 2 — Customer Ordering Experience

### Day 1 — Product Discovery & Shopping Cart

### Tasks

- Build Past Creations Gallery
- Build Order CTA Section
- Build Featured Categories
- Build Category Filter
- Build Shopping Cart

### Deliverables

- Past Creations Gallery
- Order CTA Component
- Featured Categories
- Category Filter
- Shopping Cart Component

### Acceptance Criteria

- Gallery renders correctly
- CTA navigates to Menu
- Featured Categories display properly
- Category filtering works correctly
- Cart updates quantity
- Remove Item works
- Total computation is correct
- Checkout validation functions properly

---

### Day 2 — Checkout & Order Completion Workflow

### Tasks

- Build Checkout Page
- Build Payment Page
- Build Order Completion Page
- Build Receipt Page
- Build Scroll-To-Top Utility

### Deliverables

- Checkout Component
- Payment Component
- Order Completion Component
- Receipt Component
- Scroll-To-Top Utility

### Acceptance Criteria

- Customer form validates inputs
- Order Summary computes correctly
- Payment selection works
- Receipt displays correctly
- QR Code renders successfully
- Receipt download works
- Navigation scroll resets automatically

---

## Week 3 — Backend Development

### Day 1 — Product & Order Backend Logic

### Tasks

- Update Product Model
- Update Product Service
- Update Order Model
- Update Order Service
- Write Product Tests
- Write Order Tests

### Deliverables

- Product Model
- Product Service
- Product Unit Tests
- Order Model
- Order Service
- Order Unit Tests

### Acceptance Criteria

- Product CRUD operations work
- Order CRUD operations work
- Product validation passes
- Order validation passes
- Business rules enforced
- Unit tests pass successfully

---

### Day 2 — Customer Backend Logic

### Tasks

- Implement Customer Model
- Implement Customer Service
- Create Customer Tests

### Deliverables

- Customer Model
- Customer Service
- Customer Unit Tests

### Acceptance Criteria

- Customer records created successfully
- Customer retrieval works
- Validation functions correctly
- Unit tests pass successfully

---

## Week 4 — Integration

### Day 1 — Frontend Integration Testing

### Tasks

Perform integration testing for:

- Home
- Menu
- Checkout
- Payment
- Order Completion
- Receipt

### Deliverables

- Home.test.jsx
- Menu.test.jsx
- Checkout.test.jsx
- Payment.test.jsx
- Complete.test.jsx
- Receipt.test.jsx

### Acceptance Criteria

- Complete ordering workflow works
- Navigation remains consistent
- Cart persists correctly
- Receipt displays correct information
- Integration tests pass

---

### Day 2 — Controllers & API Routes

### Tasks

- Implement Product Controller
- Implement Customer Controller
- Implement Order Controller
- Create Express Routes
- Register Routes

### Deliverables

- Product Controller
- Customer Controller
- Order Controller
- Product Routes
- Customer Routes
- Order Routes

### Acceptance Criteria

- Requests routed correctly
- Controllers return proper responses
- Correct HTTP status codes returned
- Route tests pass successfully

---

## Week 5 — Middleware & Backend Testing

### Day 1 — Validation Middleware

### Tasks

- Validate incoming requests
- Handle invalid inputs
- Handle errors
- Integrate middleware

### Deliverables

- Validation Middleware

### Acceptance Criteria

- Invalid requests rejected
- Errors handled correctly
- Middleware integrates properly

---

### Day 2 — Backend Integration Testing

### Tasks

Perform backend integration testing for:

- Products
- Customers
- Orders

### Deliverables

- Backend Integration Tests
- Controller Tests
- Route Tests
- Model Tests
- Service Tests

### Acceptance Criteria

- Business logic validated
- API responses correct
- Database interactions verified
- Integration tests pass

---

## Week 6 — Finalization

### Day 1 — Deployment Preparation

### Tasks

- Fix bugs
- Refactor source code
- Clean project structure
- Prepare deployment build
- Final documentation

### Deliverables

- Final Online Ordering Portal
- Documented Source Code
- Production Build

### Acceptance Criteria

- Project builds successfully
- No lint errors
- Features meet requirements
- Ready for deployment
- Ready for final demonstration

---

# 🧪 Pull Request (PR) Acceptance Criteria

## Frontend

- Home page renders correctly
- Navigation works across all pages
- Product catalog displays correctly
- Category filtering functions correctly
- Shopping cart updates correctly
- Checkout validates customer inputs
- Payment selection functions correctly
- Receipt displays accurate order information
- QR Code renders successfully
- Scroll-To-Top executes on route changes

---

## Backend

- Product APIs work correctly
- Customer APIs work correctly
- Order APIs work correctly
- Controllers call appropriate services
- Validation middleware rejects invalid requests
- Business rules enforced
- Database operations complete successfully

---

## Testing

- Product Model Tests
- Product Service Tests
- Customer Model Tests
- Customer Service Tests
- Order Model Tests
- Order Service Tests
- Frontend Integration Tests
- Backend Integration Tests
- Controller Tests
- Route Tests

All tests must pass before merging.

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- React Router
- Tailwind CSS

## Backend

- Node.js
- Express.js

## Database

- Supabase
- PostgreSQL

## Testing

- Vitest
- React Testing Library

## Additional Libraries

- QR Code Generator
- HTML-to-Image
- Local Storage API

---

# 📌 Module Summary

The **Online Ordering Portal** provides customers with a complete online ordering experience, beginning with product browsing and ending with digital receipt generation. The module integrates responsive frontend interfaces, backend services, validation middleware, API routes, and comprehensive testing to deliver a reliable ordering workflow. By combining React, Express, Supabase, and automated testing, the portal supports secure order processing, accurate data management, and a deployment-ready application for CakeLytics.