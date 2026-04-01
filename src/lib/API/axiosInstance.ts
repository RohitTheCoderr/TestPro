import axios from "axios";
import { store } from "../redux/store";
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach token from localStorage (or Redux if needed)
axiosInstance.interceptors.request.use(
  (config) => {
    // const token =
    //   typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    // const token = useSelector((state: RootState) => state.auth.token) || null;

    const token = store.getState().auth.token; // from redux store
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
