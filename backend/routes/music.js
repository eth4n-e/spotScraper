const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { 
    redirectToSpotifyAuth,
    getAccessToken,
    exchangeCodeForToken,
    getUserInfoSpotify,
    createUser,
    getSpotifyTracks, 
} = require('../controllers/musicController');

// use expresses router to handle all routes
const router = express.Router();

// configure route to be associated with particular controllers
router.post('/login', createUser, getUserInfoSpotify);

router.post('/auth', redirectToSpotifyAuth);

router.post('/getToken', getAccessToken, exchangeCodeForToken);

router.get('/getSpotifyTracks', getSpotifyTracks);

// export router for use in server.js
module.exports = router;