import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axios.js"; 
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within a AuthContextProvider');
    }
    return context;
};

export const AuthContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    // Set authorization header whenever token changes
    useEffect(() => {
        if (token) {
            axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("token", token);
        } else {
            delete axiosInstance.defaults.headers.common["Authorization"];
            localStorage.removeItem("token");
        }
    }, [token]);

    // Listen for storage events (when localStorage changes in another tab)
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === "token") {
                // If token was removed in another tab
                if (!e.newValue) {
                    setToken("");
                    setUser(null);
                    disconnectSocket();
                } 
                // If token was added/changed in another tab
                else if (e.newValue !== token) {
                    setToken(e.newValue);
                }
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [token]);

    // Fetch user profile when token is available
    useEffect(() => {
        if (token) {
            fetchUserProfile();
        } else {
            setLoading(false); 
        }
    }, [token]);

    const fetchUserProfile = async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        
        setLoading(true);
        try {
            const response = await axiosInstance.get("/users/current-user");
            if (response.status < 401 && response.data.data) {
                setUser(response.data.data);
                connectSocket(response.data.data._id);
            } else {
                console.error("Unexpected response format:", response.data);
                // Clear invalid token
                setToken("");
            }
        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            // Clear invalid token on auth errors
            if (error.response && error.response.status === 401) {
                setToken("");
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/users/login", credentials);
            const { user, accessToken } = response.data.data;

            // Store token and user data
            setToken(accessToken);
            localStorage.setItem("token", accessToken);
            setUser(user);

            // Connect to socket
            connectSocket(user._id);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
            return { error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axiosInstance.post("/users/logout");
            toast.success("Logged out successfully");
            disconnectSocket();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setToken("");
            localStorage.removeItem("token");
            delete axiosInstance.defaults.headers.common["Authorization"];
            setUser(null);
            setLoading(false);
            navigate("/");
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await axiosInstance.post("/users/register", userData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const { user , accessToken } = response.data.data;
            setUser(user);
            setToken(accessToken);
            localStorage.setItem("token", accessToken);
            toast.success("Account created successfully");
            connectSocket(user._id);
            navigate("/");
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || "Registration failed");
            return { error: error.response?.data?.message };
        } finally {
            setLoading(false);
        }
    };

    const connectSocket = (userId) => {
        if (!userId) {
            console.error("User ID is missing. Cannot connect to socket.");
            return;
        }
    
        if (socket?.connected) {
            console.log("Socket is already connected.");
            return;
        }

        const socketInstance = io(
            backendUrl,
            { 
                query: { 
                    userId : userId, 
                 },
                transports: ["websocket", "polling"], // Ensures compatibility across browsers
                reconnection: true,
                reconnectionAttempts: 5, // Try reconnecting 5 times
                reconnectionDelay: 1000, // Delay of 1s before retrying
            });
        setSocket(socketInstance);
        socketInstance.on("getOnlineUsers", (userIds) => setOnlineUsers(userIds));
    };

    const disconnectSocket = () => {
        if (socket) {
            socket.off("getOnlineUsers");
            socket.disconnect();
            setSocket(null);
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
        connectSocket,
        disconnectSocket,
        onlineUsers,
        socket,
    };

    return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContextProvider;
