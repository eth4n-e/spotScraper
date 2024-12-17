const querystring = require('querystring');
require('dotenv').config();

// client credentials / necessary data for spotify requests
const clientId = process.env.CLIENT_ID;
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
    const codeChallenge = req.body.codeChallenge;
    // protection against attacks
    const state = generateRandomString(16).trimStart();
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
            code_challenge_method: 'S256',
            code_challenge: codeChallenge,
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

module.exports = {
    redirectToSpotifyAuth,
    generateRandomString
}