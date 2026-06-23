# Objective 4: AI-Driven Analytics Dashboard using Gemini AI API

**Owner:** Guyala, Jhon Jerick

## Description
The AI-Driven Analytics Dashboard covers the basic KPIs including total sales, expenses, profit, and profit margin. Apart from this, the AI integration of this module covers forecasting of sales and expenses, product trends, and actionable recommendations for sales optimization. 

Additionally, this module matters to the overall capstone project as it highlights AI-driven integration and will significantly benefit the owner in the decision-making process. Lastly, it connects to other members' objectives by fetching data from online ordering, the POS system, and stock inventory management.

## Sprint Task Breakdown

| Week | Day | Task Description | Sub-Tasks | Deliverable(s) | Test Suite / PR Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Week 1** | Day 1 | Setup Admin UI dashboard | - Create a left sidebar component<br>- Create a header component<br>- Implement mobile responsive toggle logic | - Left Sidebar component<br>- Header UI component<br>- Functional hamburger menu for mobile device | - Render the main navigation links (POS, All Orders, Product Management, Inventory, Analytics) in the sidebar.<br>- Point to correct route.<br>- Display the correct header label based on route.<br>- Call `onMenuClick` when the hamburger icon is clicked. |
| **Week 2** | Day 1 | Build the top summary cards (KPIs) | - Make 4 KPI Cards for (Sales, Expenses, Profit, Profit Margin)<br>- Make a timeframe selector for (Day, Week, Month, Year) | - 4 KPI Cards<br>- Timeframe Selector | - Display correctly formatted currency and percentage values passed via mock data.<br>- Trigger timeframe change function with selected value. |
| **Week 2** | Day 2 | Business Performance Metrics | - Make Performance Trend Bar Chart (Sales, Expenses, Profit)<br>- Create Order Volume Heatmap<br>- Make Top 5 Tracking List for best selling products | - Performance Trend Bar Chart<br>- Order Volume Heatmap<br>- Top 5 Products Tracking List | - Correctly calculate and pass Sales, Expenses, and Profit data to the chart.<br>- Render correct order volume numbers when valid data is passed.<br>- Display a clean fallback message when data array is empty for heatmap.<br>- Render ranked items and quantities when valid sales data is passed.<br>- Display a fallback message when the products array is empty. |
| **Week 3** | Day 1 | Timeframe Selector Integration Part 1 | - Timeframe Selector Integration to the 4 KPI Cards | - Integrated Timeframe Selector to the 4 KPI Cards | - Update the 4 KPI Cards (Sales, Expenses, Profit, Profit Margin). |
| **Week 3** | Day 2 | Timeframe Selector Integration Part 2 | - Timeframe Selector Integration to the Performance Trend Bar | - Integrated Timeframe Selector Performance Trend Bar | - Fetch and render new chart data on the Performance Trend Bar when timeframe changes. |
| **Week 4** | Day 1 | Gemini AI Integration | - Integrate Gemini AI API key to the System | - Integrated Gemini AI API | - Successfully execute the AI generation function and return a response. |
| **Week 4** | Day 2 | Database Integration | - Integrate Database to the System | - Integrated Database | - Establish a successful connection to the database. |
| **Week 5** | Day 1 | Build an AI Forecast line chart layout | - Make a forecast line chart capable of showing two metrics (Sales and Expenses) | - AI Forecast Line Chart for (Sales and Expenses) | - Render the forecast chart layout with both Sales and Expenses metrics. |
| **Week 5** | Day 2 | Product Trend Forecasting & Insights | - Make product trend forecasting (Fast moving and At risk products)<br>- Make actionable recommendations for business tips | - Product Trend Forecasting<br>- Actionable Recommendations for Sales Optimization | - Render categories for both Fast Moving and At Risk products.<br>- Successfully display the AI-generated actionable recommendations. |
| **Week 6** | Day 1 | Connect to other Modules / Objectives | - Connect the Analytics Dashboard Module to other Modules/Objectives | - Functional AI-Driven Analytics Dashboard Module | - Successfully render the analytics dashboard displaying consolidated data from the POS, Online Ordering, and Inventory modules. |
