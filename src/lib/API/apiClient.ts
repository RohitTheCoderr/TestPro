import axios from "axios";
import axiosInstance from "./axiosInstance";

export const apiClient = {
  get: async (url: string, params?: Record<string, any>) => {
    try {
      const res = await axiosInstance.get(url, { params });
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          // Network or timeout
          throw new Error("Network error: Please check your internet connection.");
        } else {
          // Server responded with error
          throw new Error(
            error.response.data?.message || `Request failed with status ${error.response.status}`
          );
        }
      }
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  },

  post: async (url: string, data?: Record<string, any>) => {
    const res = await axiosInstance.post(url, data);
    return res.data;
  },

  put: async (url: string, data?: Record<string, any>) => {
    const res = await axiosInstance.put(url, data);
    return res.data;
  },

  patch: async (url: string, data?: Record<string, any>) => {
    const res = await axiosInstance.patch(url, data);
    return res.data;
  },

  delete: async (url: string) => {
    const res = await axiosInstance.delete(url);
    return res.data;
  },
};
