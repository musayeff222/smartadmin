import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import NotificationPermission from './components/NotificationPermission';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/auth/ProtectedRoute';
import api from './services/api';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Features = lazy(() => import('./pages/Features'));
const Packages = lazy(() => import('./pages/Packages'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const MySubscriptions = lazy(() => import('./pages/MySubscriptions'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Yükleniyor...</p>
    </div>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin-panel');

  // Track visitor on page load (only for public routes)
  useEffect(() => {
    if (!isAdminRoute) {
      // Track visitor asynchronously without blocking
      api.post('/public/track-visitor', { path: location.pathname }).catch(() => {
        // Silently fail - don't interrupt user experience
      });
    }
  }, [location.pathname, isAdminRoute]);

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex flex-col ${isAdminRoute ? 'bg-white' : ''}`}>
      {!isAdminRoute && <Navbar />}
      <main className={`flex-grow ${isAdminRoute ? 'bg-white' : ''} animate-fade-in`}>
        <Suspense fallback={<PageLoader />}>
          <div className="page-enter-active">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/ozellikler" element={<Features />} />
              <Route path="/paketler" element={<Packages />} />
              <Route path="/hakkimizda" element={<About />} />
              <Route path="/iletisim" element={<Contact />} />
              <Route path="/aboneliklerim" element={<MySubscriptions />} />
              <Route path="/admin-panel/login" element={<AdminLogin />} />
              <Route
                path="/admin-panel/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Suspense>
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <WhatsAppButton />}
      {!isAdminRoute && <ScrollToTop />}
      {!isAdminRoute && <NotificationPermission />}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            borderRadius: '12px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

