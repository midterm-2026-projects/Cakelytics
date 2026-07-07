# Objective 3: Stock Inventory Management Module
**Owner:** Christine P. De Padua
**Project:** CakeLytics

## Objective Description
This objective covers the Stock Inventory Management Module of CakeLytics, which enables the business owner to manage all inventory-related information such as raw ingredients, celebration materials, recipes, produced products, and waste. This objective also includes setting up the Supabase authentication system for the owner login and designing the shared database structure that all other modules depend on, making it the foundation of the entire CakeLytics system.

## 5-Week Task Breakdown (Editable Development Plan)

| Week / Day | Task Description | Sub-Tasks (breakdown) | Deliverable(s) | Test Suite / PR Acceptance Criteria |
| :--- | :--- | :--- | :--- | :--- |
| **Week 1 <br> Day 1** | Backend Foundation, Frontend Foundation, Mock Schema, Skeleton Routes, Mock Authentication Service, and Admin Login UI | 1. Set up backend and Frontend project folder structure and install dependencies<br>2. Design the mock database schema covering all inventory tables and attributes<br>3. Build skeleton routes file with stub controllers<br>4. Build the mock authentication service with login and logout functions<br>5. Build the auth middleware that verifies a token before allowing access to protected routes<br>6. Wrap the skeleton routes with the auth middleware<br>7. Build the Admin Login form UI and connect it to the mock authentication service | 1. Backend and Frontend project workspace with folder structure and dependencies installed<br>2. Mock database schema file defining all table structures and attributes<br>3. Skeleton routes with stub controllers<br>4. Mock Authentication service (login, logout)<br>5. Auth middleware function<br>6. Protected skeleton routes<br>7. Admin Login Form component | 1. It should return a valid session token when login is called with correct admin credentials.<br>2. It should reject the login attempt when credentials are incorrect.<br>3. It should reject the login attempt when email or password is missing.<br>4. It should clear the active session when logout is called.<br>5. It should return false from logout when the token does not exist.<br>6. It should return null from verifyToken for an invalid or unknown token.<br>7. It should update the input state when the admin types into the email or password field.<br>8. It should call the mock login function with the entered credentials when the form is submitted.<br>9. It should store the token and call onLogin with the admin info on success.<br>10. It should show an error and not call onLogin when login fails.<br>11. It should show validation errors and not call the login service when fields are empty.<br>12. It should render and run the main application frontend without crashing. <br>13. It should resolve with mock admin data and save the token when credentials match the seed definitions.<br>14. It should reject the login attempt with a validation error when incorrect credentials are provided.<br>15. It should clear the local session token and resolve successfully during a simulated logout request.<br>16. It should call the live fetch endpoint, update local storage tokens, and return data when a network login is successful.<br>17. It should intercept failure states and throw the exact error message returned by the backend API when the server response is invalid.<br>18. It should fire a secure live network fetch to the logout endpoint and completely wipe the local token upon logging out. |
| **Week 2 <br> Day 1** | Creating All backend services of Inventory | 1. Create celebration materials services. <br>2. Create production log services.<br>3. Create recipe log services.<br>4. Create waste log services.<br>5. Create raw ingredients services. | 1. created all inventory services |<br>1. It should return all ingredients successfully.<br>2. It should return an empty array when there are no ingredients.<br>3. It should return an error when findAll fails.<br>4. It should return the created ingredient on success.<br>5. It should return an error when the model fails to create.<br>6. It should return an error when the body is empty or null.<br>7. It should return the updated ingredient on success.<br>8. It should return an error when the ingredient cannot be found during update.<br>9. It should return an error when findById or setStock fails during restock.<br>10. It should handle zero restock quantity without returning an error.<br>11. It should successfully delete the ingredient.<br><br>12. It should return all materials successfully.<br>13. It should return an empty array when there are no materials.<br>14. It should return an error when findAll fails.<br>15. It should return the created material on success.<br>16. It should return an error when the model fails to create.<br>17. It should return an error when the body is empty or null.<br>18. It should return the updated material on success.<br>19. It should return an error when findById or setStock fails during restock.<br>20. It should handle zero restock quantity without returning an error.<br>21. It should successfully delete the material.<br><br>22. It should return all recipes successfully.<br>23. It should return an empty array when there are no recipes.<br>24. It should return an error when findAll fails.<br>25. It should return the recipe when found by id.<br>26. It should return an error when getById cannot find the recipe or if findById fails.<br>27. It should return the created recipe with its ingredients on success.<br>28. It should handle an empty ingredients array without returning an error.<br>29. It should return an error when the recipe row cannot be created or when insertIngredients fails.<br>30. It should clear all ingredients when an empty array is passed on update.<br>31. It should return an error when insertIngredients fails during update.<br>32. It should successfully delete the recipe and return an error when delete fails.<br><br>33. It should return all production logs successfully.<br>34. It should return an empty array when there are no production logs.<br>35. It should return an error when findAll fails.<br>36. It should correctly deduct quantities from both inventory tables based on batch count.<br>37. It should correctly compute the deduction quantity per batch.<br>38. It should only deduct from ingredients when all recipe items are raw.<br>39. It should only deduct from materials when all recipe items are materials.<br>40. It should return an error when insertDeductions fails after log creation.<br>41. It should return the production log on success.<br><br>42. It should return all waste logs successfully.<br>43. It should return an empty array when there are no waste logs.<br>44. It should return an error when findAll fails.<br>45. It should deduct from ingredients and not materials when waste type is ingredient (passing correct name and quantity).<br>46. It should deduct from materials and not ingredients when waste type is material (passing correct name and quantity).<br>47. It should return an error when create fails after ingredient or material deduction.<br>48. It should return the created waste log on success. |
| **Week 2 <br> Day 2** | All Inventory UI Components (Raw Ingredients, Celebration Materials, Recipe Log, Production Log, Waste Log) | 1. Build the Raw Ingredients page with functions for viewing, adding, editing, deleting, and restocking ingredients<br>2. Build the Celebration Materials page with functions for viewing, adding, editing, deleting, and restocking materials<br>3. Build the Recipe Log page with functions for viewing, adding, and deleting recipes, including a shopping list for insufficient stock<br>4. Build the Production Log page with functions for viewing production entries<br>5. Build the Waste Log page with functions for logging ingredient, product, and material waste | 1. Raw Ingredients list page with add/edit/delete/restock forms<br>2. Celebration Materials list page with add/edit/delete/restock forms<br>3. Recipe Log page with add/delete recipe forms and shopping list<br>4. Production Log page with list view<br>5. Waste Log page with logging forms for ingredient, product, and material waste | **RawTab**<br>1. It should render all ingredients from context, including the correct name and stock quantity<br>2. It should fall back to mock ingredient data when context returns an empty array<br>3. It should open the restock modal with the edit-mode label when Restock is clicked<br>4. It should call updateIngredient with the computed new stock (existing stock + added qty) when restocking<br>5. It should call addIngredient with the correct initial data when a new ingredient form is submitted<br>6. It should call deleteIngredient with the correct ingredient id when deletion is confirmed<br>7. It should display the empty-state message when a search query matches zero ingredients<br><br>**CelebrationTab**<br>8. It should render all celebration materials from context with the correct names<br>9. It should fall back to mock data and still display items when context returns an empty array<br>10. It should filter the list to only matching items when a search query is entered<br>11. It should display the empty-state message when a search query matches zero materials<br>12. It should call addMaterial with the correct shape when a new material form is submitted<br>13. It should call updateMaterial with the computed new stock (existing + added qty) when add stock is submitted<br>14. It should call deleteMaterial with the correct material id when deletion is confirmed<br><br>**RecipeTab**<br>15. It should show the shopping list banner when a recipe has insufficient stock<br>16. It should compute stock capacity as floor(stock / ingredientQty) * yield and handle zero capacity<br>17. It should call addRecipe with the correct shape when a new recipe is saved<br>18. It should call deleteRecipe with the correct recipe id when deletion is confirmed<br><br>**ProductLogTab**<br>19. It should render all production log entries from context when data is available<br>20. It should render the produced quantity with the correct unit badge format (+N unit)<br>21. It should fall back to mock data and still render rows when context returns an empty array<br>22. It should display the empty-state message when a search query matches zero production records<br>23. It should display the no-records empty-state message when logs are present but the search matches nothing<br>24. It should show pagination and still filter correctly when more than 10 logs are loaded<br><br>**WasteTab**<br>25. It should call logWaste with the estimated cost computed as costPerUnit * qty when logging ingredient waste<br>26. It should call logWaste with the estimated cost computed correctly when logging product waste<br>27. It should call logWaste with the estimated cost computed as costPerUnit * qty when logging material waste<br>28. It should display the no-records empty state when the logs array is empty and the search returns no results |
| **Week 3 <br> Day 1** | Connecting the Database to the Backend and Authentication | 1. Set up the Supabase client configuration to connect the backend to the real database<br>2. Rebuild the Auth model to query the real database instead of mock data<br>3. Rebuild the Auth service to sign in through the database and issue a JWT-based session<br>4. Rebuild the Auth controller to validate input and handle real database responses<br>5. Rebuild the Auth route and connect it with the JWT-based authentication middleware | 1. Supabase config connected to the backend<br>2. Auth model with real database queries<br>3. Auth service with database-based login and JWT session<br>4. Auth controller with validation and error handling<br>5. Auth route protected by JWT middleware | **Database Connection**<br>1. It should successfully connect to the database<br><br>**AuthModel**<br>2. It should return an error when signing in with an invalid email format<br>3. It should return an error when signing in with a non-existent email<br>4. It should return an error when signing in with a wrong password<br>5. It should return an error when fetching an admin with a non-existent id<br>6. It should return an error when fetching an admin with an invalid uuid format<br><br>**AuthService**<br>7. It should return a token and admin data when login is successful<br>8. It should throw when signIn fails<br>9. It should throw when signIn succeeds but no matching admin record exists<br>10. It should return admin data when getProfile succeeds<br>11. It should throw when getProfile cannot find the admin<br><br>**AuthController**<br>12. It should call ok() when login is successful<br>13. It should return 401 when a credential error is thrown<br>14. It should call next() for other unknown errors<br>15. It should call ok() to clear the session<br>16. It should call ok() with admin profile data<br>17. It should call next() when getProfile throws an error<br><br>**Auth Routes**<br>18. POST /auth/login should return 401 when logging in with invalid credentials<br>19. POST /auth/login should return 200 and a token when logging in with valid credentials<br>20. GET /auth/me should return 401 when accessing without a token<br>21. GET /auth/me should return 200 when accessing with a valid token<br>22. POST /auth/logout should return 200 when logging out with a valid token<br>23. POST /auth/logout should return 401 when logging out without a token |
| **Week 3 <br> Day 2** | Production Log (Backend + Frontend) | 1. Add mock data for production logs<br>2. Build the functions for viewing and adding a production log, including deducting stock used<br>3. Connect those functions to a route<br>4. Add a check that blocks saving if there isn't enough stock<br>5. Build the page that shows the production log form and history | 1. Mock production log data<br>2. Production log functions (view, add, stock deduction)<br>3. Production log route<br>4. Stock check before saving<br>5. Production log page | 1. It should show all the production log entries<br>2. It should correctly reduce the ingredient stock when a production entry is saved<br>3. It should block saving and show an error if there isn't enough stock<br>4. It should add a new production log entry correctly<br>5. It should show all production entries on the page<br>6. It should add a new entry correctly when the form is submitted |
| **Week 4 <br> Day 1** | Waste Log (Backend + Frontend) | 1. Add mock data for waste logs<br>2. Build the functions for viewing and adding a waste log, including deducting stock used<br>3. Connect those functions to a route<br>4. Add a filter for viewing waste logs by date<br>5. Build the page that shows the waste log form and history | 1. Mock waste log data<br>2. Waste log functions (view, add, stock deduction)<br>3. Waste log route<br>4. Date filter<br>5. Waste log page | 1. It should show all the waste log entries<br>2. It should correctly reduce the right stock (ingredient, material, or product) when a waste entry is saved<br>3. It should add a new waste entry correctly, and show an error if some info is missing<br>4. It should only show entries within the selected date range when filtered<br>5. It should show all waste entries on the page<br>6. It should add a new entry correctly when the form is submitted |
| **Week 4 <br> Day 2** | Connecting to the Real Database | 1. Set up the connection to the real database<br>2. Test that the connection works<br>3. Switch Raw Ingredients and Celebration Materials to use the real database instead of mock data<br>4. Switch Recipe, Production Log, and Waste Log to use the real database instead of mock data<br>5. Re-check all previous tests still work with the real database | 1. Real database connection setup<br>2. Connection test<br>3. Ingredients and Materials using real data<br>4. Recipe, Production, and Waste Log using real data<br>5. Updated test results | 1. It should connect to the real database successfully<br>2. It should show an error if the connection details are wrong<br>3. It should add, view, edit, and delete real ingredient and material records correctly<br>4. It should add, view, edit, and delete real recipe, production, and waste records correctly, including correct stock deductions<br>5. It should pass all the same tests from before, but now using real data<br>6. It should have no failing tests after switching to the real database |
| **Week 5 <br> Day 1** | Connecting Frontend to Backend | 1. Connect all the inventory pages to the real backend<br>2. Check that adding, editing, and deleting works properly end to end<br>3. Check that the list pages update correctly after changes<br>4. Check that recipes, production, and waste logs correctly affect stock numbers<br>5. Fix any issues found while connecting | 1. Inventory pages connected to backend<br>2. Working add/edit/delete across all pages<br>3. Updated list views<br>4. Verified stock changes<br>5. Bug fixes | 1. It should correctly send and receive data between each page and the backend<br>2. It should update the list immediately after adding, editing, or deleting something<br>3. It should correctly reduce stock after a production or waste entry is saved<br>4. It should have no failing tests before moving to the next testing stage |
| **Week 5 <br> Day 2** | Full Workflow Testing | 1. Test the full process from logging in to managing ingredients and materials<br>2. Test the full process of creating a recipe<br>3. Test the full process of logging production and checking stock changes<br>4. Test the full process of logging waste and checking stock changes<br>5. Test that all the inventory pages can be navigated properly | 1. Full test: login + ingredients/materials<br>2. Full test: recipe creation<br>3. Full test: production log<br>4. Full test: waste log<br>5. Full test: page navigation | 1. It should complete the whole process from login to managing ingredients without errors<br>2. It should complete the whole process of creating a recipe without errors<br>3. It should complete the whole process of logging production and correctly update stock<br>4. It should complete the whole process of logging waste and correctly update stock<br>5. It should go to the right page when each tab or link is clicked |
| **Week 6 <br> Day 1** | Final Fixes and Testing | 1. Add proper error messages for missing or wrong information across all forms<br>2. Run a check for code issues and fix them<br>3. Run the full test of the whole inventory system<br>4. Fix any remaining bugs found<br>5. Go through the checklist to make sure everything required is done | 1. Validated forms across all pages<br>2. Clean code with no issues<br>3. Full system test results<br>4. Bug fixes<br>5. Completed checklist | 1. It should show an error if required information is missing or invalid<br>2. It should have no code issues found<br>3. It should complete the whole inventory process without errors<br>4. It should have no failing tests before submitting the pull request<br>5. It should meet everything on the checklist before merging |









