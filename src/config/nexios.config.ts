/* eslint-disable prettier/prettier */
import { Nexios } from "nexios-http";

const nexiosInstance = new Nexios({
    baseURL:"https://gardening-server.vercel.app/api/v1",
    timeout:10000,
    headers:{
        "Content-type":"application/json",
    },
});

export default nexiosInstance;