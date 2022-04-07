const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const MangaSchema = new Schema(
    {
        title: {type: String, trim: true, unique: true},
        description: {type: String},
        author: {type: String},
        cover:{type: String},
        photos: [{
            type: String,
            unique: true
        }],
        cloudinary_id: {
            type: String,
          }
    }
)

module.exports = model('Manga', MangaSchema);