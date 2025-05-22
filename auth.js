// auth.js - Fixed version
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database connection
const dbPath = path.join(__dirname, 'database', 'users.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to database:', err.message);
  } else {
    console.log('Connected to the users database.');
    
    // Create users table only
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullname TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Authentication middleware
const authMiddleware = {
  isAuthenticated: (req, res, next) => {
    console.log('isAuthenticated middleware called, session:', req.session.user ? 'exists' : 'not found');
    if (req.session && req.session.user) {
      return next();
    }
    console.log('User not authenticated, redirecting to login');
    return res.redirect('/login');
  },
  isNotAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      return res.redirect('/');
    }
    return next();
  }
};

// Authentication controller
const authController = {
  getLogin: (req, res) => {
    res.render('login', { title: 'Login' });
  },
  
  postLogin: (req, res) => {
    console.log('postLogin called with body:', req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.render('login', { 
        title: 'Login',
        error: 'Email and password are required',
        email
      });

    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.render('login', { 
          title: 'Login',
          error: 'An error occurred, please try again',
          email
        });
      }
      
      if (!user || user.password !== password) {
        return res.render('login', { 
          title: 'Login',
          error: 'Invalid email or password',
          email
        });
      }
      
      req.session.user = {
        id: user.id,
        email: user.email,
        fullname: user.fullname
      };
      
      res.redirect('/profile');
    });
  },
  
  getSignup: (req, res) => {
    res.render('signup', { title: 'Sign Up' });
  },
  
  postSignup: (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;
    
    if (!fullname || !email || !password) {
      return res.render('signup', { 
        title: 'Sign Up',
        error: 'All fields are required',
        fullname,
        email
      });
    }
    
    if (password !== confirmPassword) {
      return res.render('signup', { 
        title: 'Sign Up',
        error: 'Passwords do not match',
        fullname,
        email
      });
    }

    
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, existingUser) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.render('signup', { 
          title: 'Sign Up',
          error: 'An error occurred, please try again',
          fullname,
          email
        });
      }
      
      if (existingUser) {
        return res.render('signup', { 
          title: 'Sign Up',
          error: 'Email already in use',
          fullname,
          email
        });
      }
      
      db.run(
        'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)',
        [fullname, email, password],
        function(err) {
          if (err) {
            console.error('Error creating user:', err.message);
            return res.render('signup', { 
              title: 'Sign Up',
              error: 'An error occurred, please try again',
              fullname,
              email
            });
          }
          
          // Use the last inserted ID from this.lastID
          const newUserId = this.lastID;
          
          req.session.user = {
            id: newUserId,
            email: email,
            fullname: fullname
          };
          
          res.redirect('/profile');
        }
      );
    });
  },
  
  logout: (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err.message);
      }
      res.redirect('/login');
    });
  }
};

// Explicitly log what we're exporting
console.log('Exporting from auth.js:', {
  authMiddleware: typeof authMiddleware,
  authController: typeof authController
});

// Export the objects
module.exports = {
  authMiddleware,
  authController
};