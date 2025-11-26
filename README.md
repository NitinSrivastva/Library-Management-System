# Library-Management-System

    This is the library management API Backend for the management of users and the books

# Routes and Endpoints

## /users
GET: Get all the list of the users in the system
POST: Create/Register new user

## /users/{id}
GET: Get a user by their ID
PUT: Updatting a user by their ID 
DELETE: Deleting a user by their ID (Check if the user still has an issued book) && {is there any fine/penalty to be collected}

## /users/subscription-details/{id}
GET: Get a user subscription details by their ID 
    >> Date of subscription
    >> Valid till ?
    >> Fine if any ?




## /books
GET: Get all the books in the system
POST: Add a new book to the system

## /books/{id}
GET: Get a book by it's ID
PUT: Update a book by it's ID
DELETE: Delete a book by it's ID

## /books/issued
GET: Get all the issued books

## /books/issued/withFine
GET: Get all the issued books with their fine amount 

### Subscription Types
    >> Basic Subscription(3 months)
    >> Standard Subscription(6 months)
    >> Premium Subscription (12 months)

    >> If a user missed the renewal date, then user should collected with $100
    >> If a user missed his subscription, then user is expected to pay $100
    >> If a user missed both renewal & subscription, then the collected amount should be $200

## Command
npm init
npm i express
npm i nodemon --save-dev

npm run dev

To  restore the node_modules and package-lock.json  ---> npm i/npm install
