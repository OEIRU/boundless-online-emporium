
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single category by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    let category;
    
    // Check if the parameter is an ObjectID or a slug
    if (req.params.idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      // It's likely an ObjectID
      category = await Category.findById(req.params.idOrSlug);
    } else {
      // It's likely a slug
      category = await Category.findOne({ slug: req.params.idOrSlug });
    }
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new category (admin only)
router.post('/', async (req, res) => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a category (admin only)
router.put('/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(updatedCategory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a category (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    
    if (!deletedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
