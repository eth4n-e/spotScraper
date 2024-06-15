// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
const Track = require('../models/trackModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const querystring = require('querystring');
require('dotenv').config();
// might need axios, dotenv, bcrypt
const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:4000/api/music/callback'; // url to redirect back to after authorization

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
    const state = generateRandomString(16);
    const scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
    }));
}

const callback = async (req,res) => {
    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
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
    callback,
    register,
    getTracks,
    getTrack,
    createTrack
}