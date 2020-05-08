const mongoose = require('mongoose');

// Patterns
const { __object_name } = require('../globals/patterns');

const schema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    meeting: {
        type: String,
        required: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    }
    
});

module.exports = mongoose.model('Meeting', schema);