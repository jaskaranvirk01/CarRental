import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [cars, setCars] = useState([]);

    //FUNCTION TO CHECK IF USER IS LOGGED IN
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/user/data");
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === "owner");
            } else {
                navigate("/");
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //FUNCTION TO FETCH ALL THE CARS FROM THE SERVER
    const fetchCars = async () => {
        try {
            const { data } = await axios.get("/api/user/cars");
            data.success ? setCars(data.cars) : toast.error(data.message);
        } catch (error) {
            toast.error(error.message);
        }
    }

    //FUNCTION TO LOG OUT USER
    const logout = async () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common["Authorization"] = "";
        toast.success("You have been logged out");
    }

    //USEEFFECT TO RETRIEVE USER TOKEN FROM LOCAL STORAGE
    useEffect(() => {
        const token = localStorage.getItem("token");
        setToken(token);
        fetchCars();
    }, []);

    //USEEFFECT TO FETCH USER DATA IF TOKEN IS AVAILABLE
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `${token}`;
            fetchUser();
        }
    }, [token]);

    const value = { navigate, currency, axios, user, setUser, token, setToken, isOwner, setIsOwner, fetchUser, showLogin, setShowLogin, logout, fetchCars, cars, setCars, pickupDate, setPickupDate, returnDate, setReturnDate }

    return (<AppContext.Provider value={value} >
        {children}
    </AppContext.Provider >)
}

export const useAppContext = () => {
    return useContext(AppContext);
}