## Objective #: 3
**Owner (Member Name):** Christine P. De Padua  
**Objective Title:** Stock Inventory Management Module  
**Objective Description:** This objective covers the Stock Inventory Management Module of CakeLytics, which enables the business owner to manage all inventory-related information such as raw ingredients, celebration materials, recipes, produced products, and waste. This objective also includes setting up the Supabase authentication system for the owner login and designing the shared database structure that all other modules depend on, making it the foundation of the entire CakeLytics system.

---

### 6-Week Task Breakdown

#### Week 1 / Day 1
* **Task Description:** Backend Foundation, Frontend Foundation, Mock Schema, Skeleton Routes, Mock Authentication Service, and Admin Login UI.
* **Sub-Tasks:**
    1. Set up backend and Frontend project folder structure and install dependencies.
    2. Design the mock database schema covering all inventory tables and attributes.
    3. Build skeleton routes file with stub controllers.
    4. Build the mock authentication service with login and logout functions.
    5. Build the auth middleware that verifies a token before allowing access to protected routes.
    6. Wrap the skeleton routes with the auth middleware.
    7. Build the Admin Login form UI and connect it to the mock authentication service.
* **Deliverable(s):**
    1. Backend and Frontend project workspace with folder structure and dependencies installed.
    2. Mock database schema file defining all table structures and attributes.
    3. Skeleton routes with stub controllers.
    4. Mock Authentication service (login, logout).
    5. Auth middleware function.
    6. Protected skeleton routes.
    7. Admin Login Form component.
