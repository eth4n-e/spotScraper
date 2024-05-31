const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { register,
    login,
    getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController')

// use expresses router to handle all routes
const router = express.Router();

// login
    // react will handle getting login page and redirects 
router.post('/', login);

// get a single track
router.get('/:id', getTrack);

// create tracks to store in database
router.post('/', createTrack)

// export router for use in server.js
module.exports = router;