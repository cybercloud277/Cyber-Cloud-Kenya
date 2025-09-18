const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');
const newsletterRoutes = require('./routes/newsletter');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from PAGES directory
app.use(express.static(path.join(__dirname, 'PAGES')));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cybercloudkenya', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);

// Serve the main HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'NDEX.HTML'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Services.HTML'));
});

app.get('/training-programs', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Training Programs .HTML'));
});

app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'About Us.HTML'));
});

app.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Contact Us.HTML'));
});

// Training program routes
app.get('/web-development', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Web-Development.html'));
});

app.get('/graphic-design', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Graphic-Design.html'));
});

app.get('/video-editing', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Video-Editing.html'));
});

app.get('/music-production', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Music-Production.html'));
});

app.get('/online-jobs', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Online-Jobs.html'));
});

app.get('/computer-packages', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Computer-Packages.html'));
});

app.get('/robotics-ml', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Robotics-ML.html'));
});

// Service routes
app.get('/web-dev-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Web-Dev-Service.html'));
});

app.get('/graphic-design-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Graphic-Design-Service.html'));
});

app.get('/video-editing-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Video-Editing-Service.html'));
});

app.get('/social-media-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Social-Media-Service.html'));
});

app.get('/cyber-security-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Cyber-Security-Service.html'));
});

app.get('/software-sales-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'PAGES', 'Software-Sales-Service.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;