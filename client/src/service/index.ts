import axios from 'axios';
import { io } from "socket.io-client";

export const api = axios.create({
    baseURL: "http://localhost:3000",
});

export const ioSocket = io("http://localhost:3000");