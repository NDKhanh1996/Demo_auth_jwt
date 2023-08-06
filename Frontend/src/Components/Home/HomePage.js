import "./home.css";
import {useEffect, useState} from "react";
import {deleteUser, getAllUsers} from "../../redux/apiRequest";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {loginSuccess} from "../../redux/authSlice";

let axiosJWT = axios.create();

const HomePage = () => {
    const [reload, setReload] = useState(0);
    const user = useSelector(state => state.auth.login?.currentUser);
    const userList = useSelector(state => state.users.users?.allUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const handleDelete = (id) => {
        deleteUser(user?.accessToken, dispatch, id, axiosJWT)
            .then(() => {
                setReload(reload + 1);
            })
            .catch(e => {
                console.log(e)
            });
    }

    const refreshToken = async (id) => {
        try {
            const res = await axios.post("http://localhost:8080/api/auth/refresh", {
                withCredentials: true,
            });
            return res.data;
        } catch (e) {
            console.log(e);
        }
    }

    axiosJWT.interceptors.request.use(
        async (config) => {
            let date = new Date();
            const decodedToken = jwtDecode(user?.accessToken);
            if (decodedToken.exp < date.getTime() / 1000) {
                const data = await refreshToken();
                console.log(data)
                const refreshUser = {
                    ...user, accessToken: data.accessToken
                };
                dispatch(loginSuccess(refreshUser));
                config.headers["token"] = "Bearer " + data.accessToken;
            }
            return config;
        },
        (err) => {
            console.log(err)
            return Promise.reject(err);
        }
    );


    useEffect(() => {
        !user ? navigate("/login") :
            getAllUsers(user?.accessToken, dispatch, axiosJWT)
                .then()
                .catch(e => {
                    console.log(e)
                });
    }, [dispatch, navigate, user, reload]); // delete dependency

    return (<main className="home-container">
        <div className="home-title">User List</div>
        <div className="home-role">{`Your role: ${user?.admin ? 'Admin' : 'User'}`}</div>
        <div className="home-userlist">
            {userList?.map((user) => {
                return (<div className="user-container" key={user._id}>
                    <div className="home-user">{user.username}</div>
                    <div className="delete-user" onClick={() => {
                        handleDelete(user['_id'])
                    }}> Delete
                    </div>
                </div>);
            })}
        </div>
    </main>);
};

export default HomePage;