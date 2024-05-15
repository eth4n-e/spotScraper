const express = require('express');

// use expresses router to handle all routes
const router = express.Router();

// temporary placeholder route for setup
router.get('/', (req, res) => {
    res.json({message: 'Placeholder for now'});
});

// export router for use in server.js
module.exports = router;