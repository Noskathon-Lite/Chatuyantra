const { verify } = require('jsonwebtoken');
const { MongoInvalidArgumentError } = require('mongodb');
const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minLength: [5, 'Email must be at least 5 characters long'],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        trim: true,
        select: false,
        minLength: [8, 'Password must be at least 8 characters long'],
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    verified: {
        type: Boolean,
        default: false,
    },

}, { timestamps: true });

module.exports = mongoose.model('Users', usersSchema);