// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
const Track = require('../models/trackModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
require('dotenv').config();
const axios = require('axios');
const { URLSearchParams } = require('url');
const { access } = require('fs');

// client credentials / necessary data for spotify requests
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/login'; // url to redirect back to after authorization


/** HELPER METHOD TO IMPLEMENT SPOTIFY AUTHORIZATION FLOW **/
// method to generate a code verifier (high-entropy cryptographic string)
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}
/** HELPER METHOD TO IMPLEMENT SPOTIFY AUTHORIZATION FLOW **/

/*************************************************************/
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
const updateTokenDB = async (userDB, token) => {
    userDB.accessToken = token.access_token;
    // refresh tokens are not always generated, in these instances default to the user's existing refreshToken
    userDB.refreshToken = token.refresh_token || userDB.refreshToken;
    // additions to Date.now() are in milliseconds
    // tokens last for 1 hour (3600 seconds or 3600 * 1000 milliseconds)
    userDB.tokenExpiration = Date.now() + token.expires_in * 1000;

    // save updates to document in db
    await userDB.save();
}
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
/*************************************************************/

/*******************/
/** AUTHORIZATION **/
const redirectToSpotifyAuth = async (req, res) => {
    // protection against attacks
    const state = generateRandomString(16);
    // spotify functionality we want to access
    const scopes = 'user-read-private user-read-email playlist-modify-private playlist-modify-public playlist-read-collaborative user-top-read user-library-modify user-library-read';

    // pass the authorization url to the frontend
    // frontend handles redirect to spotify's authorization page
    try {
        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes,
            redirect_uri: redirectUri,
            state: state,
            show_dialog: true,
        });

        const authorize_url = `https://accounts.spotify.com/authorize?${queryParams}`;
        return res.status(200).json({auth_data: authorize_url});
    } catch(err) {
        console.log(err);
        res.status(500).json({'error': err});
    }
}
/** AUTHORIZATION **/
/*******************/

/***************************/
/** ACCESS TOKEN EXCHANGE **/
const getAccessToken = async (code, state) => {
    if (state === null || code === null) {
      throw new Error({error: 'State mismatch'});
    } else {
      try {
        const tokenEndpoint = "https://accounts.spotify.com/api/token";
        // fetch does not support form property (reason behind using body property)
        // data must be application/w-xxx-form-urlencoded
            // URLSearchParams helps accomplish this
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
            }),
        });

        return await tokenResponse.json();
      } catch(err) {
        throw new Error({error: 'Failed to retrieve access token'})
      }
    }
}
/** ACCESS TOKEN EXCHANGE **/
/***************************/

