const { chunkArray } = require('../utils/helpers.js');

// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
/***********************/
/** FETCH LIKED SONGS **/
const fetchLikedSongs = async (req, res) => {
    const user = req.body.user;

    try {
        // first endpoint to perform request
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?limit=50&offset=0`;

        const trackResponse = await fetch(trackEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${user.accessToken}`
            }
        });

        const trackData = await trackResponse.json();
        // const tracks = await paginateLikedSongs(trackEndpoint, user.accessToken);

        return res.status(200).json({tracks: trackData});
    } catch (err) {
        res.status(401).json({error: err})
    }
}

const paginateLikedSongs = async (endpoint, token) => {
    try {
        const tracks = [];

        // fetch all tracks
        while(endpoint) {
            const trackResponse = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            // body of response parsed in json
            const trackData = await trackResponse.json();

            endpoint = trackData.next;

            tracks.concat(trackData.items);
        }

        return tracks;
    } catch(err) {
        throw new Error({error: 'Unable to retrieve liked songs list'});
    }
}
/** FETCH LIKED SONGS **/
/***********************/

/*********************/
/** FETCH PLAYLISTS **/
const fetchPlaylists = async (req, res) => {
    const user = req.body.user;

    try {
        let playlistEndpoint = `https://api.spotify.com/v1/users/${user._id}/playlists`;

        const playlistResponse = await fetch(playlistEndpoint, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + user.accessToken
            }
        });

        const playlistData = await playlistResponse.json();

        return res.status(200).json({playlists: playlistData});
    }  catch (err) {
        console.log(err);
        res.status(401).json({error: "Unable to fetch user's playlists"});
    }
}

/** FETCH PLAYLISTS **/
/*********************/

/**********************/
/** FETCH TOP TRACKS **/
const fetchTopTracks = async (req, res) => {
    const user = req.body.user;

    try {
        const topItemType = 'tracks'
        let trackEndpoint = `https://api.spotify.com/v1/me/top/${topItemType}?time_range=long_term&limit=50`;

        const trackData = await paginateTopTracks(trackEndpoint, user.accessToken);

        res.status(200).json({tracks: trackData});

    } catch(err) {
        console.log(err);
        res.status(401).json({error: "Unable to fetch user's top tracks"});
    }
}

const paginateTopTracks = async (endpoint, token) => {
    try {
        let tracks = []

        // retrieve top1000 tracks from different pages
        while(endpoint && tracks.length < 1000) {
            const trackResponse = await fetch(endpoint, {
                method: "GET",
                headers: {
                  Authorization: 'Bearer ' + token  
                }
            })
    
            const trackData = await trackResponse.json();

            // next stores endpoint to next page of tracks
            endpoint = trackData.next;

            tracks = tracks.concat(trackData.items);
        }

        return tracks;
    } catch(err) {
        throw new Error({error: 'Unable to retrieve list of top tracks'});
    }
}
/** FETCH TOP TRACKS **/
/**********************/

/************************/
/** DELETE LIKED SONGS **/
const deleteSelectLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${trackIds}`

        await fetch(trackEndpoint, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        res.status(200).json({"message": "Tracks successfully removed from liked songs"});

    } catch (err) {
        console.error(err);
    }
}

const deleteAllLikedSongs = async (req, res) => {

}
/** DELETE LIKED SONGS **/
/************************/

/********************/
/** ADD TOP TRACKS **/
const addSelectTracksToLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${trackIds}`;
        await fetch(trackEndpoint, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        })

        res.status(201).json({"message": "Tracks successfully added to liked songs"});
    } catch (err) {
        console.error(err);
    }
}

const addAllTracksToLikedSongs = async (req, res) => {

}
/** ADD TOP TRACKS **/
/********************/

/*******************/
/** ADD PLAYLISTS **/
const addTracksFromSelectPlaylistsToLikedSongs = async (req, res) => {
    // need to first get the items contained in the playlist so that these can be added to liked songs
        // make separate controller for this

    // make a put request to track endpoint to add these songs to user's liked songs
    try {
        const CHUNK_SIZE = 50;
        let playlistIds = req.body.itemIds;
        let token = req.body.user.accessToken;
        let tracks = [];
        
        // retrieve all tracks from each playlist
        // think about converting this to promise.all for concurrent processing
        playlistIds.forEach( async id => {
            let endpoint = `https://api.spotify.com/v1/playlists/${id}/tracks`;

            while(endpoint) {
                let getPlaylistItems = await fetch(endpoint, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                let playlistData = await getPlaylistItems.json();

                endpoint = playlistData.next;

                tracks.push(playlistData.items);
            }
        });

        let chunkedTracks = chunkArray(tracks, CHUNK_SIZE);

        chunkedTracks.forEach( async trackBatch => {
            console.log(trackBatch);
            let trackEndpoint = `https://api.spotify.com/v1/me/tracks?ids=${trackBatch}`;
            const addTrackResponse = await fetch(trackEndpoint, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            const addTrackData = addTrackResponse.json();
            
            trackEndpoint = addTrackData.next;
        })
    } catch(err) {
        console.error(err);
    }
}

const addTracksFromAllPlaylists = async (req, res) => {

}
/** ADD PLAYLISTS **/
/*******************/

module.exports = {
    fetchLikedSongs,
    fetchPlaylists,
    fetchTopTracks,
    addSelectTracksToLikedSongs,
    deleteSelectLikedSongs,
    addTracksFromSelectPlaylistsToLikedSongs,
}