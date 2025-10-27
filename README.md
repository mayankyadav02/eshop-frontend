# eShop Frontend

## Project Overview

eShop Frontend is a React.js application for a full-stack e-commerce platform.
It provides a responsive UI to browse products, manage cart, and complete checkout.
The frontend interacts with backend APIs using Axios and manages global state with Redux.

## Features

- Browse products with search, filter, and sort options.
- View product details.
- Add/remove products to/from cart.
- Persistent cart using Redux + localStorage.
- User authentication (login/register).
- Responsive design for multiple devices.
- Integration with backend APIs for products, users, and orders.

## Tech Stack

- **Frontend:** React.js, Redux, React Router, Axios
- **Styling:** CSS
- **State Management:** Redux Toolkit
- **API Calls:** Axios
- **Environment Variables:** .env

## Installation

Clone the repository:

```bash
git clone https://github.com/mayankyadav02/eshop-frontend.git
```

Install dependencies:
cd eshop-frontend
npm install
Create .env file based on .env.example:
REACT_APP_API_URL=http://localhost:5000/api
Start the development server:
npm start

## Folder Structure

src/
 ├── api/                # Axios instance and API calls
 ├── components/         # Reusable UI components (Navbar, ProductCard, CartItem)
 ├── pages/              # Page-level components (Home, ProductDetail, Cart, Checkout, Login)
 ├── redux/              # Redux slices and store configuration
 ├── App.js              # Application routing
 ├── index.js            # App bootstrap
 └── styles/             # CSS files

## Components Overview

Navbar.js: Header with navigation links and cart badge.

ProductCard.js: Displays individual product information.

Cart.js: Lists products in the cart with quantity controls.

Checkout.js: Handles checkout form and order submission.

Login/Register.js: User authentication forms.

## Usage

Browse products and filter/search by category, price, or rating.

Click on a product for details.

Add items to the cart and proceed to checkout.

Register or login to save your cart and place orders.

## Future Enhancements

Integrate payment gateway (Stripe/PayPal).

Advanced product recommendations.

Lazy loading for better performance.

UI enhancements for responsiveness.

Error handling improvements and notifications.
