import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Package {
  id: string;
  name: string;
  price: number;
  duration: number;
}

interface PaymentLog {
  id: string;
  amount: number;
  month: number;
  year: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  paymentDate: string | null;
  notes: string | null;
}

interface Subscription {
  id: string;
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  customerLogin: string | null;
  customerPassword: string | null;
  user: { firstName: string; lastName: string; email: string } | null;
  package: Package;
  restaurantName: string | null;
  restaurantAddress: string | null;
  status: 'active' | 'expired' | 'cancelled';
  paymentStatus: 'pending' | 'paid';
  paymentType: 'one_time' | 'monthly';
  durationMonths: number;
  startDate: string;
  endDate: string;
  amount: number;
  notes: string | null;
  paymentLogs?: PaymentLog[];
  createdAt: string;
}

const SubscriptionsManagement = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    // Müşteri bilgileri
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    // Giriş bilgileri (sadece kayıt/not amaçlı)
    customerLogin: '',
    customerPassword: '',
    // Paket ve süre
    packageId: '',
    durationMonths: '1',
    // Restoran bilgileri
    restaurantName: '',
    restaurantAddress: '',
    // Tarihler
    startDate: '',
    // Ödeme bilgileri
    paymentType: 'one_time' as 'one_time' | 'monthly',
    amount: '',
    notes: '',
    paymentStatus: 'pending' as 'pending' | 'paid',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [subsRes, packagesRes] = await Promise.all([
        api.get('/admin/subscriptions'),
        api.get('/public/packages'),
      ]);
      setSubscriptions(subsRes.data.subscriptions || []);
      
      // Paket fiyatlarını number'a çevir
      const packagesWithNumbers = (packagesRes.data.packages || []).map((pkg: any) => ({
        ...pkg,
        price: typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price,
        duration: typeof pkg.duration === 'string' ? parseInt(pkg.duration) : pkg.duration,
      }));
      setPackages(packagesWithNumbers);
    } catch (error: any) {
      console.error('Fetch error:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = () => {
    if (!formData.packageId || !formData.durationMonths) return 0;
    const selectedPackage = packages.find((pkg) => pkg.id === formData.packageId);
    if (!selectedPackage) return 0;
    const price = typeof selectedPackage.price === 'string' ? parseFloat(selectedPackage.price) : selectedPackage.price;
    return price * parseInt(formData.durationMonths);
  };

  const handlePackageChange = (packageId: string) => {
    setFormData((prev) => ({
      ...prev,
      packageId,
      amount: calculateTotalAmount().toString(),
    }));
    updateEndDate();
  };

  const handleDurationChange = (durationMonths: string) => {
    setFormData((prev) => ({
      ...prev,
      durationMonths,
      amount: calculateTotalAmount().toString(),
    }));
    updateEndDate();
  };

  const updateEndDate = () => {
    if (formData.startDate && formData.durationMonths) {
      const start = new Date(formData.startDate);
      const end = new Date(start);
      end.setMonth(end.getMonth() + parseInt(formData.durationMonths));
      // Bu sadece gösterim için, backend'de hesaplanacak
    }
  };

  const handleStartDateChange = (startDate: string) => {
    setFormData((prev) => ({ ...prev, startDate }));
    updateEndDate();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // CustomerId validasyonu (5 rakamlı, sadece sayılar)
      if (formData.customerId && !/^\d{5}$/.test(formData.customerId)) {
        toast.error('Müşteri ID 5 rakamlı olmalıdır (sadece sayılar)');
        return;
      }

      const totalAmount = calculateTotalAmount();
      if (totalAmount === 0) {
        toast.error('Lütfen paket ve süre seçin');
        return;
      }

      const submitData = {
        ...formData,
        amount: totalAmount.toString(),
        // Müşteri ID'sini boş string ise null yap
        customerId: formData.customerId && formData.customerId.trim() ? formData.customerId.trim() : null,
      };

      if (editingSubscription) {
        await api.put(`/admin/subscriptions/${editingSubscription.id}`, submitData);
        toast.success('Abonelik güncellendi');
      } else {
        await api.post('/admin/subscriptions', submitData);
        toast.success('Abonelik oluşturuldu');
      }
      setShowModal(false);
      setEditingSubscription(null);
      resetForm();
      fetchData();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'İşlem başarısız');
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setFormData({
      customerId: subscription.customerId || '',
      customerName: subscription.customerName || '',
      customerEmail: subscription.customerEmail || '',
      customerPhone: subscription.customerPhone || '',
      customerLogin: subscription.customerLogin || '',
      customerPassword: subscription.customerPassword || '',
      packageId: subscription.package.id,
      durationMonths: subscription.durationMonths.toString(),
      restaurantName: subscription.restaurantName || '',
      restaurantAddress: subscription.restaurantAddress || '',
      startDate: subscription.startDate.split('T')[0],
      paymentType: subscription.paymentType,
      amount: subscription.amount.toString(),
      notes: subscription.notes || '',
      paymentStatus: subscription.paymentStatus,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (deleting) return; // Çift tıklamayı önle
    
    try {
      setDeleting(true);
      await api.delete(`/admin/subscriptions/${id}`);
      toast.success('Abonelik silindi');
      setDeleteConfirm(null);
      await fetchData();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Silme işlemi başarısız');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadPDF = async (id: string) => {
    try {
      const response = await api.get(`/admin/subscriptions/${id}/invoice`, {
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

  const handleDownloadPaymentPDF = async (subscriptionId: string, paymentId: string) => {
    try {
      const response = await api.get(`/admin/subscriptions/${subscriptionId}/payments/${paymentId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `odeme-faturasi-${paymentId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Ödeme faturası indirildi');
    } catch (error: any) {
      console.error('Payment PDF download error:', error);
      toast.error('Ödeme faturası indirilemedi');
    }
  };

  const handlePaymentStatusUpdate = async (subscriptionId: string, paymentId: string, status: 'paid' | 'pending') => {
    try {
      await api.put(`/admin/subscriptions/${subscriptionId}/payments/${paymentId}`, {
        status,
        paymentDate: status === 'paid' ? new Date().toISOString() : null,
      });
      toast.success('Ödeme durumu güncellendi');
      fetchData();
    } catch (error: any) {
      console.error('Payment update error:', error);
      toast.error('Ödeme durumu güncellenemedi');
    }
  };

  const resetForm = () => {
    setFormData({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerLogin: '',
      customerPassword: '',
      packageId: '',
      durationMonths: '1',
      restaurantName: '',
      restaurantAddress: '',
      startDate: '',
      paymentType: 'one_time',
      amount: '',
      notes: '',
      paymentStatus: 'pending',
    });
  };

  const getCustomerDisplayName = (sub: Subscription) => {
    if (sub.customerName) {
      return sub.customerName;
    }
    if (sub.user) {
      return `${sub.user.firstName} ${sub.user.lastName}`;
    }
    return 'Bilinmeyen';
  };

  const getCustomerEmail = (sub: Subscription) => {
    return sub.customerEmail || sub.user?.email || '-';
  };

  // Son ödeme tarihini bul
  const getLastPaymentDate = (sub: Subscription): Date | null => {
    if (!sub.paymentLogs || sub.paymentLogs.length === 0) return null;
    const paidPayments = sub.paymentLogs
      .filter((p: PaymentLog) => p.status === 'paid' && p.paymentDate)
      .sort((a: PaymentLog, b: PaymentLog) => {
        const dateA = new Date(a.paymentDate!).getTime();
        const dateB = new Date(b.paymentDate!).getTime();
        return dateB - dateA; // En yeni önce
      });
    return paidPayments.length > 0 ? new Date(paidPayments[0].paymentDate!) : null;
  };

  // Sonraki ödeme tarihini bul
  const getNextPaymentDate = (sub: Subscription): Date | null => {
    if (sub.paymentType !== 'monthly') return null;
    
    if (!sub.paymentLogs || sub.paymentLogs.length === 0) {
      // Eğer paymentLogs yoksa, başlangıç tarihinden itibaren hesapla
      const startDate = new Date(sub.startDate);
      const now = new Date();
      // Bu ayın ödeme tarihini bul (başlangıç tarihinin günü)
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const paymentDate = new Date(currentYear, currentMonth, startDate.getDate());
      
      // Eğer bu ayın ödeme tarihi geçmişse, gelecek ay
      if (paymentDate < now) {
        paymentDate.setMonth(paymentDate.getMonth() + 1);
      }
      return paymentDate;
    }
    
    const pendingPayments = sub.paymentLogs
      .filter((p: PaymentLog) => p.status === 'pending')
      .sort((a: PaymentLog, b: PaymentLog) => {
        // Ay ve yıla göre sırala
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      });
    
    if (pendingPayments.length > 0) {
      const nextPayment = pendingPayments[0];
      const startDate = new Date(sub.startDate);
      // month ve year gerçek ay ve yıl değerleri (1-12 ve yıl)
      // Başlangıç tarihinin gününü kullanarak ödeme tarihini oluştur
      const paymentDate = new Date(nextPayment.year, nextPayment.month - 1, startDate.getDate());
      return paymentDate;
    }
    
    return null;
  };

  // Bu ay ödeme yapıldı mı?
  const isCurrentMonthPaid = (sub: Subscription): boolean => {
    if (!sub.paymentLogs || sub.paymentLogs.length === 0) return false;
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();
    
    return sub.paymentLogs.some((p: PaymentLog) => 
      p.month === currentMonth && 
      p.year === currentYear && 
      p.status === 'paid'
    );
  };

  // Gelecek ay ödeme yapılacak mı?
  const hasNextMonthPayment = (sub: Subscription): boolean => {
    if (sub.paymentType !== 'monthly') return false;
    if (!sub.paymentLogs || sub.paymentLogs.length === 0) return true; // Eğer paymentLogs yoksa, gelecek ay ödeme var
    
    const now = new Date();
    let nextMonth = now.getMonth() + 2; // +1 bu ay, +1 gelecek ay
    let nextYear = now.getFullYear();
    if (nextMonth > 12) {
      nextMonth = 1;
      nextYear += 1;
    }
    
    // Gelecek ay için pending ödeme var mı?
    return sub.paymentLogs.some((p: PaymentLog) => 
      p.month === nextMonth && 
      p.year === nextYear && 
      p.status === 'pending'
    );
  };

  const getMonthName = (month: number) => {
    const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return months[month - 1] || month.toString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Filtrelenmiş abonelikler
  const filteredSubscriptions = subscriptions.filter((sub) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const customerName = getCustomerDisplayName(sub).toLowerCase();
    const customerEmail = getCustomerEmail(sub).toLowerCase();
    const customerPhone = (sub.customerPhone || '').toLowerCase();
    const customerId = (sub.customerId || '').toLowerCase();
    const restaurantName = (sub.restaurantName || '').toLowerCase();
    const restaurantAddress = (sub.restaurantAddress || '').toLowerCase();
    const packageName = sub.package.name.toLowerCase();
    const subscriptionId = sub.id.toLowerCase();
    
    return (
      customerName.includes(query) ||
      customerEmail.includes(query) ||
      customerPhone.includes(query) ||
      customerId.includes(query) ||
      restaurantName.includes(query) ||
      restaurantAddress.includes(query) ||
      packageName.includes(query) ||
      subscriptionId.includes(query)
    );
  });

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

  const PaymentIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  const PDFIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const PlusIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Abonelik Yönetimi</h1>
            <p className="text-gray-600 text-sm sm:text-base">Restoran aboneliklerini yönetin ve fatura oluşturun</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={async () => {
                try {
                  const response = await api.post('/admin/subscriptions/create-demo');
                  toast.success(response.data.message || '10 demo abonelik başarıyla oluşturuldu');
                  await fetchData();
                } catch (error: any) {
                  toast.error(error.response?.data?.message || 'Demo abonelikler oluşturulamadı');
                }
              }}
              className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-3 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>10 Demo Abonelik Oluştur</span>
            </button>
            <button
              onClick={() => {
                resetForm();
                setEditingSubscription(null);
                setShowModal(true);
              }}
              className="btn btn-primary px-6 py-3 text-sm sm:text-base whitespace-nowrap flex items-center space-x-2"
            >
              <PlusIcon />
              <span>Yeni Abonelik Ekle</span>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri ara (ID, ad, email, telefon, restoran adı, restoran adresi...)"
            className="input pl-12 pr-10 w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Müşteri ID</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Müşteri</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Restoran</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Paket</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Süre</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Başlangıç</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Bitiş</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Tutar</th>
                <th className="text-left p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">Durum</th>
                <th className="text-right p-4 text-xs font-bold text-gray-700 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
          <tbody>
            {filteredSubscriptions.map((sub) => {
              const lastPaymentDate = getLastPaymentDate(sub);
              const nextPaymentDate = getNextPaymentDate(sub);
              const currentMonthPaid = isCurrentMonthPaid(sub);
              const nextMonthPayment = hasNextMonthPayment(sub);
              const isExpanded = expandedRows.has(sub.id);
              
              return (
              <>
              <tr 
                key={sub.id} 
                className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                onClick={() => setSelectedSubscription(sub)}
              >
                <td className="p-4">
                  {sub.customerId ? (
                    <div className="font-mono text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md inline-block border border-blue-200">
                      {sub.customerId}
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{getCustomerDisplayName(sub)}</div>
                  <div className="text-sm text-gray-600 mt-0.5">{getCustomerEmail(sub)}</div>
                  {sub.customerPhone && (
                    <div className="text-xs text-gray-500 mt-0.5">{sub.customerPhone}</div>
                  )}
                </td>
                <td className="p-4">
                  {sub.restaurantName ? (
                    <>
                      <div className="font-medium text-gray-900">{sub.restaurantName}</div>
                      {sub.restaurantAddress && (
                        <div className="text-sm text-gray-600 mt-0.5">{sub.restaurantAddress}</div>
                      )}
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="font-semibold text-gray-900">{sub.package.name}</div>
                  <div className="text-sm text-gray-600 mt-0.5">
                    {(() => {
                      const price = typeof sub.package.price === 'string' ? parseFloat(sub.package.price) : sub.package.price;
                      return Number(price).toFixed(2);
                    })()} AZN/ay
                  </div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">{sub.durationMonths} ay</div>
                  <div className="text-xs text-gray-500 mt-0.5">{sub.paymentType === 'monthly' ? 'Aylık' : 'Tek'}</div>
                </td>
                <td className="p-4 text-sm text-gray-700">{new Date(sub.startDate).toLocaleDateString('tr-TR')}</td>
                <td className="p-4 text-sm text-gray-700">{new Date(sub.endDate).toLocaleDateString('tr-TR')}</td>
                <td className="p-4">
                  <div className="font-bold text-gray-900">{Number(sub.amount).toFixed(2)} AZN</div>
                </td>
                <td className="p-4">
                  <div className="space-y-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        sub.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {sub.paymentStatus === 'paid' ? '✓ Ödendi' : '⏳ Bekliyor'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newExpanded = new Set(expandedRows);
                        if (isExpanded) {
                          newExpanded.delete(sub.id);
                        } else {
                          newExpanded.add(sub.id);
                        }
                        setExpandedRows(newExpanded);
                      }}
                      className="flex items-center text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                          Gizle
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                          Detaylar
                        </>
                      )}
                    </button>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleEdit(sub)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                      title="Düzenle"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => setSelectedSubscription(sub)}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600"
                      title="Ödeme Detayları"
                    >
                      <PaymentIcon />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(sub.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                      title="PDF İndir"
                    >
                      <PDFIcon />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(sub.id)}
                      className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                      title="Sil"
                    >
                      <DeleteIcon />
                    </button>
                  </div>
                </td>
              </tr>
              {isExpanded && (
                <tr key={`${sub.id}-details`} className="border-b bg-gradient-to-r from-blue-50/50 to-gray-50">
                  <td colSpan={10} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Müşteri Bilgileri */}
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Müşteri Bilgileri
                        </h4>
                        <div className="space-y-2">
                          {sub.customerId && (
                            <div className="flex items-center justify-between text-sm bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
                              <span className="text-gray-600">Müşteri ID:</span>
                              <span className="font-mono font-bold text-indigo-700">{sub.customerId}</span>
                            </div>
                          )}
                          {sub.customerName && (
                            <div className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Ad:</span>
                              <span className="font-semibold text-gray-900">{sub.customerName}</span>
                            </div>
                          )}
                          {sub.customerEmail && (
                            <div className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Email:</span>
                              <span className="font-semibold text-gray-900">{sub.customerEmail}</span>
                            </div>
                          )}
                          {sub.customerPhone && (
                            <div className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Telefon:</span>
                              <span className="font-semibold text-gray-900">{sub.customerPhone}</span>
                            </div>
                          )}
                          {sub.restaurantName && (
                            <div className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Restoran:</span>
                              <span className="font-semibold text-gray-900">{sub.restaurantName}</span>
                            </div>
                          )}
                          {sub.restaurantAddress && (
                            <div className="flex items-start justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Adres:</span>
                              <span className="font-semibold text-gray-900 text-right">{sub.restaurantAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Ödeme Durumu Detayları
                        </h4>
                        {sub.paymentType === 'monthly' && (
                          <div className="space-y-2">
                            {currentMonthPaid ? (
                              <div className="flex items-center text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Bu ay ödendi
                              </div>
                            ) : (
                              <div className="flex items-center text-sm text-red-700 bg-red-50 px-3 py-2 rounded-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Bu ay ödenmedi
                              </div>
                            )}
                            {nextMonthPayment && (
                              <div className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-2 rounded-lg">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                                Gelecek ay ödeme var
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Ödeme Tarihleri
                        </h4>
                        <div className="space-y-2">
                          {lastPaymentDate && (
                            <div className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Son ödeme:</span>
                              <span className="font-semibold text-gray-900">{lastPaymentDate.toLocaleDateString('tr-TR')}</span>
                            </div>
                          )}
                          {nextPaymentDate && (
                            <div className="flex items-center justify-between text-sm bg-blue-50 px-3 py-2 rounded-lg">
                              <span className="text-gray-600">Sonraki ödeme:</span>
                              <span className="font-semibold text-blue-700">{nextPaymentDate.toLocaleDateString('tr-TR')}</span>
                            </div>
                          )}
                          {!lastPaymentDate && !nextPaymentDate && sub.paymentType === 'one_time' && (
                            <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">Tek ödeme</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </>
            );
            })}
          </tbody>
        </table>
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-gray-500 text-lg font-medium">
              {searchQuery ? 'Arama sonucu bulunamadı' : 'Henüz abonelik bulunmamaktadır'}
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4 px-4 sm:px-6 lg:px-8">
        {filteredSubscriptions.map((sub) => {
          const lastPaymentDate = getLastPaymentDate(sub);
          const nextPaymentDate = getNextPaymentDate(sub);
          const currentMonthPaid = isCurrentMonthPaid(sub);
          const nextMonthPayment = hasNextMonthPayment(sub);
          const isExpanded = expandedRows.has(sub.id);
          
          return (
          <div 
            key={sub.id} 
            className="card hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedSubscription(sub)}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {sub.customerId && (
                    <div className="text-sm font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md inline-block mb-2 border border-blue-200">
                      Müşteri ID: {sub.customerId}
                    </div>
                  )}
                  <div className="font-bold text-lg text-gray-900">{getCustomerDisplayName(sub)}</div>
                  <div className="text-sm text-gray-600 mt-1">{getCustomerEmail(sub)}</div>
                  {sub.customerPhone && (
                    <div className="text-xs text-gray-500 mt-1">{sub.customerPhone}</div>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    sub.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {sub.paymentStatus === 'paid' ? '✓ Ödendi' : '⏳ Bekliyor'}
                </span>
              </div>

              {/* Restoran Bilgisi */}
              {sub.restaurantName && (
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="font-semibold text-gray-900">{sub.restaurantName}</div>
                  {sub.restaurantAddress && (
                    <div className="text-sm text-gray-600 mt-1">{sub.restaurantAddress}</div>
                  )}
                </div>
              )}

              {/* Paket ve Tarih Bilgileri */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="text-xs text-gray-600 mb-1">Paket</div>
                  <div className="font-semibold text-gray-900">{sub.package.name}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    {(() => {
                      const price = typeof sub.package.price === 'string' ? parseFloat(sub.package.price) : sub.package.price;
                      return Number(price).toFixed(2);
                    })()} AZN/ay
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                  <div className="text-xs text-gray-600 mb-1">Süre</div>
                  <div className="font-semibold text-gray-900">{sub.durationMonths} ay</div>
                  <div className="text-xs text-gray-600 mt-1">{sub.paymentType === 'monthly' ? 'Aylık' : 'Tek'}</div>
                </div>
              </div>

              {/* Tarih Aralığı */}
              <div className="flex items-center justify-between text-sm bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div>
                  <div className="text-xs text-gray-600">Başlangıç</div>
                  <div className="font-medium text-gray-900">{new Date(sub.startDate).toLocaleDateString('tr-TR')}</div>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <div>
                  <div className="text-xs text-gray-600">Bitiş</div>
                  <div className="font-medium text-gray-900">{new Date(sub.endDate).toLocaleDateString('tr-TR')}</div>
                </div>
              </div>

              {/* Tutar */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                <div className="text-xs text-gray-600 mb-1">Toplam Tutar</div>
                <div className="font-bold text-2xl text-green-700">{Number(sub.amount).toFixed(2)} AZN</div>
              </div>
              
              {/* Detayları Göster/Gizle Butonu */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const newExpanded = new Set(expandedRows);
                  if (isExpanded) {
                    newExpanded.delete(sub.id);
                  } else {
                    newExpanded.add(sub.id);
                  }
                  setExpandedRows(newExpanded);
                }}
                className="w-full flex items-center justify-center text-sm text-blue-600 hover:text-blue-800 font-semibold py-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {isExpanded ? (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Detayları Gizle
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Detayları Göster
                  </>
                )}
              </button>
              
              {/* Ödeme Durumu Detayları */}
              {isExpanded && (
                <div className="space-y-3 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  {sub.paymentType === 'monthly' && (
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Ödeme Durumu
                      </h4>
                      <div className="space-y-2">
                        {currentMonthPaid ? (
                          <div className="flex items-center text-sm text-green-700 bg-green-100 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Bu ay ödendi
                          </div>
                        ) : (
                          <div className="flex items-center text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Bu ay ödenmedi
                          </div>
                        )}
                        {nextMonthPayment && (
                          <div className="flex items-center text-sm text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Gelecek ay ödeme var
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Ödeme Tarihleri
                    </h4>
                    <div className="space-y-2">
                      {lastPaymentDate && (
                        <div className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-lg border border-gray-200">
                          <span className="text-gray-600">Son ödeme:</span>
                          <span className="font-semibold text-gray-900">{lastPaymentDate.toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      {nextPaymentDate && (
                        <div className="flex items-center justify-between text-sm bg-white px-3 py-2 rounded-lg border border-blue-200">
                          <span className="text-gray-600">Sonraki ödeme:</span>
                          <span className="font-semibold text-blue-700">{nextPaymentDate.toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      {!lastPaymentDate && !nextPaymentDate && sub.paymentType === 'one_time' && (
                        <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">Tek ödeme</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleEdit(sub)}
                  className="btn btn-secondary text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <EditIcon />
                  <span>Düzenle</span>
                </button>
                <button
                  onClick={() => setSelectedSubscription(sub)}
                  className="btn bg-green-100 text-green-700 hover:bg-green-200 text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <PaymentIcon />
                  <span>Ödemeler</span>
                </button>
                <button
                  onClick={() => handleDownloadPDF(sub.id)}
                  className="btn bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <PDFIcon />
                  <span>PDF</span>
                </button>
                <button
                  onClick={() => setDeleteConfirm(sub.id)}
                  className="btn bg-red-100 text-red-700 hover:bg-red-200 text-sm py-2.5 flex items-center justify-center space-x-1"
                >
                  <DeleteIcon />
                  <span>Sil</span>
                </button>
              </div>
            </div>
          </div>
          );
        })}
        {filteredSubscriptions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery ? 'Arama sonucu bulunamadı.' : 'Henüz abonelik bulunmamaktadır.'}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6">
              <h2 className="text-2xl font-bold">{editingSubscription ? 'Abonelik Düzenle' : 'Yeni Abonelik Ekle'}</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Müşteri Bilgileri */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Müşteri Bilgileri</h3>
                <p className="text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded">
                  ℹ️ Bu bilgiler yalnızca kayıt ve not amaçlıdır. Giriş yapmak için kullanılmaz.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-sm">Müşteri ID <span className="text-gray-500 text-xs">(5 rakam)</span></label>
                    <input
                      type="text"
                      value={formData.customerId}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 5);
                        setFormData({ ...formData, customerId: value });
                      }}
                      className="input"
                      placeholder="12345"
                      maxLength={5}
                    />
                    {formData.customerId && formData.customerId.length !== 5 && (
                      <p className="text-xs text-red-500 mt-1">Müşteri ID 5 rakamlı olmalıdır</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Müşteri Adı</label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="input"
                      placeholder="Ad Soyad"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Email</label>
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="input"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Telefon</label>
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="input"
                      placeholder="+994501234567"
                    />
                  </div>
                </div>
              </div>

              {/* Giriş Bilgileri */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-2">Giriş Bilgileri</h3>
                <p className="text-xs text-gray-500 mb-3 bg-gray-50 p-2 rounded">
                  ℹ️ Bu bilgiler yalnızca kayıt ve not amaçlıdır. Giriş yapmak için kullanılmaz.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-sm">Login</label>
                    <input
                      type="text"
                      value={formData.customerLogin}
                      onChange={(e) => setFormData({ ...formData, customerLogin: e.target.value })}
                      className="input"
                      placeholder="Kullanıcı adı / Login"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Şifre</label>
                    <input
                      type="text"
                      value={formData.customerPassword}
                      onChange={(e) => setFormData({ ...formData, customerPassword: e.target.value })}
                      className="input"
                      placeholder="Şifre"
                    />
                  </div>
                </div>
              </div>

              {/* Paket ve Süre */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Paket ve Süre</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-sm">Paket *</label>
                    <select
                      value={formData.packageId}
                      onChange={(e) => handlePackageChange(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Seçiniz...</option>
                      {packages.map((pkg) => {
                        const price = typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price;
                        return (
                          <option key={pkg.id} value={pkg.id}>
                            {pkg.name} - {Number(price).toFixed(2)} AZN/ay
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Süre (Ay) *</label>
                    <select
                      value={formData.durationMonths}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      className="input"
                      required
                    >
                      <option value="1">1 Ay</option>
                      <option value="3">3 Ay</option>
                      <option value="6">6 Ay</option>
                      <option value="12">12 Ay</option>
                    </select>
                  </div>
                </div>
                {formData.packageId && formData.durationMonths && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">
                      Aylık Tutar: {(() => {
                        const pkg = packages.find(p => p.id === formData.packageId);
                        const price = pkg ? (typeof pkg.price === 'string' ? parseFloat(pkg.price) : pkg.price) : 0;
                        return Number(price).toFixed(2);
                      })()} AZN
                    </div>
                    <div className="text-lg font-bold text-blue-700">Toplam Tutar: {calculateTotalAmount().toFixed(2)} AZN</div>
                  </div>
                )}
              </div>

              {/* Restoran Bilgileri */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Restoran Bilgileri</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 font-medium text-sm">Restoran Adı</label>
                    <input
                      type="text"
                      value={formData.restaurantName}
                      onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                      className="input"
                      placeholder="Restoran adı"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Restoran Adresi</label>
                    <textarea
                      value={formData.restaurantAddress}
                      onChange={(e) => setFormData({ ...formData, restaurantAddress: e.target.value })}
                      className="input"
                      rows={2}
                      placeholder="Restoran adresi"
                    />
                  </div>
                </div>
              </div>

              {/* Tarih ve Ödeme */}
              <div className="border-b pb-4">
                <h3 className="text-lg font-semibold mb-3">Tarih ve Ödeme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-sm">Başlangıç Tarihi *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleStartDateChange(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Ödeme Türü *</label>
                    <select
                      value={formData.paymentType}
                      onChange={(e) => setFormData({ ...formData, paymentType: e.target.value as 'one_time' | 'monthly' })}
                      className="input"
                      required
                    >
                      <option value="one_time">Tek Ödeme</option>
                      <option value="monthly">Aylık Ödeme</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Toplam Tutar (AZN) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount || calculateTotalAmount()}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input"
                      required
                      readOnly={!!formData.packageId && !!formData.durationMonths}
                    />
                    {formData.packageId && formData.durationMonths && (
                      <p className="text-xs text-gray-500 mt-1">Otomatik hesaplanıyor</p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 font-medium text-sm">Ödeme Durumu</label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as 'pending' | 'paid' })}
                      className="input"
                    >
                      <option value="pending">Bekliyor</option>
                      <option value="paid">Ödendi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notlar */}
              <div>
                <label className="block mb-2 font-medium text-sm">Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input"
                  rows={3}
                  placeholder="Ekstra hizmetler veya notlar..."
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 btn btn-primary">
                  {editingSubscription ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingSubscription(null);
                    resetForm();
                  }}
                  className="flex-1 btn btn-secondary"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Details Modal */}
      {selectedSubscription && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSubscription(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Abonelik Detayları</h2>
                  <p className="text-gray-600 mt-1">{selectedSubscription.package.name} - {selectedSubscription.durationMonths} ay</p>
                </div>
                <button
                  onClick={() => setSelectedSubscription(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* İdari Paket Bölümü */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  İdari Paket Fiyatları
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(() => {
                    const monthlyPrice = typeof selectedSubscription.package.price === 'string' 
                      ? parseFloat(selectedSubscription.package.price) 
                      : selectedSubscription.package.price;
                    
                    // Özel fiyatlar varsa onları kullan, yoksa aylık fiyat × ay sayısı
                    const price1Month = selectedSubscription.package.price1Month 
                      ? (typeof selectedSubscription.package.price1Month === 'string' 
                          ? parseFloat(selectedSubscription.package.price1Month) 
                          : selectedSubscription.package.price1Month)
                      : monthlyPrice * 1;
                    
                    const price6Months = selectedSubscription.package.price6Months 
                      ? (typeof selectedSubscription.package.price6Months === 'string' 
                          ? parseFloat(selectedSubscription.package.price6Months) 
                          : selectedSubscription.package.price6Months)
                      : monthlyPrice * 6;
                    
                    const price12Months = selectedSubscription.package.price12Months 
                      ? (typeof selectedSubscription.package.price12Months === 'string' 
                          ? parseFloat(selectedSubscription.package.price12Months) 
                          : selectedSubscription.package.price12Months)
                      : monthlyPrice * 12;
                    
                    return (
                      <>
                        {/* 1 Ay */}
                        <div className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-indigo-400 transition-all hover:shadow-lg">
                          <div className="text-sm font-medium text-gray-600 mb-2">1 Ay</div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {price1Month.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </div>
                        
                        {/* 6 Ay */}
                        <div className="bg-white rounded-lg p-4 border-2 border-indigo-300 hover:border-indigo-500 transition-all hover:shadow-lg relative">
                          <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Popüler
                          </div>
                          <div className="text-sm font-medium text-gray-600 mb-2">6 Ay</div>
                          <div className="text-2xl font-bold text-indigo-600 mb-1">
                            {price6Months.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </div>
                        
                        {/* 12 Ay */}
                        <div className="bg-white rounded-lg p-4 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg relative">
                          <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            En İyi
                          </div>
                          <div className="text-sm font-medium text-gray-600 mb-2">12 Ay</div>
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {price12Months.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                          </div>
                          <div className="text-xs text-gray-500">Aylık: {monthlyPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN</div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Ödeme Detayları Bölümü */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Ödeme Detayları</h3>
              {selectedSubscription.paymentType === 'monthly' && selectedSubscription.paymentLogs && selectedSubscription.paymentLogs.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-5 gap-2 text-sm font-semibold pb-2 border-b">
                    <div>Ay</div>
                    <div>Tutar</div>
                    <div>Ödeme Tarihi</div>
                    <div>Durum</div>
                    <div>İşlem</div>
                  </div>
                  {selectedSubscription.paymentLogs.map((payment) => {
                    // Ödeme tarihini hesapla
                    const startDate = new Date(selectedSubscription.startDate);
                    const paymentDate = new Date(startDate.getFullYear(), startDate.getMonth() + (payment.month - 1), startDate.getDate());
                    
                    return (
                    <div key={payment.id} className="grid grid-cols-5 gap-2 items-center py-2 border-b">
                      <div className="font-medium">
                        {getMonthName(payment.month)} {payment.year}
                      </div>
                      <div>{Number(payment.amount).toFixed(2)} AZN</div>
                      <div className="text-xs text-gray-600">
                        {payment.paymentDate 
                          ? new Date(payment.paymentDate).toLocaleDateString('tr-TR')
                          : paymentDate.toLocaleDateString('tr-TR')
                        }
                      </div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            payment.status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {payment.status === 'paid' ? 'Ödendi' : payment.status === 'overdue' ? 'Gecikmiş' : 'Bekliyor'}
                        </span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {payment.status === 'paid' && (
                          <button
                            onClick={() => handleDownloadPaymentPDF(selectedSubscription.id, payment.id)}
                            className="text-xs btn bg-blue-100 text-blue-800 hover:bg-blue-200 py-1 px-2"
                            title="PDF İndir"
                          >
                            📄 PDF
                          </button>
                        )}
                        {payment.status === 'pending' ? (
                          <button
                            onClick={() => handlePaymentStatusUpdate(selectedSubscription.id, payment.id, 'paid')}
                            className="text-xs btn btn-primary py-1 px-2"
                          >
                            Ödendi İşaretle
                          </button>
                        ) : (
                          <button
                            onClick={() => handlePaymentStatusUpdate(selectedSubscription.id, payment.id, 'pending')}
                            className="text-xs btn btn-secondary py-1 px-2"
                          >
                            Bekliyor Yap
                          </button>
                        )}
                      </div>
                    </div>
                    );
                  })}
                  <div className="pt-4 border-t mt-4">
                    <div className="flex justify-between font-bold">
                      <div>Toplam:</div>
                      <div>{Number(selectedSubscription.amount).toFixed(2)} AZN</div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <div>Ödenen:</div>
                      <div>
                        {selectedSubscription.paymentLogs
                          .filter((p) => p.status === 'paid')
                          .reduce((sum, p) => sum + Number(p.amount), 0)
                          .toFixed(2)}{' '}
                        AZN
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div>Kalan Borç:</div>
                      <div className="font-semibold text-red-600">
                        {(
                          Number(selectedSubscription.amount) -
                          selectedSubscription.paymentLogs
                            .filter((p) => p.status === 'paid')
                            .reduce((sum, p) => sum + Number(p.amount), 0)
                        ).toFixed(2)}{' '}
                        AZN
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {selectedSubscription.paymentType === 'one_time' ? (
                    <div>
                      <p className="mb-4">Bu abonelik tek ödeme türündedir.</p>
                      <p className="font-semibold text-lg">Toplam Tutar: {Number(selectedSubscription.amount).toFixed(2)} AZN</p>
                      <p className={`mt-2 ${selectedSubscription.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        Durum: {selectedSubscription.paymentStatus === 'paid' ? 'Ödendi' : 'Bekliyor'}
                      </p>
                    </div>
                  ) : (
                    <p>Ödeme planı henüz oluşturulmamış.</p>
                  )}
                </div>
              )}
              </div>
            </div>
            <div className="sticky bottom-0 bg-white border-t p-6">
              <button
                onClick={() => setSelectedSubscription(null)}
                className="w-full btn btn-secondary"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
          onClick={() => !deleting && setDeleteConfirm(null)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Aboneliği Sil</h3>
            </div>
            <p className="text-gray-600 mb-6 ml-16">Bu aboneliği silmek istediğinize emin misiniz? Bu işlem geri alınamaz.</p>
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(deleteConfirm);
                }}
                disabled={deleting}
                className={`flex-1 btn bg-red-600 text-white hover:bg-red-700 transition-all ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {deleting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Siliniyor...
                  </span>
                ) : (
                  'Sil'
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!deleting) setDeleteConfirm(null);
                }}
                disabled={deleting}
                className={`flex-1 btn btn-secondary ${
                  deleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
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

export default SubscriptionsManagement;
