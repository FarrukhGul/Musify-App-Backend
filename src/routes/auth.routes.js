const express = require('express')
const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middlewares/auth.middleware')
const multer = require('multer')

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router();

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/logout', authController.logoutUser)
router.get('/profile', authMiddleware.authAny, authController.getProfile)
router.put('/profile', authMiddleware.authAny, upload.single('profilePic'), authController.updateProfile)

module.exports = router