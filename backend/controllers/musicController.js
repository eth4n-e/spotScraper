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
            tokenExpiration: expiresIn,
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
        const user = req.body.user;

        // request new token
        const updatedToken = await refreshToken(user.refreshToken);

        const userDB = await User.findById({id: user.id}).exec();

        // user or null
        if(updatedToken) {
            if(userDB) { // update data for user in database
                userDB.accessToken = updatedToken.access_token;
                userDB.refreshToken = updatedToken.refresh_token || userDB.refreshToken;
                userDB.tokenExpiration = updatedToken.expires_in;
            } else { // update data for user in current session
                user.accessToken = updatedToken.accessToken;
                user.refreshToken = updatedToken.refresh_token || user.refreshToken;

                req.session.user = user;
            }
        }

        return res.status(200);
    } catch (err) {
        return res.status(400).json({error: 'Unable to update user data'});
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

            if(updatedToken) {
                user.accessToken = updatedToken.access_token;
                // refresh tokens are not always generated, in these instances default to the user's existing refreshToken
                user.refreshToken = updatedToken.refresh_token || user.refreshToken;
                user.tokenExpiration = updatedToken.expires_in;
            }
        }
        // store important information in the user's session
        req.session.user = {
            id: user._id,
            email: user.email,
            accessToken: user.accessToken,
            refreshToken: user.refreshToken
        }

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
    generateRandomString,
    redirectToSpotifyAuth,
    getAccessToken,
    getUserInfoSpotify,
    createUser,
    getUserSession,
    updateUser,
    login,
    refreshToken,
    getTracks,
    getTrack,
    createTrack
}