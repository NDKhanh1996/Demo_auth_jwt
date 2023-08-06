import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            currentUser: null, // save value of user
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        }
    },
    reducers: {
        loginStart: state => {
            state.login.isFetching = true; // on login
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false; // loading complete
            state.login.currentUser = action.payload; // save value of new user
            state.login.error = false;
        },
        loginFailed: state => {
            state.login.isFetching = false;
            state.login.error = true;
        },
        registerStart: state => {
            state.register.isFetching = true; // on login
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false; // loading complete
            state.register.error = false;
            state.register.success = true;
        },
        registerFailed: state => {
            state.register.isFetching = false;
            state.register.error = true;
            state.register.success = false;
        }
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailed,
    registerStart,
    registerSuccess,
    registerFailed

} = authSlice.actions;

export default authSlice.reducer;