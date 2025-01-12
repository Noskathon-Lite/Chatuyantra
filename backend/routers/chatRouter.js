const express = require('express');
const Message = require('../models/messageModel'); // Import Message model
const chatController = require('../controllers/chatController');
const router = express.Router();
const { identifier } =require('../middlewares/identification');

//  Route to send a new message ( token needed)
router.post('/message',identifier, chatController.sendMessage);

//  Route to fetch all messages token needed
router.get('/messages',identifier, chatController.getMessages);

module.exports = router;
