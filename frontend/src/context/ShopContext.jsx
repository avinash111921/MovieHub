import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();

    // Configure axios defaults
    axios.defaults.baseURL = backendUrl;
    axios.defaults.withCredentials = true;

    // Set Authorization header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            // Get user profile when token is available
            fetchUserProfile();
        }
    }, [token]);

    const fetchUserProfile = async () => {
        if (!token) return;
        
        setLoading(true);
        try {
            const response = await axios.get('/api/v1/users/current-user');
            setUser(response.data.data);
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // If unauthorized, clear token
            if (error.response?.status === 401) {
                setToken("");
                localStorage.removeItem('token');
                setUser(null);
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/users/login', credentials);
            const { accessToken } = response.data.data;
            
            // Set token in state and localStorage
            setToken(accessToken);
            localStorage.setItem('token', accessToken);
            
            // Set the authorization header immediately
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            
            setUser(response.data.data.user);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return { error: error.response?.data?.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            if (token) {
                await axios.post('/api/v1/users/logout');
            }
        } catch (error) {
            console.error("Logout API call failed:", error);
        } finally {
            // Clear token and user data
            setToken("");
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setLoading(false);
            navigate('/');
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await axios.post('/api/v1/users/register', userData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return { success: true };
        } catch (error) {
            console.error("Registration failed:", error);
            return { error: error.response?.data?.message || "Registration failed" };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        navigate,
        backendUrl,
        token,
        setToken,
        user,
        setUser,
        loading,
        login,
        logout,
        register,
        fetchUserProfile,
        search,
        setSearch,
        showSearch,
        setShowSearch
    };

    return(
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;