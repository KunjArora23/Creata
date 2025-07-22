import jwt from 'jsonwebtoken';

// Middleware to verify JWT access token from cookies and check roles
export const authorizeRoles = (...roles) => (req, res, next) => {
  const accessToken = req.cookies.accessToken ;
  if (!accessToken) {
    return res.status(401).json({ 
      success: false, 
      message: 'No token provided.' 
    });
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded;
    
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ success: false, message: 'Access denied: insufficient permissions.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
}; 