* **Test Suite / PR Acceptance Criteria:**
    * It should return a valid session token when login is called with correct admin credentials.
    * It should reject the login attempt when credentials are incorrect.
    * It should reject the login attempt when email or password is missing.
    * It should clear the active session when logout is called.
    * It should return false from logout when the token does not exist.
    * It should return null from verifyToken for an invalid or unknown token.
    * It should update the input state when the admin types into the email or password field.
    * It should call the mock login function with the entered credentials when the form is submitted.
    * It should store the token and call onLogin with the admin info on success.
    * It should show an error and not call onLogin when login fails.
    * It should show validation errors and not call the login service when fields are empty.
    * It should run the main application shell without crashing. 

#### Week 2 / Day 1
* **Task Description:** Creating All services of Inventory and Inventory sub pages UI.
* **Sub-Tasks:**
    1. Create celebration materials services.
    2. Create production log services.
    3. Create recipe log services.
    4. Create waste log services.
    5. Create raw ingredients services.
* **Deliverable(s):**
    1. Created all inventory services.
* **Test Suite / PR Acceptance Criteria:**
    1. should fetch all records correctly.
    2. should compute and update stock properly on restock.
    3. should add a new material successfully.
    4. should successfully calculate batch multipliers and update ledger tables.
    5. should orchestrate recipe creation and component listing entry.
    6. should automatically process inventory deduction when target is raw ingredient.

