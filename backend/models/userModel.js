// use mongoose to organize and manage data / relationships
const mongoose = require('mongoose');

// store schema function
const Schema = mongoose.Schema

// create schema to define data associated with a user
    // potential add-ons:
        // a way to connect users to playlists
const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    tokenExpiration: {
        type: Number,
        required: true,
    }, 
    codeVerifier: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('User', userSchema);