import axios from 'axios';
import { getToken } from '../services/localstorage.service.ts';
import { API_URL } from '../consts/consts.ts';
import type { IUserData, IUserLoginRequest, IUserRegisterRequest } from '../types/interfaces.ts';

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  timeout: 100000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 && error.config && !error.config._isRetry) {
      error.config._isRetry = true;
      const response = await axios.get(`${API_URL}/refresh`, { withCredentials: true });
      if (response.data.accessToken) {
        localStorage.setItem('token', response.data.accessToken);
        return axios.request(error.config);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

export const fetchMe = async () => {
  const { data } = await api.get<IUserData>('/me');
  return data;
};

export const fetchUsers = async () => {
  const { data } = await api.get<IUserData[]>('/users');
  return data;
};

export const createUser = async (payload: IUserRegisterRequest) => {
  const { data } = await api.post('/registration', payload);
  return data;
};

export const login = async ({ email, password }: IUserLoginRequest) => {
  const { data } = await api.post('/login', { email, password });
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/logout');
  return data;
};
