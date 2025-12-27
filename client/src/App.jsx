import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Player from './pages/Player';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import { Video, LogOut, User as UserIcon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import Logo from './components/Logo';

// Protected Route Component
const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Public Route Component (redirects to dashboard if logged in)
const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="min-h-screen flex items-center justify-center text-zinc-500">Loading...</div>;
    if (user) return <Navigate to="/dashboard" />;
    return children;
};

// Navbar Component
const NavBar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="border-b border-zinc-800 bg-surface/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to={user ? "/dashboard" : "/"} className="hover:opacity-80 transition-opacity">
                        <Logo />
                    </Link>

                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 bg-zinc-800/50 px-3 py-1 rounded-full border border-zinc-700">
                                <UserIcon className="w-4 h-4 text-zinc-400" />
                                <span className="text-sm font-medium">{user.username} <span className="text-zinc-500 text-xs">({user.role})</span></span>
                            </div>
                            <button onClick={handleLogout} className="text-zinc-400 hover:text-white transition-colors" title="Logout">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex gap-4 items-center">
                            <Link to="/login" className="text-sm font-bold text-zinc-300 hover:text-white transition-colors px-4 py-2 hover:bg-white/5 rounded-lg">Login</Link>
                            <Link to="/register" className="text-sm font-bold bg-primary hover:bg-blue-600 px-5 py-2.5 rounded-full text-white transition-all shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-background text-zinc-100 font-sans selection:bg-primary/30">
                    <Toaster position="top-right" toastOptions={{
                        style: {
                            background: '#18181b',
                            color: '#fff',
                            border: '1px solid #27272a',
                        },
                        success: {
                            iconTheme: {
                                primary: '#3b82f6',
                                secondary: '#fff',
                            },
                        },
                    }} />
                    <NavBar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <Routes>
                            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
                            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/play/:id" element={
                                <PrivateRoute>
                                    <Player />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </main>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
