# Cyber Cloud Kenya - Backend API

A comprehensive backend API for Cyber Cloud Kenya's digital skills and technology platform.

## 🚀 Features

- **User Authentication & Authorization**
- **Contact Form Management**
- **Newsletter Subscription System**
- **Email Notifications**
- **Admin Dashboard**
- **File Upload Support**
- **Rate Limiting & Security**

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cyber-cloud-kenya-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/cybercloudkenya
   JWT_SECRET=your_super_secret_jwt_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Contact Form Endpoints

#### Submit Contact Form
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry about training",
  "message": "I would like to know more about your web development course",
  "service": "web-development"
}
```

#### Get All Contacts (Admin)
```http
GET /api/contact
Authorization: Bearer <token>
```

### Newsletter Endpoints

#### Subscribe to Newsletter
```http
POST /api/newsletter/subscribe
Content-Type: application/json

{
  "email": "john@example.com",
  "name": "John Doe",
  "interests": ["web-development", "graphic-design"]
}
```

#### Unsubscribe from Newsletter
```http
POST /api/newsletter/unsubscribe
Content-Type: application/json

{
  "email": "john@example.com"
}
```

### Admin Endpoints

#### Get Dashboard Statistics
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

#### Send Newsletter
```http
POST /api/admin/newsletter/send
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "subject": "New Course Announcement",
  "content": "<h2>Exciting News!</h2><p>We have launched a new AI course...</p>",
  "targetAudience": "all"
}
```

## 🗂️ Project Structure

```
cyber-cloud-kenya-backend/
├── models/                 # Database models
│   ├── User.js
│   ├── Contact.js
│   └── Newsletter.js
├── routes/                 # API routes
│   ├── auth.js
│   ├── contact.js
│   ├── newsletter.js
│   └── admin.js
├── middleware/             # Custom middleware
│   └── auth.js
├── services/               # Business logic services
│   └── emailService.js
├── PAGES/                  # Static HTML files
├── server.js               # Main application file
├── package.json
├── .env.example
└── README.md
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 📧 Email Configuration

Configure email settings in your `.env` file:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

For Gmail, you'll need to:
1. Enable 2-factor authentication
2. Generate an App Password
3. Use the App Password in EMAIL_PASS

## 🛡️ Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **Password hashing** with bcrypt
- **CORS** configuration
- **JWT authentication**

## 📊 Admin Features

- Dashboard with statistics
- Contact form management
- Newsletter management
- User management
- Email campaign management

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/cybercloudkenya
JWT_SECRET=your_production_secret_key
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start server.js --name "cyber-cloud-kenya"
pm2 startup
pm2 save
```

## 🧪 Testing

```bash
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@cybercloudkenya.com or create an issue in the repository.

---

**Cyber Cloud Kenya** - Empowering digital skills for the future! 🚀