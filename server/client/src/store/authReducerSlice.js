import { createSlice } from '@reduxjs/toolkit';

const authReducerSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        // authenticated: true,
        // store: {
        //     name: "Test Store"
        // }
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },  
        logoutUser: (state) => {
            state.user = null;
            state.authenticated = false;
        }
    },

});

export const { setUser, logoutUser } = authReducerSlice.actions;
export default authReducerSlice.reducer;
