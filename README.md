# Izhaiyam eCommerce

**Izhaiyam eCommerce** is a full-stack, luxury e-commerce platform designed for furniture and home decor. It features a premium, responsive user interface, secure authentication, and a robust backend for managing products, orders, and payments.

## ✨ Key Features

- **Storefront**:
    - **Luxury UI/UX**: Designed with a "Heritage • Calm • Confident • Premium" aesthetic using Tailwind CSS and Framer Motion.
    - **Responsive Design**: Fully optimized for Desktop, Tablet, and Mobile devices.
    - **Product Catalog**: Advanced filtering, sorting, and categorization (Featured, Living Room, etc.).
    - **Instagram Gallery**: A custom grid layout to showcase social media content.
    - **Brand Story**: Engaging narrative sections highlighting the brand's heritage.

- **User Features**:
    - **Authentication**: Secure Login, Registration, and Email Verification.
    - **Shopping Cart**: Real-time cart management with stock validation.
    - **Checkout**: Integrated address management and shipping options.
    - **Order Tracking**: Users can track the status of their orders.
    - **Wishlist**: Save favorite items for later.

- **Admin Dashboard**:
    - **Product Management**: Create, read, update, and delete products with image uploads (Cloudinary).
    - **Order Management**: View and update order statuses (Delivery/Payment).
    - **Analytics**: Visualization of sales and stock data.
    - **User Management**: Manage administrative privileges.

## 🛠 Technology Stack

### Frontend
- **Framework**: [React.js](https://reactjs.org/) (v18)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & Redux Persist
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) & [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & React-Chartjs-2
- **Notifications**: React Hot Toast & React Toastify

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: [Cloudinary](https://cloudinary.com/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Security**: Helmet, Cors, Express-Rate-Limit, XSS-Clean
- **Email**: Nodemailer

## 📂 Project Structure

```bash
izhaiyam-eCommerce-off/
├── backend/                # Node.js/Express Backend
│   ├── controllers/        # Request handlers (products, auth, orders, etc.)
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # API route definitions
│   ├── middleware/         # Auth, error handling, file upload middleware
│   ├── db/                 # Database connection logic
│   └── app.js              # Express app entry point
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, Cards)
│   │   ├── pages/          # Full page components (Home, Shop, About, Checkout)
│   │   ├── features/       # Redux slices (cart, user, products)
│   │   ├── assets/         # Static assets (images, logos)
│   │   └── utils/          # Helper functions and constants
│   └── public/             # Public assets and HTML entry point
└── README.md               # Project Documentation
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URL)
- [Git](https://git-scm.com/)

### Environment Variables

You need to set up environment variables for both `backend` and `frontend`.

**Backend (`backend/.env`)**
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/auffur
JWT_SECRET=your_jwt_secret
JWT_LIFETIME=1d
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_key
CLOUD_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=http://localhost:3000
```

**Frontend (`frontend/.env`)**
```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/izhaiyam-ecommerce.git
    cd izhaiyam-eCommerce-off
    ```

2.  **Install Backend Dependencies**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies**
    ```bash
    cd ../frontend
    npm install
    # or if you use legacy peer deps
    npm install --legacy-peer-deps
    ```

### Running the Application

1.  **Start Backend Server**
    ```bash
    # From /backend directory
    npm start
    # Server runs on http://localhost:5000
    ```

2.  **Start Frontend Application**
    ```bash
    # From /frontend directory
    npm run dev
    # Client runs on http://localhost:3000
    ```

## 📡 API Reference

Here is a summary of the main API resources. For full documentation, please refer to the `backend/README.md`.

-   **Auth**: `/api/v1/auth` (Register, Login, Verify Email)
-   **Products**: `/api/v1/products` (Get All, Create, Update, Delete)
-   **Orders**: `/api/v1/orders` (Place Order, Get History)
-   **Admin**: `/api/v1/admin` (Admin stats, User management)
-   **Instagram**: `/api/v1/instagram` (Manage gallery posts)


