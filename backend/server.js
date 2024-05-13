// get access to .env variables
require('dotenv').config()
const express = require('express');

// create express app
const app = express();

// middleware setup
app.use((req, res, next) => {
    // log path and request method
    console.log(req.path, req.method);
    // transfer to next request / middleware function
    next();
})

// routes
app.get('/', (req, res) => {
    res.json({mssg: 'Welcome to the app'});
})

// listen for requests
app.listen(process.env.PORT, () => {
    console.log('listening on port ', process.env.PORT);
});