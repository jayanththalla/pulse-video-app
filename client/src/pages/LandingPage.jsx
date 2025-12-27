import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Shield, Zap, TrendingUp } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl md:text-7xl font-extrabold font-display leading-tight mb-6"
                >
                    Stream with <span className="text-primary bg-primary/10 px-4 rounded-xl">Vantage</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-12"
                >
                    Secure video hosting with real-time sensitivity analysis and seamless streaming for your organization.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Link to="/register" className="bg-primary hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2">
                        Get Started <Play className="w-5 h-5 fill-current" />
                    </Link>
                    <Link to="/login" className="px-8 py-4 rounded-full font-bold text-lg text-zinc-300 hover:text-white border border-zinc-700 hover:bg-zinc-800 transition-all">
                        Login
                    </Link>
                </motion.div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard
                    icon={<Shield className="w-8 h-8 text-green-400" />}
                    title="Content Safety"
                    desc="Automated AI-powered sensitivity analysis ensures your content is safe for all audiences."
                    delay={0.6}
                />
                <FeatureCard
                    icon={<Zap className="w-8 h-8 text-yellow-400" />}
                    title="Real-time Processing"
                    desc="Watch your videos process live with our websocket-powered status updates."
                    delay={0.7}
                />
                <FeatureCard
                    icon={<TrendingUp className="w-8 h-8 text-blue-400" />}
                    title="High Performance"
                    desc="Optimized streaming with HTTP range requests for instant playback and seeking."
                    delay={0.8}
                />
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay }}
        className="bg-surface/50 border border-zinc-800 p-8 rounded-2xl hover:bg-zinc-800/50 transition-colors"
    >
        <div className="bg-zinc-900 rounded-lg w-14 h-14 flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </motion.div>
);

export default LandingPage;
