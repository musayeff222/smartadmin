import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export enum AdvertisingChannel {
  WHATSAPP = 'whatsapp',
  INSTAGRAM = 'instagram',
  TIKTOK = 'tiktok',
  FACEBOOK = 'facebook',
}

interface AdvertisingCustomer {
  id: string;
  customerName: string;
  phone: string;
  restaurantName: string;
  tableCount: number | null;
  qrMenuRequest: boolean;
  notes: string | null;
  channel: AdvertisingChannel;
  createdAt: string;
  updatedAt: string;
}


const AdvertisingCustomers = () => {
  const [customers, setCustomers] = useState<AdvertisingCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<AdvertisingCustomer | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState<string>('');
  const [filterQrMenu, setFilterQrMenu] = useState<string>('');
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    restaurantName: '',
    tableCount: '',
    qrMenuRequest: false,
    notes: '',
    channel: AdvertisingChannel.WHATSAPP,
  });

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterChannel) params.append('channel', filterChannel);
      if (filterQrMenu) params.append('qrMenuRequest', filterQrMenu);
      
      const response = await api.get(`/admin/advertising-customers?${params.toString()}`);
      setCustomers(response.data.customers || []);
    } catch (error: any) {
      console.error('Fetch customers error:', error);
      toast.error('Müşteriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsApp = (customer: AdvertisingCustomer) => {
    if (!customer.phone) {
      toast.error('Bu müşteride telefon numarası bulunmuyor');
      return;
    }
    
    const cleanPhone = customer.phone.replace(/[^0-9]/g, '');
    const defaultMessage = `Merhaba ${customer.customerName}, SmartCafe hakkında bilgi almak ister misiniz?`;
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, filterChannel, filterQrMenu]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer) {
        await api.put(`/admin/advertising-customers/${editingCustomer.id}`, formData);
        toast.success('Müşteri başarıyla güncellendi');
      } else {
        await api.post('/admin/advertising-customers', formData);
        toast.success('Müşteri başarıyla eklendi');
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu');
    }
  };

  const handleEdit = (customer: AdvertisingCustomer) => {
    setEditingCustomer(customer);
    setFormData({
      customerName: customer.customerName,
      phone: customer.phone,
      restaurantName: customer.restaurantName,
      tableCount: customer.tableCount?.toString() || '',
      qrMenuRequest: customer.qrMenuRequest,
      notes: customer.notes || '',
      channel: customer.channel,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/admin/advertising-customers/${id}`);
      toast.success('Müşteri başarıyla silindi');
      fetchData();
      setDeleteConfirm(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
    }
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      phone: '',
      restaurantName: '',
      tableCount: '',
      qrMenuRequest: false,
      notes: '',
      channel: AdvertisingChannel.WHATSAPP,
    });
    setEditingCustomer(null);
  };


  const getChannelLabel = (channel: AdvertisingChannel) => {
    const labels: Record<AdvertisingChannel, string> = {
      [AdvertisingChannel.WHATSAPP]: 'WhatsApp',
      [AdvertisingChannel.INSTAGRAM]: 'Instagram',
      [AdvertisingChannel.TIKTOK]: 'TikTok',
      [AdvertisingChannel.FACEBOOK]: 'Facebook',
    };
    return labels[channel];
  };

  const getChannelColor = (channel: AdvertisingChannel) => {
    const colors: Record<AdvertisingChannel, string> = {
      [AdvertisingChannel.WHATSAPP]: 'bg-green-100 text-green-800 border-green-300',
      [AdvertisingChannel.INSTAGRAM]: 'bg-pink-100 text-pink-800 border-pink-300',
      [AdvertisingChannel.TIKTOK]: 'bg-black text-white border-gray-800',
      [AdvertisingChannel.FACEBOOK]: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[channel];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reklam Müşterileri</h1>
          <p className="text-gray-600 mt-1">Reklam kanallarından gelen müşterileri yönetin</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Yeni Müşteri Ekle</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Arama</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Müşteri adı, telefon, restoran..."
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kanal</label>
            <select
              value={filterChannel}
              onChange={(e) => setFilterChannel(e.target.value)}
              className="input"
            >
              <option value="">Tümü</option>
              <option value={AdvertisingChannel.WHATSAPP}>WhatsApp</option>
              <option value={AdvertisingChannel.INSTAGRAM}>Instagram</option>
              <option value={AdvertisingChannel.TIKTOK}>TikTok</option>
              <option value={AdvertisingChannel.FACEBOOK}>Facebook</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Menü</label>
            <select
              value={filterQrMenu}
              onChange={(e) => setFilterQrMenu(e.target.value)}
              className="input"
            >
              <option value="">Tümü</option>
              <option value="true">Evet</option>
              <option value="false">Hayır</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterChannel('');
                setFilterQrMenu('');
              }}
              className="btn btn-secondary w-full"
            >
              Filtreleri Temizle
            </button>
          </div>
        </div>
      </div>


      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {customers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Henüz müşteri bulunmamaktadır</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Müşteri Adı</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Telefon</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Restoran</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Masa Sayısı</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kanal</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">QR Menü</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{customer.customerName}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{customer.restaurantName}</td>
                    <td className="px-4 py-3 text-gray-600">
                      {customer.tableCount || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getChannelColor(customer.channel)}`}>
                        {getChannelLabel(customer.channel)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {customer.qrMenuRequest ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Evet
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Hayır
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSendWhatsApp(customer)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="WhatsApp Gönder"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Düzenle"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(customer.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Müşteri Adı *</label>
                  <input
                    type="text"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Telefon Numarası *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input"
                    placeholder="+994501234567"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Restoran / Mekan Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.restaurantName}
                  onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                  className="input"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Masa Sayısı</label>
                  <input
                    type="number"
                    value={formData.tableCount}
                    onChange={(e) => setFormData({ ...formData, tableCount: e.target.value })}
                    className="input"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Kanal</label>
                  <select
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value as AdvertisingChannel })}
                    className="input"
                  >
                    <option value={AdvertisingChannel.WHATSAPP}>WhatsApp</option>
                    <option value={AdvertisingChannel.INSTAGRAM}>Instagram</option>
                    <option value={AdvertisingChannel.TIKTOK}>TikTok</option>
                    <option value={AdvertisingChannel.FACEBOOK}>Facebook</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.qrMenuRequest}
                    onChange={(e) => setFormData({ ...formData, qrMenuRequest: e.target.checked })}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-700">QR Menü İsteği</span>
                </label>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Not</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={4}
                  placeholder="Özel notlar..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  {editingCustomer ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="btn btn-secondary"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Müşteriyi Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu müşteriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="btn bg-red-600 hover:bg-red-700 text-white flex-1"
              >
                Sil
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertisingCustomers;

