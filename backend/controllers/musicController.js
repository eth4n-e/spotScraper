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
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/home'; // url to redirect back to after authorization

/* TO DO: register route
    - register a user in the db
        - store username, email, password in db
            - hash password for security
*/
const register = async(req, res) => {
    const {email, username, password} = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);
        // check if user exists by email
        const user = await User.find({email});
        // no user
            // add to db 
        if(!user) {
            const authToken = undefined;
            const refreshToken = undefined;
            const tokenExpiration = undefined;

            // create new user with hashed password
                // set authentications to undefined
                // update these upon login
                    // in other requests, refresh the spotify token
            const newUser = await User.create(email, username, hash, authToken, refreshToken, tokenExpiration);
            res.status(200).json({user: newUser});
        } else {
            res.status(400).json({error: 'User already exists'});
        }
    } catch(err) {
        res.status(400).json({ error: err });
    }
}

/* TO DO: login route:
    - search for user in db
    - keep track of session 
*/
// still needs work

// 
const setAccessToken = async (req, res) => {

}

const refreshAccessToken = async (req, res) => {

}

// helper method to generate random string
const generateRandomString = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const login = async (req, res) => {
    console.log('Received request to login');

    const state = generateRandomString(16);
    const scopes = ['user-read-private', 'user-read-email'];

    // pass the authorization url to the frontend
    // frontend handles redirect to spotify's authorization page
    try {
        const queryParams = querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scopes.join(' '),
            redirect_uri: redirectUri,
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

const exchangeCodeForToken = async (code) => {
    try {
        const authOptions = {
            form: {
                code: code,
                redirect_uri: redirectUri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(clientId + ':' + clientSecret).toString('base64'))
            },
            json: true
        };
    
        const tokenResponse = await axios.post(
            'https://accounts.spotify.com/api/token',
            authOptions
        );

        return {
            accessToken: tokenResponse.data.access_token,
            refreshToken: tokenResponse.data.refresh_token,
            tokenExpiration: tokenResponse.data.expires_in
        }
        // to-do: create a mongoDB user upon successful tokenResponse
    } catch(err) {
        console.error('Error obtaining token:', err);
        throw new Error('Failed to obtain Spotify access token');
    }
}

const getHome = async (req, res) => {
    console.log('in callback');
    const code = req.query.code || null;
    const state = req.query.state || null;
  
    console.log(code);
    console.log(state);
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      try {
          const tokenResponse = await exchangeCodeForToken(code);

          return res.status(200).json(tokenResponse);
          // to-do: create a mongoDB user upon successful tokenResponse
      } catch(err) {
          console.error('Error in /api/music/home route: ', err);
          res.status(500).json({ error: 'Failed to retrieve access token from Spotify' });
      }
    }
}

// get all tracks
// make request to spotify api to get top tracks for user
const getTracks = async(req, res) => {
    // find searches database for tracks
        // can specify properties like so
            // Music.find({artist_name: 'Nas'})
            // would grab all tracks with Nas as the artist
    const tracks = await Track.find({});

    res.status(200).json(tracks);
}

// get single track
const getTrack = async(req, res) => {
    const { id } = req.params;

    // ensure track has a valid id
    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such track'});
    }

    // get a particular track
    const track = await Track.findById(id);

    if(!track) {
        return res.status(404).json({error: 'No such track'});
    }

    res.status(200).json(track);
}

// create a track
const createTrack = async (req, res) => {
    const {title, artist_name} = req.body;

    // add doc to db
    try {
        const track = await Track.create({title, artist_name});
        res.status(200).json(track);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    login,
    getHome,
    exchangeCodeForToken,
    register,
    getTracks,
    getTrack,
    createTrack
}