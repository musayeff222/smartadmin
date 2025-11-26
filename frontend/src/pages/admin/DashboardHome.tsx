import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    totalSubscriptions: 0,
    newMessages: 0,
    activeSubscriptions: 0,
    todayVisitors: 0,
    todayPaidCount: 0,
    todayPaidCustomers: [] as any[],
    todayDueCount: 0,
    todayDueCustomers: [] as any[],
    threeDaysDueCount: 0,
    threeDaysDueCustomers: [] as any[],
    monthlyTotalAmount: 0,
    monthlyCustomers: [] as any[],
  });
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/statistics');
        setStats(response.data.statistics);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, link }: any) => (
    <Link
      to={link}
      className="card group hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color} mb-2`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('-600', '-100')}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
        Detayları Gör
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">Yönetim paneline hoş geldiniz</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Toplam Paket"
          value={stats.totalPackages}
          icon={
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
          color="text-blue-600"
          link="/admin-panel/packages"
        />
        <StatCard
          title="Aktif Abonelikler"
          value={stats.activeSubscriptions || stats.totalSubscriptions}
          icon={
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          }
          color="text-green-600"
          link="/admin-panel/subscriptions"
        />
        <StatCard
          title="Yeni Mesajlar"
          value={stats.newMessages}
          icon={
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          color="text-orange-600"
          link="/admin-panel/messages"
        />
        <StatCard
          title="Bugünkü Ziyaretçiler"
          value={stats.todayVisitors || 0}
          icon={
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          color="text-purple-600"
          link="/admin-panel/statistics"
        />
      </div>

      {/* Payment Statistics Cards */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ödeme İstatistikleri</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Bugün Ödeme Yapanlar */}
          <div className="card group hover:shadow-lg transition-all duration-200">
            <div 
              className="cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedCards);
                if (newExpanded.has('todayPaid')) {
                  newExpanded.delete('todayPaid');
                } else {
                  newExpanded.add('todayPaid');
                }
                setExpandedCards(newExpanded);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Bugün Ödeme Yapanlar</p>
                  <p className="text-3xl font-bold text-emerald-600 mb-2">{stats.todayPaidCount || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm font-medium text-emerald-600">
                {expandedCards.has('todayPaid') ? 'Gizle' : 'Detayları Göster'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${expandedCards.has('todayPaid') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedCards.has('todayPaid') && stats.todayPaidCustomers && stats.todayPaidCustomers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 max-h-64 overflow-y-auto">
                {stats.todayPaidCustomers.map((customer, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="font-semibold text-gray-900">{customer.customerName}</div>
                    {customer.restaurantName && (
                      <div className="text-sm text-gray-600 mt-1">{customer.restaurantName}</div>
                    )}
                    {customer.customerId && (
                      <div className="text-xs text-gray-500 mt-1">ID: {customer.customerId}</div>
                    )}
                    <div className="text-sm font-medium text-emerald-600 mt-1">
                      {customer.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                    </div>
                  </div>
                ))}
              </div>
            )}
            {expandedCards.has('todayPaid') && (!stats.todayPaidCustomers || stats.todayPaidCustomers.length === 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">Henüz ödeme yapan yok</div>
            )}
          </div>

          {/* Bugün Ödeme Yapacaklar */}
          <div className="card group hover:shadow-lg transition-all duration-200">
            <div 
              className="cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedCards);
                if (newExpanded.has('todayDue')) {
                  newExpanded.delete('todayDue');
                } else {
                  newExpanded.add('todayDue');
                }
                setExpandedCards(newExpanded);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Bugün Ödeme Yapacaklar</p>
                  <p className="text-3xl font-bold text-yellow-600 mb-2">{stats.todayDueCount || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm font-medium text-yellow-600">
                {expandedCards.has('todayDue') ? 'Gizle' : 'Detayları Göster'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${expandedCards.has('todayDue') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedCards.has('todayDue') && stats.todayDueCustomers && stats.todayDueCustomers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 max-h-64 overflow-y-auto">
                {stats.todayDueCustomers.map((customer, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="font-semibold text-gray-900">{customer.customerName}</div>
                    {customer.restaurantName && (
                      <div className="text-sm text-gray-600 mt-1">{customer.restaurantName}</div>
                    )}
                    {customer.customerId && (
                      <div className="text-xs text-gray-500 mt-1">ID: {customer.customerId}</div>
                    )}
                    <div className="text-sm font-medium text-yellow-600 mt-1">
                      {customer.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                    </div>
                  </div>
                ))}
              </div>
            )}
            {expandedCards.has('todayDue') && (!stats.todayDueCustomers || stats.todayDueCustomers.length === 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">Bugün ödeme yapacak kimse yok</div>
            )}
          </div>

          {/* 3 Gün Sonra Ödeme Yapacaklar */}
          <div className="card group hover:shadow-lg transition-all duration-200">
            <div 
              className="cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedCards);
                if (newExpanded.has('threeDaysDue')) {
                  newExpanded.delete('threeDaysDue');
                } else {
                  newExpanded.add('threeDaysDue');
                }
                setExpandedCards(newExpanded);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">3 Gün Sonra Ödeme Yapacaklar</p>
                  <p className="text-3xl font-bold text-amber-600 mb-2">{stats.threeDaysDueCount || 0}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm font-medium text-amber-600">
                {expandedCards.has('threeDaysDue') ? 'Gizle' : 'Detayları Göster'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${expandedCards.has('threeDaysDue') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedCards.has('threeDaysDue') && stats.threeDaysDueCustomers && stats.threeDaysDueCustomers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 max-h-64 overflow-y-auto">
                {stats.threeDaysDueCustomers.map((customer, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="font-semibold text-gray-900">{customer.customerName}</div>
                    {customer.restaurantName && (
                      <div className="text-sm text-gray-600 mt-1">{customer.restaurantName}</div>
                    )}
                    {customer.customerId && (
                      <div className="text-xs text-gray-500 mt-1">ID: {customer.customerId}</div>
                    )}
                    <div className="text-sm font-medium text-amber-600 mt-1">
                      {customer.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                    </div>
                  </div>
                ))}
              </div>
            )}
            {expandedCards.has('threeDaysDue') && (!stats.threeDaysDueCustomers || stats.threeDaysDueCustomers.length === 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">3 gün sonra ödeme yapacak kimse yok</div>
            )}
          </div>

          {/* Bu Ay Toplam Alınacak */}
          <div className="card group hover:shadow-lg transition-all duration-200">
            <div 
              className="cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedCards);
                if (newExpanded.has('monthly')) {
                  newExpanded.delete('monthly');
                } else {
                  newExpanded.add('monthly');
                }
                setExpandedCards(newExpanded);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">Bu Ay Toplam Alınacak</p>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">
                    {(stats.monthlyTotalAmount || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-100">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-2 flex items-center text-sm font-medium text-indigo-600">
                {expandedCards.has('monthly') ? 'Gizle' : 'Detayları Göster'}
                <svg className={`w-4 h-4 ml-1 transition-transform ${expandedCards.has('monthly') ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedCards.has('monthly') && stats.monthlyCustomers && stats.monthlyCustomers.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 max-h-64 overflow-y-auto">
                {stats.monthlyCustomers.map((customer, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                    <div className="font-semibold text-gray-900">{customer.customerName}</div>
                    {customer.restaurantName && (
                      <div className="text-sm text-gray-600 mt-1">{customer.restaurantName}</div>
                    )}
                    {customer.customerId && (
                      <div className="text-xs text-gray-500 mt-1">ID: {customer.customerId}</div>
                    )}
                    <div className="text-sm font-medium text-indigo-600 mt-1">
                      {customer.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} AZN
                    </div>
                  </div>
                ))}
              </div>
            )}
            {expandedCards.has('monthly') && (!stats.monthlyCustomers || stats.monthlyCustomers.length === 0) && (
              <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500 text-center">Bu ay ödeme yapacak kimse yok</div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <Link
          to="/admin-panel/packages"
          className="card group hover:scale-[1.02] transition-all duration-200 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Paket Yönetimi</h3>
              <p className="text-sm text-gray-600">Paketleri görüntüle ve düzenle</p>
            </div>
            <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          to="/admin-panel/subscriptions"
          className="card group hover:scale-[1.02] transition-all duration-200 bg-gradient-to-br from-green-50 to-green-100 border-green-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-600 rounded-xl text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Abonelikler</h3>
              <p className="text-sm text-gray-600">Abonelikleri yönet ve fatura oluştur</p>
            </div>
            <svg className="w-5 h-5 text-green-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          to="/admin-panel/messages"
          className="card group hover:scale-[1.02] transition-all duration-200 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-orange-600 rounded-xl text-white relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {stats.newMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.newMessages}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Mesajlar</h3>
              <p className="text-sm text-gray-600">Yeni mesajları kontrol et</p>
            </div>
            <svg className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;

