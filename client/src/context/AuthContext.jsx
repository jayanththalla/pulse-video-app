import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            fetchMe(token);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchMe = async (token) => {
        try {
            const res = await axios.get('/api/auth/me');
            setUser(res.data);
        } catch (error) {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const res = await axios.post('/api/auth/login', { username, password });
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    };

    const register = async (username, password, role) => {
        const res = await axios.post('/api/auth/register', { username, password, role });
        const { token, ...userData } = res.data;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        return userData;
    }

    const logout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
