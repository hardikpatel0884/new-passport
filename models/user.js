const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('Users', {
    name: {
        type: String,
        required: true, //validator
        minlength: 2, // minimum length
        trim: true //trim string
    },
    email: {
        type: String,
        required: true, //validator
        minlength: 2, // minimum length
        trim: true, //trim string
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true
    },
    tokens: [{
        auth: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

module.exports = { User };