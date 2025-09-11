const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const path = require('path');

require('dotenv').config();
connectDB();
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// 404 Not Found Middleware
// This must be placed after all defined routes.
app.use((req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global Error Handling Middleware
// This middleware must be defined last, after all other routes and middleware.
// The presence of four parameters (err, req, res, next) signifies it as an error handler.
app.use((err, req, res, next) => {
    // Determine the status code. If a status code was already set (e.g., 404), use it.
    // Otherwise, default to 500 for a generic server error.
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    // Log the error for server-side debugging. In production, you might use a dedicated
    // logging service.
    console.error(err.message);

    let message = err.message;
    let errors = {};

    // Check for common error types and provide specific, user-friendly messages.
    switch (err.name) {
        case 'SyntaxError':
            // Handles invalid JSON in the request body
            message = 'Invalid JSON provided in the request body.';
            break;

        case 'ValidationError':
            // Handles Mongoose validation errors
            message = 'Validation failed.';
            // Extract specific validation errors for a more detailed response
            Object.keys(err.errors).forEach(key => {
                errors[key] = err.errors[key].message;
            });
            break;

        case 'CastError':
            // Handles errors when a value cannot be cast to a schema type (e.g., invalid ObjectId)
            message = `Invalid ${err.kind} for field '${err.path}'.`;
            break;

        case 'MongoError':
            // Handles MongoDB specific errors like duplicate key
            if (err.code === 11000) {
                message = 'Duplicate key error.';
            }
            break;

        default:
            // For any other unexpected errors, use a generic "Something broke" message
            // in production to avoid leaking sensitive information.
            if (statusCode === 500) {
                message = 'Something broke!';
            }
            break;
    }

    // Send the final error response
    res.json({
        success: false,
        message: message,
        errors: Object.keys(errors).length > 0 ? errors : undefined,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

module.exports = app;