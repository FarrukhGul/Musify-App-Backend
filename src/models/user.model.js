const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'artist'], default: 'user' },
    profilePic: { type: String, default: '' },      // ← add
    bio: { type: String, default: '' },             // ← add
})

const userModel = mongoose.model('user', userSchema)
module.exports = userModel