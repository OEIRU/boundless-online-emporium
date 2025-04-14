
const jwt = require('jsonwebtoken');

// Authentication middleware
const authenticate = (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Add the user data to the request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin authorization middleware
const authorizeAdmin = (req, res, next) => {
  // First authenticate the user
  authenticate(req, res, (err) => {
    if (err) return next(err);
    
    // Check if the user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin rights required.' });
    }
    
    next();
  });
};

// Rate limiting middleware to prevent brute force attacks
const rateLimiter = (() => {
  const requests = {};
  const resetIntervalMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100; // Maximum requests per IP per interval

  // Clear old entries every 15 minutes
  setInterval(() => {
    const now = Date.now();
    for (const ip in requests) {
      if (now - requests[ip].timestamp > resetIntervalMs) {
        delete requests[ip];
      }
    }
  }, resetIntervalMs);

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests[ip]) {
      requests[ip] = {
        count: 1,
        timestamp: now
      };
    } else if (now - requests[ip].timestamp > resetIntervalMs) {
      requests[ip] = {
        count: 1,
        timestamp: now
      };
    } else {
      requests[ip].count++;
      if (requests[ip].count > maxRequests) {
        return res.status(429).json({ 
          message: 'Too many requests, please try again later.'
        });
      }
    }
    
    next();
  };
})();

module.exports = {
  authenticate,
  authorizeAdmin,
  rateLimiter
};
