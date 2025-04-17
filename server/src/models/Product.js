
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  images: [String],
  sizes: [String],
  colors: [{
    name: String,
    value: String,
    border: Boolean
  }],
  features: [String],
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for improved search and filtering performance
productSchema.index({ title: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ discount: 1 });
productSchema.index({ "colors.name": 1 });
productSchema.index({ sizes: 1 });
productSchema.index({ isActive: 1 });

// Calculate discount before saving if originalPrice is set
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    const discountPercentage = ((this.originalPrice - this.price) / this.originalPrice) * 100;
    this.discount = Math.round(discountPercentage);
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
