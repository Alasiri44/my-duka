import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clerksReducer from '../store/clerksSlice'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    clerks: clerksReducer,
  },
});
