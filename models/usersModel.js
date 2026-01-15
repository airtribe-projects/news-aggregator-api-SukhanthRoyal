const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        trim: true
    }, 
    email: {
        type: String,
        required: true,
        trim:true, 
        unique: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    preferences: {
        type: [String], 
        enum: ['movies', 'comics'],
        default: ['movies']
    }
})

module.exports = mongoose.model("Users", usersSchema);