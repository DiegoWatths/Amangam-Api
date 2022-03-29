const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const cloud_name = process.env.cloud_name
const api_key = process.env.api_key
const api_secret = process.env.api_secret

cloudinary.config({ 
    cloud_name: cloud_name,
    api_key: api_key, 
    api_secret: api_secret
  });

module.exports = cloudinary;