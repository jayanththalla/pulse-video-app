const Video = require('../models/Video');
const fs = require('fs');
const path = require('path');

// Upload a video
exports.uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const video = new Video({
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
            size: req.file.size,
            mimeType: req.file.mimetype,
            duration: req.body.duration || 0, // Save duration
            sensitivityStatus: 'pending',
            uploadedBy: req.user._id
        });

        await video.save();

        // Trigger processing (async)
        const processingService = require('../services/processingService');
        processingService.processVideo(video._id, req.app.get('io'));

        res.status(201).json({ message: 'Video uploaded successfully', video });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Get all videos
exports.getVideos = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'editor') {
            query.uploadedBy = req.user._id;
        }

        const videos = await Video.find(query)
            .sort({ createdAt: -1 })
            .populate('uploadedBy', 'username role');

        res.json(videos);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

// Delete video
exports.deleteVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        if (video.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this video' });
        }

        if (fs.existsSync(video.path)) {
            fs.unlinkSync(video.path);
        }

        await video.deleteOne();
        res.json({ message: 'Video removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// Stream video
exports.streamVideo = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) {
            return res.status(404).json({ message: 'Video not found' });
        }

        const videoPath = video.path;
        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1]
                ? parseInt(parts[1], 10)
                : fileSize - 1;

            const chunksize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': video.mimeType,
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': video.mimeType,
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Stream Error' });
    }
};
