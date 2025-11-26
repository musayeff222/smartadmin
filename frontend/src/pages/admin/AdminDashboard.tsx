import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardHome from './DashboardHome';
import PackagesManagement from './PackagesManagement';
import SubscriptionsManagement from './SubscriptionsManagement';
import ContactMessages from './ContactMessages';
import ContentManagement from './ContentManagement';
import WebSettings from './WebSettings';
import SendNotifications from './SendNotifications';
import UsersManagement from './UsersManagement';
import Statistics from './Statistics';
import AdvertisingCustomers from './AdvertisingCustomers';
import toast from 'react-hot-toast';
import api from '../../services/api';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  // Sidebar durumunu localStorage'dan oku, yoksa desktop'ta açık başlat
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('adminSidebarOpen');
    return saved !== null ? saved === 'true' : true; // Default: açık
  });
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  // Sidebar durumunu localStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('adminSidebarOpen', sidebarOpen.toString());
  }, [sidebarOpen]);

  // Fetch unread messages count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await api.get('/admin/statistics');
        setUnreadMessagesCount(response.data.statistics.newMessages || 0);
      } catch (error) {
        console.error('Failed to fetch unread messages count:', error);
      }
    };
    
    fetchUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  // Debug: Kullanıcı bilgilerini logla
  useEffect(() => {
    console.log('AdminDashboard - User info:', {
      user,
      isAuthenticated,
      userRole: user?.role,
      localStorageUser: JSON.parse(localStorage.getItem('user') || 'null'),
      currentPath: location.pathname,
    });
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    toast.success('Çıkış yapıldı');
    navigate('/admin-panel/login');
  };

  const isActive = (path: string) => {
    // Exact match for dashboard
    if (path === '/admin-panel') {
      return location.pathname === '/admin-panel' || location.pathname === '/admin-panel/';
    }
    // For other paths, check if current path starts with the menu path
    return location.pathname.startsWith(path);
  };

  // SVG Icon Components
  const DashboardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
  
  const PackageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );
  
  const SubscriptionIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
  
  const MessageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
  
  const ContentIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
  
  const SettingsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const NotificationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
  
  const StatisticsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
  
  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
  
  const AdvertisingIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  );
  
  const LogoutIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  const menuItems = [
    { path: '/admin-panel', label: 'Dashboard', icon: DashboardIcon },
    { path: '/admin-panel/packages', label: 'Paketler', icon: PackageIcon },
    { path: '/admin-panel/subscriptions', label: 'Abonelikler', icon: SubscriptionIcon },
    { path: '/admin-panel/messages', label: 'Mesajlar', icon: MessageIcon, badge: true },
    { path: '/admin-panel/advertising-customers', label: 'Reklam Müşterileri', icon: AdvertisingIcon },
    { path: '/admin-panel/content', label: 'İçerik Yönetimi', icon: ContentIcon },
    { path: '/admin-panel/settings', label: 'Web Ayarları', icon: SettingsIcon },
    { path: '/admin-panel/notifications', label: 'Bildirimler', icon: NotificationIcon },
    { path: '/admin-panel/statistics', label: 'İstatistikler', icon: StatisticsIcon },
  ];

  const userRole = user?.role ? String(user.role).toLowerCase() : '';
  if (userRole === 'super_admin') {
    menuItems.push({ path: '/admin-panel/users', label: 'Kullanıcılar', icon: UsersIcon });
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toggle Button - Hem Mobile hem Desktop */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 p-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-xl transition-all duration-300 ${
          sidebarOpen ? 'left-4 lg:left-[260px]' : 'left-4'
        }`}
        title={sidebarOpen ? 'Sidebar\'ı Kapat' : 'Sidebar\'ı Aç'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white z-40 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-slate-700/50 bg-gradient-to-r from-slate-800/50 to-slate-900/50">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-xs text-slate-400">Yönetim Merkezi</p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-700/50">
              <p className="text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 capitalize">{user?.role}</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-3 sm:p-4 space-y-1.5 overflow-y-auto">
            {menuItems.map((item) => {
              const unreadCount = item.badge && item.path === '/admin-panel/messages' 
                ? unreadMessagesCount 
                : 0;
              const IconComponent = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`}>
                      <IconComponent />
                    </div>
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && unreadCount > 0 && (
                    <span className={`text-xs font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center ${
                      active 
                        ? 'bg-white/20 text-white' 
                        : 'bg-red-500 text-white animate-pulse'
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
          
          {/* Footer */}
          <div className="p-3 sm:p-4 border-t border-slate-700/50">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 border border-slate-700/50 hover:border-red-500/30"
            >
              <LogoutIcon />
              <span className="font-medium text-sm">Çıkış Yap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`min-h-screen transition-all duration-300 ${
        sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
      }`}>
        <div className="p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="packages" element={<PackagesManagement />} />
            <Route path="subscriptions" element={<SubscriptionsManagement />} />
            <Route path="messages" element={<ContactMessages />} />
            <Route path="advertising-customers" element={<AdvertisingCustomers />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="settings" element={<WebSettings />} />
            <Route path="notifications" element={<SendNotifications />} />
            <Route path="statistics" element={<Statistics />} />
            {userRole === 'super_admin' && (
              <Route path="users" element={<UsersManagement />} />
            )}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

