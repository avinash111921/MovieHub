import { createContext, useContext, useState } from 'react';
import toast from "react-hot-toast";
import { axiosInstance } from '../utils/axios.js';
import { useAuthContext } from './AuthContext';

export const ChatContext = createContext();

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = (props) => {
    const { user } = useAuthContext(); // Get the authenticated user from AuthContext

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isUsersLoading, setIsUsersLoading] = useState(false);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);

    const getUsers = async () => {
        setIsUsersLoading(true);
        try {
            const res = await axiosInstance.get('/messages/users');
            setUsers(res.data.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch users");
        } finally {
            setIsUsersLoading(false);
        }
    };

    const getMessages = async (userId) => {
        if (!userId) return;
        setIsMessagesLoading(true);
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            setMessages(res.data.data);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
        } finally {
            setIsMessagesLoading(false);
        }
    };

    const sendMessage = async (messageData) => {
        const formData = new FormData();
        formData.append("text", messageData.text);
        if (messageData.image) {
            formData.append("messageImage", messageData.image);
        }

        const tempMessage = {
            _id: Date.now().toString(),
            senderId: user._id, // Using authenticated user's ID
            reciverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image ? URL.createObjectURL(messageData.image) : "",
            createdAt: new Date().toISOString(),
            isPending: true
        };

        setMessages(prevMessages => [...prevMessages, tempMessage]);

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`, 
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setMessages(prevMessages =>
                prevMessages.map(msg =>
                    msg._id === tempMessage._id ? res.data.data : msg
                )
            );
            return res.data.data;
        } catch (error) {
            setMessages(prevMessages => 
                prevMessages.filter(msg => msg._id !== tempMessage._id)
            );
            toast.error(error?.response?.data?.message || "Failed to send message");
            throw error;
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
        setSelectedUser,
        getUsers,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {props.children}
        </ChatContext.Provider>
    );
};

export default ChatProvider;