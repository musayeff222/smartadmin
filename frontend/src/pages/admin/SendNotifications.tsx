import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface NotificationSubscription {
  id: string;
  endpoint: string;
  userAgent: string | null;
  userId: string | null;
  createdAt: string;
}

const SendNotifications = () => {
  const [subscriptions, setSubscriptions] = useState<NotificationSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    url: '',
    targetSubscriptionId: '',
  });

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/admin/notifications/subscriptions');
      console.log('Subscriptions response:', response.data);
      setSubscriptions(response.data.subscriptions || []);
      
      // Debug bilgisi
      if (response.data.debug) {
        console.log('VAPID configured:', response.data.debug.vapidConfigured);
        console.log('Subscription count:', response.data.debug.subscriptionCount);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Subscriptions fetch error:', error);
      console.error('Error details:', error.response?.data);
      toast.error('Abonelikler yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      toast.error('Başlık ve mesaj zorunludur');
      return;
    }

    setSending(true);
    try {
      const response = await api.post('/admin/notifications/send', {
        title: formData.title,
        message: formData.message,
        url: formData.url || undefined,
        targetSubscriptionId: formData.targetSubscriptionId || undefined,
      });

      const message = response.data.message || 'Bildirim gönderildi';
      toast.success(message);
      
      // Aboneleri yeniden yükle
      await fetchSubscriptions();
      
      setFormData({
        title: '',
        message: '',
        url: '',
        targetSubscriptionId: '',
      });
    } catch (error: any) {
      console.error('Send notification error:', error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Bildirim gönderilirken hata oluştu';
      toast.error(errorMessage);
      
      // Eğer VAPID key hatası varsa, kullanıcıya bilgi ver
      if (error.response?.data?.error === 'VAPID keys not configured') {
        console.error('VAPID keys eksik! Backend klasöründe şu komutu çalıştırın: npm run generate-vapid-keys');
      }
    } finally {
      setSending(false);
    }
  };

  const getBrowserIcon = (userAgent: string | null) => {
    if (!userAgent) return '💻';
    if (userAgent.includes('Chrome')) return '🌐';
    if (userAgent.includes('Firefox')) return '🦊';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return '🧭';
    if (userAgent.includes('Edge')) return '🌐';
    return '💻';
  };

  const getBrowserName = (userAgent: string | null) => {
    if (!userAgent) return 'Bilinmeyen Cihaz';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Web Tarayıcı';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bildirim Gönder</h1>
            <p className="text-sm text-gray-600 mt-0.5">Kullanıcılara push bildirimleri gönderin</p>
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-semibold text-blue-900">
              {subscriptions.length} Aktif Abone
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bildirim Formu - Sol Taraf */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                <span>Bildirim Formu</span>
              </h2>
              <p className="text-sm text-gray-600">Yeni bildirim oluşturun ve gönderin</p>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>Başlık *</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input w-full"
                  placeholder="Örn: Yeni Paket Duyurusu"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Mesaj *</span>
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="input w-full"
                  rows={5}
                  placeholder="Bildirim mesajınızı buraya yazın..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length} karakter</p>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span>URL (Opsiyonel)</span>
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="input w-full"
                  placeholder="/paketler veya https://..."
                />
                <p className="text-xs text-gray-500 mt-1">Bildirime tıklandığında yönlendirilecek sayfa</p>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>Belirli Bir Aboneye Gönder (Opsiyonel)</span>
                </label>
                <select
                  value={formData.targetSubscriptionId}
                  onChange={(e) => setFormData({ ...formData, targetSubscriptionId: e.target.value })}
                  className="input w-full"
                >
                  <option value="">Tüm Abonelere Gönder ({subscriptions.length} kişi)</option>
                  {subscriptions.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {getBrowserIcon(sub.userAgent)} {getBrowserName(sub.userAgent)} - {new Date(sub.createdAt).toLocaleDateString('tr-TR')}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleSend}
                  disabled={sending || !formData.title.trim() || !formData.message.trim()}
                  className="btn btn-primary w-full px-6 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Gönderiliyor...</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span>Bildirimi Gönder</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Aktif Aboneler - Sağ Taraf */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center space-x-2">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Aktif Aboneler</span>
              </h2>
              <p className="text-sm text-gray-600">{subscriptions.length} kullanıcı bildirim alıyor</p>
            </div>
            {subscriptions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium mb-1">Henüz abone yok</p>
                <p className="text-sm text-gray-500">Kullanıcılar bildirim izni verdiğinde burada görünecek</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-xl">{getBrowserIcon(sub.userAgent)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">
                            {getBrowserName(sub.userAgent)}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 mb-2">
                          {new Date(sub.createdAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                        {sub.userAgent && (
                          <p className="text-xs text-gray-400 truncate" title={sub.userAgent}>
                            {sub.userAgent.length > 30 ? sub.userAgent.substring(0, 30) + '...' : sub.userAgent}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendNotifications;
