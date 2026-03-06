const { uploadFile } = require("../services/storage.service");
const musicModel = require('../models/music.model');
const jwt = require('jsonwebtoken');
const albumModel = require('../models/album.model');




async function createMusic(req, res) {
    const { title, tags } = req.body;  
    const file = req.file;

    const result = await uploadFile(file.buffer.toString('base64'));

    const music = await musicModel.create({
        uri: result.url,
        title,
        tags: tags || '',  
        artist: req.user.id
    });

    res.status(201).json({
        message: "Music Created Successfully",
        music: { id: music._id, uri: music.uri, title: music.title, artist: music.artist }
    });
}
async function createAlbum(req, res) {
    const { title} = req.body;
    const musics = JSON.parse(req.body.musics || '[]');
    const file = req.file;  // image file

    let coverImage = '';
    if (file) {
        const result = await uploadFile(file.buffer.toString('base64'));
        coverImage = result.url;
    }

    const album = await albumModel.create({
        title,
        musics,
        coverImage,  
        artist: req.user.id,
    });

    res.status(201).json({
        id: album._id,
        title: album.title,
        artist: album.artist,
        coverImage: album.coverImage,
        music: album.musics
    });
}

// In your getAllMusics function
async function getAllMusics(req, res) {
    const musics = await musicModel
    .find()
    .limit(100)
    .populate('artist', 'username email'); // This returns an object

    res.status(200).json({
        message : "Musics fetched successfully",
        musics : musics  // artist will be an object here
    });
}

async function getAllAlbums(req, res) {
    const albums = await albumModel
        .find()
        .select('title artist musics coverImage')
        .populate('artist', 'username email')
        .populate({
            path: 'musics',
            populate: { path: 'artist', select: 'username email' }
        });

    res.status(200).json({
        message: "Albums fetched successfully",
        albums: albums
    });
}

async function getAlbumById(req, res) {
    const { id } = req.params;
    const album = await albumModel.findById(id)
        .populate('artist', 'username email')
        .populate({
            path: 'musics',
            populate: { path: 'artist', select: 'username email' }
        });

    if (!album) {
        return res.status(404).json({ message: "Album not found..." });
    }
    res.status(200).json({
        message: "Album fetched successfully",
        album: album
    });
}

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

async function searchMusics(req, res) {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ message: "Search query required" });

        const userModel = require('../models/user.model');

        const artists = await userModel.find({
            username: { $regex: q, $options: 'i' }
        }).select('_id');

        const artistIds = artists.map(a => a._id);

        const musics = await musicModel.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { tags: { $regex: q, $options: 'i' } },   // ← Seach with tags
                { artist: { $in: artistIds } }
            ]
        })
        .limit(10)
        .populate('artist', 'username email');

        res.status(200).json({ message: "Search results", musics });
    } catch (error) {
        res.status(500).json({ message: "Search failed", error: error.message });
    }
}


async function likeMusic(req, res) {
    try {
        const userModel = require('../models/user.model');
        const { id } = req.params;
        await userModel.findByIdAndUpdate(req.user.id, {
            $addToSet: { likedSongs: id }
        });
        res.status(200).json({ message: "Song liked" });
    } catch (error) {
        res.status(500).json({ message: "Failed to like", error: error.message });
    }
}

async function unlikeMusic(req, res) {
    try {
        const userModel = require('../models/user.model');
        const { id } = req.params;
        await userModel.findByIdAndUpdate(req.user.id, {
            $pull: { likedSongs: id }
        });
        res.status(200).json({ message: "Song unliked" });
    } catch (error) {
        res.status(500).json({ message: "Failed to unlike", error: error.message });
    }
}

async function getLikedSongs(req, res) {
    try {
        const userModel = require('../models/user.model');
        const user = await userModel.findById(req.user.id)
            .populate({
                path: 'likedSongs',
                populate: { path: 'artist', select: 'username email' }
            });
        res.status(200).json({ message: "Liked songs fetched", musics: user.likedSongs });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch liked songs", error: error.message });
    }
}


async function downloadMusic(req, res) {
    try {
        const music = await musicModel.findById(req.params.id);
        if (!music) return res.status(404).json({ message: "Music not found" });

        const response = await fetch(music.uri);
        const buffer = await response.arrayBuffer();

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(music.title)}.mp3"; filename*=UTF-8''${encodeURIComponent(music.title)}.mp3`);
        res.send(Buffer.from(buffer));
    } catch (error) {
        res.status(500).json({ message: "Download failed", error: error.message });
    }
}

async function deleteMusic(req, res){
    try{
        // Check if music exists
        const music = await musicModel.findById(req.params.id);

        // If music not found, return 404 Not Found
        if(!music)return res.status(404).json({message: "Music not found"});

        // Check if the logged in user is the artist of the music
        if(music.artist.toString() !== req.user.id.toString()){
            return res.status(403).json({message: "You are not authorized to delete this music"});
        }

        // Delete the music
       await musicModel.findByIdAndDelete(req.params.id);

        // Remove the music from any albums that contain it
        await albumModel.updateMany(
            {musics : req.params.id},
            {$pull : {musics: req.params.id}}
        )

        // Return success response
        res.status(200).json({message: "Music deleted successfully"});

    }
    catch(error){
        // Return error response
        res.status(500).json({message: "Failed to delete music", error: error.message});
    }
    
    }

async function deleteAlbum(req, res){
    try{
        const album = await albumModel.findById(req.params.id);

        if(!album) return res.status(404).json({message: "Album not found"});

        if(album.artist.toString() !== req.user.id.toString()){
            return res.status(403).json({message: "You are not authorized to delete this album"});
        };

        await albumModel.findByIdAndDelete(req.params.id);

        res.status(200).json({message: "Album deleted successfully"});
    }
    catch(error){
       res.status(500).json({
        message: "Failed to delete album",
        error: error.message
    });
    }
}
module.exports = { 
    createMusic, 
    createAlbum, 
    getAllMusics, 
    getAllAlbums, 
    getAlbumById,
    getMyMusic,
    searchMusics,
    likeMusic,     
    unlikeMusic,    
    getLikedSongs,
    downloadMusic,
    deleteMusic,
    deleteAlbum
};
