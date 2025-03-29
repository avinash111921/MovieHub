import { useSelector, useDispatch } from 'react-redux';
import { 
  setSearch, 
  setShowSearch, 
  setOnlineUsers, 
  setSocket,
  fetchUserProfile,
  login,
  logout
} from '../store/slices/shopSlice';

export const useShop = () => {
  const dispatch = useDispatch();
  const {
    token,
    user,
    loading,
    search,
    showSearch,
    onlineUsers,
    socket
  } = useSelector(state => state.shop);

  return {
    // State
    token,
    user,
    loading,
    search,
    showSearch,
    onlineUsers,
    socket,

    // Actions
    setSearch: (value) => dispatch(setSearch(value)),
    setShowSearch: (value) => dispatch(setShowSearch(value)),
    setOnlineUsers: (users) => dispatch(setOnlineUsers(users)),
    setSocket: (socket) => dispatch(setSocket(socket)),
    fetchUserProfile: () => dispatch(fetchUserProfile()),
    login: (credentials) => dispatch(login(credentials)),
    logout: () => dispatch(logout()),
  };
};
