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

// Add cart routes for both /cart and /cart.html
app.get('/cart', (req, res) => {
  res.render('cart', { title: 'Shopping Cart' });
});

app.get('/cart.html', (req, res) => {
  res.render('cart', { title: 'Shopping Cart' });
});

app.get('/product-page.html', (req, res) => {
  // Check if there's a product ID in the query params
  const productId = req.query.id;
  
  if (productId) {
    // If there's a product ID, we'll fetch the data from JSON file
    try {
      const dataPath = path.join(__dirname, 'public', 'data', 'data.json');
      const productsData = fs.readFileSync(dataPath, 'utf8');
      const products = JSON.parse(productsData);
      
      // Find the product with the matching ID
      const product = products.find(p => p.id === parseInt(productId));
      
      if (product) {
        // If product found, render the page with the product data
        res.render('product-page', { 
          title: product.name,
          product: {
            id: product.id,
            title: product.name,
            price: product.price,
            category: product.category, // Include the category
            features: product.description ? [product.description] : ['Feature 1', 'Feature 2', 'Feature 3']
          }
        });
      } else {
        // Product not found
        res.render('product-page', { 
          title: 'Product Not Found',
          product: {
            id: 0,
            title: 'Product Not Found',
            price: '0.00',
            category: '',
            features: ['Product not found']
          }
        });
      }
    } catch (error) {
      console.error('Error loading product data:', error);
      // Fallback to default product
      res.render('product-page', { 
        title: 'Product Page',
        product: {
          id: 1,
          title: 'Product Name',
          price: '20.00',
          category: 'Mice', // Default category
          features: ['Feature 1', 'Feature 2', 'Feature 3']
        }
      });
    }
  } else {
    // If no product ID, render with default product
    res.render('product-page', { 
      title: 'Product Page',
      product: {
        id: 1,
        title: 'Product Name',
        price: '20.00',
        category: 'Mice', // Default category
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      }
    });
  }
});
app.get('/product-page', (req, res) => {
  // Redirect to the HTML version to maintain consistent URLs
  res.redirect('/product-page.html' + (req.query.id ? `?id=${req.query.id}` : ''));
});

app.get('/store.html', (req, res) => {
  res.render('store', { title: 'Store' });
});

app.get('/store', (req, res) => {
  res.render('store', { title: 'Store' });
});

app.get('/favorites.html', (req, res) => {
  res.render('favorites', { title: 'Favorites' });
});

app.get('/favorites', (req, res) => {
  res.render('favorites', { title: 'Favorites' });
});

// Add data.json endpoint to serve product data directly
app.get('/api/products', (req, res) => {
  try {
    const dataPath = path.join(__dirname, 'public', 'data', 'data.json');
    const productsData = fs.readFileSync(dataPath, 'utf8');
    res.json(JSON.parse(productsData));
  } catch (error) {
    console.error('Error loading products data:', error);
    res.status(500).json({ error: 'Failed to load products data' });
  }
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