# 🍽️ Mahii - Student Food Marketplace

**Mahii** is a comprehensive food discovery and ordering platform designed specifically for students. It connects students with mess services, cafes, hotels, and food stalls around their campus while providing real student reviews, fixed pricing, and easy subscription management.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Database Models](#database-models)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

### Vision
Simplifying food discovery for students through transparency, digital tools, and real student reviews.

### Key Features
- **Smart Discovery**: Find mess services, cafes, hotels, and stalls near your campus
- **Student Reviews**: Real ratings and feedback from verified students
- **Fixed Pricing**: Transparent, no-surprise billing
- **Subscriptions**: Monthly mess subscription plans with attendance tracking
- **One-Click Ordering**: Fast food ordering with multiple payment options
- **Multi-Language**: Support for English and Marathi
- **Payment Integration**: Razorpay for secure payments
- **Admin Dashboard**: Control over orders, subscriptions, and analytics

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Payment Gateway**: Razorpay
- **Real-time Updates**: Socket.IO
- **File Upload**: Multer
- **Security**: Helmet, CORS, Express Rate Limit
- **Email**: Nodemailer

### Frontend
- **Framework**: React 19.2.5
- **Routing**: React Router v7
- **State Management**: Context API (Auth, Cart, Theme)
- **HTTP Client**: Axios
- **Animation**: Framer Motion
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **UI Components**: Custom React components
- **Data Fetching**: TanStack React Query
- **Notifications**: React Hot Toast
- **Accessibility**: React Helmet Async

### Tools & Standards
- **Package Manager**: npm
- **Development Server**: react-scripts (React), nodemon (Node)
- **Code Formatting**: PostCSS, Autoprefixer
- **Version Control**: Git

---

## 📁 Project Structure

```
mahii/
├── client/                          # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── src/
│   │   ├── App.js                   # Main app component
│   │   ├── App.css
│   │   ├── index.js                 # React DOM root
│   │   ├── index.css
│   │   ├── setupTests.js
│   │   ├── components/              # Reusable UI components
│   │   │   ├── common/
│   │   │   │   └── Navbar.jsx
│   │   │   ├── layout/
│   │   │   └── ui/
│   │   ├── contexts/                # React Context for global state
│   │   │   ├── AuthContext.jsx      # Authentication state
│   │   │   ├── CartContext.jsx      # Shopping cart state
│   │   │   └── ThemeContext.jsx     # Theme state (dark/light)
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Home/landing page
│   │   │   ├── Explore.jsx          # Food discovery page
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   │   ├── CustomerLogin.jsx
│   │   │   │   └── CustomerRegister.jsx
│   │   │   ├── customer/
│   │   │   ├── shop/
│   │   │   │   ├── CafePage.jsx
│   │   │   │   ├── HotelPage.jsx
│   │   │   │   └── MessPage.jsx
│   │   ├── services/
│   │   │   └── api.js               # Axios API client & endpoints
│   │   └── utils/
│   ├── build/                       # Production build output
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── README.md
│
├── server/                          # Node.js Backend
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/                 # Business logic
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── contactController.js
│   │   ├── notificationController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   ├── productController.js
│   │   ├── shopController.js
│   │   └── subscriptionController.js
│   ├── middleware/
│   │   └── authMiddleware.js        # JWT verification
│   ├── models/                      # MongoDB schemas
│   │   ├── Contact.js
│   │   ├── Notification.js
│   │   ├── Order.js
│   │   ├── Payment.js
│   │   ├── Product.js
│   │   ├── Shop.js
│   │   ├── Subscription.js
│   │   └── User.js
│   ├── routes/                      # API routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   ├── productRoutes.js
│   │   ├── shopRoutes.js
│   │   └── subscriptionRoutes.js
│   ├── services/
│   │   └── razorpayService.js       # Razorpay payment gateway
│   ├── validations/                 # Input validation schemas
│   ├── utils/                       # Utility functions
│   ├── .env                         # Environment variables
│   ├── server.js                    # Main server file
│   ├── package.json
│   └── package-lock.json
│
├── package.json                     # Root package.json
├── database.txt                     # Database info
├── system.txt                       # System configuration
└── README.md                        # This file
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v16+ (download from [nodejs.org](https://nodejs.org))
- **npm** v7+ (comes with Node.js)
- **MongoDB Atlas** account (free tier available at [mongodb.com/cloud](https://mongodb.com/cloud))
- **Git** for version control
- **Razorpay Account** (test keys available)

### Step 1: Clone/Setup Project
```bash
# Navigate to project directory
cd mahii

# Install root dependencies (if needed)
npm install
```

### Step 2: Setup Backend
```bash
cd server

# Install backend dependencies
npm install

# Create/configure .env file
# (Already configured with MongoDB Atlas and Razorpay keys)
cat .env
```

**Server .env Variables:**
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=your_razorpay_test_key
RAZORPAY_KEY_SECRET=your_razorpay_test_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OTP_EXPIRE_MINUTES=5
```

### Step 3: Setup Frontend
```bash
cd ../client

# Install frontend dependencies
npm install

# Dependencies will include:
# - react@19.2.5
# - react-router-dom@7.14.0
# - axios (for API calls)
# - tailwindcss@3.4.19
# - framer-motion@12.38.0
# - lucide-react (icons)
# - socket.io-client@4.8.3
```

---

## ▶️ Running the Application

### Option 1: Run Server and Client Separately (Recommended for Development)

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
# Output: ✅ MongoDB Connected
#         🚀 Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
cd client
npm start
# Client runs on http://localhost:3000
# Browser will auto-open
```

### Option 2: Run Production Build
```bash
# Build frontend
cd client
npm run build

# Start server in production mode
cd ../server
NODE_ENV=production npm start
# Visit http://localhost:5000
```

### Available Scripts

**Server:**
- `npm run dev` - Start server with nodemon auto-reload
- `npm start` - Start server in production
- `npm run setup:admin` - Create admin account for testing

**Client:**
- `npm start` - Start development server
- `npm run build` - Create production build
- `npm test` - Run tests
- `npm run eject` - Eject from create-react-app

### Admin Setup for Testing

After starting the server, create an admin account:

```bash
# In server directory
npm run setup:admin
```

**Default Admin Credentials:**
- Email: `admin@mahii.dev`
- Password: `NewAdmin@2026!`

Admin Portal: `http://localhost:3000/login/admin`

📖 see [Admin Credentials Guide](./docs/ADMIN_CREDENTIALS.md) for detailed setup and [Admin Testing Guide](./ADMIN_TESTING.md) for complete testing workflows.

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

### 1. Authentication Endpoints

#### Register Customer
```http
POST /auth/customer/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "9876543210",
  "college": "XYZ University",
  "location": "Pune"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Register Shop Owner
```http
POST /auth/shopowner/register
Content-Type: application/json

{
  "name": "Shop Name",
  "email": "shop@example.com",
  "password": "password",
  "phone": "9876543210",
  "shopName": "My Mess",
  "category": "mess|cafe|hotel|desserts|stalls",
  "address": "Shop Address",
  "latitude": 18.5204,
  "longitude": 73.8567
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Customer Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Admin Login
```http
POST /auth/admin/login
Content-Type: application/json

{
  "email": "admin@mahii.dev",
  "password": "NewAdmin@2026!"
}

Response: { success: true, token: "jwt_token", user: {...} }
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt_token>

Response: { success: true, user: {...} }
```

---

### 2. Shop Endpoints

#### Get Nearby Shops
```http
GET /shops/nearby?lat=18.5204&lng=73.8567&radius=10&category=mess
Authorization: Bearer <jwt_token>

Response: { success: true, shops: [{...}], count: 5 }
```

#### Get Shop by ID
```http
GET /shops/:id
Authorization: Bearer <jwt_token>

Response: { success: true, shop: {...} }
```

#### Create Shop (Shop Owner)
```http
POST /shops
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "My Mess",
  "category": "mess",
  "address": "123 Main St",
  "latitude": 18.5204,
  "longitude": 73.8567,
  "openingHours": "6:00 AM - 10:00 PM",
  "description": "Best mess in campus",
  "cuisineType": ["Indian", "Continental"]
}

Response: { success: true, shop: {...} }
```

---

### 3. Product Endpoints

#### Get Products by Shop
```http
GET /products/shop/:shopId?page=1&limit=10
Authorization: Bearer <jwt_token>

Response: { success: true, products: [...], count: 10 }
```

#### Get Product by ID
```http
GET /products/:id
Authorization: Bearer <jwt_token>

Response: { success: true, product: {...} }
```

#### Search Products
```http
GET /products/search?q=biryani
Authorization: Bearer <jwt_token>

Response: { success: true, products: [...] }
```

---

### 4. Order Endpoints

#### Create Order
```http
POST /orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "product_id",
      "quantity": 2,
      "price": 150
    }
  ],
  "shopId": "shop_id",
  "deliveryAddress": "Hostel Block A",
  "totalAmount": 300,
  "paymentMethod": "razorpay|cash"
}

Response: { success: true, order: {...} }
```

#### Get My Orders
```http
GET /orders/my-orders
Authorization: Bearer <jwt_token>

Response: { success: true, orders: [...] }
```

#### Get Order by ID
```http
GET /orders/:id
Authorization: Bearer <jwt_token>

Response: { success: true, order: {...} }
```

#### Update Order Status (Admin/Shop Owner)
```http
PUT /orders/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "confirmed|preparing|ready|delivered|cancelled"
}

Response: { success: true, order: {...} }
```

---

### 5. Subscription Endpoints

#### Get Plans by Shop
```http
GET /subscriptions/plans/:shopId
Authorization: Bearer <jwt_token>

Response: { success: true, plans: [...] }
```

#### Create Subscription
```http
POST /subscriptions/create
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "shopId": "shop_id",
  "planId": "plan_id",
  "startDate": "2024-04-15",
  "mealType": "breakfast|lunch|dinner|combined"
}

Response: { success: true, subscription: {...} }
```

#### Activate Subscription (After Payment)
```http
POST /subscriptions/activate/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "paymentId": "razorpay_payment_id"
}

Response: { success: true, subscription: {...} }
```

#### Get My Subscriptions
```http
GET /subscriptions/my
Authorization: Bearer <jwt_token>

Response: { success: true, subscriptions: [...] }
```

#### Mark Attendance
```http
POST /subscriptions/attendance
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subscriptionId": "subscription_id",
  "date": "2024-04-15",
  "attended": true
}

Response: { success: true, attendance: {...} }
```

#### Get Attendance History
```http
GET /subscriptions/attendance/:subscriptionId
Authorization: Bearer <jwt_token>

Response: { success: true, attendanceRecords: [...] }
```

#### Cancel Subscription
```http
PUT /subscriptions/:id/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reason": "Cancellation reason"
}

Response: { success: true, subscription: {...} }
```

---

### 6. Payment Endpoints

#### Create Razorpay Order
```http
POST /payments/create-order
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "order_id",
  "amount": 299.99
}

Response: { 
  success: true, 
  razorpayOrder: {
    id: "order_xxx",
    amount: 29999,
    currency: "INR"
  }
}
```

#### Verify Payment
```http
POST /payments/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "razorpay_payment_id": "pay_xxx",
  "razorpay_order_id": "order_xxx",
  "razorpay_signature": "signature"
}

Response: { success: true, payment: {...} }
```

#### Get Payment History
```http
GET /payments/history
Authorization: Bearer <jwt_token>

Response: { success: true, payments: [...] }
```

#### Get Invoice
```http
GET /payments/:paymentId/invoice
Authorization: Bearer <jwt_token>

Response: PDF file download
```

---

### 7. Notification Endpoints

#### Get Notifications
```http
GET /notifications?page=1&limit=10&read=false
Authorization: Bearer <jwt_token>

Response: { success: true, notifications: [...], count: 10 }
```

#### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <jwt_token>

Response: { success: true, notification: {...} }
```

#### Mark All as Read
```http
PUT /notifications/read-all
Authorization: Bearer <jwt_token>

Response: { success: true, message: "All notifications marked as read" }
```

#### Delete Notification
```http
DELETE /notifications/:id
Authorization: Bearer <jwt_token>

Response: { success: true, message: "Notification deleted" }
```

---

### 8. Contact/Support Endpoints

#### Submit Contact Form
```http
POST /contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "subject": "Issue with order",
  "message": "Detailed message",
  "phone": "9876543210"
}

Response: { success: true, message: "Contact form submitted" }
```

---

### 9. Admin Endpoints

#### Get Dashboard Stats
```http
GET /admin/stats
Authorization: Bearer <jwt_token>

Response: {
  success: true,
  stats: {
    totalUsers: 150,
    totalShops: 25,
    totalOrders: 1200,
    totalRevenue: 50000,
    averageRating: 4.5
  }
}
```

---

## 💾 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "customer|shopowner|admin",
  college: String,
  location: String,
  avatar: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Shop Model
```javascript
{
  name: String,
  owner: ObjectId (ref: User),
  category: "mess|cafe|hotel|desserts|stalls",
  address: String,
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  openingHours: String,
  description: String,
  cuisineType: [String],
  rating: Number (0-5),
  reviews: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model
```javascript
{
  name: String,
  shop: ObjectId (ref: Shop),
  description: String,
  price: Number,
  category: String,
  image: String,
  availability: Boolean,
  vegetarian: Boolean,
  quantity: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model
```javascript
{
  customer: ObjectId (ref: User),
  shop: ObjectId (ref: Shop),
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: "pending|confirmed|preparing|ready|delivered|cancelled",
  paymentMethod: "razorpay|cash",
  paymentStatus: "pending|completed|failed",
  deliveryAddress: String,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Subscription Model
```javascript
{
  customer: ObjectId (ref: User),
  shop: ObjectId (ref: Shop),
  plan: {
    name: String,
    price: Number,
    daysPerWeek: Number,
    mealType: "breakfast|lunch|dinner|combined"
  },
  startDate: Date,
  endDate: Date,
  status: "active|paused|cancelled|expired",
  attendanceRecords: [{
    date: Date,
    attended: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Payment Model
```javascript
{
  customer: ObjectId (ref: User),
  order: ObjectId (ref: Order),
  subscription: ObjectId (ref: Subscription),
  amount: Number,
  currency: "INR",
  paymentMethod: "razorpay|upi|card",
  razorpayPaymentId: String,
  razorpayOrderId: String,
  status: "pending|completed|failed|refunded",
  createdAt: Date,
  updatedAt: Date
}
```

---

## ✨ Features

### Customer Features
- ✅ User Registration & Login
- ✅ Find nearby mess/cafe/hotel/stalls
- ✅ Browse products with real-time availability
- ✅ One-click food ordering
- ✅ Monthly subscription plans
- ✅ Attendance tracking for subscriptions
- ✅ Multiple payment methods (Razorpay)
- ✅ Order tracking
- ✅ Review & rating system
- ✅ Favorites/wishlist
- ✅ Notification system
- ✅ Multi-language support (English, Marathi)

### Shop Owner Features
- ✅ Shop registration & management
- ✅ Add products with pricing
- ✅ Create subscription plans
- ✅ View orders & analytics
- ✅ Accept/confirm orders
- ✅ Track daily subscriptions
- ✅ Revenue reporting

### Admin Features
- ✅ Dashboard with analytics
- ✅ User management
- ✅ Shop verification
- ✅ Order monitoring
- ✅ Payment tracking
- ✅ Report generation
- ✅ System configuration

---

## 🔧 Troubleshooting

### Issue: Server won't start - MongoDB connection error
**Solution:**
```bash
# Check MongoDB URI in server/.env
# Ensure MongoDB Atlas cluster is running
# Verify IP whitelist in MongoDB Atlas allows your IP
# Test connection:
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.error(e))"
```

### Issue: Client won't compile - lucide-react error
**Solution:**
```bash
cd client
npm install lucide-react
npm start
```

### Issue: API calls failing - CORS error
**Solution:**
- Server has CORS enabled by default
- Ensure client API URL matches backend port
- Check `client/src/services/api.js` for correct BASE_URL

### Issue: Payment integration not working
**Solution:**
```bash
# Verify Razorpay keys in server/.env
# Use test keys from Razorpay dashboard (https://dashboard.razorpay.com)
# Test mode enabled for development
```

### Issue: Authentication token expired
**Solution:**
- Tokens expire after 7 days (set in JWT_EXPIRE)
- User will be redirected to login
- Session stored in localStorage gets cleared

### Issue: Emails not sending
**Solution:**
```bash
# Gmail requires App Password, not regular password
# Enable 2FA on Google Account first
# Generate App Password from https://myaccount.google.com/apppasswords
# Update EMAIL_USER and EMAIL_PASS in .env
```

---

## 📞 Support & Contact

For issues, feature requests, or support:
- Email: support@mahii.com
- Contact form: `/contact` endpoint
- GitHub Issues: [Project Repository]

---

## 📄 License

This project is licensed under the ISC License - see package.json for details.

---

## 👥 Contributors

- **Lead Developer**: Om Jaunjal
- **Backend Team**: [Contributors]
- **Frontend Team**: [Contributors]

---

**Last Updated:** April 2026
**Version:** 1.0.0
**Status:** Production Ready ✅
