import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Eğer zaten giriş yapmışsa ve admin ise admin paneline yönlendir
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      console.log('AdminLogin - Checking user role:', user.role);
      if (user.role === 'admin' || user.role === 'super_admin') {
        console.log('User already logged in as admin, redirecting to admin panel');
        navigate('/admin-panel', { replace: true });
      } else {
        console.log('User is not admin, showing login form. Role:', user.role);
        // Normal kullanıcı ise çıkış yap ve uyar
        if (user.role === 'user') {
          toast.error('Bu sayfaya erişmek için admin yetkisi gerekiyor. Lütfen admin kullanıcısı ile giriş yapın.');
          // Çıkış yap
          authService.logout();
          // State'i temizlemek için kısa bir gecikme
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);
      console.log('Login result:', result);
      
      // Token ve user kontrolü
      const token = localStorage.getItem('token');
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      
      console.log('After login check:', {
        token: token ? 'exists' : 'missing',
        storedUser,
        resultUser: result?.user,
      });
      
      const finalUser = result?.user || storedUser;
      
      console.log('Login final check:', {
        token: token ? 'exists' : 'missing',
        resultUser: result?.user,
        storedUser,
        finalUser,
        finalUserRole: finalUser?.role,
      });

      if (token && finalUser) {
        // Role kontrolü
        if (finalUser.role !== 'admin' && finalUser.role !== 'super_admin') {
          toast.error('Bu sayfaya erişmek için admin yetkisi gerekiyor');
          authService.logout();
          return;
        }

        toast.success('Giriş başarılı!');
        console.log('Navigating to admin panel...');
        
        // State güncellenmesi için kısa bir gecikme
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Window location kullanarak kesin yönlendirme
        window.location.href = '/admin-panel';
      } else {
        throw new Error('Giriş başarılı ancak kullanıcı bilgileri alınamadı');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Giriş başarısız';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Admin Girişi
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Yönetim paneline erişmek için giriş yapın
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Adresi
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Şifre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 w-full"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Giriş yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Giriş Yap</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

