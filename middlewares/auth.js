const jwt = require('express-jwt');

const requireAuth = jwt({
	secret: process.env.SECRET,
	algorithms: ['HS256']
  });

module.exports = requireAuth;
