const express = require('express');
const {
    redirectToSpotifyAuth,
} = require('../controllers/authController');

const {
    getAccessToken,
} = require('../controllers/tokenController');

const {
    getUserSession,
    updateUser,
    login
} = require('../controllers/userController');

const { 
    fetchLikedSongs,
    fetchPlaylists,
    fetchTopTracks,
    deleteSelectLikedSongs,
    addSelectTracksToLikedSongs,
    addTracksFromSelectPlaylistsToLikedSongs
} = require('../controllers/musicController');

// use expresses router to handle all routes
const router = express.Router();

// configure route to be associated with particular controllers
router.post('/login', login);

router.post('/auth', redirectToSpotifyAuth);

router.get('/getUser', getUserSession);

router.post('/fetchLikedSongs', fetchLikedSongs);

router.put('/updateUser', updateUser)

router.post('/fetchPlaylists', fetchPlaylists);

router.post('/fetchTopTracks', fetchTopTracks);

router.put('/addSelectTracksToLikedSongs', addSelectTracksToLikedSongs);

router.put('/addTracksFromSelectPlaylistsToLikedSongs', addTracksFromSelectPlaylistsToLikedSongs);

router.delete('/deleteSelectLikedSongs', deleteSelectLikedSongs);

// export router for use in server.js
module.exports = router;