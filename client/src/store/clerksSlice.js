// store/clerksSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3001/users';

export const fetchClerks = createAsyncThunk(
  'clerks/fetchClerks',
  async () => {
    const response = await axios.get(`${API_URL}?role=clerk`);
    return response.data;
  }
);

export const addClerk = createAsyncThunk(
  'clerks/addClerk',
  async (clerkData) => {
    const response = await axios.post(API_URL, clerkData);
    return response.data;
  }
);

export const deactivateClerk = createAsyncThunk(
  'clerks/deactivateClerk',
  async (id) => {
    const response = await axios.patch(`${API_URL}/${id}`, { is_active: false });
    return response.data;
  }
);

export const deleteClerk = createAsyncThunk(
  'clerks/deleteClerk',
  async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  }
);

const clerksSlice = createSlice({
  name: 'clerks',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClerks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClerks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchClerks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })

      .addCase(addClerk.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(deactivateClerk.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteClerk.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  }
});

export default clerksSlice.reducer;
