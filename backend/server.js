// get access to .env variables
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const musicRoutes = require('./routes/music');
// create express app
const app = express();

// cross-origin resource sharing
    // ensures safe access to data / resources
    // determines which origins (protocol, hostname, port) can access resources / have permission
    // e.g. define localhost as origin, only localhost can get data / access backend resources
app.use(cors());
// middleware setup
    // parse data sent in request into json
app.use(express.json());
app.use((req, res, next) => {
    // log path and request method
    console.log(req.path, req.method);
    // transfer to next request / middleware function
    next();
})

// use routes defined in music.js
app.use('/api/music', musicRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests only after successfully connecting 
        app.listen(process.env.PORT, () => {
        console.log('connected to db & listening on port', process.env.PORT);
        });
    }).catch((err) => {
        console.log(err)
    })