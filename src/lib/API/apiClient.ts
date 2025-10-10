import axiosInstance from "./axiosInstance";
export const apiClient = {
  get: async (url: string, params?: any) => {
    const res = await axiosInstance.get(url, { params });
    return res.data;
  },

  post: async (url: string, data?: any) => {
    const res = await axiosInstance.post(url, data);
    return res.data;
  },

  put: async (url: string, data?: any) => {
    const res = await axiosInstance.put(url, data);
    return res.data;
  },

  patch: async (url: string, data?: any) => {
    const res = await axiosInstance.patch(url, data);
    return res.data;
  },

  delete: async (url: string) => {
    const res = await axiosInstance.delete(url);
    return res.data;
  },
};