#### Week 2 / Day 2
* **Task Description:** Raw Ingredients (Backend + Frontend).
* **Sub-Tasks:**
    1. Add mock data for raw ingredients.
    2. Build the functions for adding, viewing, editing, deleting, and restocking ingredients.
    3. Connect those functions to a route.
    4. Build the page that shows the list of ingredients.
    5. Build the forms for adding, editing, and deleting an ingredient.
* **Deliverable(s):**
    1. Mock ingredient data.
    2. Ingredient functions (view, add, edit, delete, restock).
    3. Ingredient route.
    4. Ingredient list page.
    5. Add/edit/delete ingredient forms.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show all the ingredients when viewing the list.
    2. It should add a new ingredient correctly, and show an error if some info is missing.
    3. It should update an ingredient correctly when edited.
    4. It should remove an ingredient correctly when deleted.
    5. It should increase the stock number correctly when restocked.
    6. It should show all ingredients on the page, and properly add/edit/delete them when using the forms.

#### Week 3 / Day 1
* **Task Description:** Celebration Materials (Backend + Frontend).
* **Sub-Tasks:**
    1. Add mock data for celebration materials.
    2. Build the functions for adding, viewing, editing, deleting, and restocking materials.
    3. Connect those functions to a route.
    4. Build the page that shows the list of materials.
    5. Build the forms for adding, editing, and deleting a material.
