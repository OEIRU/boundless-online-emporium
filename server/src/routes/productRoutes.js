
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, limit = 12, page = 1, sort, min_price, max_price } = req.query;
    
    const query = {};
    
    // Add filters
    if (category) {
      query.category = category;
    }
    
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }
    
    // Build sort options
    const sortOptions = {};
    if (sort) {
      switch (sort) {
        case 'price_asc':
          sortOptions.price = 1;
          break;
        case 'price_desc':
          sortOptions.price = -1;
          break;
        case 'newest':
          sortOptions.createdAt = -1;
          break;
        case 'rating':
          sortOptions.rating = -1;
          break;
        default:
          sortOptions.createdAt = -1;
      }
    } else {
      sortOptions.createdAt = -1; // Default sort
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const products = await Product.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('category', 'name slug');
    
    // Get total count for pagination
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new product (admin only)
router.post('/', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
