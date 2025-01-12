const express = require('express');
const helmet = require('helmet');
const http = require('http');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRouter');

const app = express();

const server = http.createServer(app);

// Middleware
app.use(helmet());
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('Connected to MongoDB');
  }).catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });

  // Home route (for testing)
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
  });

  app.use('/api/auth', authRouter);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
