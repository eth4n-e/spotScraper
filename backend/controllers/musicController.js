// Purpose: implement the functionality of the routes, keep music.js (file for routes) clean
const Music = require('../models/musicModel');
const mongoose = require('mongoose');

// get all tracks
const getTracks = async(req, res) => {
    // find searches database for tracks
        // can specify properties like so
            // Music.find({artist_name: 'Nas'})
            // would grab all tracks with Nas as the artist
    const tracks = await Music.find({});

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
    const track = await Music.findById(id);

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
        const track = await Music.create({title, artist_name});
        res.status(200).json(track);
    } catch(error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    getTracks,
    getTrack,
    createTrack
}