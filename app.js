const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();
require('./config/passport');

const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'midterm'
})
  .then(() => {
    console.log('✅ MongoDB connected');

    // START THE SERVER *after* the DB is ready
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    // Optional: Exit the app if DB fails
    process.exit(1);
  });

app.set('view engine', 'ejs');
// if you delete this line, it will default to 'views' folder
app.set('views', path.join(__dirname, 'html')); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/', require('./routes/auth'));
app.use('/projects', require('./routes/projects'));
app.use('/categories', require('./routes/categories'));  // ADD THIS LINE
app.use('/notes', require('./routes/notes'));
app.use('/api', require('./routes/api'));


app.get('/test-server', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date() });
});

app.get('/test-db', async (req, res) => {
  try {
      await mongoose.connection.db.admin().ping();
      res.json({ message: 'Database connection working!', timestamp: new Date() });
  } catch (err) {
      res.json({ error: 'Database error:', details: err.message });
  }
});
app.get('/', (req, res) => {
  res.render('login', { user: req.user });
});

app.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard', { user: req.user });
});



// Middleware to check if user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

