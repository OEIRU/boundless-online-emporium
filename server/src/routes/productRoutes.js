
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authorizeAdmin } = require('../middleware/authMiddleware');

// Get all products
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      limit = 12, 
      page = 1, 
      sort, 
      min_price, 
      max_price,
      sizes,
      colors,
      min_discount
    } = req.query;
    
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

    // Filter by sizes (comma-separated list)
    if (sizes) {
      const sizeArray = sizes.split(',').map(size => size.trim());
      query.sizes = { $in: sizeArray };
    }

    // Filter by colors (comma-separated list)
    if (colors) {
      const colorArray = colors.split(',').map(color => color.trim());
      query['colors.name'] = { $in: colorArray };
    }

    // Filter by minimum discount percentage
    if (min_discount) {
      query.discount = { $gte: parseInt(min_discount) };
    }

    // Always show only active products
    query.isActive = true;
    
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
        case 'discount':
          sortOptions.discount = -1;
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
    console.error('Product query error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search products endpoint
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 12, page = 1, category, min_price, max_price, colors, sizes, min_discount } = req.query;
    
    const query = {};
    
    // Text search if query parameter exists
    if (q) {
      query.$text = { $search: q };
    }
    
    // Add filters
    if (category) {
      query.category = category;
    }
    
    if (min_price || max_price) {
      query.price = {};
      if (min_price) query.price.$gte = parseFloat(min_price);
      if (max_price) query.price.$lte = parseFloat(max_price);
    }

    // Filter by sizes
    if (sizes) {
      const sizeArray = sizes.split(',').map(size => size.trim());
      query.sizes = { $in: sizeArray };
    }

    // Filter by colors
    if (colors) {
      const colorArray = colors.split(',').map(color => color.trim());
      query['colors.name'] = { $in: colorArray };
    }

    // Filter by minimum discount percentage
    if (min_discount) {
      query.discount = { $gte: parseInt(min_discount) };
    }

    // Always show only active products
    query.isActive = true;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sortOptions = q ? { score: { $meta: "textScore" } } : { createdAt: -1 };
    
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
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get product autocomplete suggestions
router.get('/autocomplete', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const regex = new RegExp(q, 'i');
    
    const suggestions = await Product.find({ 
      title: regex,
      isActive: true 
    })
    .select('title')
    .limit(10);
    
    const terms = suggestions.map(product => product.title);
    
    res.json(terms);
  } catch (error) {
    console.error('Autocomplete error:', error);
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
router.post('/', authorizeAdmin, async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a product (admin only)
router.put('/:id', authorizeAdmin, async (req, res) => {
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
router.delete('/:id', authorizeAdmin, async (req, res) => {
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
