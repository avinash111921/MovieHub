import { useChatStore } from "../context/ChatContext";
import { useContext, useEffect,useRef } from "react";

import ChatHeader from "./ChatHeader"
import InputMessage from "./InputMessage"
import MessageSkeleton from "./skeletons/MessageSkeleton"
import { ShopContext } from "../context/ShopContext.jsx";
import {formatMessageTime} from "../utils/utlis.js"

const ChatContainer = () => {
    const {
        messages,
        getMessages,
        isMessagesLoading,
        selectedUser,
        subscribeToMessages,
        unsubscribeFromMessages,
      } = useChatStore();

      const {user} = useContext(ShopContext);
      const messagesEndRef = useRef(null);

      useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages();
      },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages])

      useEffect(() => {
        if(messagesEndRef.current && messages){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      },[messages])

      if(isMessagesLoading){
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton/>
                <InputMessage />
            </div>
        );
      }
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === user._id ? "chat-end" : "chat-start"}`}
            ref={messagesEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === user._id
                      ? user.avatar || "/avatar.png"
                      : selectedUser.avatar || "/avatar.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
}

export default ChatContainer
