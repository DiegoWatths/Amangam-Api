const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary')
const multer = require("multer");

const cloud_name = process.env.CLOUD_NAME
const api_key = process.env.API_KEY
const api_secret = process.env.API_SECRET

cloudinary.v2.config({ 
    cloud_name: cloud_name,
    api_key: api_key, 
    api_secret: api_secret
  });

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now());
    },
  });

const upload = multer({storage})

const Manga = require("../models/Manga");

router.get("/allMangas", async (req, res) => {
    /*fetch all mangas*/
    /*Show them*/
    try {
        let mangas = await Manga.find({});
        console.table(mangas);
        res.json(mangas)    
    } catch (error) {
        console.log(error.message);
    }
})

//Manga title
router.get("/manga/:title", async (req, res) => {
    /*Obtain manga data for manga of title = nameManga*/
    /*Show chapter data */
    
    try {
        const {title: nameManga} = req.params;
        
        let mangas = await Manga.findOne({title: nameManga});
        console.table(mangas);
        res.json(mangas)
    } catch (error) {
        console.log(error.message);
    }
})

router.post('/post', upload.array('pictures', 20), async (req, res) => {
    try {
        
        let pictureFiles = req.files;
        if (!pictureFiles)
          return res.status(400).json({ message: "No picture attached!" });
        //map through images and create a promise array using cloudinary upload function
        let multiplePicturePromise = pictureFiles.map((picture) =>
          cloudinary.v2.uploader.upload(picture.path)
        );
        let imageResponses = await Promise.all(multiplePicturePromise);
        res.status(200).json({ images: imageResponses });   

        //TO DO:
        /*let newManga = new Manga({
            title: req.body.tit, 
            description: req.body.desc, 
            author: req.body.auth, 
            photos: imageResponses
        });

        await newManga.save();
        //console.table(newManga);
        res.status(201).json(newManga);*/
    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

router.delete("/del/:title", async (req, res) =>{
    try{
        const {title: tit} = req.params;

        const manga = await Manga.findOne({title: tit});
        if(manga){
            await manga.delete();
            res.status(200).json("Deleted Manga :o oops...")
        }
    }catch(error){
        console.log(error.message);
    }
})

module.exports = router;