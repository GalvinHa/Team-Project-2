const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Set up view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Install pug if not already installed
// npm install pug

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


app.get('/index.html', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Add routes for HTML extensions to handle existing links
app.get('/login.html', (req, res) => {
  res.render('login', { title: 'Login' });
});

// Also keep the clean URL version
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

app.get('/signup.html', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
});

app.get('/signup', (req, res) => {
  res.render('signup', { title: 'Sign Up' });
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