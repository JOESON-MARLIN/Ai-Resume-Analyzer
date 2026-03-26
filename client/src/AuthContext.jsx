import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Setup global axios auth header
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('token', token);
            fetchProfile();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('token');
            setUser(null);
            setLoading(false);
        }
    }, [token]);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/api/auth/me`);
            setUser(data);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setToken(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/login`, { email, password });
            setToken(data.token);
            setUser({ id: data.id, name: data.name, email: data.email });
            return true;
        } catch (error) {
            console.error('Login error:', error.response?.data?.error || error.message);
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await axios.post(`${API_BASE}/api/auth/register`, { name, email, password });
            setToken(data.token);
            setUser({ id: data.id, name: data.name, email: data.email });
            return true;
        } catch (error) {
            console.error('Register error:', error.response?.data?.error || error.message);
            throw new Error(error.response?.data?.error || 'Registration failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
