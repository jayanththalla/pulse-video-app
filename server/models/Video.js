const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    mimeType: { type: String, required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duration: { type: Number },
    sensitivityStatus: {
        type: String,
        enum: ['pending', 'processing', 'safe', 'flagged'],
        default: 'pending'
    },
    processingProgress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
