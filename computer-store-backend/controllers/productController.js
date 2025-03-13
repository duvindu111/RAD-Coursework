const Product = require('../models/Product');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique file name
    },
});

const upload = multer({storage});

exports.addProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const {name, description, price, stock, category} = req.body;
            const imagePath = req.file ? req.file.filename : '';

            const newProduct = new Product({
                name,
                description,
                price,
                stock,
                category,
                image: imagePath,
            });
            await newProduct.save();
            res.status(201).json({message: 'Product added successfully'});
        } catch (error) {
            console.error('Error in adding product:', error.message);
            res.status(500).json({message: 'Failed to add product'});
        }
    }
];
