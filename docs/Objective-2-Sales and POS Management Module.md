# Sales and POS Management Module

## Objective
This project focuses on developing a **Sales and Point of Sale (POS) Management Module** for **Aileen and Niculus Bake Shop**. The module enables business owners to manage daily sales operations efficiently by providing functionalities such as product viewing, cart management, payment processing, order monitoring, sales tracking, and sales record generation.

---

## Features

### Product Management
* Display available bakery products
* Product search functionality
* Product category filtering
* Product details viewing

### Cart Management
* Add products to cart
* Update product quantities
* Remove products from cart
* Display cart summary and totals

### Order Management
* Monitor walk-in and online orders
* View order details
* Filter and search orders
* Update order status

### Payment Processing
* Validate customer payments
* Compute customer change
* Generate payment records
* Save transaction information

### Sales Tracking
* Store sales records
* Generate transaction history
* Monitor completed sales

### System Integration
* Frontend and backend integration
* Product data synchronization
* Order transaction verification
* End-to-end sales transaction workflow

---

## Technology Stack

### Frontend
* React.js
* Vite
* Tailwind CSS

### Backend
* Node.js
* Express.js

### Database
* MySQL

### Testing
* Vitest
* React Testing Library

---

## Development Timeline

### Week 1
**Day 1 – POS Product Listing Interface Design**
*   **Sub-Tasks:** Design POS product listing layout, create product card component, create search bar and product category filter UI, design product details display.
*   **Deliverables:** Product listing page UI, product card component, search bar and category filter component, product details section.

### Week 2
**Day 1 – Cart Management Interface Design**
*   **Sub-Tasks:** Design cart panel layout, create add-to-cart button UI, design quantity control component, design cart summary section.
*   **Deliverables:** Cart interface UI, add-to-cart component, quantity control component, cart summary display.

**Day 2 – Orders Monitoring Interface Design**
*   **Sub-Tasks:** Design orders table layout, create order status display component, create search bar and order filter controls UI, design order details modal/page.
*   **Deliverables:** Orders table page UI, status display component, order filter component and search bar, order details view.

### Week 3
**Day 1 –  Adding Model & Services and Design Product Management Interface**
*   **Sub-Tasks:** 
    * Create order model, product model, and sales model
    * Create order, product, and sales services
    * Design product CRUD (Create, Read, Update, Delete) layouts
    * Create product input forms for adding/editing items
    * Design product management dashboard table with edit/delete actions
*   **Deliverables:** 
    * Order, Product, and Sales models/services
    * High-density table component to list products
    * Product Form (Add/Edit)
    * Table columns: Product Name, Category, Stock Level, Price, and Actions (Edit/Delete)

**Day 2 – Product and Cart Backend Integration**
*   **Sub-Tasks:** Retrieve products from database, implement add-to-cart functionality, implement quantity update logic, calculate cart totals.
*   **Deliverables:** Product retrieval functionality, add-to-cart feature, quantity management logic, cart total computation.

### Week 4
**Day 1 – Order Storage and Management**
*   **Sub-Tasks:** Save order information, store ordered items, generate order records.
*   **Deliverables:** Order saving functionality, order item storage feature, sales transaction records, order status management.

**Day 2 – Payment Processing Integration**
*   **Sub-Tasks:** Validate payment amount, compute customer change, generate payment record.
*   **Deliverables:** Payment validation module, change computation feature, payment records.

### Week 5
**Day 1 – Order Status Monitoring Integration**
*   **Sub-Tasks:** Display updated order statuses, implement status filtering, implement status updates.
*   **Deliverables:** Order monitoring functionality, status update feature, status filter controls.

**Day 2 – Data Validation and Error Handling**
*   **Sub-Tasks:** Validate transaction inputs, handle invalid entries, prevent incomplete orders, display validation messages.
*   **Deliverables:** Input validation rules, error handling mechanism, invalid transaction prevention, validation message component.

### Week 6
**Day 1 – System Integration Testing and Bug Fixing**
*   **Sub-Tasks:** Integrate frontend and backend modules, verify product data flow, verify order transaction flow, fix identified bugs.
*   **Deliverables:** Integrated POS system, product data flow verification, order transaction verification, resolved issues and fixes.

---

## Testing Strategy

*   **Unit Testing:** Product Listing, Card Components, Search/Filter, Cart, Order Status, Payment Validation.
*   **Integration Testing:** Product Retrieval/Cart, Order Creation, Payment Processing, Order Monitoring.
*   **End-to-End Testing:** Complete POS Transaction Flow, Sales Record Generation, Order Status Updates.

---

## Expected Outcome
Upon completion, the Sales and POS Management Module will provide a complete sales transaction solution for Aileen and Niculus Bake Shop, enabling efficient product management, cart handling, order processing, payment recording, sales tracking, order monitoring, and sales record generation.