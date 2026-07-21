# Sales and POS Management Module

## Project Overview

This repository contains the development of the **Sales and POS Management Module** for the **Aileen and Niculus Bake Shop Online Ordering System**. The module enables product browsing, order management, payment processing, inventory synchronization, and sales monitoring through an integrated frontend and backend architecture.

---

## Development Timeline & Progress

### Week 1

* **Day 1 – POS Product Listing Interface Design**
* **Tasks:** Design POS product listing layout, create Product Card component, create Search Bar component, create Product Category Filter UI, design Product Details display.
* **Deliverables:** POS Product Listing Page, Product Card Component, Search Bar Component, Category Filter Component, Product Details Section.
* **Test Cases:** Render Point of Sale title, display user initials, toggle notification badge based on count, format current date/time, display products and categories, highlight active category, handle `setActiveCategory`, render search input, handle `searchTerm`, and display product attributes (name, stock status, description, price).



### Week 2

* **Day 1 – Cart Management Interface Design**
* **Tasks:** Design cart panel layout, create Add-to-Cart button, design Quantity Control component, design Cart Summary section.
* **Deliverables:** Cart Interface, Add-to-Cart Component, Quantity Controls, Cart Summary.
* **Test Cases:** Verify empty/populated cart layouts, verify sidebar sections (Current Order, Pre-order, Item List, Subtotal, Grand Total), check Add button role and clickability, test `"+"`, `"-"`, and `updateQuantity()` handlers, and verify calculations for Subtotal, Additional Fee, Discount, and Grand Total.


* **Day 2 – Orders Monitoring Interface Design**
* **Tasks:** Design Orders Table, create Status Display Component, create Search Bar, create Filter Controls, design Order Details Modal.
* **Deliverables:** Orders Table, Status Component, Search Bar, Filter Controls, Order Details View.
* **Test Cases:** Verify Orders Table rendering, display Order IDs, check order list interactions, display status component, verify search and pagination via test files, and verify `onViewDetails()` execution.



### Week 3

* **Day 1 – Models, Services and Product Management Interface**
* **Tasks:**
* *Backend:* Configure database connection and environment variables; create Order, Product, and Sales Models; create Order, Product, and Sales Services.
* *Frontend:* Design Product CRUD Layout, create Product Form, design Product Management Table.


* **Deliverables:** Database Connection, Environment Configuration, Models, Services, Product Management Page, Product Form, Dashboard Table.
* **Test Cases:** Verify database connection, environment loading, unit tests for models and services, product management page loading, CRUD interface workflow, input validation on forms, submit/cancel functionality, dashboard table rendering, and edit/delete actions (form opening and confirmation dialogs).


* **Day 2 – Product and Cart Backend Integration**
* **Tasks:** Retrieve products from database, add products to cart, update cart quantities, compute totals.
* **Deliverables:** Product Retrieval, Add-to-Cart, Quantity Management, Cart Total Computation.
* **Test Cases:** Display products from database, add products successfully, update quantities correctly, and calculate totals accurately.



### Week 4

* **Day 1 – Order Storage and Management**
* **Tasks:** Save order information, store ordered items, generate order records.
* **Deliverables:** Order Saving, Order Item Storage, Sales Transaction Records, Order Status Management.
* **Test Cases:** Save order successfully, store ordered items, and retrieve order records.


* **Day 2 – Payment Processing Integration (Products Edit/Delete)**
* **Main Tasks:** Validate payment amount, compute customer change, generate payment record, update/delete products.
* **Subtasks:**
* *Payment Validation:* Validate cash payment, prevent payment lower than total, validate input format, handle empty inputs and invalid values.
* *Change Computation:* Compute change automatically, update dynamically, display zero change when equal, prevent negative values.
* *Payment Record Management:* Save payment to database, associate with order, generate unique reference, record timestamp, store payment method, update status.
* *Product Edit/Delete Integration:* Update/delete products in database, refresh product lists/dashboard, display confirmation dialogs, prevent accidental deletion.


* **Deliverables:** Payment Validation Module, Change Computation Feature, Payment Records, Product Edit/Delete Functions.
* **Test Cases:** Validate payment amounts, compute customer change, store payment records, and successfully edit/delete products.



### Week 5

* **Day 1 – Order Status Monitoring Integration**
* **Tasks:** Display updated order statuses, implement status filtering, implement status updates.
* **Deliverables:** Order Monitoring, Status Updates, Status Filter Controls.
* **Test Cases:** Display updated statuses, filter orders successfully, and update order status records.


* **Day 2 – POS Handlers and Index Integration**
* **Main Tasks:** Validate transaction inputs, handle invalid entries, prevent incomplete orders, display validation messages, integrate POS handlers into index.
* **Subtasks:**
* *POS Handlers:* Create transaction, add-to-cart, remove-from-cart, quantity update, checkout, payment, order submission handlers, and transaction success/failure callbacks.
* *Validation:* Validate customer info, products, payment amount, order type, payment method, and required fields.
* *Error Handling:* Handle backend failures, API timeouts, network errors, duplicate submissions, unavailable products, and display user-friendly messages.
* *Index Integration:* Export POS handlers, import into index, register correctly, ensure module exports and clean application startup.
* *Validation Messages:* Display field errors, highlight invalid inputs, show checkout messages, clear messages after correction.


* **Deliverables:** Input Validation Rules, Error Handling Mechanism, Transaction Prevention, Validation Message Components, POS Handler Integration.
* **Test Cases:** Validate transaction inputs, display invalid entry errors, prevent incomplete orders, show validation messages, and verify handler imports and execution.



### Week 6

* **Day 1 – System Integration Testing and Bug Fixing**
* **Tasks:** Integrate frontend and backend, verify inventory synchronization, verify analytics synchronization, fix identified bugs.
* **Deliverables:** Integrated POS System, Inventory Integration, Analytics Integration, Bug Fixes.
* **Test Cases:** Complete POS transactions successfully, synchronize inventory after checkout, update analytics reports correctly, and resolve bugs without regression.



---

## Technologies Used

* **Frontend:**
* React
* Vite
* Tailwind CSS
* Axios
* React Router
* Lucide React


* **Backend:**
* Node.js
* Express.js
* Supabase


* **Database:**
* PostgreSQL (Supabase)


* **Testing:**
* Vitest
* React Testing Library
* Jest DOM
* MSW (Mock Service Worker)



---

## Project Modules

* POS Product Listing
* Cart Management
* Orders Monitoring
* Product Management (CRUD)
* Product & Cart Backend Integration
* Order Storage
* Payment Processing
* Order Status Monitoring
* POS Handlers & Validation
* Inventory Integration
* Analytics Integration
* System Integration Testing & Bug Fixing