/****************************************/
/** USER RETRIEVAL + CREATION + UPDATE **/
const getUserInfoSpotify = async (accessToken) => {
    // use spotify's get current user profile API route to retrieve user name and email associated with user
    try {
        const userResponse = await fetch('https://api.spotify.com/v1/me', {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // return the body content of the response in json format
        return await userResponse.json(); 
    } catch (err) {
        console.error('Error retrieving information about the user: ', err);
        throw new Error('Unable to retrieve user information');
    }
}

// use information from the users profile, email, password, and token to create a user
const createUser = async (token, profile, email, password) => {
    try {
        // extract information needed for a new user
        const username = profile.display_name;
        const id = profile.id;
        const profilePic = profile.images[0].url || '../public/discoBall.png';
        const accessToken = token.access_token;
        const refreshToken = token.refresh_token;
        const expiresIn = token.expires_in;

        // insert user into db
        const newUser = await User.create({
            _id: id,
            name: username, 
            email: email,
            password: password,
            profilePic: profilePic,
            accessToken: accessToken,
            refreshToken: refreshToken,
            tokenExpiration: Date.now() + expiresIn * 1000,
        });

        return newUser
    } catch(err) {
        throw new Error({error: 'Unable to create user'})
    }
}

const getUserSession = (req, res) => {
    if(!req.session.user) {
        return res.status(401).json({message: 'Unauthorized'})
    }

    return res.status(200).json({
        user: req.session.user
    })
}

const updateUser = async (req, res) => {
    try {
        // current session's user passed in body of request
        console.log('request body', req.body);
        const user = req.body.user.data.user;

        // find associated user in db
        const userDB = await User.findById({_id: user._id}).exec();

        // check if user exists
        if(userDB) {
            // request new token
            const updatedToken = await refreshToken(user.refreshToken);

            // check if token exists
            if(updatedToken) {
                // update user's tokens
                updateTokenDB(userDB, updatedToken);
                // update session information if updates to user occur
                req.session.user = userDB
            }
        }

        // if no updates occur, req.session.user will correspond to the user set from login
        // updates are only necessary if token expiration occurs
        return res.status(200).json({user: req.session.user});
    } catch (err) {
        console.log(err);
        return res.status(400).json({error: 'Unable to update user'});
    }
}
/** USER RETRIEVAL + CREATION + UPDATE **/
/****************************************/

/***********/
/** LOGIN **/
const login = async (req, res) => {
    /*
    Handles:
        - access token creation if the user has never been registered
            - creates user in the database
        - refreshes token if the user already exists
    */
    try {
        const email = req.body.email;
        const password = req.body.password;
        const code = req.body.code;
        const state = req.body.state;
        // find user with the associated email entered
            // multiple spotify accounts cannot be linked to the same exact email 
        let user = await User.findOne({email: email}).exec();

        // user has not yet been created
        if(!user) {
            // create access token
            const token = await getAccessToken(code, state);
            // fetch the user's profile info from spotify
            const profile = await getUserInfoSpotify(token.access_token);
            
            // insert user into db
            user = await createUser(token, profile, email, password);
        } else if(user && user.email == email && user.password == password) { // user exists, verify that email and password match the user's credentials
            // refresh the user's token and update in the db
            const updatedToken = await refreshToken(user.refreshToken);

            if(updatedToken) { // if new token received update the user's document
                updateTokenDB(user, updatedToken);
            }
        }
        // store important information in the user's session
        req.session.user = user;

        return res.status(200).json({user: user});
    } catch(err) {
        console.error(err);
        res.status(400).json({error: err});
    }
}
/** LOGIN **/
/***********/

/*******************/
/** REFRESH TOKEN **/
const refreshToken = async (refreshToken) => {
    try {
        const url = 'https://accounts.spotify.com/api/token';
        // data necessary for refreshing token
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64')),
        });

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        });

        // fetch token
        const updatedToken = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        return await updatedToken.json();
    } catch (err) {
        console.error(err);
        throw new Error('Unable to refresh spotify token');
    }
}
/** REFRESH TOKEN **/
/*******************/

/***********************/
/** FETCH LIKED SONGS **/
const fetchLikedSongs = async (req, res) => {
    const token = req.body.token;
    const country = req.body.country;

    try {
        // first endpoint to perform request
        let trackEndpoint = `https://api.spotify.com/v1/me/tracks?market=${country}&limit=50&offset=0`
        // let tracks = []

        const trackResponse = await fetch(trackEndpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const trackData = await trackResponse.json();

        return res.status(200).json(trackData);
        // while(trackEndpoint) {
        //     // make request to spotify's tracks endpoint
        //     const trackResponse = await fetch(trackEndpoint, {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${token}`

        //         }
        //     });

        //     // parse response to JS object
        //     const trackData = await trackResponse.json();
          
        //     // update endpoint to continue fetching liked songs
        //     trackEndpoint = trackData.data.next;

        //     // add the tracks to our array
        //     tracks.concat(trackData.data.items);
        // }
        // return tracks;
    } catch (err) {
        res.status(401).json({error: err})
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

        // template once we begin to implement pagination
        // while(trackEndpoint) {
        //     // make request to spotify's tracks endpoint
        //     const trackResponse = await fetch(trackEndpoint, {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${token}`

        //         }
        //     });

        //     // parse response to JS object
        //     const trackData = await trackResponse.json();
          
        //     // update endpoint to continue fetching liked songs
        //     trackEndpoint = trackData.data.next;

        //     // add the tracks to our array
        //     tracks.concat(trackData.data.items);
        // }
        // return tracks;
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

        const trackResponse = await fetch(trackEndpoint, {
            method: "GET",

            headers: {
              Authorization: 'Bearer ' + user.accessToken  
            }
        })

        const trackData = await trackResponse.json();

        res.status(200).json({tracks: trackData});

    } catch(err) {
        console.log(err);
        res.status(401).json({error: "Unable to fetch user's top tracks"});
    }
}

/** FETCH TOP TRACKS **/
/**********************/


module.exports = {
    generateRandomString,
    redirectToSpotifyAuth,
    getAccessToken,
    getUserInfoSpotify,
    createUser,
    getUserSession,
    updateUser,
    login,
    refreshToken,
    fetchLikedSongs,
    fetchPlaylists,
    fetchTopTracks,
}