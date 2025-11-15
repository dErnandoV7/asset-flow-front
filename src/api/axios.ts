import axios from "axios";

export const apiBack = axios.create({
    baseURL: "https://assetflowback.onrender.com",
    // baseURL: "http://localhost:3030",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export const apiCript = axios.create({
    baseURL: "https://api.coingecko.com/api/v3/simple",
    headers: {
        "Content-type": "application/json"
    }
})

