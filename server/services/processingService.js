const Video = require('../models/Video');

exports.processVideo = async (videoId, io) => {
    const video = await Video.findById(videoId);
    if (!video) return;

    video.sensitivityStatus = 'processing';
    await video.save();

    if (io) io.emit('video_status_update', { _id: video._id, status: 'processing', progress: 0 });

    let progress = 0;
    const interval = setInterval(async () => {
        progress += 10;

        if (progress % 20 === 0) {
            video.processingProgress = progress;
            await video.save();
        }

        if (io) io.emit('progress_update', { _id: video._id, progress });

        if (progress >= 100) {
            clearInterval(interval);

            // Mock sensitivity analysis
            const isSafe = Math.random() > 0.3;
            video.sensitivityStatus = isSafe ? 'safe' : 'flagged';
            video.processingProgress = 100;
            await video.save();

            if (io) {
                io.emit('video_status_update', {
                    _id: video._id,
                    status: video.sensitivityStatus,
                    progress: 100
                });
            }
        }
    }, 1000);
};
