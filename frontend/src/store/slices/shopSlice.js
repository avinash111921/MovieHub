import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '../../utils/axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8001";

export const fetchUserProfile = createAsyncThunk(
  'shop/fetchUserProfile',
  async (_, { getState }) => {
    const { token } = getState().shop;
    if (!token) return null;
    const response = await axiosInstance.get("/users/current-user");
    return response.data.data;
  }
);

export const login = createAsyncThunk(
  'shop/login',
  async (credentials, { dispatch }) => {
    const response = await axiosInstance.post("/users/login", credentials);
    const { accessToken, user } = response.data.data;
    localStorage.setItem("token", accessToken);
    return { accessToken, user };
  }
);

export const logout = createAsyncThunk(
  'shop/logout',
  async (_, { dispatch }) => {
    await axiosInstance.post("/users/logout");
    localStorage.removeItem("token");
    delete axiosInstance.defaults.headers.common["Authorization"];
    return null;
  }
);

const initialState = {
  token: localStorage.getItem("token") || "",
  user: null,
  loading: false,
  search: "",
  showSearch: false,
  onlineUsers: [],
  socket: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setShowSearch: (state, action) => {
      state.showSearch = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        if (action.payload && !state.socket) {
          const socket = io(backendUrl);
          socket.emit("addNewUser", action.payload._id);
          state.socket = socket;
        }
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${action.payload.accessToken}`;
        toast.success("Logged in successfully");
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        toast.error(action.error.message || "Login failed");
      })
      .addCase(logout.fulfilled, (state) => {
        state.token = "";
        state.user = null;
        if (state.socket) {
          state.socket.disconnect();
          state.socket = null;
        }
        toast.success("Logged out successfully");
      });
  },
});

export const { setSearch, setShowSearch, setOnlineUsers, setSocket } = shopSlice.actions;
export default shopSlice.reducer;
