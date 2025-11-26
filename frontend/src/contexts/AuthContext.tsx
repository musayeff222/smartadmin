import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, User } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Önce localStorage'dan kontrol et (daha hızlı)
      const storedUser = authService.getUser();
      if (storedUser) {
        console.log('Found stored user:', storedUser);
        setUser(storedUser);
        setLoading(false);
        
        // Sonra backend'den doğrula (arka planda)
        if (authService.isAuthenticated()) {
          try {
            const currentUser = await authService.getCurrentUser();
            console.log('Verified user from backend:', currentUser);
            setUser(currentUser);
            // Backend'den gelen user'ı localStorage'a kaydet
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            console.error('Failed to verify user, clearing auth:', error);
            authService.logout();
            setUser(null);
          }
        }
      } else if (authService.isAuthenticated()) {
        // Token var ama user yok, backend'den al
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('Failed to get user, clearing auth:', error);
          authService.logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await authService.login({ email, password });
      console.log('AuthContext - Login response data:', data);
      
      if (data && data.user) {
        // Role'u string olarak garanti et
        const userWithRole = {
          ...data.user,
          role: String(data.user.role || ''),
        };
        
        console.log('AuthContext - User with role:', userWithRole);
        
        // User state'ini güncelle
        setUser(userWithRole);
        console.log('AuthContext - User state updated:', userWithRole);
        
        // localStorage'ı da güncelle
        localStorage.setItem('user', JSON.stringify(userWithRole));
        
        return {
          ...data,
          user: userWithRole,
        };
      } else {
        // Eğer response'da user yoksa localStorage'dan al
        const storedUser = authService.getUser();
        if (storedUser) {
          console.log('AuthContext - Using stored user from localStorage');
          const userWithRole = {
            ...storedUser,
            role: String(storedUser.role || ''),
          };
          setUser(userWithRole);
          return { user: userWithRole, token: localStorage.getItem('token') };
        }
        throw new Error('Login response does not contain user data');
      }
    } catch (error) {
      console.error('Login error in AuthContext:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

