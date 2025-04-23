import axios, {AxiosInstance, AxiosRequestConfig} from 'axios';
import {HOST_API, HOST_API_OPEN} from "../config-global";

export const api: AxiosInstance = axios.create({
  baseURL: HOST_API,
  headers: {
    "Content-Type": "application/json"
  },
  // withCredentials: true,
});

export const apiOpen: AxiosInstance = axios.create({
  baseURL: HOST_API_OPEN,
  headers: {
    "Content-Type": "application/json"
  },
  // withCredentials: true,
});

export const fetcher = async (url: string, config?: AxiosRequestConfig) => {
  try {
    const method = config?.method?.toUpperCase() || "GET";

    const response =
        method === "POST"
            ? await api.post(url, config?.data, config)
            : method === "PUT"
                ? await api.put(url, config?.data, config)
                : method === "DELETE"
                    ? await api.delete(url, config)
                    : await api.get(url, config);

    return response.data; // Always return `.data` for consistency.
  } catch (error: any) {
    throw error.response?.data || error.message || "An error occurred";
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  auth: {
    me: '/auth/me',
    login: '/auth/login',
    register: '/auth/register',
  },
  file: {
    list: '/file/list',
    details: '/file/details',
    search: '/file/search',
    upload: '/file/upload',
    delete: '/file/delete',
    favorite: '/file/favorite',
    notfavorite: '/file/notfavorite',
    sendLink: 'file/sendlink',
  },
  folder: {
    list: '/folder/list',
    details: '/folder/details',
    search: '/folder/search',
    new: '/folder/new',
    delete: '/folder/delete',
    storage: '/folder/storage',
    favorite: '/folder/favorite',
    notfavorite: '/folder/notfavorite',
  },
  dashboard: {
    overview: '/dashboard/overview',
    generateImage: '/dashboard/generate',
    latestimages: '/dashboard/latestimages',
    generateIdeas: '/dashboard/generateideas',
  },
  user: {
    invoices: '/invoices',
    upgradePlan: '/profile/upgrade',
    photo: '/profile/photo',
    updateProfile: '/profile/update',
    createProfile: '/profile/create',
    },
};

export type IResult = {
  Value: any;
    StatusCode: number;
    Formatters: [];
    ContentTypes: [];
    DeclaredType: string;
}
