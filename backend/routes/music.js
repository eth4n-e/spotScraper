const express = require('express');
// import Music Model
const Music = require('../models/musicModel');

const {getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController')

// use expresses router to handle all routes
const router = express.Router();

// get all tracks
router.get('/', getTracks);

// get a single track
router.get('/:id', getTrack);

// create tracks to store in database
router.post('/', createTrack)

// export router for use in server.js
module.exports = router;