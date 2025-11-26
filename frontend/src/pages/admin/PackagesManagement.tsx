import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Package } from '../../services/public.service';
import toast from 'react-hot-toast';

const PackagesManagement = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    features: '',
    price: '',
    price1Month: '',
    price6Months: '',
    price12Months: '',
    duration: '',
    displayOrder: '0',
    isActive: true,
  });

  useEffect(() => {
    console.log('PackagesManagement component mounted');
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await api.get('/admin/packages');
      // Ensure price and duration are numbers
      const packagesWithNumbers = response.data.packages.map((pkg: any) => ({
        ...pkg,
        price: typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price,
        duration: typeof pkg.duration === 'string' ? parseInt(pkg.duration) : pkg.duration,
      }));
      setPackages(packagesWithNumbers);
    } catch (error: any) {
      console.error('Fetch packages error:', error);
      const errorMessage = error.response?.data?.message || 'Paketler yüklenirken hata oluştu';
      toast.error(errorMessage);
      
      // Eğer admin yetkisi yoksa kullanıcıyı bilgilendir
      if (error.response?.status === 403) {
        toast.error('Admin yetkisi gerekiyor. Lütfen admin kullanıcısı ile giriş yapın.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Frontend validation
    if (!formData.name.trim()) {
      toast.error('Paket adı zorunludur');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Paket açıklaması zorunludur');
      return;
    }
    
    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Geçerli bir fiyat giriniz');
      return;
    }
    
    if (!formData.duration || isNaN(parseInt(formData.duration)) || parseInt(formData.duration) <= 0) {
      toast.error('Geçerli bir süre giriniz (gün cinsinden)');
      return;
    }
    
    try {
      // Features'ı array'e çevir (boş satırları filtrele)
      const featuresArray = formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f.length > 0);
      
      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        features: featuresArray, // Array olarak gönder
        price: parseFloat(formData.price),
        price1Month: formData.price1Month ? parseFloat(formData.price1Month) : null,
        price6Months: formData.price6Months ? parseFloat(formData.price6Months) : null,
        price12Months: formData.price12Months ? parseFloat(formData.price12Months) : null,
        duration: parseInt(formData.duration),
        displayOrder: parseInt(formData.displayOrder) || 0,
        isActive: formData.isActive,
      };

      if (editingPackage) {
        await api.put(`/admin/packages/${editingPackage.id}`, data);
        toast.success('Paket güncellendi');
      } else {
        await api.post('/admin/packages', data);
        toast.success('Paket oluşturuldu');
      }
      setShowModal(false);
      setEditingPackage(null);
      resetForm();
      fetchPackages();
    } catch (error: any) {
      console.error('Package operation error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'İşlem başarısız';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    // Features array ise join, string ise direkt kullan
    const featuresText = Array.isArray(pkg.features) 
      ? pkg.features.join('\n') 
      : (typeof pkg.features === 'string' ? pkg.features : '');
    setFormData({
      name: pkg.name,
      description: pkg.description,
      features: featuresText,
      price: pkg.price.toString(),
      price1Month: pkg.price1Month?.toString() || '',
      price6Months: pkg.price6Months?.toString() || '',
      price12Months: pkg.price12Months?.toString() || '',
      duration: pkg.duration.toString(),
      displayOrder: pkg.displayOrder.toString(),
      isActive: pkg.isActive,
    });
    setShowModal(true);
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleDelete = async (id: string) => {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
      setDeleteConfirm({ id, name: pkg.name });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/admin/packages/${deleteConfirm.id}`);
      toast.success('Paket silindi');
      setDeleteConfirm(null);
      fetchPackages();
    } catch (error) {
      toast.error('Silme işlemi başarısız');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      features: '',
      price: '',
      price1Month: '',
      price6Months: '',
      price12Months: '',
      duration: '',
      displayOrder: '0',
      isActive: true,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // SVG Icons
  const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  const PackageIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Paket Yönetimi</h1>
            <p className="text-gray-600 text-sm sm:text-base">Paketleri görüntüleyin, düzenleyin ve yönetin</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={async () => {
                try {
                  await api.post('/admin/packages/create-demo');
                  toast.success('Demo paket başarıyla oluşturuldu!');
                  fetchPackages();
                } catch (error: any) {
                  console.error('Create demo package error:', error);
                  const errorMessage = error.response?.data?.message || error.message || 'Demo paket oluşturulurken bir hata oluştu';
                  toast.error(errorMessage);
                }
              }}
              className="btn bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Demo Paket Oluştur</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setEditingPackage(null);
                setShowModal(true);
              }}
              className="btn btn-primary px-6 py-3 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2"
            >
              <PlusIcon />
              <span>Yeni Paket Ekle</span>
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Paket Adı</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Fiyat</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Süre</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Durum</th>
                <th className="text-right p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg, index) => (
                <tr key={pkg.id} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-mono text-sm text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
                      {index + 1}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-gray-900">{pkg.name}</div>
                    {pkg.description && (
                      <div className="text-sm text-gray-600 mt-1 max-w-md line-clamp-2">{pkg.description}</div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-lg text-blue-600">
                      {Number(pkg.price).toFixed(2)} AZN
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{pkg.duration} gün</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        pkg.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pkg.isActive ? '✓ Aktif' : '○ Pasif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        title="Düzenle"
                      >
                        <EditIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        title="Sil"
                      >
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {packages.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <PackageIcon />
              </div>
              <p className="text-gray-500 text-lg font-medium">Henüz paket bulunmamaktadır</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 sm:px-6 lg:px-8">
        {packages.map((pkg, index) => (
          <div key={pkg.id} className="card hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        pkg.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {pkg.isActive ? '✓ Aktif' : '○ Pasif'}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{pkg.name}</h3>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{pkg.description}</p>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">Fiyat</div>
                  <div className="font-bold text-lg text-blue-600">
                    {Number(pkg.price).toFixed(2)} AZN
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">Süre</div>
                  <div className="font-semibold text-gray-900">{pkg.duration} gün</div>
                </div>
              </div>

              {/* Features Preview */}
              {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-600 mb-2 font-semibold">Özellikler</div>
                  <ul className="space-y-1">
                    {pkg.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start">
                        <svg className="w-4 h-4 mr-2 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-xs text-gray-500">+{pkg.features.length - 3} daha fazla...</li>
                    )}
                  </ul>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="flex-1 btn btn-secondary text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <EditIcon />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="flex-1 btn bg-red-100 text-red-700 hover:bg-red-200 text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <DeleteIcon />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <PackageIcon />
            </div>
            <p className="text-gray-500 text-lg font-medium">Henüz paket bulunmamaktadır</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => {
          setShowModal(false);
          setEditingPackage(null);
          resetForm();
        }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6 z-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {editingPackage ? 'Paket Düzenle' : 'Yeni Paket Ekle'}
              </h2>
            </div>
            <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Paket Adı *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  placeholder="Örn: Temel Paket"
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Açıklama *</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input"
                  rows={3}
                  placeholder="Paket açıklaması..."
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Özellikler (Her satıra bir özellik) *
                </label>
                <textarea
                  required
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  className="input font-mono text-sm"
                  rows={6}
                  placeholder="Özellik 1&#10;Özellik 2&#10;Özellik 3"
                />
                <p className="text-xs text-gray-500 mt-1">Her satıra bir özellik yazın</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Aylık Fiyat (AZN) *</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="input pr-12"
                      placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">AZN/ay</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Temel aylık fiyat</p>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">Süre (gün) *</label>
                  <input
                    type="number"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    className="input"
                    placeholder="30"
                  />
                </div>
              </div>
              
              {/* Aylık Fiyatlar */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Özel Aylık Fiyatlar (Opsiyonel)
                </h3>
                <p className="text-sm text-gray-600 mb-4">Belirtilmezse aylık fiyat × ay sayısı hesaplanır</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">1 Ay İçin</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price1Month}
                        onChange={(e) =>
                          setFormData({ ...formData, price1Month: e.target.value })
                        }
                        className="input pr-12"
                        placeholder="Otomatik"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">AZN</span>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">6 Ay İçin</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price6Months}
                        onChange={(e) =>
                          setFormData({ ...formData, price6Months: e.target.value })
                        }
                        className="input pr-12"
                        placeholder="Otomatik"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">AZN</span>
                    </div>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-semibold text-gray-700">12 Ay İçin</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price12Months}
                        onChange={(e) =>
                          setFormData({ ...formData, price12Months: e.target.value })
                        }
                        className="input pr-12"
                        placeholder="Otomatik"
                      />
                      <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs">AZN</span>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Sıralama</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({ ...formData, displayOrder: e.target.value })
                  }
                  className="input"
                  placeholder="0"
                />
                <p className="text-xs text-gray-500 mt-1">Düşük sayılar önce gösterilir</p>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="font-semibold text-gray-700 cursor-pointer">
                  Paket aktif olsun
                </label>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPackage(null);
                    resetForm();
                  }}
                  className="btn btn-secondary px-6"
                >
                  İptal
                </button>
                <button type="submit" className="btn btn-primary px-6">
                  {editingPackage ? 'Güncelle' : 'Kaydet'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Paketi Sil</h2>
            <p className="text-gray-600 text-center mb-6">
              <strong className="text-gray-900">{deleteConfirm.name}</strong> paketini silmek istediğinize emin misiniz?
            </p>
            <p className="text-sm text-red-600 text-center mb-6 font-medium">⚠️ Bu işlem geri alınamaz!</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 btn btn-secondary"
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 btn bg-red-600 text-white hover:bg-red-700"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackagesManagement;

