const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { 
    redirectToSpotifyAuth,
    getAccessToken,
    getUserInfoSpotify,
    createUser,
    getUser,
    login,
    refreshToken,
    getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController');

// use expresses router to handle all routes
const router = express.Router();

// configure route to be associated with particular controllers
router.post('/login', login, createUser, getAccessToken, getUserInfoSpotify, refreshToken);

router.post('/auth', redirectToSpotifyAuth);

router.get('/user', getUser);

// export router for use in server.js
module.exports = router;