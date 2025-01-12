const Message = require('../models/messageModel');
const identifier=require('../middlewares/identification');

// ✅ Send a new chat message
exports.sendMessage = async (req, res) => {
  const { fullName, text } = req.body;

  if (!fullName || !text) {
    return res.status(400).json({ message: 'Full name and text are required.' });
  }

  try {
    const newMessage = new Message({ fullName, text });
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: 'Error sending message', error: err });
  }
};

// ✅ Get all chat messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages', error: err });
  }
};
