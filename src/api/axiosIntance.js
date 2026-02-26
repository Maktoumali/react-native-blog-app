import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Create axios instance
const api = axios.create({
  baseURL: "http://192.168.1.66:8000",
  timeout: 10000,
});

// Request Interceptor (Attach Access Token)
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('access_token'); 
    // Later you can get this from AsyncStorage

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;