const express = require('express');
// import Music Model
const Track = require('../models/trackModel');

const { register,
    login,
    callback,
    getTracks, 
    getTrack,
    createTrack,
} = require('../controllers/musicController')

// use expresses router to handle all routes
const router = express.Router();

router.post('/register', register);

// login
    // react will handle getting login page and redirects 
router.get('/login', login);
// router.post('/login', login);
router.get('/callback', callback);

// get a single track
router.get('/:id', getTrack);

// create tracks to store in database
router.post('/', createTrack)

// export router for use in server.js
module.exports = router;