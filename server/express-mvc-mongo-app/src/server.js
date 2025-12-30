const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const connectDB = require('./config/db');

// CORS
const cors = require('cors');
require('dotenv').config();

const whitelist = (process.env.CORS_ORIGIN || 'http://localhost:3000'||"*")
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (curl/Postman)
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true,
  exposedHeaders: ['Authorization']
};

app.use(cors(corsOptions));

// handle preflight without registering a '*' route that breaks path-to-regexp
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    // CORS middleware already set headers; respond to preflight
    return res.sendStatus(204);
  }
  next();
});

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});