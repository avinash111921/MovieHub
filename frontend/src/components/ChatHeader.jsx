import React, { useContext } from 'react'
import {X} from "lucide-react"
import {AuthContext} from "../context/AuthContext.jsx"
import { useChatContext } from '../context/ChatContext.jsx'

const ChatHeader = () => {
    const {selectedUser,setSelectedUser} = useChatContext();
    const  {onlineUsers} = useContext(AuthContext);

  return (
     <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          {selectedUser && (
            <div className="avatar">
              <div className="size-10 rounded-full relative">
              <img src={selectedUser.avatar || "/avatar.png"} alt={selectedUser.fullname} />
              </div>
            </div>
          )}

          {/* User info */}
          {selectedUser && (
            <div>
              <h3 className="font-medium">{selectedUser.fullname}</h3>
              <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
              </p>
              </div>
          )}
        </div>

        {/* Close button */}
        <button onClick={() => selectedUser && setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader
