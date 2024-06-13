const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Find the user in the database to ensure they exist and attach the user object to the request
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: 'Access denied. User not found.' });

    req.user = user;  // Attach the user info to the request object
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};


// middlewares/authMiddleware.js

const authorizeRoles = (req, res, next) => {
    if (!req.user || !req.user.admin) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
    }
    next();
  };
  
  //module.exports = authorizeRoles;
  

module.exports = { authenticateToken, authorizeRoles };
  
