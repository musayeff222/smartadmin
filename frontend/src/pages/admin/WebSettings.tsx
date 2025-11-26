import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../../services/api';

interface Settings {
  id?: string;
  whatsappNumber: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  twitterUrl: string;
  linkedinUrl: string;
  companyName: string;
  companyDescription: string;
  contactLink: string;
  faqLink: string;
  documentationLink: string;
  email: string;
  phone: string;
  siteTitle: string;
  metaDescription: string;
  metaKeywords: string;
  faviconUrl: string;
  logoUrl: string;
}

type TabType = 'social' | 'company' | 'seo';

const WebSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('social');
  const [settings, setSettings] = useState<Settings>({
    whatsappNumber: '',
    instagramUrl: '',
    tiktokUrl: '',
    facebookUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    companyName: 'SmartCafe',
    companyDescription: '',
    contactLink: '',
    faqLink: '',
    documentationLink: '',
    email: '',
    phone: '',
    siteTitle: '',
    metaDescription: '',
    metaKeywords: '',
    faviconUrl: '',
    logoUrl: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/admin/settings');
      if (response.data.settings) {
        setSettings(response.data.settings);
      }
      setLoading(false);
    } catch (error: any) {
      console.error('Settings fetch error:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Ayarlar başarıyla kaydedildi!');
    } catch (error: any) {
      console.error('Settings save error:', error);
      toast.error(error.response?.data?.message || 'Ayarlar kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Settings, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
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
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Web Ayarları</h1>
            <p className="text-sm text-gray-600 mt-0.5">Web sitesi ayarlarını yönetin</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('social')}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Sosyal Medya</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('company')}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'company'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span>Şirket Bilgileri</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-3 font-semibold text-sm whitespace-nowrap transition-all border-b-2 ${
              activeTab === 'seo'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>SEO Ayarları</span>
            </div>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Sosyal Medya Tab */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Sosyal Medya Hesapları</h2>
              <p className="text-sm text-gray-600">Sosyal medya hesaplarınızın linklerini ekleyin</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* WhatsApp */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>WhatsApp Numarası</span>
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ''}
                  onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                  className="input w-full"
                  placeholder="994501234567"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Instagram</span>
                </label>
                <input
                  type="url"
                  value={settings.instagramUrl || ''}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="input w-full"
                  placeholder="https://instagram.com/..."
                />
              </div>

              {/* TikTok */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
                  </svg>
                  <span>TikTok</span>
                </label>
                <input
                  type="url"
                  value={settings.tiktokUrl || ''}
                  onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                  className="input w-full"
                  placeholder="https://tiktok.com/@..."
                />
              </div>

              {/* Facebook */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span>Facebook</span>
                </label>
                <input
                  type="url"
                  value={settings.facebookUrl || ''}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  className="input w-full"
                  placeholder="https://facebook.com/..."
                />
              </div>

              {/* Twitter */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  <span>Twitter (Opsiyonel)</span>
                </label>
                <input
                  type="url"
                  value={settings.twitterUrl || ''}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  className="input w-full"
                  placeholder="https://twitter.com/..."
                />
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  <span>LinkedIn (Opsiyonel)</span>
                </label>
                <input
                  type="url"
                  value={settings.linkedinUrl || ''}
                  onChange={(e) => handleChange('linkedinUrl', e.target.value)}
                  className="input w-full"
                  placeholder="https://linkedin.com/company/..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Şirket Bilgileri Tab */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Şirket Bilgileri</h2>
              <p className="text-sm text-gray-600">Footer ve iletişim bilgilerini düzenleyin</p>
            </div>
            <div className="space-y-6">
              {/* Şirket Adı ve Açıklama */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">Şirket Adı</label>
                  <input
                    type="text"
                    value={settings.companyName || ''}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    className="input w-full"
                    placeholder="SmartCafe"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700">Şirket Açıklaması</label>
                  <textarea
                    value={settings.companyDescription || ''}
                    onChange={(e) => handleChange('companyDescription', e.target.value)}
                    className="input w-full"
                    rows={3}
                    placeholder="Restoranlar için modern ve kullanıcı dostu POS çözümü..."
                  />
                </div>
              </div>

              {/* Footer Linkleri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Footer Linkleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">İletişim Linki</label>
                    <input
                      type="text"
                      value={settings.contactLink || ''}
                      onChange={(e) => handleChange('contactLink', e.target.value)}
                      className="input w-full"
                      placeholder="/iletisim"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">SSS Linki</label>
                    <input
                      type="text"
                      value={settings.faqLink || ''}
                      onChange={(e) => handleChange('faqLink', e.target.value)}
                      className="input w-full"
                      placeholder="/sss"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700">Dokümantasyon Linki</label>
                    <input
                      type="text"
                      value={settings.documentationLink || ''}
                      onChange={(e) => handleChange('documentationLink', e.target.value)}
                      className="input w-full"
                      placeholder="/dokumantasyon"
                    />
                  </div>
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">İletişim Bilgileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span>Email</span>
                    </label>
                    <input
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="input w-full"
                      placeholder="info@posrestaurant.com"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>Telefon</span>
                    </label>
                    <input
                      type="text"
                      value={settings.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="input w-full"
                      placeholder="+90 (212) 123 45 67"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SEO Ayarları Tab */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">SEO Ayarları</h2>
              <p className="text-sm text-gray-600">Arama motoru optimizasyonu ayarlarını yapın</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700">Site Başlığı (Title)</label>
                <input
                  type="text"
                  value={settings.siteTitle || ''}
                  onChange={(e) => handleChange('siteTitle', e.target.value)}
                  className="input w-full"
                  placeholder="SmartCafe - Restoran POS Çözümü"
                />
                <p className="text-xs text-gray-500 mt-1">Arama motorlarında görünecek başlık</p>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700">Meta Açıklaması (Description)</label>
                <textarea
                  value={settings.metaDescription || ''}
                  onChange={(e) => handleChange('metaDescription', e.target.value)}
                  className="input w-full"
                  rows={3}
                  placeholder="Restoranlar için modern ve kullanıcı dostu POS çözümü..."
                />
                <p className="text-xs text-gray-500 mt-1">Arama sonuçlarında görünecek açıklama (150-160 karakter önerilir)</p>
              </div>
              <div>
                <label className="block mb-2 font-semibold text-sm text-gray-700">Anahtar Kelimeler (Keywords)</label>
                <input
                  type="text"
                  value={settings.metaKeywords || ''}
                  onChange={(e) => handleChange('metaKeywords', e.target.value)}
                  className="input w-full"
                  placeholder="POS, restoran, sipariş yönetimi, stok takibi"
                />
                <p className="text-xs text-gray-500 mt-1">Virgülle ayırın (örn: kelime1, kelime2, kelime3)</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Favicon URL</span>
                  </label>
                  <input
                    type="url"
                    value={settings.faviconUrl || ''}
                    onChange={(e) => handleChange('faviconUrl', e.target.value)}
                    className="input w-full"
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-xs text-gray-500 mt-1">Tarayıcı sekmesinde görünecek ikon</p>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-sm text-gray-700 flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Logo URL</span>
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl || ''}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    className="input w-full"
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">Web sitesinde görünecek logo</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-200 -mx-6 px-6">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn btn-primary px-8 py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Kaydediliyor...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Ayarları Kaydet</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WebSettings;
