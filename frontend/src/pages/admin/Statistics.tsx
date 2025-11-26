import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Visitor {
  id: string;
  ipAddress: string;
  userAgent: string | null;
  deviceId: string | null;
  path: string;
  createdAt: string;
  isNewVisitor: boolean;
}

const Statistics = () => {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'returning'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [visitorToDelete, setVisitorToDelete] = useState<Visitor | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    fetchTodayVisitors();
  }, []);

  const fetchTodayVisitors = async () => {
    try {
      const response = await api.get('/admin/visitors/today');
      setVisitors(response.data.visitors || []);
    } catch (error) {
      toast.error('Ziyaretçiler yüklenirken hata oluştu');
      console.error('Failed to fetch today visitors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBrowserName = (userAgent: string | null) => {
    if (!userAgent) return 'Bilinmeyen';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Web';
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('tr-TR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const handleDeleteClick = (visitor: Visitor) => {
    setVisitorToDelete(visitor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!visitorToDelete) return;

    setDeletingId(visitorToDelete.id);
    try {
      await api.delete(`/admin/visitors/${visitorToDelete.id}`);
      toast.success('Ziyaretçi başarıyla silindi');
      setVisitors(visitors.filter(v => v.id !== visitorToDelete.id));
      setShowDeleteModal(false);
      setVisitorToDelete(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ziyaretçi silinirken hata oluştu');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setVisitorToDelete(null);
  };

  const handleDeleteAllClick = () => {
    if (visitors.length === 0) {
      toast.error('Silinecek ziyaretçi bulunmuyor');
      return;
    }
    setShowDeleteAllModal(true);
  };

  const handleDeleteAllConfirm = async () => {
    setDeletingAll(true);
    try {
      const response = await api.delete('/admin/visitors/today/all');
      toast.success(response.data.message || 'Tüm ziyaretçiler başarıyla silindi');
      setVisitors([]);
      setShowDeleteAllModal(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Ziyaretçiler silinirken hata oluştu');
    } finally {
      setDeletingAll(false);
    }
  };

  const handleDeleteAllCancel = () => {
    setShowDeleteAllModal(false);
  };

  const filteredVisitors = visitors.filter(visitor => {
    if (filter === 'new') return visitor.isNewVisitor;
    if (filter === 'returning') return !visitor.isNewVisitor;
    return true;
  });

  const newVisitorsCount = visitors.filter(v => v.isNewVisitor).length;
  const returningVisitorsCount = visitors.filter(v => !v.isNewVisitor).length;

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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
    <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Site Ziyaretçileri</h1>
              <p className="text-sm text-gray-600 mt-0.5">Bugün siteye giriş yapan kullanıcılar</p>
            </div>
          </div>
          {visitors.length > 0 && (
            <button
              onClick={handleDeleteAllClick}
              disabled={deletingAll}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              {deletingAll ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Siliniyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Tümünü Sil</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Toplam Ziyaret</p>
              <p className="text-2xl font-bold text-gray-900">{visitors.length}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Yeni Ziyaretçiler</p>
              <p className="text-2xl font-bold text-green-600">{newVisitorsCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tekrar Eden</p>
              <p className="text-2xl font-bold text-purple-600">{returningVisitorsCount}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            filter === 'all'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tümü ({visitors.length})
        </button>
        <button
          onClick={() => setFilter('new')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            filter === 'new'
              ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Yeni Ziyaretçiler ({newVisitorsCount})
        </button>
        <button
          onClick={() => setFilter('returning')}
          className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
            filter === 'returning'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Tekrar Eden ({returningVisitorsCount})
        </button>
      </div>

      {/* Visitors List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {filteredVisitors.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">
              {filter === 'all' 
                ? 'Henüz bugün ziyaretçi yok' 
                : filter === 'new' 
                ? 'Yeni ziyaretçi bulunmuyor'
                : 'Tekrar eden ziyaretçi bulunmuyor'}
            </p>
            <p className="text-sm text-gray-500 mt-1">Siteye giriş yapıldığında burada görünecek</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredVisitors.map((visitor) => (
              <div
                key={visitor.id}
                className={`p-4 rounded-xl border transition-all ${
                  visitor.isNewVisitor
                    ? 'bg-gradient-to-r from-green-50 to-white border-green-200 hover:border-green-300 hover:shadow-md'
                    : 'bg-gradient-to-r from-gray-50 to-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        visitor.isNewVisitor
                          ? 'bg-gradient-to-br from-green-100 to-green-200'
                          : 'bg-gradient-to-br from-purple-100 to-purple-200'
                      }`}>
                        {visitor.isNewVisitor ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 flex-wrap">
                          <h3 className="font-semibold text-sm text-gray-900">
                            {getBrowserName(visitor.userAgent)}
                          </h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            visitor.isNewVisitor
                              ? 'bg-green-100 text-green-700'
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {visitor.isNewVisitor ? 'Yeni Ziyaretçi' : 'Tekrar Eden'}
                          </span>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {visitor.path}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{visitor.ipAddress}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0 flex flex-col items-end">
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {formatTime(visitor.createdAt)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(visitor.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(visitor)}
                      disabled={deletingId === visitor.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Sil"
                    >
                      {deletingId === visitor.id ? (
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && visitorToDelete && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          onClick={handleDeleteCancel}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Ziyaretçiyi Sil</h3>
                <p className="text-sm text-gray-600">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">Tarayıcı:</span> {getBrowserName(visitorToDelete.userAgent)}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-semibold">IP Adresi:</span> {visitorToDelete.ipAddress}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Sayfa:</span> {visitorToDelete.path}
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Bu ziyaretçi kaydını silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteCancel}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deletingId === visitorToDelete.id}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingId === visitorToDelete.id ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete All Confirmation Modal */}
      {showDeleteAllModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4"
          onClick={handleDeleteAllCancel}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Tüm Ziyaretçileri Sil</h3>
                <p className="text-sm text-gray-600">Bu işlem geri alınamaz</p>
              </div>
            </div>
            <div className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200">
              <p className="text-sm text-red-800 font-semibold mb-2">
                {visitors.length} ziyaretçi kaydı silinecek
              </p>
              <p className="text-xs text-red-700">
                Bugün siteye giriş yapan tüm ziyaretçi kayıtları kalıcı olarak silinecektir.
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Tüm ziyaretçi kayıtlarını silmek istediğinize emin misiniz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteAllCancel}
                disabled={deletingAll}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAllConfirm}
                disabled={deletingAll}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingAll ? 'Siliniyor...' : 'Tümünü Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
