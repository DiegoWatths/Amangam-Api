const jwt = require('express-jwt');

const requireAuth = jwt({
	secret: SECRET,
	algorithms: ['HS256']
  });

module.exports = requireAuth;
