require('dotenv').config();

const mongoose = require('mongoose');

dbURI = process.env.MONGO_URI;

// connect to mongoDB
const connectDB = mongoose.connect(dbURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

module.exports = connectDB;