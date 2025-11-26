import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Package {
  id: string;
  name: string;
  price: number;
}

interface Subscription {
  id: string;
  package: Package;
  restaurantName: string | null;
  restaurantAddress: string | null;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  startDate: string;
  endDate: string;
  amount: number;
  notes: string | null;
}

const MySubscriptions = () => {
  const { user, isAuthenticated } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchSubscriptions();
    }
  }, [isAuthenticated, user]);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/public/my-subscriptions');
      setSubscriptions(response.data.subscriptions || []);
    } catch (error: any) {
      console.error('Fetch subscriptions error:', error);
      if (error.response?.status === 401) {
        toast.error('Lütfen giriş yapın');
      } else {
        toast.error('Abonelikler yüklenirken hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await api.get(`/public/subscriptions/${id}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fatura-${id.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('PDF indirildi');
    } catch (error: any) {
      console.error('PDF download error:', error);
      toast.error('PDF indirilemedi');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Giriş Yapın</h1>
        <p className="text-gray-600 mb-8">Aboneliklerinizi görüntülemek için lütfen giriş yapın.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Aboneliklerim</h1>

      {subscriptions.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">📦</div>
          <h2 className="text-xl font-semibold mb-2">Henüz aboneliğiniz yok</h2>
          <p className="text-gray-600 mb-6">Paketler sayfasından abonelik satın alabilirsiniz.</p>
          <a href="/paketler" className="btn btn-primary inline-block">
            Paketleri Görüntüle
          </a>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="card">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{sub.package.name}</h3>
                    {sub.restaurantName && (
                      <p className="text-gray-600">{sub.restaurantName}</p>
                    )}
                  </div>
                  <div className="flex flex-col sm:items-end gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        sub.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : sub.status === 'expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {sub.status === 'active'
                        ? 'Aktif'
                        : sub.status === 'expired'
                        ? 'Süresi Dolmuş'
                        : 'İptal Edilmiş'}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        sub.paymentStatus === 'paid'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sub.paymentStatus === 'paid' ? '✓ Ödendi' : 'Ödeme Bekliyor'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Başlangıç Tarihi</div>
                    <div className="font-medium">
                      {new Date(sub.startDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Bitiş Tarihi</div>
                    <div className="font-medium">
                      {new Date(sub.endDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  {sub.restaurantAddress && (
                    <div className="sm:col-span-2">
                      <div className="text-sm text-gray-500 mb-1">Restoran Adresi</div>
                      <div className="font-medium">{sub.restaurantAddress}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Toplam Tutar</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {Number(sub.amount).toFixed(2)} AZN
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {sub.notes && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-500 mb-1">Notlar</div>
                    <div className="text-gray-700">{sub.notes}</div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  {sub.paymentStatus === 'pending' && (
                    <button className="flex-1 btn btn-primary">
                      Ödeme Yap
                    </button>
                  )}
                  <button
                    onClick={() => handleDownloadPDF(sub.id)}
                    className="flex-1 btn btn-secondary"
                  >
                    📄 PDF Fatura İndir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptions;

