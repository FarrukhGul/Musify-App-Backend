const { uploadFile } = require("../services/storage.service");
const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const albumModel = require('../models/album.model');
const { error } = require("three/src/utils.js");



async function createMusic(req, res) {

    const { title } = req.body;
        const file = req.file;

        const result = await uploadFile(file.buffer.toString('base64'));

        const music = await musicModel.create({
            uri: result.url,     
            title,              
            artist: req.user.id    
        });

        res.status(201).json({
            message: "Music Created Successfully",
            music: {
                id: music._id,
                uri: music.uri,   
                title: music.title,
                artist: music.artist
            }
        });
};

async function createAlbum(req, res){

        const {title, musics} = req.body
        const album = await albumModel.create({
            title,
            musics : musics,
            artist : req.user.id,
        });


        res.status(201).json({
            id : album._id,
            title : album.title,
            artist : album.artist,
            music: album.musics
        })

    
};


// In your getAllMusics function
async function getAllMusics(req, res) {
    const musics = await musicModel
    .find()
    .limit(20)
    .populate('artist', 'username email'); // This returns an object

    res.status(200).json({
        message : "Musics fetched successfully",
        musics : musics  // artist will be an object here
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel.find().select('title artist').populate('artist', 'username email')

    res.status(200).json({
        message : "Albums fetched successfully",
        albums : albums
    });
};
async function getAlbumById(req, res) {
    const { id } = req.params;
    const album = await albumModel.findById(id).populate('artist', 'username email').populate('musics');                         
    if(!album) {
        return res.status(404).json({ message: "Album not found..." });
    };
    res.status(200).json({
        message : "Album fetched successfully",
        album : album
    });
};      

// Add this to your music.controller.js
async function getMyMusic(req, res) {
    try {
        const musics = await musicModel
            .find({ artist: req.user.id })
            .populate('artist', 'username email');

        res.status(200).json({
            message: "Your music fetched successfully",
            musics: musics
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Failed to fetch your music", 
            error: error.message 
        });
    }
}

// Don't forget to export it
module.exports = { 
    createMusic, 
    createAlbum, 
    getAllMusics, 
    getAllAlbums, 
    getAlbumById,
    getMyMusic // Add this to exports
};
