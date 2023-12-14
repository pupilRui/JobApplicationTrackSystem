import http from 'http';
import express from 'express';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import authRouter from './routes/auth_manager.js';
import mongoose from 'mongoose';
import jobRoutes from './routes/jobs.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from './utils/logger.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Use this middleware in your routes


const app = express();

app.use(cookieParser());

// Enable CORS for all requests
app.use(cors({
    origin: 'http://localhost:3000', // Replace with the actual origin of your frontend
    credentials: true
}));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { httpOnly: true, maxAge: 60 * 60 * 1000}
}));

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

function logUserActivity(req, res, next) {
    if (req.isAuthenticated()) {
        const userID = req.user.id; // Assuming user ID is stored in req.user.id
        logger.info(`User ID: ${userID}, Endpoint: ${req.originalUrl}, Method: ${req.method}`);
    }
    next();
}

app.use(logUserActivity);

app.use('/auth', authRouter);
app.use('/jobs', jobRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, console.log(`Server started on port ${PORT}`));