* **Deliverable(s):**
    1. Mock material data.
    2. Material functions (view, add, edit, delete, restock).
    3. Material route.
    4. Material list page.
    5. Add/edit/delete material forms.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show all the materials when viewing the list.
    2. It should add a new material correctly, and show an error if some info is missing.
    3. It should update a material correctly when edited.
    4. It should remove a material correctly when deleted.
    5. It should increase the stock number correctly when restocked.
    6. It should show all materials on the page, and properly add/edit/delete them when using the forms.

#### Week 3 / Day 2
* **Task Description:** Recipe Log (Backend + Frontend).
* **Sub-Tasks:**
    1. Add mock data for recipes, including their ingredients.
    2. Build the functions for adding, viewing, editing, and deleting recipes.
    3. Connect those functions to a route.
    4. Build the page that shows the list of recipes.
    5. Build the form for adding a recipe with its ingredients.
* **Deliverable(s):**
    1. Mock recipe data.
    2. Recipe functions (view, add, edit, delete).
    3. Recipe route.
    4. Recipe list page.
    5. Add recipe form with ingredients.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show all the recipes when viewing the list.
    2. It should add a new recipe correctly with its ingredients, and show an error if no ingredients are added.
    3. It should update a recipe correctly when edited.
    4. It should remove a recipe correctly when deleted.
    5. It should show all recipes on the page.
    6. It should add a new recipe correctly when the form is submitted, and show its ingredients properly.

#### Week 4 / Day 1
* **Task Description:** Production Log (Backend + Frontend).
* **Sub-Tasks:**
    1. Add mock data for production logs.
    2. Build the functions for viewing and adding a production log, including deducting stock used.
    3. Connect those functions to a route.
    4. Add a check that blocks saving if there isn't enough stock.
    5. Build the page that shows the production log form and history.
