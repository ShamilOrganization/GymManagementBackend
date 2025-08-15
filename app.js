const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
connectDB();
const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

// If the route is not matched, serve the index.html as the default home page
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// });

module.exports = app;