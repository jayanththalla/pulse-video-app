const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require("socket.io");
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all for now, tighten for prod
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/pulse_video_app')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Routes
const videoRoutes = require('./routes/videoRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/videos', videoRoutes);
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Pulse API is running');
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
