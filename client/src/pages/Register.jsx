import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, User, Loader2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('editor');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (password.length < 6) {
            toast.error('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            await register(username, password, role);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-surface border border-zinc-800 p-8 rounded-2xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-300">
                <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Username</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Choose a username"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-1">Role</label>
                        <div className="relative">
                            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-black/50 border border-zinc-700 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                            >
                                <option value="viewer">Viewer (Read-only)</option>
                                <option value="editor">Editor (Upload & Manage)</option>
                                <option value="admin">Admin (Full Access)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-blue-600 text-white py-2 rounded-lg font-bold transition-all flex justify-center items-center gap-2 shadow-lg shadow-blue-500/20"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register'}
                    </button>
                </form>
                <p className="mt-6 text-center text-zinc-500 text-sm">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
