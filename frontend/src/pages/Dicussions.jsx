import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import { ShopContext } from '../context/ShopContext.jsx';
import { useChatStore } from "../context/ChatContext.jsx"
import Sidebar from "../components/Sidebar.jsx"
import NoChatSelected from "../components/NoChatSelected.jsx"
import ChatContainer from "../components/ChatContainer.jsx"


function Discussions() {
  const {selectedUser} = useChatStore();

  const { token } = useContext(ShopContext); // Get token from context
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check if the user is logged in
    const storedToken = localStorage.getItem('token');

    if (token || storedToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate('/login'); // Redirect if not logged in
    }

    setLoading(false); // Stop loading
  }, [token, navigate]); // Depend on token

  if (loading) return <p>Loading...</p>; // Prevent UI flickering

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center pt-20 px-4">
        <div className="bg-base-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full rounded-lg overflow-hidden">
            <Sidebar />
            {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Discussions;
