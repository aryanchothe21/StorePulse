const express = require('express');
const cors = require('cors');
const storeRoutes = require('./routes/storeRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Roxiler backend is running' });
});

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/stores', storeRoutes);
app.use('/ratings', ratingRoutes);
app.use('/store-owner', storeOwnerRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found.` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

module.exports = app;
