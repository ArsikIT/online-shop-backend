const Product = require("../models/Product");

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get products'
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get product'
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, images, categoryId, stock } = req.body;
    const product = await Product.create({
      title,
      description,
      price,
      images,
      categoryId,
      stock
    });
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product',
      error: error.toString()
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price, images, categoryId, stock } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        price,
        images,
        categoryId,
        stock
      },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product',
      error: error.toString()
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product'
    });
  }
};
