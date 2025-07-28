import { configureStore } from '@reduxjs/toolkit';
import supplyRequestsReducer from './supplyRequestsSlice';
import authReducerSlice from './authReducerSlice';
import clerksReducer from './clerksSlice'; 

const store = configureStore({
  reducer: {
    supplyRequests: supplyRequestsReducer,
    auth: authReducerSlice,
    clerks: clerksReducer,  
  },
});

export default store;
