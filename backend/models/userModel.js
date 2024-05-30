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
    }
})

module.exports = mongoose.model('User', userSchema);