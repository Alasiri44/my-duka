import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// supply requests
export const fetchSupplyRequests = createAsyncThunk(
  'supplyRequests/fetchAll',
  async () => {
    const res = await axios.get('/api/admin/supply-requests');
    return res.data;
  }
);

// request status
export const updateRequestStatus = createAsyncThunk(
  'supplyRequests/updateStatus',
  async ({ id, status }) => {
    const res = await axios.patch(`/api/admin/supply-requests/${id}`, { status });
    return { id, status };
  }
);


const supplyRequestsSlice = createSlice({
  name: 'supplyRequests',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSupplyRequests.pending, (state) => {
        state.status = 'loading';
      })

      .addCase(fetchSupplyRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })

      .addCase(fetchSupplyRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const { id, status } = action.payload;
        const req = state.list.find((r) => r.id === id);
        if (req) {
          req.status = status;
        }
      });
  },
});

export default supplyRequestsSlice.reducer;
