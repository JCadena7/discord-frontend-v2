import axios from 'axios';
import { DiscordRole, DiscordChannel, DiscordCategory } from '../types/discord';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the token in each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await api.post('/auth/refresh-token', { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('access_token', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

// Channels API
export const channelsApi = {
  getChannels: (guildId: string) => api.get<DiscordChannel[]>(`/discord-bot/${guildId}/channels`),
  getChannel: (guildId: string, id: string) => api.get<DiscordChannel>(`/discord-bot/${guildId}/channels/${id}`),
  createChannel: (guildId: string, data: Partial<DiscordChannel>) => 
    api.post<DiscordChannel>(`/discord-bot/${guildId}/channels`, data),
  updateChannel: (guildId: string, id: string, data: Partial<DiscordChannel>) => 
    api.put<DiscordChannel>(`/discord-bot/${guildId}/channels/${id}`, data),
  deleteChannel: (guildId: string, id: string) => 
    api.delete(`/discord-bot/${guildId}/channels/${id}`),
  deleteMultipleChannels: (guildId: string, channelIds: string[]) => 
    api.delete(`/discord-bot/${guildId}/delete-channels`, { data: { channelIds } }),
  getCategoryChannels: (guildId: string, categoryId: string) => 
    api.get<DiscordChannel[]>(`/discord-bot/${guildId}/categories/${categoryId}/channels`),
};

// Categories API
export const categoriesApi = {
  getCategories: (guildId: string) => 
    api.get<DiscordCategory[]>(`/discord-bot/${guildId}/categories`),
  getCategory: (guildId: string, id: string) => 
    api.get<DiscordCategory>(`/discord-bot/${guildId}/categories/${id}`),
  createCategory: (guildId: string, data: Partial<DiscordCategory>) => 
    api.post<DiscordCategory>(`/discord-bot/${guildId}/categories`, data),
  updateCategory: (guildId: string, id: string, data: Partial<DiscordCategory>) => 
    api.put<DiscordCategory>(`/discord-bot/${guildId}/categories/${id}`, data),
  deleteCategory: (guildId: string, id: string) => 
    api.delete(`/discord-bot/${guildId}/categories/${id}`),
};

// Bot Status API
// Roles API
export const rolesApi = {
  getRoles: (guildId: string) => api.get<DiscordRole[]>(`/discord-bot/${guildId}/roles`),
  createRole: (guildId: string, data: Partial<DiscordRole>) => api.post<DiscordRole>(`/discord-bot/${guildId}/roles`, data),
  updateRole: (guildId: string, id: string, data: Partial<DiscordRole>) => api.put<DiscordRole>(`/discord-bot/${guildId}/roles/${id}`, data),
  deleteRole: (guildId: string, id: string) => api.delete(`/discord-bot/${guildId}/roles/${id}`),
};

export const botApi = {
  getBotStatus: (guildId: string) => 
    api.get(`/discord-bot/${guildId}/bot-status`),
};

export default api;