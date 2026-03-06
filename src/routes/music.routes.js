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

/* Liked Songs - /:id se PEHLE */
router.get('/liked', authMiddleware.authAny, musicController.getLikedSongs)

/* Albums */
router.get('/albums', authMiddleware.authAny, musicController.getAllAlbums)     
router.get('/albums/:id', authMiddleware.authAny, musicController.getAlbumById)

/* All music */
router.get('/', authMiddleware.authUser, musicController.getAllMusics)

/* Like / Unlike */
router.post('/:id/like', authMiddleware.authAny, musicController.likeMusic)
router.delete('/:id/like', authMiddleware.authAny, musicController.unlikeMusic)

// router for music download
router.get('/:id/download', authMiddleware.authAny, musicController.downloadMusic);

//router to delete the music
router.delete('/:id', authMiddleware.authArtist, musicController.deleteMusic);

//router to delete the album
router.delete('/album/:id', authMiddleware.authArtist, musicController.deleteAlbum);

module.exports = router