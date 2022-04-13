const mongoose = require('mongoose');
const {Schema, model} = require('mongoose')

const MangaSchema = new Schema(
    {
        title: {type: String, trim: true, unique: true},
        description: {type: String},
        author: {type: String},
        mangaImages: [{
            type: String,
            unique: true
        }]
    }
)

module.exports = model('Manga', MangaSchema);