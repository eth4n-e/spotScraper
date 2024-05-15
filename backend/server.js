// get access to .env variables
require('dotenv').config()
const express = require('express');

const musicRoutes = require('./routes/music');
// create express app
const app = express();

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
app.use(musicRoutes);

// listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port ', process.env.PORT);
});