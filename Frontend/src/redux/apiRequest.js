import axios from "axios";
import {loginFailed, loginStart, loginSuccess, registerFailed, registerStart, registerSuccess} from "./authSlice";
import {
    deleteUserFailed,
    deleteUserStart,
    deleteUserSuccess,
    getUsersFailed,
    getUsersStart,
    getUsersSuccess
} from "./userSlice";

export const loginUser = async (user, dispatch, navigate) => {
    dispatch(loginStart());
    try {
        const res = await axios.post("http://localhost:8080/api/auth/login", user);
        dispatch(loginSuccess(res.data));
        console.log(res.data)
        navigate("/");
    } catch (e) {
        console.log(e);
        dispatch(loginFailed());
    }
}

export const registerUser = async (user, dispatch, navigate) => {
    dispatch(registerStart());
    try {
        const res = await axios.post("http://localhost:8080/api/auth/register", user);
        dispatch(registerSuccess(res.data));
        navigate("/login");
    } catch (e) {
        console.log(e);
        dispatch(registerFailed());
    }
}

export const getAllUsers = async (accessToken, dispatch, axiosJWT) => {
    dispatch(getUsersStart());
    try {
        const res = await axiosJWT.get("http://localhost:8080/api/admin/users", {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(getUsersSuccess(res.data));
    } catch (e) {
        dispatch(getUsersFailed());
    }
}

export const deleteUser = async (accessToken, dispatch, id, axiosJWT) => {
    dispatch(deleteUserStart());
    try {
        const res = await axiosJWT.delete("http://localhost:8080/api/admin/users/" + id, {
            headers: {token: `Bearer ${accessToken}`},
        });
        dispatch(deleteUserSuccess(res.data));
    } catch (e) {
        console.log(e);
        dispatch(deleteUserFailed());
    }
}