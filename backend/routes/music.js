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
    deleteLikedSongs,
    deleteAllLikedSongs,
    addTracksToLikedSongs,
    addTracksFromPlaylistsToLikedSongs
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

router.put('/addTracksToLikedSongs', addTracksToLikedSongs);

router.put('/addTracksFromPlaylistsToLikedSongs', addTracksFromPlaylistsToLikedSongs);

router.delete('/deleteLikedSongs', deleteLikedSongs);

router.delete('/deleteAllLikedSongs', deleteAllLikedSongs);

// export router for use in server.js
module.exports = router;