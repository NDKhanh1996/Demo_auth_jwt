import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "users",
    initialState: {
        users: {
            allUser: null, isFetching: false, error: false
        },
    }, reducers: {
        getUsersStart: state => {
            state.users.isFetching = true;
        }, getUsersSuccess: (state, action) => {
            state.users.isFetching = false;
            state.users.allUser = action.payload;
        }, getUsersFailed: state => {
            state.users.isFetching = false;
            state.users.error = true;
        },
        deleteUserStart: state => {
            state.users.isFetching = true;
        },
        deleteUserSuccess: (state, action) => {
            state.users.isFetching = true;
        },
        deleteUserFailed: state => {
            state.users.isFetching = false;
            state.users.error = true;
        },
    }
});

export const {
    getUsersStart,
    getUsersSuccess,
    getUsersFailed,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailed
} = userSlice.actions;

export default userSlice.reducer;