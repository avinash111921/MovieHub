import { useChatContext } from "../context/ChatContext";
import { useContext, useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import InputMessage from "./InputMessage";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { ShopContext } from "../context/ShopContext.jsx";
import { formatMessageTime } from "../utils/utlis.js";

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
    } = useChatContext();

    const { user, socket } = useContext(ShopContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!selectedUser) return;
        getMessages(selectedUser._id);
        subscribeToMessages(socket);
        return () => unsubscribeFromMessages(socket);
    }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

    useEffect(() => {
        if (messagesEndRef.current && messages) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <InputMessage />
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <div
                        key={message._id}
                        className={`flex ${message.senderId === user._id ? "justify-end" : "justify-start"}`}
                        ref={index === messages.length - 1 ? messagesEndRef : null} // Attach to last message
                    >
                        {/* Avatar */}
                        <div className="flex items-start space-x-2">
                            <div className="w-10 h-10 rounded-full border overflow-hidden">
                                <img
                                    src={
                                        message.senderId === user._id
                                            ? user.avatar || "/avatar.png"
                                            : selectedUser.avatar || "/avatar.png"
                                    }
                                    alt="profile pic"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Message Box */}
                            <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                                <div className="text-xs text-gray-500 mb-1">
                                    {formatMessageTime(message.createdAt)}
                                </div>
                                <div className={`p-3 rounded-lg ${message.senderId === user._id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"}`}>
                                    {message.image && (
                                        <img
                                            src={message.image}
                                            alt="Attachment"
                                            className="max-w-full rounded-md mb-2"
                                        />
                                    )}
                                    {message.text && <p>{message.text}</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <InputMessage />
        </div>
    );
};

export default ChatContainer;
