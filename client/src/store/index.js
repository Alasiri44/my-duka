import { configureStore } from '@reduxjs/toolkit';
import supplyRequestsReducer from './supplyRequestsSlice';

const store = configureStore({
  reducer: {
    supplyRequests: supplyRequestsReducer,
    // I will add slices like clerks, reports later
  },
});

export default store;
