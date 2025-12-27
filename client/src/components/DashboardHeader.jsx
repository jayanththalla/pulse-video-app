import React from 'react';
import { Upload, Loader2, Search, Filter, X } from 'lucide-react';

const DashboardHeader = ({
    user,
    isUploading,
    uploadProgress,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    handleUpload
}) => {
    return (
        <div className="mb-10 space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2 font-display">
                        {user?.role === 'viewer' ? 'Explore Library' : 'Creator Studio'}
                    </h1>
                    <p className="text-lg text-zinc-400">
                        {user?.role === 'viewer' ? 'Discover curated content from our community.' : 'Manage, analyze, and track your video content.'}
                    </p>
                </div>

                {user && user.role !== 'viewer' && (
                    <label className={`group relative cursor-pointer bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded-full font-bold transition-all flex items-center gap-3 shadow-xl ${isUploading ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                        <span>{isUploading ? `Uploading ${uploadProgress}%` : 'Upload New'}</span>
                        <input type="file" accept="video/*" className="hidden" onChange={handleUpload} disabled={isUploading} />

                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-white/50 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity -z-10" />
                    </label>
                )}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-12 pr-4 text-zinc-100 focus:outline-none focus:border-zinc-600 focus:bg-zinc-800 transition-all placeholder:text-zinc-600"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-auto">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full md:w-auto bg-zinc-900 border border-zinc-800 rounded-xl py-3.5 pl-10 pr-8 text-zinc-300 focus:outline-none focus:border-zinc-600 focus:bg-zinc-800 transition-all appearance-none cursor-pointer font-medium"
                        >
                            <option value="all">All Status</option>
                            <option value="safe">Safe ✅</option>
                            <option value="flagged">Flagged 🚨</option>
                            <option value="processing">Processing ⏳</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
