import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://europe-west3-s9bar-54d46.cloudfunctions.net/api",
  baseURL: "http://localhost:5001/s9bar-54d46/europe-west3/api",
  timeout: 60 * 1000,
  withCredentials: false,
});

export default axiosInstance;
