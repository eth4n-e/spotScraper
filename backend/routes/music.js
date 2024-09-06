const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { 
    redirectToSpotifyAuth,
    getAccessToken,
    getUserInfoSpotify,
    createUser,
    getUserSession,
    updateUser,
    login,
    refreshToken,
    fetchPlaylists,
    getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController');

// use expresses router to handle all routes
const router = express.Router();

// configure route to be associated with particular controllers
router.post('/login', login);

router.post('/auth', redirectToSpotifyAuth);

router.get('/getUser', getUserSession);

router.put('/updateUser', updateUser)

router.post('/fetchPlaylists', fetchPlaylists);

// export router for use in server.js
module.exports = router;