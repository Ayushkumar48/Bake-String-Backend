const express = require('express');
const passport = require('passport');
const session = require('express-session');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');

const authApp = express();
const port = 3001; // Different port for the auth server

authApp.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }));
authApp.use(passport.initialize());
authApp.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: 'YOUR_GOOGLE_CLIENT_ID',
    clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    callbackURL: 'http://localhost:3001/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {
    // Handle user profile here (e.g., save to database)
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

authApp.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

authApp.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('http://localhost:5173'); // Redirect to Svelte app
  });

authApp.get('/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:5173');
});

authApp.get('/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});

authApp.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`);
});

module.exports = authApp;
