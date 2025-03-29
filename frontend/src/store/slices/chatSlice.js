import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import toast from 'react-hot-toast';

export const fetchUsers = createAsyncThunk(
  'chat/fetchUsers',
  async () => {
    const response = await axiosInstance.get('/messages/users');
    return response.data;
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (userId) => {
    const response = await axiosInstance.get(`/messages/${userId}`);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ messageData, userId }) => {
    const response = await axiosInstance.post(`/messages/send/${userId}`, messageData);
    return response.data;
  }
);

const initialState = {
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    addNewMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isUsersLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isUsersLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isUsersLoading = false;
        toast.error(action.error.message || "Failed to fetch users");
      })
      .addCase(fetchMessages.pending, (state) => {
        state.isMessagesLoading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.isMessagesLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.isMessagesLoading = false;
        toast.error(action.error.message || "Failed to fetch messages");
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        toast.error(action.error.message || "Failed to send message");
      });
  },
});

export const { setSelectedUser, addNewMessage } = chatSlice.actions;
export default chatSlice.reducer;
