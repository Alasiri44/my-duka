import { createSlice } from '@reduxjs/toolkit';


const authReducerSlice = createSlice({
    name: 'authentication',
    initialState: {
        user: {
            role: "admin",
            name: "Test Admin User"
        },
        authenticated: true,
        store: {
            name: "Test Store"
        }
    },
    reducers: {},

});

export default authReducerSlice.reducer;