* **Deliverable(s):**
    1. Mock production log data.
    2. Production log functions (view, add, stock deduction).
    3. Production log route.
    4. Stock check before saving.
    5. Production log page.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show all the production log entries.
    2. It should correctly reduce the ingredient stock when a production entry is saved.
    3. It should block saving and show an error if there isn't enough stock.
    4. It should add a new production log entry correctly.
    5. It should show all production entries on the page.
    6. It should add a new entry correctly when the form is submitted.

#### Week 4 / Day 2
* **Task Description:** Waste Log (Backend + Frontend).
* **Sub-Tasks:**
    1. Add mock data for waste logs.
    2. Build the functions for viewing and adding a waste log, including deducting stock used.
    3. Connect those functions to a route.
    4. Add a filter for viewing waste logs by date.
    5. Build the page that shows the waste log form and history.
* **Deliverable(s):**
    1. Mock waste log data.
    2. Waste log functions (view, add, stock deduction).
    3. Waste log route.
    4. Date filter.
    5. Waste log page.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show all the waste log entries.
    2. It should correctly reduce the right stock (ingredient, material, or product) when a waste entry is saved.
    3. It should add a new waste entry correctly, and show an error if some info is missing.
    4. It should only show entries within the selected date range when filtered.
    5. It should show all waste entries on the page.
    6. It should add a new entry correctly when the form is submitted.

#### Week 5 / Day 1
* **Task Description:** Connecting to the Real Database.
* **Sub-Tasks:**
    1. Set up the connection to the real database.
    2. Test that the connection works.
    3. Switch Raw Ingredients and Celebration Materials to use the real database instead of mock data.
    4. Switch Recipe, Production Log, and Waste Log to use the real database instead of mock data.
    5. Re-check all previous tests still work with the real database.
* **Deliverable(s):**
    1. Real database connection setup.
    2. Connection test.
    3. Ingredients and Materials using real data.
    4. Recipe, Production, and Waste Log using real data.
    5. Updated test results.
* **Test Suite / PR Acceptance Criteria:**
    1. It should connect to the real database successfully.
    2. It should show an error if the connection details are wrong.
    3. It should add, view, edit, and delete real ingredient and material records correctly.
    4. It should add, view, edit, and delete real recipe, production, and waste records correctly, including correct stock deductions.
    5. It should pass all the same tests from before, but now using real data.
    6. It should have no failing tests after switching to the real database.

#### Week 5 / Day 2
* **Task Description:** Full Workflow Testing.
* **Sub-Tasks:**
    1. Test the full process from logging in to managing ingredients and materials.
    2. Test the full process of creating a recipe.
    3. Test the full process of logging production and checking stock changes.
    4. Test the full process of logging waste and checking stock changes.
    5. Test that all the inventory pages can be navigated properly.
* **Deliverable(s):**
    1. Full test: login + ingredients/materials.
    2. Full test: recipe creation.
    3. Full test: production log.
    4. Full test: waste log.
    5. Full test: page navigation.
* **Test Suite / PR Acceptance Criteria:**
    1. It should complete the whole process from login to managing ingredients without errors.
    2. It should complete the whole process of creating a recipe without errors.
    3. It should complete the whole process of logging production and correctly update stock.
    4. It should complete the whole process of logging waste and correctly update stock.
    5. It should go to the right page when each tab or link is clicked.

#### Week 6 / Day 1
* **Task Description:** Final Fixes and Testing.
* **Sub-Tasks:**
    1. Add proper error messages for missing or wrong information across all forms.
    2. Run a check for code issues and fix them.
    3. Run the full test of the whole inventory system.
    4. Fix any remaining bugs found.
    5. Go through the checklist to make sure everything required is done.
* **Deliverable(s):**
    1. Validated forms across all pages.
    2. Clean code with no issues.
    3. Full system test results.
    4. Bug fixes.
    5. Completed checklist.
* **Test Suite / PR Acceptance Criteria:**
    1. It should show an error if required information is missing or invalid.
    2. It should have no code issues found.
    3. It should complete the whole inventory process without errors.
    4. It should have no failing tests before submitting the pull request.
    5. It should meet everything on the checklist before merging.