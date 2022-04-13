const express = require("express");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require ('dotenv').config();

CLOUD_NAME = process.env.CLOUD_NAME;
API_KEY = process.env.API_KEY;
API_SECRET = process.env.API_SECRET;


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "Uploads",
        format: async (req, file) => {
            "jpg", "png";
        }, // supports promises as well
        public_id: (req, file) => {
            console.log(
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            );
            return (
                new Date().toISOString().replace(/:/g, "-") + file.originalname
            );
        },
    },
});

const parser = multer({ storage: storage });

module.exports = parser