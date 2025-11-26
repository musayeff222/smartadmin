import { useEffect, useState } from 'react';
import { publicService, Package } from '../services/public.service';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

// Package Card Component
const PackageCard = ({ pkg, index, onSelect }: { pkg: Package; index: number; onSelect: (pkg: Package) => void }) => {
  const { elementRef, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 relative overflow-hidden ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {index === 0 && (
        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          Popüler
        </div>
      )}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
        <div className="mb-4">
          <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
            {Number(pkg.price).toFixed(2)}
          </span>
          <span className="text-gray-600 text-lg ml-2">AZN</span>
          <p className="text-sm text-gray-500 mt-1">/ {pkg.duration} gün</p>
        </div>
        <p className="text-gray-600 mb-6">{pkg.description}</p>
      </div>
      <ul className="space-y-3 mb-8">
        {(Array.isArray(pkg.features) ? pkg.features : []).slice(0, 5).map((feature, idx) => (
          <li key={idx} className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
        {(Array.isArray(pkg.features) ? pkg.features : []).length > 5 && (
          <li className="text-sm text-gray-500">
            +{(Array.isArray(pkg.features) ? pkg.features : []).length - 5} daha fazla özellik
          </li>
        )}
      </ul>
      <button 
        onClick={() => onSelect(pkg)}
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
      >
        Paketi Seç
      </button>
    </div>
  );
};

const Packages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [orderMethod, setOrderMethod] = useState<'whatsapp' | 'website' | null>(null);
  const [selectedDurationMonths, setSelectedDurationMonths] = useState<1 | 6 | 12>(1);
  const [orderForm, setOrderForm] = useState({
    name: '',
    restaurantName: '',
    email: '',
    phone: '',
    password: '',
  });

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await publicService.getPackages();
        const packagesWithNumbers = data.map((pkg: any) => ({
          ...pkg,
          price: typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price,
          duration: typeof pkg.duration === 'string' ? parseInt(pkg.duration) : pkg.duration,
          features: Array.isArray(pkg.features) ? pkg.features : (typeof pkg.features === 'string' ? JSON.parse(pkg.features) : []),
        }));
        setPackages(packagesWithNumbers);
      } catch (error) {
        console.error('Fetch packages error:', error);
        toast.error('Paketler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  useEffect(() => {
    const fetchWhatsAppNumber = async () => {
      try {
        const response = await api.get('/public/settings');
        if (response.data.settings?.whatsappNumber) {
          setWhatsappNumber(response.data.settings.whatsappNumber);
        }
      } catch (error) {
        console.error('WhatsApp number fetch error:', error);
      }
    };
    fetchWhatsAppNumber();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <section className="relative py-20 bg-gradient-to-br from-green-600 via-blue-700 to-purple-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            Abonelik Paketleri
          </h1>
          <p className="text-xl sm:text-2xl text-green-100 max-w-3xl mx-auto">
            İhtiyacınıza uygun paketi seçin. Tüm paketlerimiz 7 gün ücretsiz deneme süresi ile gelir.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {packages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-gray-600 text-xl font-medium">
              Şu anda aktif paket bulunmamaktadır.
            </p>
          </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <PackageCard 
                  key={pkg.id}
                  pkg={pkg} 
                  index={index} 
                  onSelect={setSelectedPackage}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Order Method Selection Modal */}
      {selectedPackage && !orderMethod && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex sm:items-center sm:justify-center px-2.5 sm:px-8 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPackage(null);
              setOrderMethod(null);
              setSelectedDurationMonths(1);
            }
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          <div className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl mt-auto sm:mt-0 animate-slide-up my-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3 text-center sm:text-left">Sipariş Yöntemi Seçin</h2>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-6">
                <p className="font-semibold text-lg mb-1">{selectedPackage.name}</p>
                <p className="text-blue-600 font-bold text-2xl">
                  Aylık: {Number(selectedPackage.price).toFixed(2)} AZN
                </p>
              </div>
              
              {/* Aylık Seçim */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Abonelik Süresi Seçin</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {(() => {
                    const monthlyPrice = typeof selectedPackage.price === 'string' 
                      ? parseFloat(selectedPackage.price) 
                      : selectedPackage.price;
                    
                    const price1Month = selectedPackage.price1Month 
                      ? (typeof selectedPackage.price1Month === 'string' 
                          ? parseFloat(selectedPackage.price1Month) 
                          : selectedPackage.price1Month)
                      : monthlyPrice * 1;
                    
                    const price6Months = selectedPackage.price6Months 
                      ? (typeof selectedPackage.price6Months === 'string' 
                          ? parseFloat(selectedPackage.price6Months) 
                          : selectedPackage.price6Months)
                      : monthlyPrice * 6;
                    
                    const price12Months = selectedPackage.price12Months 
                      ? (typeof selectedPackage.price12Months === 'string' 
                          ? parseFloat(selectedPackage.price12Months) 
                          : selectedPackage.price12Months)
                      : monthlyPrice * 12;
                    
                    return (
                      <>
                        <button
                          onClick={() => setSelectedDurationMonths(1)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            selectedDurationMonths === 1
                              ? 'border-blue-600 bg-blue-50 shadow-lg scale-105'
                              : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                          }`}
                        >
                          <div className="text-sm font-medium text-gray-600 mb-2">1 Ay</div>
                          <div className={`text-2xl font-bold mb-1 ${
                            selectedDurationMonths === 1 ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {price1Month.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedDurationMonths(6)}
                          className={`p-4 rounded-xl border-2 transition-all relative ${
                            selectedDurationMonths === 6
                              ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105'
                              : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                          }`}
                        >
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Popüler
                          </div>
                          <div className="text-sm font-medium text-gray-600 mb-2">6 Ay</div>
                          <div className={`text-2xl font-bold mb-1 ${
                            selectedDurationMonths === 6 ? 'text-indigo-600' : 'text-gray-900'
                          }`}>
                            {price6Months.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </button>
                        
                        <button
                          onClick={() => setSelectedDurationMonths(12)}
                          className={`p-4 rounded-xl border-2 transition-all relative ${
                            selectedDurationMonths === 12
                              ? 'border-purple-600 bg-purple-50 shadow-lg scale-105'
                              : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50'
                          }`}
                        >
                          <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            En İyi
                          </div>
                          <div className="text-sm font-medium text-gray-600 mb-2">12 Ay</div>
                          <div className={`text-2xl font-bold mb-1 ${
                            selectedDurationMonths === 12 ? 'text-purple-600' : 'text-gray-900'
                          }`}>
                            {price12Months.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => setOrderMethod('whatsapp')}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center space-x-3 text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>WhatsApp ile Sipariş Ver</span>
              </button>
              <button
                onClick={() => setOrderMethod('website')}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-4 flex items-center justify-center space-x-3 text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Web Sitesi Üzerinden Sipariş Ver</span>
              </button>
              <button
                onClick={() => {
                  setSelectedPackage(null);
                  setOrderMethod(null);
                  setSelectedDurationMonths(1);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl px-6 py-3 transition-all"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Order */}
      {selectedPackage && orderMethod === 'whatsapp' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex sm:items-center sm:justify-center px-2.5 sm:px-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPackage(null);
              setOrderMethod(null);
              setSelectedDurationMonths(1);
              setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
            }
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          <div className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl mt-auto sm:mt-0 animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">WhatsApp ile Sipariş</h2>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                <p className="font-semibold text-lg mb-2">Seçilen Paket: {selectedPackage.name}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Abonelik Süresi: {selectedDurationMonths} ay</p>
                    <p className="text-green-600 font-bold text-2xl">
                      {(() => {
                        const monthlyPrice = typeof selectedPackage.price === 'string' 
                          ? parseFloat(selectedPackage.price) 
                          : selectedPackage.price;
                        
                        let totalPrice = 0;
                        if (selectedDurationMonths === 1) {
                          totalPrice = selectedPackage.price1Month 
                            ? (typeof selectedPackage.price1Month === 'string' 
                                ? parseFloat(selectedPackage.price1Month) 
                                : selectedPackage.price1Month)
                            : monthlyPrice * 1;
                        } else if (selectedDurationMonths === 6) {
                          totalPrice = selectedPackage.price6Months 
                            ? (typeof selectedPackage.price6Months === 'string' 
                                ? parseFloat(selectedPackage.price6Months) 
                                : selectedPackage.price6Months)
                            : monthlyPrice * 6;
                        } else {
                          totalPrice = selectedPackage.price12Months 
                            ? (typeof selectedPackage.price12Months === 'string' 
                                ? parseFloat(selectedPackage.price12Months) 
                                : selectedPackage.price12Months)
                            : monthlyPrice * 12;
                        }
                        return `${totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN`;
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Aylık</p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {Number(selectedPackage.price).toFixed(2)} AZN
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form
              id="whatsapp-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!orderForm.name.trim() || !orderForm.restaurantName.trim() || !orderForm.email.trim() || !orderForm.phone.trim() || !orderForm.password.trim()) {
                  toast.error('Lütfen tüm alanları doldurun');
                  return;
                }
                if (!whatsappNumber) {
                  toast.error('WhatsApp numarası bulunamadı. Lütfen admin panelinden ayarları kontrol edin.');
                  return;
                }
                // Fiyat hesaplama
                const monthlyPrice = typeof selectedPackage.price === 'string' 
                  ? parseFloat(selectedPackage.price) 
                  : selectedPackage.price;
                
                let totalPrice = 0;
                if (selectedDurationMonths === 1) {
                  totalPrice = selectedPackage.price1Month 
                    ? (typeof selectedPackage.price1Month === 'string' 
                        ? parseFloat(selectedPackage.price1Month) 
                        : selectedPackage.price1Month)
                    : monthlyPrice * 1;
                } else if (selectedDurationMonths === 6) {
                  totalPrice = selectedPackage.price6Months 
                    ? (typeof selectedPackage.price6Months === 'string' 
                        ? parseFloat(selectedPackage.price6Months) 
                        : selectedPackage.price6Months)
                    : monthlyPrice * 6;
                } else {
                  totalPrice = selectedPackage.price12Months 
                    ? (typeof selectedPackage.price12Months === 'string' 
                        ? parseFloat(selectedPackage.price12Months) 
                        : selectedPackage.price12Months)
                    : monthlyPrice * 12;
                }
                
                const message = `Salam! ${selectedPackage.name} paketini sipariş etmek istiyorum.

📦 Paket Bilgileri:
- Paket Adı: ${selectedPackage.name}
- Abonelik Süresi: ${selectedDurationMonths} ay
- Toplam Fiyat: ${totalPrice.toFixed(2)} AZN
- Aylık Fiyat: ${monthlyPrice.toFixed(2)} AZN

👤 Müşteri Bilgileri:
- Adı Soyadı: ${orderForm.name}
- Restoran Adı: ${orderForm.restaurantName}
- E-mail: ${orderForm.email}
- Telefon: ${orderForm.phone}
- Şifre: ${orderForm.password}`;
                const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
                const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                toast.success('WhatsApp açılıyor...');
                setSelectedPackage(null);
                setOrderMethod(null);
                setSelectedDurationMonths(1);
                setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
              }}
              className="space-y-5 overflow-y-auto flex-1 min-h-0 pr-2"
            >
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Adı Soyadı *</label>
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Restoran Adı *</label>
                <input
                  type="text"
                  value={orderForm.restaurantName}
                  onChange={(e) => setOrderForm({ ...orderForm, restaurantName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">E-mail *</label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Telefon Numarası *</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  placeholder="+994501234567"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Giriş Yapabilmek İçin Şifre *</label>
                <input
                  type="password"
                  value={orderForm.password}
                  onChange={(e) => setOrderForm({ ...orderForm, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 6 karakter</p>
              </div>
            </form>
            <div className="flex-shrink-0 flex gap-4 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage(null);
                  setOrderMethod(null);
                  setSelectedDurationMonths(1);
                  setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 transition-all"
              >
                İptal
              </button>
              <button
                type="submit"
                form="whatsapp-form"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              >
                WhatsApp'ta Aç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Website Order Form */}
      {selectedPackage && orderMethod === 'website' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex sm:items-center sm:justify-center px-2.5 sm:px-8"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPackage(null);
              setOrderMethod(null);
              setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
            }
          }}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) {
              e.preventDefault();
            }
          }}
        >
          <div className="bg-white rounded-3xl sm:rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl mt-auto sm:mt-0 animate-slide-up max-h-[90vh] flex flex-col">
            <div className="flex-shrink-0 mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold mb-4">Sipariş Formu</h2>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <p className="font-semibold text-lg mb-2">Seçilen Paket: {selectedPackage.name}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Abonelik Süresi: {selectedDurationMonths} ay</p>
                    <p className="text-blue-600 font-bold text-2xl">
                      {(() => {
                        const monthlyPrice = typeof selectedPackage.price === 'string' 
                          ? parseFloat(selectedPackage.price) 
                          : selectedPackage.price;
                        
                        let totalPrice = 0;
                        if (selectedDurationMonths === 1) {
                          totalPrice = selectedPackage.price1Month 
                            ? (typeof selectedPackage.price1Month === 'string' 
                                ? parseFloat(selectedPackage.price1Month) 
                                : selectedPackage.price1Month)
                            : monthlyPrice * 1;
                        } else if (selectedDurationMonths === 6) {
                          totalPrice = selectedPackage.price6Months 
                            ? (typeof selectedPackage.price6Months === 'string' 
                                ? parseFloat(selectedPackage.price6Months) 
                                : selectedPackage.price6Months)
                            : monthlyPrice * 6;
                        } else {
                          totalPrice = selectedPackage.price12Months 
                            ? (typeof selectedPackage.price12Months === 'string' 
                                ? parseFloat(selectedPackage.price12Months) 
                                : selectedPackage.price12Months)
                            : monthlyPrice * 12;
                        }
                        return `${totalPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN`;
                      })()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Aylık</p>
                    <p className="text-sm text-gray-700 font-semibold">
                      {Number(selectedPackage.price).toFixed(2)} AZN
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <form
              id="website-form"
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  // Fiyat hesaplama
                  const monthlyPrice = typeof selectedPackage.price === 'string' 
                    ? parseFloat(selectedPackage.price) 
                    : selectedPackage.price;
                  
                  let totalPrice = 0;
                  if (selectedDurationMonths === 1) {
                    totalPrice = selectedPackage.price1Month 
                      ? (typeof selectedPackage.price1Month === 'string' 
                          ? parseFloat(selectedPackage.price1Month) 
                          : selectedPackage.price1Month)
                      : monthlyPrice * 1;
                  } else if (selectedDurationMonths === 6) {
                    totalPrice = selectedPackage.price6Months 
                      ? (typeof selectedPackage.price6Months === 'string' 
                          ? parseFloat(selectedPackage.price6Months) 
                          : selectedPackage.price6Months)
                      : monthlyPrice * 6;
                  } else {
                    totalPrice = selectedPackage.price12Months 
                      ? (typeof selectedPackage.price12Months === 'string' 
                          ? parseFloat(selectedPackage.price12Months) 
                          : selectedPackage.price12Months)
                      : monthlyPrice * 12;
                  }
                  
                  await api.post('/public/order', {
                    packageId: selectedPackage.id,
                    packageName: selectedPackage.name,
                    packagePrice: monthlyPrice,
                    durationMonths: selectedDurationMonths,
                    totalAmount: totalPrice,
                    ...orderForm,
                  });
                  toast.success('Siparişiniz başarıyla gönderildi! En kısa sürede sizinle iletişime geçeceğiz.');
                  setSelectedPackage(null);
                  setOrderMethod(null);
                  setSelectedDurationMonths(1);
                  setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
                } catch (error: any) {
                  toast.error(error.response?.data?.message || 'Sipariş gönderilemedi');
                }
              }}
              className="space-y-5 overflow-y-auto flex-1 min-h-0 pr-2"
            >
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Adı Soyadı *</label>
                <input
                  type="text"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Restoran Adı *</label>
                <input
                  type="text"
                  value={orderForm.restaurantName}
                  onChange={(e) => setOrderForm({ ...orderForm, restaurantName: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">E-mail *</label>
                <input
                  type="email"
                  value={orderForm.email}
                  onChange={(e) => setOrderForm({ ...orderForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Telefon Numarası *</label>
                <input
                  type="tel"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="+994501234567"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 font-semibold text-gray-700">Giriş Yapabilmek İçin Şifre *</label>
                <input
                  type="password"
                  value={orderForm.password}
                  onChange={(e) => setOrderForm({ ...orderForm, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                  minLength={6}
                />
                <p className="text-sm text-gray-500 mt-1">Minimum 6 karakter</p>
              </div>
            </form>
            <div className="flex-shrink-0 flex gap-4 pt-6 border-t border-gray-200 mt-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedPackage(null);
                  setOrderMethod(null);
                  setSelectedDurationMonths(1);
                  setOrderForm({ name: '', restaurantName: '', email: '', phone: '', password: '' });
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl px-6 py-3 transition-all"
              >
                İptal
              </button>
              <button
                type="submit"
                form="website-form"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl px-6 py-3 shadow-lg hover:shadow-xl transition-all"
              >
                Siparişi Gönder
              </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Packages;
