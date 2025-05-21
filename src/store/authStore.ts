import { create } from 'zustand';
import { DiscordGuild } from '../types/discord';
import api from '../services/api';

interface AuthState {
  isAuthenticated: boolean;
  selectedGuild: DiscordGuild | null;
  isLoading: boolean;
  error: string | null;
  guilds: DiscordGuild[];
  login: () => void;
  logout: () => Promise<void>;
  fetchGuilds: () => Promise<void>;
  selectGuild: (guild: DiscordGuild) => void;
  checkAuthStatus: () => Promise<void>;
  handleAuthCallback: (code: string) => Promise<void>;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = create<AuthState>()((set, get) => ({
  isAuthenticated: !!localStorage.getItem('access_token'),
  selectedGuild: JSON.parse(localStorage.getItem('selected_guild') || 'null'),
  isLoading: false,
  error: null,
  guilds: [],
  
  login: () => {
    window.location.href = `${API_URL}/auth/discord`;
  },
  
  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('selected_guild');
      set({ 
        isAuthenticated: false,
        selectedGuild: null,
        guilds: [] 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },
  
  fetchGuilds: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/auth/guilds');
      set({ guilds: response.data, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to fetch guilds',
        isLoading: false 
      });
    }
  },
  
  selectGuild: (guild: DiscordGuild) => {
    localStorage.setItem('selected_guild', JSON.stringify(guild));
    set({ selectedGuild: guild });
  },

  checkAuthStatus: async () => {
    try {
      const response = await api.get('/auth/status');
      const isAuthenticated = response.data.isAuthenticated;
      set({ isAuthenticated });
      if (isAuthenticated) {
        get().fetchGuilds();
      }
    } catch (error) {
      set({ isAuthenticated: false });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  handleAuthCallback: async (code: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/auth/discord/redirect?code=${code}`);
      const { accessToken, refreshToken } = response.data;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      set({ 
        isAuthenticated: true,
        isLoading: false 
      });
      
      await get().fetchGuilds();
    } catch (error) {
      set({ 
        error: 'Authentication failed',
        isLoading: false,
        isAuthenticated: false 
      });
      throw error;
    }
  }
}));