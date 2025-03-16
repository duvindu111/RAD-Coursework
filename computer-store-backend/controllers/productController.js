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

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Error in getting products:', error.message);
        res.status(500).json({message: 'Failed to load products'});
    }
};

exports.getSelectedProducts = async (req, res) => {
    const {productIds} = req.body;

    try {
        const products = await Product.find({_id: {$in: productIds}}).select('name price image');
        res.json(products);
    } catch (error) {
        console.error('Error in getting choosen products:', error.message);
        res.status(500).json({message: 'Failed to fetch cart products'});
    }
};

exports.updateProduct = [
    upload.single('image'),
    async (req, res) => {
        try {
            const {productId} = req.params;
            const {name, description, price, stock, category} = req.body;

            const image = req.file ? req.file.filename : undefined;

            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                {name, description, price, stock, category, ...(image && {image})},
                {new: true}
            );

            if (!updatedProduct) {
                return res.status(404).json({message: 'Product not found'});
            }

            res.status(200).json({message: 'Product updated successfully', updatedProduct});
        } catch (error) {
            console.error('Error updating product:', error);
            res.status(500).json({message: 'Failed to update product.'});
        }
    }
];

exports.deleteProduct = async (req, res) => {
    const {productId} = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.status(200).json({message: 'Product removed successfully'});
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({message: 'Failed to delete product.'});
    }
};


