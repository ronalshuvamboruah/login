const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');
const  connectDB  = require('./config/db');

const PORT = process.env.PORT || 3001;

connectDB();

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});