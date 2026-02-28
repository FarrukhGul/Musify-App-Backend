const express = require('express')
const musicController = require('../controllers/music.controller')
const multer = require('multer')
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() })

/* Artist routes */
router.post('/upload', authMiddleware.authArtist, upload.single('music'), musicController.createMusic)
router.post('/album', authMiddleware.authArtist, upload.single('coverImage'), musicController.createAlbum)  // ✅ sirf ek baar, coverImage ke saath
router.get('/my-music', authMiddleware.authArtist, musicController.getMyMusic)

/* Search */
router.get('/search', authMiddleware.authAny, musicController.searchMusics)

/* Albums - specific pehle, dynamic baad mein */
router.get('/albums', authMiddleware.authAny, musicController.getAllAlbums)     
router.get('/albums/:id', authMiddleware.authAny, musicController.getAlbumById)

/* All music */
router.get('/', authMiddleware.authUser, musicController.getAllMusics)

module.exports = router