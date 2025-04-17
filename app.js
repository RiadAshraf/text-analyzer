const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

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

// Google OAuth Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/',
}), (req, res) => {
    console.log(`User logged in: ${req.user.displayName} (${req.user.emails[0].value})`);
    res.redirect('/'); // Redirect to the frontend after login
});

// Middleware to protect API routes
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ error: 'Unauthorized' });
};

// Endpoint to check authentication status
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

// Protect API routes
app.use('/api', ensureAuthenticated);

// Other middleware and routes
app.use(express.json());
app.use(express.static('public'));

// Example API route
app.post('/api/texts', (req, res) => {
    const { content } = req.body;
    const user = req.user.displayName; // Get the logged-in user's name
    // Perform text analysis and return results
    res.json({
        wordCount: content.split(/\s+/).length,
        characterCount: content.length,
        user,
    });
});

module.exports = app;