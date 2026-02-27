const express = require('express')
const musicController = require('../controllers/music.controller')
const multer = require('multer')

//middleware
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const upload = multer({
    storage : multer.memoryStorage(),
})

/* Artist routes (only artists can access) */
router.post('/upload', authMiddleware.authArtist, upload.single('music'), musicController.createMusic)
router.post('/album', authMiddleware.authArtist, musicController.createAlbum)
router.get('/my-music', authMiddleware.authArtist, musicController.getMyMusic)

/* User routes (only users can access) */
router.get('/', authMiddleware.authUser, musicController.getAllMusics)

/* Public routes (any authenticated user - both users and artists) */
router.get('/albums', authMiddleware.authAny, musicController.getAllAlbums)
router.get('/albums/:id', authMiddleware.authAny, musicController.getAlbumById)


// User routes ke saath
router.get('/search', authMiddleware.authUser, musicController.searchMusics)

module.exports = router