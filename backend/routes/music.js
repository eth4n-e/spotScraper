const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { register,
    redirectToSpotifyAuth,
    getHome,
    exchangeCodeForToken,
    getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController');

// use expresses router to handle all routes
const router = express.Router();

router.post('/register', register);

// login
    // react will handle getting login page and redirects 
router.get('/login', redirectToSpotifyAuth);
// router.post('/login', login);
//router.get('/home', home);
router.get('/home', getHome, exchangeCodeForToken);

// get a single track
router.get('/:id', getTrack);

// create tracks to store in database
router.post('/', createTrack)

// export router for use in server.js
module.exports = router;