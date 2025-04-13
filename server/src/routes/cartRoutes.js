
const express = require('express');
const router = express.Router();

// For simplicity, we'll use an in-memory store instead of a database model
// In a real app, you'd use a Cart model with MongoDB
const carts = {};

// Get cart contents
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (!carts[userId]) {
    carts[userId] = {
      items: [],
      subtotal: 0,
      total: 0
    };
  }
  
  res.json(carts[userId]);
});

// Add item to cart
router.post('/add', (req, res) => {
  const { userId, productId, title, price, quantity, size, color, image } = req.body;
  
  if (!carts[userId]) {
    carts[userId] = {
      items: [],
      subtotal: 0,
      total: 0
    };
  }
  
  // Check if item already exists in cart
  const existingItemIndex = carts[userId].items.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (existingItemIndex > -1) {
    // Update quantity of existing item
    carts[userId].items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    carts[userId].items.push({
      productId,
      title,
      price,
      quantity,
      size,
      color,
      image
    });
  }
  
  // Recalculate totals
  calculateCartTotals(userId);
  
  res.status(201).json({
    message: 'Item added to cart',
    cart: carts[userId]
  });
});

// Update cart item quantity
router.put('/update', (req, res) => {
  const { userId, productId, quantity, size, color } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Find the item to update
  const itemIndex = carts[userId].items.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    carts[userId].items.splice(itemIndex, 1);
  } else {
    // Update quantity
    carts[userId].items[itemIndex].quantity = quantity;
  }
  
  // Recalculate totals
  calculateCartTotals(userId);
  
  res.json({
    message: 'Cart updated',
    cart: carts[userId]
  });
});

// Remove item from cart
router.delete('/remove', (req, res) => {
  const { userId, productId, size, color } = req.body;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  // Find the item to remove
  const itemIndex = carts[userId].items.findIndex(
    item => item.productId === productId && item.size === size && item.color === color
  );
  
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found in cart' });
  }
  
  // Remove item
  carts[userId].items.splice(itemIndex, 1);
  
  // Recalculate totals
  calculateCartTotals(userId);
  
  res.json({
    message: 'Item removed from cart',
    cart: carts[userId]
  });
});

// Clear cart
router.delete('/clear/:userId', (req, res) => {
  const userId = req.params.userId;
  
  if (!carts[userId]) {
    return res.status(404).json({ message: 'Cart not found' });
  }
  
  carts[userId] = {
    items: [],
    subtotal: 0,
    total: 0
  };
  
  res.json({
    message: 'Cart cleared',
    cart: carts[userId]
  });
});

// Helper function to calculate cart totals
function calculateCartTotals(userId) {
  const cart = carts[userId];
  
  // Calculate subtotal
  cart.subtotal = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate shipping cost (free over $50)
  const shippingCost = cart.subtotal >= 50 ? 0 : 4.99;
  
  // Calculate total
  cart.total = cart.subtotal + shippingCost;
  cart.shippingCost = shippingCost;
}

module.exports = router;
