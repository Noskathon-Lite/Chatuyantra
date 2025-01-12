const { verify } = require('jsonwebtoken');
const { MongoInvalidArgumentError } = require('mongodb');
const mongoose = require('mongoose');
const usersModel = require("../models/usersModel");

const messageSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    text: { type: String, required: true },

    timestamp: { type: Date, default: Date.now },
  });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;