const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const gymRoutes = require('./routes/gymRoutes');
const calculationRoutes = require('./routes/calculationRoutes');
const path = require('path');
require('./scripts/calculatePendingAmount.js');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');


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
app.use('/api/payment', paymentRoutes);
app.use('/api/gym', gymRoutes);
app.use('/api/calculations', calculationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;