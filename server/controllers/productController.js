import Product from '../models/Product.js';

//  Add a new product
export const addProduct = async (req, res) => {
  try {
    console.log(" Full Request Body:", req.body);
    console.log(" Uploaded File:", req.file); // Log uploaded file

    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.path : '';

    if (!name || !price || !category) {
      return res.status(400).json({ message: ' Name, price, and category are required' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock,
      user: req.user.id,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error(" Add Product Error:", error);
    res.status(500).json({ message: 'Failed to add product', error });
  }
};

//  Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error });
  }
};

//  Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error });
  }
};

//  Update a product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const image = req.file ? req.file.path : '';

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    if (image) product.image = image;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error });
  }
};
