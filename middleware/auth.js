const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');
const { toApi } = require('../utils/supabaseHelpers');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { data, error } = await supabase.from('users').select('*').eq('id', decoded.id).single();
    if (error || !data || !data.is_active) throw error || new Error('User not found');
    req.user = toApi(data);
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized`
      });
    }
    next();
  };
};
