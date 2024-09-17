// get access to .env variables
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const musicRoutes = require('./routes/music');
const session = require('express-session');
// create express app
const app = express();

// use MongoDB to store sessions
const sessionStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions',
});

const corsOptions = {
    origin: 'http://localhost:3000'
}

// middleware setup
// cross-origin resource sharing
    // ensures safe access to data / resources
    // determines which origins (protocol, hostname, port) can access resources / have permission
    // e.g. define localhost as origin, only localhost can get data / access backend resources
app.use(cors(corsOptions));
    
// setup sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET, // Replace with a strong secret key
      resave: false,
      saveUninitialized: false,
      store: sessionStore,
      cookie: { secure: false } // Set to true if using HTTPS
    })
  );
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