
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movies: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    addedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  visibility: {
    type: String,
    enum: ['public', 'private', 'friends'],
    default: 'public'
  },
  tags: [String],
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  coverImage: String,
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
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

listSchema.index({ title: 'text', description: 'text' });
listSchema.index({ creator: 1 });
listSchema.index({ tags: 1 });
listSchema.index({ likeCount: -1 });
listSchema.index({ createdAt: -1 });

module.exports = mongoose.model('List', listSchema);
