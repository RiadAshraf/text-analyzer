// Import dependencies
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const textRoutes = require('./routes/textRoutes');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Initialize the app
const app = express();

// Middleware: Parse JSON request bodies
app.use(express.json());

// Middleware: Serve static files
app.use(express.static('public'));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
});

app.use('/api', limiter);



// Serve texts.html for /texts route
app.get('/texts', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'texts.html'));
});

// Session middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
    // Save user profile in session
    return done(null, profile);
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware: Protect API routes
const ensureAuthenticated = (req, res, next) => {
    console.log('Authentication check:', req.isAuthenticated());
    console.log('Session:', req.session);
    console.log('User:', req.user);
    if (req.isAuthenticated()) {
        return next();
    }    function ensureAuthenticated(req, res, next) {
        console.log('Authentication check:', req.isAuthenticated());
        console.log('Session:', req.session);
        console.log('User:', req.user);
        if (req.isAuthenticated()) {
            return next();
        }
        res.status(401).json({ error: 'Unauthorized' });
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
}), (req, res) => {
    if (!req.user) {
        console.error('Authentication failed');
        return res.redirect('/login');
    }
    console.log(`User logged in: ${req.user.displayName} (${req.user.emails[0].value})`);
    res.redirect('/'); // Redirect to the frontend after login
});

// Logout route
app.post('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Failed to log out' });
        }
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

// Endpoint: Check authentication status
app.get('/api/auth-status', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            displayName: req.user.displayName,
            email: req.user.emails[0].value,
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

app.post('/api/texts', ensureAuthenticated, (req, res) => {
    const { content } = req.body;
    const user = req.user.displayName; // Get the logged-in user's name

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    // Perform text analysis
    const wordCount = content.split(/\s+/).filter(Boolean).length;
    const characterCount = content.length;
    const sentenceCount = content.split(/[.!?]+/).filter(Boolean).length;
    const paragraphCount = content.split(/\n+/).filter(Boolean).length;
    const longestWord = content.split(/\s+/).reduce((longest, word) => {
        return word.length > longest.length ? word : longest;
    }, '');

    // Return all results
    res.json({
        wordCount,
        characterCount,
        sentenceCount,
        paragraphCount,
        longestWord,
        user,
    });
});

// Register text analysis routes
app.use('/api', ensureAuthenticated);
app.use('/api', textRoutes);



// Export the app
module.exports = app;