// routes/auth_manager.js
import express from 'express';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import LocalStrategy from 'passport-local';
import User from '../models/User.js'; // Adjust the path as necessary

const router = express.Router();

// Passport Configuration
passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username: username })
        .then(user => {
            if (!user) {
                return done(null, false, { message: 'Incorrect username.' });
            }

            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, { message: 'Incorrect password.' });
                    }
                })
                .catch(err => done(err));
        })
        .catch(err => done(err));
}));


passport.serializeUser((user, done) => {
    console.log('Serializing user:', user.id);
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    console.log('Deserializing user, ID:', id);
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null));
});

// Register route
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
            return res.status(500).send('Error hashing password');
        }
        try {
            const newUser = new User({ username, password: hash });
            await newUser.save();
            res.status(201).json({ message: 'User registered' });
            // res.status(201).send('User registered');
        } catch (error) {
            res.status(500).send('Error registering user');
        }
    });
});

// Login route
router.post('/login', (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) { return res.status(401).json(info); }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.json({ message: 'Logged in' });
        });
    })(req, res, next);
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.json({ message: 'Logged out' });
    res.send('Logged out');
});

export default router;
