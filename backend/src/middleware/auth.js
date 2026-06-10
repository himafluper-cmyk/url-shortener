import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/errorHandler.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return next(createError(401, 'Not authenticated. Please log in.'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      return next(createError(401, 'User no longer exists or is inactive.'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError(401, 'Invalid or expired token.'));
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    }
  } catch (_) {
    // Silently fail — user stays unauthenticated
  }
  next();
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(createError(403, 'You do not have permission to perform this action.'));
    }
    next();
  };
};
