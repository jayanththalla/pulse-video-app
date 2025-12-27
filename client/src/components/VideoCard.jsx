import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Trash2, Clock, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VideoCard = ({ video, user, onDelete }) => {
    const videoRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [duration, setDuration] = useState(video.duration || 0);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (videoRef.current && video.sensitivityStatus === 'safe') {
            videoRef.current.play().catch(e => console.log('Autoplay prevented', e));
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'safe': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case 'flagged': return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'safe': return <ShieldCheck className="w-3 h-3" />;
            case 'flagged': return <AlertTriangle className="w-3 h-3" />;
            default: return <Loader2 className="w-3 h-3 animate-spin" />;
        }
    };

    // Format Duration (e.g. 125s -> 2:05)
    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Format Relative Time
    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " mins ago";
        return Math.floor(seconds) + " seconds ago";
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Thumbnail / Video Preview Area */}
            <div className="relative aspect-video bg-zinc-900 overflow-hidden">
                {/* Play Button Overlay (Visible when not playing) */}
                <div className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                        <Play className="w-5 h-5 text-white ml-1" fill="currentColor" />
                    </div>
                </div>

                {/* Status Badge */}
                <div className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border backdrop-blur-md ${getStatusColor(video.sensitivityStatus)}`}>
                    {getStatusIcon(video.sensitivityStatus)}
                    {video.sensitivityStatus}
                </div>

                {/* Duration Badge (Real) */}
                <div className="absolute bottom-3 right-3 z-20 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDuration(duration)}</span>
                </div>

                {/* Video Preview (Muted) */}
                <video
                    ref={videoRef}
                    src={`/api/videos/stream/${video._id}`}
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
                    muted
                    loop
                    playsInline
                    onLoadedMetadata={handleLoadedMetadata}
                />
            </div>

            {/* Content Area */}
            <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h3 className="font-bold text-lg text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                            {video.originalName}
                        </h3>
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm text-zinc-400 flex items-center gap-1">
                                by <span className="text-zinc-300 font-medium">
                                    {video.uploadedBy?._id === user?._id ? 'You' : video.uploadedBy?.username || 'Unknown'}
                                </span>
                            </p>
                            <p className="text-xs text-zinc-500">
                                {getTimeAgo(video.createdAt || new Date())}
                            </p>
                        </div>
                    </div>

                    {/* Delete Action */}
                    {(user.role === 'admin' || user._id === video.uploadedBy) && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onDelete(video._id); }}
                            className="text-zinc-500 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-500/10 rounded-lg"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Progress Bar (if processing) */}
                {video.sensitivityStatus === 'processing' && (
                    <div className="mt-4">
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>Processing...</span>
                            <span>{video.processingProgress}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                            <motion.div
                                className="bg-primary h-full rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${video.processingProgress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Meta Info */}
                <div className="mt-4 flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/50 pt-3">
                    <span>{(video.size / (1024 * 1024)).toFixed(1)} MB</span>
                    <Link
                        to={`/play/${video._id}`}
                        className="text-white font-medium hover:underline decoration-primary underline-offset-4 decoration-2"
                        onClick={(e) => {
                            if (video.sensitivityStatus === 'processing') e.preventDefault();
                        }}
                    >
                        {video.sensitivityStatus === 'processing' ? 'Wait...' : 'Watch Now →'}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCard;
