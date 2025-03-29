import { configureStore } from '@reduxjs/toolkit';
import shopReducer from './slices/shopSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    shop: shopReducer,
    chat: chatReducer,
  },
});
