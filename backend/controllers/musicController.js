// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
const Track = require('../models/trackModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// might need axios, dotenv, bcrypt

/* TO DO: register route
    - register a user in the db
        - create a spotify token
        - store username, email, password in db
            - hash password for security
        - save session
*/
const register = async(req, res) => {
    const {email, username, password} = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        // check if user exists by email
        const user = await User.find({email})

        // no user
            // add to db, create initial spotify token, 
        if(!user) {
            // create new user with hashed password
                // think: should I add authentication token to userSchema
                    // look over how to refresh a users token
            const newUser = await User.create(email, username, hash)
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
const login = async(req, res) => {
    // obtain email, username, password from request
    const {email, username, password} = req.body;

    // find user with matchin email
    const user = await User.findOne({email});

    if(!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    //user exists
    // validate password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if(!passwordMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    // user exists & password matches

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
    register,
    getTracks,
    getTrack,
    createTrack
}