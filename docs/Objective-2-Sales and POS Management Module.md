# Sales and POS Management Module

## Objective Information

**Objective #:** 2
**Owner:** Princes Margareth Latiza
**Objective Title:** Sales and POS Management Module

## Objective Description

This project focuses on developing a **Sales and Point of Sale (POS) Management Module** for **Aileen and Niculus Bake Shop**. The module enables business owners to manage daily sales operations efficiently by providing functionalities such as product viewing, cart management, payment processing, order monitoring, sales tracking, and sales record generation.

The system supports the complete sales transaction workflow, from product selection and order processing to payment recording, order management, sales tracking, and sales record generation.

---

# Features

## Product Management

* Display available bakery products
* Product search functionality
* Product category filtering
* Product details viewing

## Cart Management

* Add products to cart
* Update product quantities
* Remove products from cart
* Display cart summary and totals

## Order Management

* Monitor walk-in and online orders
* View order details
* Filter and search orders
* Update order status

## Payment Processing

* Validate customer payments
* Compute customer change
* Generate payment records
* Save transaction information

## Sales Tracking

* Store sales records
* Generate transaction history
* Monitor completed sales

## System Integration

* Frontend and backend integration
* Product data synchronization
* Order transaction verification
* End-to-end sales transaction workflow

---

# Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS

## Backend

* Node.js
* Express.js

## Database

* MySQL

## Testing

* Vitest
* React Testing Library

---

# Development Timeline

## Week 1

### Day 1 – POS Product Listing Interface Design

#### Sub-Tasks

* Design POS product listing layout
* Create product card component
* Create search bar and product category filter UI
* Design product details display

#### Deliverables

* Product listing page UI
* Product card component
* Search bar and category filter component
* Product details section

#### Acceptance Criteria

* It should display the product listing page correctly.
* It should display product cards properly and in the correct layout.
* It should display the search bar and category filter component without UI issues.
* It should display the product details section clearly and correctly.

---

## Week 2

### Day 1 – Cart Management Interface Design

#### Sub-Tasks

* Design cart panel layout
* Create add-to-cart button UI
* Design quantity control component
* Design cart summary section

#### Deliverables

* Cart interface UI
* Add-to-cart component
* Quantity control component
* Cart summary display

#### Acceptance Criteria

* It should display the cart panel correctly.
* It should display the add-to-cart buttons properly.
* It should display the quantity control component without errors.
* It should display the cart summary section correctly.

### Day 2 – Orders Monitoring Interface Design

#### Sub-Tasks

* Design orders table layout
* Create order status display component
* Create search bar and order filter controls UI
* Design order details modal/page

#### Deliverables

* Orders table page UI
* Status display component
* Order filter component and search bar
* Order details view

#### Acceptance Criteria

* It should display the orders table correctly.
* It should display the order status component properly.
* It should display the search bar and order filter controls without UI issues.
* It should display order details correctly.

---

## Week 3

### Day 1 – Database Configuration

#### Sub-Tasks

* Create products table
* Create orders table
* Configure database connection
* Configure environment variables

#### Deliverables

* Products table schema
* Orders table schema
* Database connection setup
* Environment configuration

#### Acceptance Criteria

* It should retrieve records from the products table without errors.
* It should establish the database connection without errors.
* It should load environment variables correctly.
* It should complete the backend configuration successfully.

### Day 2 – Product and Cart Backend Integration

#### Sub-Tasks

* Retrieve products from database
* Implement add-to-cart functionality
* Implement quantity update logic
* Calculate cart totals

#### Deliverables

* Product retrieval functionality
* Add-to-cart feature
* Quantity management logic
* Cart total computation

#### Acceptance Criteria

* It should display products from the database correctly.
* It should add products to cart successfully.
* It should update quantities correctly.
* It should calculate totals accurately.

---

## Week 4

### Day 1 – Order Storage and Management

#### Sub-Tasks

* Save order information
* Store ordered items
* Generate order records

#### Deliverables

* Order saving functionality
* Order item storage feature
* Sales transaction records
* Order status management

#### Acceptance Criteria

* It should save order records successfully.
* It should save ordered items correctly.
* It should retrieve order records properly.

### Day 2 – Payment Processing Integration

#### Sub-Tasks

* Validate payment amount
* Compute customer change
* Generate payment record

#### Deliverables

* Payment validation module
* Change computation feature
* Payment records

#### Acceptance Criteria

* It should validate payment amounts correctly.
* It should compute customer change accurately.
* It should store payment records successfully.

---

## Week 5

### Day 1 – Order Status Monitoring Integration

#### Sub-Tasks

* Display updated order statuses
* Implement status filtering
* Implement status updates

#### Deliverables

* Order monitoring functionality
* Status update feature
* Status filter controls

#### Acceptance Criteria

* It should display updated order statuses correctly.
* It should filter orders by status successfully.
* It should update order status records properly.

### Day 2 – Data Validation and Error Handling

#### Sub-Tasks

* Validate transaction inputs
* Handle invalid entries
* Prevent incomplete orders
* Display validation messages

#### Deliverables

* Input validation rules
* Error handling mechanism
* Invalid transaction prevention
* Validation message component

#### Acceptance Criteria

* It should validate transaction inputs correctly.
* It should display error messages for invalid entries.
* It should prevent incomplete orders from being submitted.
* It should display validation messages correctly.

---

## Week 6

### Day 1 – System Integration Testing and Bug Fixing

#### Sub-Tasks

* Integrate frontend and backend modules
* Verify product data flow
* Verify order transaction flow
* Fix identified bugs

#### Deliverables

* Integrated POS system
* Product data flow verification
* Order transaction verification
* Resolved issues and fixes

#### Acceptance Criteria

* It should complete a full POS transaction from product selection to payment successfully.
* It should retrieve and display product data correctly.
* It should save and display order transaction records correctly.
* It should resolve identified issues without affecting existing system functionality.

---

# Testing Strategy

## Unit Testing

* Product Listing Components
* Product Card Component
* Search and Filter Components
* Cart Components
* Order Status Components
* Payment Validation Functions

## Integration Testing

* Product Retrieval and Cart Workflow
* Order Creation and Storage
* Payment Processing
* Order Monitoring

## End-to-End Testing

* Complete POS Transaction Flow
* Product Selection → Cart → Payment → Order Storage
* Sales Record Generation
* Order Status Updates

---

# Expected Outcome

Upon completion, the Sales and POS Management Module will provide a complete sales transaction solution for Aileen and Niculus Bake Shop, enabling efficient product management, cart handling, order processing, payment recording, sales tracking, order monitoring, and sales record generation.
