// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
const Track = require('../models/trackModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
require('dotenv').config();
const axios = require('axios');
const { URLSearchParams } = require('url');

// client credentials / necessary data for spotify requests
const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/login'; // url to redirect back to after authorization


/** HELPER METHODS TO IMPLEMENT SPOTIFY AUTHORIZATION PKCE FLOW **/
// method to generate a code verifier (high-entropy cryptographic string)
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

// method to hash the code verifier
// returns a digest based on the SHA256 algorithm
const sha256 = async (plain) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return crypto.subtle.digest('SHA-256', data)
}

// method to return base64 representation of digest created by sha256 method
const base64encode = (input) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
}  
/** HELPER METHODS TO IMPLEMENT SPOTIFY AUTHORIZATION PKCE FLOW **/

/*******************/
/** AUTHORIZATION **/
const redirectToSpotifyAuth = async (req, res) => {
    // protection against attacks
    const state = req.body.state;
    // spotify functionality we want to access
    const scopes = 'user-read-private user-read-email playlist-modify-private playlist-modify-public playlist-read-collaborative user-top-read user-library-modify user-library-read';

    // receive code verifier for use in PKCE flow
    const codeVerifier = req.body.code_verifier;
    const hashedVerifier = await sha256(codeVerifier);
    const codeChallenge = base64encode(hashedVerifier);

    // pass the authorization url to the frontend
    // frontend handles redirect to spotify's authorization page
    try {
        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes,
            redirect_uri: redirectUri,
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
            state: state,
            show_dialog: true
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
const exchangeCodeForToken = async (code, codeVerifier) => {
    try {
        const tokenEndpoint = "https://accounts.spotify.com/api/token";
    
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        });

        return await tokenResponse.json();
    } catch(err) {
        console.error('Error obtaining token:', err);
        throw new Error('Failed to obtain Spotify access token');
    }
}

const getAccessToken = async (req, res) => {
    const codeVerifier = req.body.code_verifier;

    const code = req.body.code || null;
    const state = req.body.state || null;
  
    if (state === null || code === null) {
      res.status(500).json({error: 'State mismatch'});
    } else {
      try {
          const tokenResponse = await exchangeCodeForToken(code, codeVerifier);

          return res.status(200).json(tokenResponse);
          // to-do: create a mongoDB user upon successful tokenResponse
      } catch(err) {
          console.error('Error in /api/music/home route: ', err);
          res.status(500).json({ error: 'Failed to retrieve access token from Spotify' });
      }
    }
}
/** ACCESS TOKEN EXCHANGE **/
/***************************/

/*******************************/
/** USER RETRIEVAL & CREATION **/
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

// check if user already exists based on spotify user id
// if so
    // return existing user object
// else 
    // make request to spotify's getUserProfile api route
        // fetch user name, email, user id
    // instantiate a new User with data from spotify + access token + refresh token + expiration time
    // return new User
const createUser = async (req, res) => {
    try {
        const accessToken = req.body.accessToken;
        // access user info via spotify api
        const userResponse = await getUserInfoSpotify(accessToken);
        // search for user based on their spotify id
        const user = await User.findById(userResponse.id);

        if(user) { // existing user
            return res.status(200).json(user);
        } else if (userResponse.email === req.body.email) { // create user if provided email matches one associated with their account
            // extract important information
            const userName = userResponse.display_name;
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            const userCountry = userResponse.country;
            const userId = userResponse.id;
            const userImg = userResponse.images[0].url || '../public/discoBall.png';
            const refreshToken = req.body.refreshToken;
            const expiresIn = req.body.expiresIn;

            const newUser = await User.create({
                _id: userId,
                name: userName, 
                email: userEmail,
                password: userPassword,
                country: userCountry,
                profilePic: userImg,
                accessToken,
                refreshToken,
                tokenExpiration: expiresIn,
            });

            return res.status(200).json(newUser);
        } else {
            return res.status(401).json({error: 'User does not exist or provided email does not match email connected to spotify account'});
        }
    } catch(err) {
        return res.status(400).json({error: 'Error in user creation process'});
    }

}
/** USER RETRIEVAL & CREATION **/
/*******************************/

/***********************************/
/** TRACK RETRIEVAL & INPUT TO DB **/

// fetch tracks from spotify
const getSpotifyTracks = async (req, res) => {
    const token = req.body.token;
    const country = req.body.country;

    try {
        const trackResponse = await fetch('https://api.spotify.com/v1/me/tracks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`

            }
        });

        return await trackResponse.json();
    } catch (err) {
        res.status(401).json({error: err})
    }
}

/** TRACK RETRIEVAL & INPUT TO DB **/
/***********************************/
// get all tracks
// make request to spotify api to get top tracks for user
// const getTracks = async(req, res) => {
//     // find searches database for tracks
//         // can specify properties like so
//             // Music.find({artist_name: 'Nas'})
//             // would grab all tracks with Nas as the artist
//     const tracks = await Track.find({});

//     res.status(200).json(tracks);
// }

// // get single track
// const getTrack = async(req, res) => {
//     const { id } = req.params;

//     // ensure track has a valid id
//     if(!mongoose.Types.ObjectId.isValid(id)) {
//         return res.status(404).json({error: 'No such track'});
//     }

//     // get a particular track
//     const track = await Track.findById(id);

//     if(!track) {
//         return res.status(404).json({error: 'No such track'});
//     }

//     res.status(200).json(track);
// }

// // create a track
// const createTrack = async (req, res) => {
//     const {title, artist_name} = req.body;

//     // add doc to db
//     try {
//         const track = await Track.create({title, artist_name});
//         res.status(200).json(track);
//     } catch(error) {
//         res.status(400).json({error: error.message});
//     }
// }

module.exports = {
    generateRandomString,
    redirectToSpotifyAuth,
    getAccessToken,
    exchangeCodeForToken,
    getUserInfoSpotify,
    createUser,
    getSpotifyTracks,
}