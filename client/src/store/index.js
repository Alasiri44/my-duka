import { configureStore } from '@reduxjs/toolkit';
import supplyRequestsReducer from './supplyRequestsSlice';
import authReducerSlice from './authReducerSlice';

const store = configureStore({
  reducer: {
    supplyRequests: supplyRequestsReducer,
    auth: authReducerSlice
    // I will add slices like clerks, reports later
  },
});

export default store;
