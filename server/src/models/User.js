
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  bio: {
    type: String,
    maxlength: 500
  },
  avatar: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  birthday: {
    type: Date
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    activityVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    }
  },
  social: {
    twitter: String,
    instagram: String,
    facebook: String
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        newFollower: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        likes: { type: Boolean, default: true },
        recommendations: { type: Boolean, default: true }
      },
      push: {
        newFollower: { type: Boolean, default: true },
        comments: { type: Boolean, default: true },
        likes: { type: Boolean, default: true }
      }
    },
    cookies: {
      type: Map,
      of: String,
      default: new Map()
    }
  },
  stats: {
    moviesWatched: { type: Number, default: 0 },
    totalMinutesWatched: { type: Number, default: 0 },
    listsCreated: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 }
  },
  watchlist: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  watched: [{
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie'
    },
    watchedAt: {
      type: Date,
      default: Date.now
    },
    rating: {
      type: Number,
      min: 1,
      max: 10
    },
    review: String,
    liked: Boolean,
    rewatch: Boolean
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  lists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
