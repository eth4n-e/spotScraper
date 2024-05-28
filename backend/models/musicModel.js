// use mongoose to organize and manage data / relationships
const mongoose = require('mongoose');

// store schema function
const Schema = mongoose.Schema

// instantiate a new schema
    // schema is like "what will the data in the collection look like?"
// schemas define structure / properties of mongoDB documents
    // how should music data / object look
    // each music document must follow this structure
        // Note: document in mongoDB is like a json object with key:value pairs describing the data
const musicSchema = new Schema({
    title: { // property
        type: String,
        required: true // if field is missing, will not allow us to save document
    },
    artist_name: {
        type: String,
        required: true,
    },
    // come back and add more properties depending on usage
}, { timestamps: true })
// timestamps creates a created_at and updated_at property for each document

// create a model
// model allows us to interact with collection (Musics, created when model is also created)
    // in terms of sql: model is like queries to interact with data
module.exports = mongoose.model('Music', musicSchema)