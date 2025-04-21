
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  originalTitle: {
    type: String,
    trim: true
  },
  tmdbId: {
    type: Number,
    unique: true
  },
  imdbId: {
    type: String,
    unique: true,
    sparse: true
  },
  overview: {
    type: String
  },
  tagline: {
    type: String
  },
  posterPath: {
    type: String
  },
  backdropPath: {
    type: String
  },
  releaseDate: {
    type: Date
  },
  runtime: {
    type: Number,
    min: 0
  },
  status: {
    type: String,
    enum: ['Released', 'Post Production', 'In Production', 'Planned', 'Cancelled'],
    default: 'Released'
  },
  genres: [{
    type: String
  }],
  languages: [{
    code: String,
    name: String
  }],
  productionCountries: [{
    code: String,
    name: String
  }],
  productionCompanies: [{
    type: String
  }],
  cast: [{
    name: String,
    character: String,
    profilePath: String
  }],
  crew: [{
    name: String,
    job: String,
    department: String,
    profilePath: String
  }],
  director: {
    type: String
  },
  budget: {
    type: Number,
    default: 0
  },
  revenue: {
    type: Number,
    default: 0
  },
  certification: {
    type: String
  },
  ratings: {
    tmdb: {
      value: Number,
      count: Number
    },
    imdb: {
      value: Number,
      count: Number
    },
    metacritic: Number,
    rottenTomatoes: Number,
    cinemaverse: {
      value: {
        type: Number,
        default: 0
      },
      count: {
        type: Number,
        default: 0
      }
    }
  },
  popularity: {
    type: Number,
    default: 0
  },
  watchCount: {
    type: Number,
    default: 0
  },
  listCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  trailers: [{
    name: String,
    key: String,
    site: String,
    type: String
  }],
  images: {
    backdrops: [String],
    posters: [String]
  },
  similar: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
  }],
  keywords: [String],
  recommendations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie'
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

// Создание индексов для улучшения производительности поиска
movieSchema.index({ title: 'text', originalTitle: 'text', overview: 'text' });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ 'ratings.cinemaverse.value': -1 });
movieSchema.index({ popularity: -1 });
movieSchema.index({ watchCount: -1 });
movieSchema.index({ genres: 1 });

module.exports = mongoose.model('Movie', movieSchema);
