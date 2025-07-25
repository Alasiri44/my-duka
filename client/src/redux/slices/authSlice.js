import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,       // e.g., { email: "jane@gmail.com", role: "clerk" }
  store: null,      // current store object (optional)
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
