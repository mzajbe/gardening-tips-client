/* eslint-disable prettier/prettier */
import { Nexios } from "nexios-http";

const nexiosInstance = new Nexios({
    baseURL: "/api/proxy",
    timeout:10000,
    headers:{
        "Content-type":"application/json",
    },
    credentials: "include",
    
    // withCredentials: true,
});

export default nexiosInstance;