require('dotenv').config();
const express = require('express')
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const cors = require('cors');
const {join} = require("path");

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/product', productRoutes);
app.use('/api/cart', cartRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
