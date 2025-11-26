import api from './api';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'user';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    console.log('Auth service - Login response:', response.data);
    
    if (response.data.token && response.data.user) {
      // Role'u string olarak garanti et
      const user = {
        ...response.data.user,
        role: String(response.data.user.role || ''),
      };
      
      console.log('Auth service - Saving user:', user);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return {
        ...response.data,
        user,
      };
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

