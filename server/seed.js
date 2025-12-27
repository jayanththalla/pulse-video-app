const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Video = require('./models/Video');

// Load env vars
dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch(err => {
        console.error('Connection Failed:', err);
        process.exit(1);
    });

// Helper to transform exported JSON
const transformData = (data, type) => {
    return data.map(item => {
        const newItem = { ...item };

        // Fix _id
        if (newItem._id && newItem._id.$oid) {
            newItem._id = newItem._id.$oid;
        }

        // Fix Dates
        if (newItem.createdAt && newItem.createdAt.$date) {
            newItem.createdAt = new Date(newItem.createdAt.$date);
        }

        // Fix Refs (for videos)
        if (type === 'video' && newItem.uploadedBy && newItem.uploadedBy.$oid) {
            newItem.uploadedBy = newItem.uploadedBy.$oid;
        }

        return newItem;
    });
};

const seedDB = async () => {
    try {
        // Read Files
        const usersRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../pulse_video_app.users.json'), 'utf-8'));
        const videosRaw = JSON.parse(fs.readFileSync(path.join(__dirname, '../pulse_video_app.videos.json'), 'utf-8'));

        const users = transformData(usersRaw, 'user');
        const videos = transformData(videosRaw, 'video');

        // Clear existing data (optional, but safer to avoid dupes on re-run)
        await User.deleteMany({});
        await Video.deleteMany({});
        console.log('Cleared existing data.');

        // Insert
        await User.insertMany(users);
        console.log(`Imported ${users.length} users.`);

        await Video.insertMany(videos);
        console.log(`Imported ${videos.length} videos.`);

        console.log('Seeding Complete!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
