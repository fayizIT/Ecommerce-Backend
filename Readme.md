# DEMO E-commerce Project

## Overview

This E-commerce project is a demonstration of a mini e-commerce platform with distinct user and admin functionalities. The project utilizes React for the frontend, Tailwind CSS for styling, Redux Toolkit for state management, and Redux Thunk middleware for asynchronous API calls.

### Features

#### Admin Page
- Admin registration with a unique key stored in environment variables.
- Admin login and authentication.
- List, unlist, edit, and add products functionality.

#### User Page
- User authentication using JWT with tokens stored in cookies.
- Add, update quantity, and delete products from the user's cart.
- View and list all available products.

## Getting Started

### Prerequisites
- Node.js and npm installed on your machine.
- MongoDB instance with a valid connection string.
- Set up a `.env` file with the required environment variables.

### Installation

1. Clone the repository:
   ```bash
   git clone 
   ```

2. Navigate to the frontend directory and install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Start both the frontend and backend:
   ```bash
   # Inside frontend directory
   npm run dev

   # Inside backend directory
   npm start or npm run server
   ```

5. Access the application at `http://localhost:3000` in your browser.

## Configuration

Make sure to set up the required environment variables in your `.env` file:
```env
NODE_ENV =production
PORT= 5000
MONGO_URI= "mongodb+srv://fayizcj94:fayizcj94@cluster0.yrsrb1d.mongodb.net/"
JWT_SECRET=abc123
ADMIN_KEY= iamadmin
```

## API Documentation

For detailed API documentation for Admin, please refer to the https://documenter.getpostman.com/view/29225438/2s9Yyqj3ML

For detailed API documentation for User, please refer to the https://documenter.getpostman.com/view/29225438/2s9Yyqj3MS

Feel free to explore and contribute to the project! If you have any questions, please refer to the API documentation.