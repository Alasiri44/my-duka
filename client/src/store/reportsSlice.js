// store/reportsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:3001';

export const fetchSupplyRequestStats = createAsyncThunk(
  'reports/fetchSupplyRequestStats',
  async () => {
    const res = await axios.get(`${API_BASE}/supply_requests`);
    const statusCounts = { pending: 0, approved: 0, declined: 0 };

    res.data.forEach(req => {
      if (statusCounts[req.status] !== undefined) {
        statusCounts[req.status]++;
      }
    });

    // Format for Recharts
    return Object.entries(statusCounts).map(([status, count]) => ({ status, count }));
  }
);



const reportsSlice = createSlice({
  name: 'reports',
  initialState: {
    supplyRequestStats: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplyRequestStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSupplyRequestStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.supplyRequestStats = action.payload;
      })
      .addCase(fetchSupplyRequestStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default reportsSlice.reducer;
