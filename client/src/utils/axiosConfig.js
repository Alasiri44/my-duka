import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/backend",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
