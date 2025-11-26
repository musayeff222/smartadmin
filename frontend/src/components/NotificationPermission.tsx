import { useState, useEffect } from 'react';
import { notificationService } from '../services/notification.service';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'notification_permission_asked';

const NotificationPermission = () => {
  const [showModal, setShowModal] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      return;
    }

    setIsSupported(true);

    // Check if already asked before
    const alreadyAsked = localStorage.getItem(STORAGE_KEY);
    const permission = Notification.permission;

    // Eğer daha önce sorulmadıysa ve izin durumu 'default' ise modal göster
    if (!alreadyAsked && permission === 'default') {
      // Kullanıcı sayfaya girdikten 2 saniye sonra modal göster
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleYes = async () => {
    setIsLoading(true);
    try {
      console.log('=== Bildirim Aboneliği Başlatılıyor ===');
      const subscription = await notificationService.subscribe();
      if (subscription) {
        console.log('✅ Subscription successful:', subscription);
        toast.success('Bildirimler başarıyla etkinleştirildi! 🎉');
        // Bir daha gösterme
        localStorage.setItem(STORAGE_KEY, 'granted');
      } else {
        console.warn('⚠️ Subscription returned null - permission might be denied');
        // İzin reddedildi, bir daha gösterme
        localStorage.setItem(STORAGE_KEY, 'denied');
        toast.error('Bildirim izni verilmedi');
      }
    } catch (error: any) {
      console.error('❌ Subscribe error:', error);
      console.error('Error message:', error.message);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = 'Bildirim aboneliği sırasında bir hata oluştu';
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      localStorage.setItem(STORAGE_KEY, 'denied');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  const handleNo = () => {
    // Hayır dedi, bir daha gösterme
    localStorage.setItem(STORAGE_KEY, 'denied');
    setShowModal(false);
  };

  // Desteklenmiyorsa veya modal gösterilmeyecekse hiçbir şey render etme
  if (!isSupported || !showModal) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleNo}
      onTouchMove={(e) => e.preventDefault()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔔</div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            Bildirimler ile Güncel Bilgiler Alın
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Yeni paketler, kampanyalar ve önemli duyurulardan haberdar olmak için bildirimleri etkinleştirin.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
          <button
            onClick={handleNo}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            Hayır
          </button>
          <button
            onClick={handleYes}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            {isLoading ? 'Yükleniyor...' : 'Evet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationPermission;

