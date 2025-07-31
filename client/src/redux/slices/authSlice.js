import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
      id: 1,
    first_name: "Stephen",
    last_name: "Njenga",
    email: "stephen@myduka.co.ke",
    role: "admin",
  },       
  store: null,      
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setStore(state, action) {
      state.store = action.payload;
    },
    clearStore(state) {
      state.store = null;
    },
  },
});

export const { setUser, clearUser, setStore, clearStore } = authSlice.actions;
export default authSlice.reducer;
