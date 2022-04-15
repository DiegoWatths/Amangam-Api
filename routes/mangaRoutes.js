const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary')
const multer = require("multer");

const parser = require('../utils/cloudinary');
const requireAuth = require('../middlewares/auth');

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

router.post('/post', parser.array('pictures', 25), async (req, res) => {

    const { title, description, author } = req.body;

    try {
        
        //New Function For Images
        let newManga = new Manga({
            title, 
            description, 
            author
        });

        if (req.files) {
            const imageURIs = []; //Arreglo de URI de Imagenes
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                imageURIs.push(path)
            };

            newManga['mangaImages'] = imageURIs;

            await newManga.save();
            return res.status(200).json({ newManga });
        }

        return res.status(400).json({ // in case things don't work out
            msg: 'Please upload an image'
        });
        

    } catch (err) {
        res.status(500).json({message: err.message})
    }
});

router.delete("/del/:title", requireAuth, async (req, res) =>{
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