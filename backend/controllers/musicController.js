const { addTracksToLikedSongsHelper, getPlaylistItems } = require('../utils/helpers.js');
const { pLimit } = require('p-limit');

// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
/***********************/
/** FETCH LIKED SONGS **/
const fetchLikedSongs = async (req, res) => {
    try {
        const token = req.body.user.accessToken;
        const LIMIT = 50;
        let offset = 0;
        // first endpoint to perform request
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?limit=${LIMIT}&offset=${offset}`;

        const firstPageOfTracks = await fetch(trackEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });

        const trackData = await firstPageOfTracks.json();
        offset += LIMIT;
        const TOTAL_TRACKS = trackData.total;

        const tracks = await paginateLikedSongs(token, TOTAL_TRACKS, LIMIT, offset);

        return res.status(200).json({tracks: trackData});
    } catch (err) {
        res.status(401).json({error: err})
    }
}

const paginateLikedSongs = async (token, totalTracks, trackLimit, trackOffset) => {
    try {
        const requestLimit = pLimit(15);
        const LIMIT = trackLimit;
        let offset = trackOffset;

        const requests = [];
        let newEndpoint;

        while(offset < totalTracks) {
            newEndpoint = `https://api.spotify.com/v1/me/tracks?limit=${LIMIT}&offset=${offset}`;
            // using p-limit to run promise.allSettled with limited concurrency
            requests.push(
                requestLimit(() => fetch(newEndpoint, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',  
                    }
                }).then(response => response.json()))
            );

            offset += LIMIT;
        }

        const trackResults = await Promise.allSettled(requests);

        console.log("Track results from paginateLikedSongs: " ,trackResults[1].value);
        // fetch all tracks
        // while(endpoint) {
        //     const trackResponse = await fetch(endpoint, {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     });

        //     // body of response parsed in json
        //     const trackData = await trackResponse.json();

        //     endpoint = trackData.next;

        //     tracks.concat(trackData.items);
        // }

        // return tracks;
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
const deleteLikedSongs = async (req, res) => {
    try {
        // TO-DO: implement batching / chunking here
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

/****************/
/** ADD TRACKS **/
const addTracksToLikedSongs = async (req, res) => {
    try {
        let trackIds = req.body.idList;
        let token = req.body.user.accessToken;
        
        const addResult = await addTracksToLikedSongsHelper(token, trackIds);

        res.status(201).json({"message": "Tracks successfully added to liked songs"});
    } catch (err) {
        console.error(err);
    }
}

const addAllTracksToLikedSongs = async (req, res) => {

}
/** ADD TRACKS **/
/****************/

/*******************/
/** ADD PLAYLISTS **/
const addTracksFromPlaylistsToLikedSongs = async (req, res) => {
    try {
        let playlistIds = req.body.itemIds;
        let token = req.body.user.accessToken;
  
        // allPlaylistItems is a list of lists containing track ids for each playlist
        const allPlaylistItems = await Promise.allSettled(playlistIds.map(id => getPlaylistItems(token, id)));

        // result was coming back as 2D array, addTracksToLikedSongsHelper expects a 1D array to perform chunking
        const allTrackIds = allPlaylistItems.map(playlistItem => playlistItem.value.flat());

        const addResult = await addTracksToLikedSongsHelper(token, allTrackIds);

        // console.log(addResult);

        res.status(201).json({"message": "Tracks from each playlist have been added to liked songs"});
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
    addTracksToLikedSongs,
    deleteLikedSongs,
    addTracksFromPlaylistsToLikedSongs,
}