const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const session = require('express-session');
const { authMiddleware, authController } = require('./auth.js');
const fs = require('fs');

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Middleware
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.json());

// Create the database directory if it doesn't exist
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Session middleware (MUST come before using req.session)
app.use(session({
  secret: 'your-secret-key', // Change this to a random string in production
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 } // 1 hour
}));

// Make user info available to all templates
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Auth routes
app.get('/login', authMiddleware.isNotAuthenticated, authController.getLogin);
app.post('/login', authMiddleware.isNotAuthenticated, authController.postLogin);
app.get('/signup', authMiddleware.isNotAuthenticated, authController.getSignup);
app.post('/signup', authMiddleware.isNotAuthenticated, authController.postSignup);
app.get('/logout', authController.logout);

// Add these modified routes to work with your existing HTML extension routes
app.get('/login.html', authMiddleware.isNotAuthenticated, authController.getLogin);
app.get('/signup.html', authMiddleware.isNotAuthenticated, authController.getSignup);

// Add this profile route with the existing routes
app.get('/profile', authMiddleware.isAuthenticated, (req, res) => {
  console.log('Profile route accessed by user:', req.session.user);
  res.render('profile', { 
    title: 'My Profile',
    user: req.session.user
  });
});

// Main routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/index.html', (req, res) => {
  res.render('index', { title: 'Home' });
});

app.get('/product-page.html', (req, res) => {
  const product = {
    id: 1,
    title: 'Product Name',
    price: '20.00',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  };
  
  res.render('product-page', { 
    title: product.title,
    product: product
  });
});

app.get('/product-page', (req, res) => {
  const product = {
    id: 1,
    title: 'Product Name',
    price: '20.00',
    features: ['Feature 1', 'Feature 2', 'Feature 3']
  };
  
  res.render('product-page', { 
    title: product.title,
    product: product
  });
});

app.get('/store.html', (req, res) => {
  res.render('store', { title: 'Store' });
});

app.get('/store', (req, res) => {
  res.render('store', { title: 'Store' });
});

app.get('/product-carousel', (req, res) => {
  const imageUrls = [
    "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=2067&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/flagged/photo-1561023367-4431103a484f?q=80&w=2073&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1698671497722-fd2dd2b2316d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Y29tcHV0ZXIlMjBtb3VzZXxlbnwwfDB8MHx8fDA%3D",
    "https://images.unsplash.com/photo-1527814050087-3793815479db?q=80&w=1928&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  ];
  
  res.render('product-carousel', { 
    title: 'Product Carousel',
    imageUrls: imageUrls
  });
});

// Handle missing pages
app.use((req, res) => {
  res.status(404).render('error', { 
    title: 'Page Not Found',
    message: 'The page you are looking for does not exist.'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});