const { URLSearchParams } = require('url');
require("dotenv").config;
const User = require('../models/userModel');
const mongoose = require('mongoose');

// client credentials / necessary data for spotify requests
const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = 'http://localhost:3000/login'; // url to redirect back to after authorization

/*************************************************************/
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
const updateTokenDB = async (userDB, token) => {
    userDB.accessToken = token.access_token;
    // refresh tokens are not always generated, in these instances default to the user's existing refreshToken
    userDB.refreshToken = token.refresh_token || userDB.refreshToken;
    // additions to Date.now() are in milliseconds
    // tokens last for 1 hour (3600 seconds or 3600 * 1000 milliseconds)
    userDB.tokenExpiration = Date.now() + token.expires_in * 1000;

    await userDB.save();
}
/** HELPER METHOD TO CHECK REFRESH TOKEN AND UPDATE DB USER */
/*************************************************************/

/***************************/
/** ACCESS TOKEN EXCHANGE **/
const getAccessToken = async (code, codeVerifier) => {
    try {
        const tokenEndpoint = "https://accounts.spotify.com/api/token";
        // fetch does not support form property (reason behind using body property)
        // data must be application/w-xxx-form-urlencoded
        // URLSearchParams helps accomplish this
        const tokenResponse = await fetch(tokenEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                client_id: clientId,
                code: code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        });
        return await tokenResponse.json();
    } catch(err) {
        throw new Error({error: 'Failed to retrieve access token'})
    }
}
/** ACCESS TOKEN EXCHANGE **/
/***************************/

/*******************/
/** REFRESH TOKEN **/
const refreshToken = async (refreshToken) => {
    try {
        const url = 'https://accounts.spotify.com/api/token';
    
        const headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded',
        });

        const body = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
            client_id: clientId,
        });

        const updatedToken = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        console.log("Updated token in refresh token endpoint: ", updatedToken);

        return await updatedToken.json();
    } catch (err) {
        console.error(err);
        throw new Error({error: 'Unable to refresh spotify token'});
    }
}
/** REFRESH TOKEN **/
/*******************/

module.exports = {
    updateTokenDB,
    getAccessToken,
    refreshToken,
}