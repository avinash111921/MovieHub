import { useSelector, useDispatch } from 'react-redux';
import {
  setSelectedUser,
  addNewMessage,
  fetchUsers,
  fetchMessages,
  sendMessage
} from '../store/slices/chatSlice';

export const useChat = () => {
  const dispatch = useDispatch();
  const {
    messages,
    users,
    selectedUser,
    isUsersLoading,
    isMessagesLoading
  } = useSelector(state => state.chat);

  return {
    // State
    messages,
    users,
    selectedUser,
    isUsersLoading,
    isMessagesLoading,

    // Actions
    setSelectedUser: (user) => dispatch(setSelectedUser(user)),
    addNewMessage: (message) => dispatch(addNewMessage(message)),
    getUsers: () => dispatch(fetchUsers()),
    getMessages: (userId) => dispatch(fetchMessages(userId)),
    sendMessage: (messageData) => dispatch(sendMessage({
      messageData,
      userId: selectedUser?._id
    })),
  };
};
