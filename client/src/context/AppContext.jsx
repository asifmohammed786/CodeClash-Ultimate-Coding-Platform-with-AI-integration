import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isAuthLoading, setIsAuthLoading] = useState(true); // 🔁 NEW

    const getToken = () => localStorage.getItem("token");

    const getAuthState = async () => {
        try {
            const token = getToken();
            if (!token) {
                setIsLoggedin(false);
                setUserData(null);
                return;
            }
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setIsLoggedin(true);
                await getUserData();
            } else {
                setIsLoggedin(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedin(false);
            setUserData(null);
        } finally {
            setIsAuthLoading(false); // ✅ Always turn off loading
        }
    };

    const getUserData = async () => {
        try {
            const token = getToken();
            if (!token) {
                setUserData(null);
                return;
            }
            const { data } = await axios.get(backendUrl + '/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success && data.userData) {
                setUserData(data.userData);
            } else {
                setUserData(null);
                toast.error(data.message);
            }
        } catch (error) {
            setUserData(null);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        getAuthState();
        // eslint-disable-next-line
    }, []);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData,
        isAuthLoading // ✅ NEW
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};
