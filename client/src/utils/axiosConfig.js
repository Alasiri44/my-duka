import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://myduka-xylv.onrender.com/backend",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
