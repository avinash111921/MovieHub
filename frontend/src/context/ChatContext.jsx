import { createContext, useContext, useState } from 'react';
import toast from "react-hot-toast";
import { axiosInstance } from '../utils/axios.js';

export const ChatContext = createContext();

export const useChatContext = ( {children} ) => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    const getUsers = async () => {
        setIsUsersLoading(true);
        try {
            const res = await axiosInstance.get('/messages/users');
            console.log("Filtered User Data:", res.data);
            setUsers(res.data);
        } catch (error) {
            console.error("Error fetching users:", error?.response || error);
            toast.error(error?.response?.data?.message || "Failed to fetch users");
        } finally {
            setIsUsersLoading(false);
        }
    };

    const getMessages = async (userId) => {
        setIsMessagesLoading(true);
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            console.log("API Response getMessages:", res.data);
            setMessages(res.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
        } finally {
            setIsMessagesLoading(false);
        }
    };

    const sendMessage = async (messageData) => {
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            console.log("API Response of sendMessage:", res.data);
            setMessages(prevMessages => [...prevMessages, res.data]);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to send message");
        }
    };

    const subscribeToMessages = (socket) => {
        if (!selectedUser || !socket) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;
            setMessages(prevMessages => [...prevMessages, newMessage]);
        });
    };

    const unsubscribeFromMessages = (socket) => {
        if (socket) {
            socket.off("newMessage");
        }
    };

    const value = {
        messages,
        users,
        selectedUser,
        isUsersLoading,
        isMessagesLoading,
        getUsers,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages,
        setSelectedUser
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};