import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Player = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    // We don't really need to fetch video metadata here just to play, 
    // but good for title etc.

    // Note: In a real app we would fetch details. 
    // For now we will just use the ID to stream.

    return (
        <div>
            <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>

            <div className="max-w-4xl mx-auto">
                <div className="bg-black rounded-xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-zinc-800 aspect-video relative">
                    <video
                        ref={videoRef}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        crossOrigin="anonymous"
                    >
                        <source src={`/api/videos/stream/${id}`} type="video/mp4" />
                        <source src={`/api/videos/stream/${id}`} type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="mt-6">
                    <h1 className="text-2xl font-bold">Now Playing</h1>
                    <p className="text-zinc-400 mt-2">Stream ID: {id}</p>
                </div>
            </div>
        </div>
    );
};

export default Player;
