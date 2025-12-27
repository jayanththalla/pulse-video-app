import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

// Components
import DashboardHeader from '../components/DashboardHeader';
import VideoCard from '../components/VideoCard';
import { Play, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const socket = useSocket();
    const { user } = useAuth();

    useEffect(() => {
        fetchVideos();
    }, []);

    useEffect(() => {
        filterVideos();
    }, [videos, searchQuery, statusFilter]);

    useEffect(() => {
        if (!socket) return;
        socket.on('video_status_update', (data) => {
            setVideos(prev => {
                const updated = prev.map(v =>
                    v._id === data._id ? { ...v, sensitivityStatus: data.status, processingProgress: data.progress } : v
                );
                return updated;
            });
            if (data.status === 'safe') toast.success('Video processed: Safe');
            if (data.status === 'flagged') toast.error('Video processed: Flagged');
        });
        socket.on('progress_update', (data) => {
            setVideos(prev => prev.map(v =>
                v._id === data._id ? { ...v, processingProgress: data.progress } : v
            ));
        });
        return () => {
            socket.off('video_status_update');
            socket.off('progress_update');
        };
    }, [socket]);

    const fetchVideos = async () => {
        try {
            const res = await axios.get('/api/videos');
            setVideos(res.data);
            setFilteredVideos(res.data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load videos');
        }
    };

    const filterVideos = () => {
        let result = videos;
        if (searchQuery) result = result.filter(v => v.originalName.toLowerCase().includes(searchQuery.toLowerCase()));
        if (statusFilter !== 'all') result = result.filter(v => v.sensitivityStatus === statusFilter);
        setFilteredVideos(result);
    };

    const getVideoDuration = (file) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'metadata';
            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                resolve(video.duration);
            };
            video.onerror = () => resolve(0);
            video.src = URL.createObjectURL(file);
        });
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Get duration
        const duration = await getVideoDuration(file);

        const formData = new FormData();
        formData.append('video', file);
        formData.append('duration', duration); // Send duration to backend

        setIsUploading(true);
        setUploadProgress(0);

        const uploadToast = toast.loading('Uploading video...');

        try {
            const res = await axios.post('/api/videos/upload', formData, {
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });
            setVideos([res.data.video, ...videos]);
            toast.success('Upload complete!', { id: uploadToast });
        } catch (err) {
            console.error(err);
            toast.error('Upload failed', { id: uploadToast });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            e.target.value = null;
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this video entirely?')) return;
        const deleteToast = toast.loading('Deleting video...');
        try {
            await axios.delete(`/api/videos/${id}`);
            setVideos(prev => prev.filter(v => v._id !== id));
            toast.success('Video deleted', { id: deleteToast });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed', { id: deleteToast });
        }
    };

    // Featured Video Logic (Latest video)
    const featuredVideo = filteredVideos.length > 0 ? filteredVideos[0] : null;
    const gridVideos = filteredVideos.length > 0 ? filteredVideos.slice(1) : [];

    return (
        <div className="min-h-screen pb-20">
            <DashboardHeader
                user={user}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                handleUpload={handleUpload}
            />

            {/* Featured Section (Only when searching/filtering is inactive essentially, or just always top list) */}
            {!searchQuery && statusFilter === 'all' && featuredVideo && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 relative rounded-3xl overflow-hidden aspect-[21/9] md:aspect-[3/1] group border border-zinc-800"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />

                    {/* Background Video (Muted Loop) */}
                    <video
                        src={`/api/videos/stream/${featuredVideo._id}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                        muted
                        autoPlay
                        loop
                        playsInline
                    />

                    <div className="absolute bottom-0 left-0 z-20 p-8 md:p-12 max-w-3xl">
                        <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-primary bg-primary/10 border border-primary/20 rounded-full uppercase backdrop-blur-md">
                            Featured Premiere
                        </span>
                        <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-4 leading-tight">
                            {featuredVideo.originalName}
                        </h2>
                        <div className="flex items-center gap-4">
                            <Link
                                to={`/play/${featuredVideo._id}`}
                                className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-xl shadow-white/10"
                            >
                                <Play className="w-5 h-5 fill-black" />
                                Watch Now
                            </Link>
                            <span className="text-zinc-300 font-medium text-lg">
                                by {featuredVideo.uploadedBy?.username || 'Unknown'}
                            </span>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {filteredVideos.length === 0 && (
                <div className="py-32 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-900 mb-6">
                        <Search className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-300 mb-2">No videos found</h3>
                    <p className="text-zinc-500">Try adjusting your filters or upload something new.</p>
                </div>
            )}

            {/* Staggered Grid */}
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {(searchQuery || statusFilter !== 'all' ? filteredVideos : gridVideos).map((video) => (
                        <VideoCard
                            key={video._id}
                            video={video}
                            user={user}
                            onDelete={handleDelete}
                        />
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Dashboard;
