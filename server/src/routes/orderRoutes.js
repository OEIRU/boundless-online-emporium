
const express = require('express');
const router = express.Router();

// Placeholder for orders (in a real app, use mongoose model)
const orders = [];
let orderCounter = 1000;

// Create a new order
router.post('/', (req, res) => {
  try {
    const { userId, items, shippingAddress, billingAddress, paymentMethod, subtotal, shipping, total } = req.body;
    
    const newOrder = {
      orderId: `ORD-${orderCounter++}`,
      userId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
      status: 'pending',
      createdAt: new Date()
    };
    
    orders.push(newOrder);
    
    res.status(201).json({
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all orders for a user
router.get('/user/:userId', (req, res) => {
  try {
    const userId = req.params.userId;
    const userOrders = orders.filter(order => order.userId === userId);
    
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific order by ID
router.get('/:orderId', (req, res) => {
  try {
    const order = orders.find(order => order.orderId === req.params.orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status (admin only)
router.put('/:orderId/status', (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = orders.findIndex(order => order.orderId === req.params.orderId);
    
    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date();
    
    res.json({
      message: 'Order status updated',
      order: orders[orderIndex]
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
