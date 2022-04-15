const jwt = require('express-jwt');
require ('dotenv').config();

const SECRET = process.env.SECRET

const requireAuth = jwt({
	secret: SECRET,
	algorithms: ['HS256']
  });

module.exports = requireAuth;
