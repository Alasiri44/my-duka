import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://my-duka-c8kn.onrender.com/backend",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
