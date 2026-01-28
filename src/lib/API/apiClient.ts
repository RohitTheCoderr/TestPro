import axios, { AxiosResponse } from "axios";
import axiosInstance from "./axiosInstance";

// Define a generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string | number;
}

export const apiClient = {
  get: async <T = unknown>(
    url: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await axiosInstance.get(url, { params });
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(
            "Network error: Please check your internet connection.",
          );
        } else {
          throw new Error(
            (error.response.data as { message?: string })?.message ||
              `Request failed with status ${error.response.status}`,
          );
        }
      }
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  },

  // post: async <T = unknown>(
  //   url: string,
  //   data?: Record<string, unknown>
  // ): Promise<T> => {
  //   const res: AxiosResponse<T> = await axiosInstance.post(url, data);
  //   return res.data;
  // },

  post: async <T = unknown, D = unknown>(url: string, data?: D): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await axiosInstance.post(url, data);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(
            "Network error: Please check your internet connection.",
          );
        } else {
          throw new Error(
            (error.response.data as { message?: string })?.message ||
              `Request failed with status ${error.response.status}`,
          );
        }
      }
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  },

  patch: async <T = unknown, D = unknown>(
    url: string,
    data?: D,
  ): Promise<T> => {
    try {
      const res: AxiosResponse<T> = await axiosInstance.patch(url, data);
      return res.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          throw new Error(
            "Network error: Please check your internet connection.",
          );
        } else {
          throw new Error(
            (error.response.data as { message?: string })?.message ||
              `Request failed with status ${error.response.status}`,
          );
        }
      }
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred. Please try again.");
    }
  },

  put: async <T = unknown>(
    url: string,
    data?: Record<string, unknown>,
  ): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.put(url, data);
    return res.data;
  },

  delete: async <T = unknown>(url: string): Promise<T> => {
    const res: AxiosResponse<T> = await axiosInstance.delete(url);
    return res.data;
  },
};

// import axios from "axios";
// import axiosInstance from "./axiosInstance";

// export const apiClient = {
//   get: async (url: string, params?: Record<string, any>) => {
//     try {
//       const res = await axiosInstance.get(url, { params });
//       return res.data;
//     } catch (error: unknown) {
//       if (axios.isAxiosError(error)) {
//         if (!error.response) {
//           // Network or timeout
//           throw new Error("Network error: Please check your internet connection.");
//         } else {
//           // Server responded with error
//           throw new Error(
//             error.response.data?.message || `Request failed with status ${error.response.status}`
//           );
//         }
//       }
//       console.error("Unexpected error:", error);
//       throw new Error("An unexpected error occurred. Please try again.");
//     }
//   },

//   post: async (url: string, data?: Record<string, any>) => {
//     const res = await axiosInstance.post(url, data);
//     return res.data;
//   },

//   put: async (url: string, data?: Record<string, any>) => {
//     const res = await axiosInstance.put(url, data);
//     return res.data;
//   },

//   patch: async (url: string, data?: Record<string, any>) => {
//     const res = await axiosInstance.patch(url, data);
//     return res.data;
//   },

//   delete: async (url: string) => {
//     const res = await axiosInstance.delete(url);
//     return res.data;
//   },
// };
