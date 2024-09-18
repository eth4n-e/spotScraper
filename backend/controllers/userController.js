const User = require('../models/userModel');
const mongoose = require('mongoose');

const {
    getAccessToken,
    updateTokenDB,
    refreshToken,
} = require('./tokenController');


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
        throw new Error({error: 'Unable to retrieve user information'});
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

module.exports = {
    getUserInfoSpotify,
    createUser,
    getUserSession,
    updateUser,
    login,
}