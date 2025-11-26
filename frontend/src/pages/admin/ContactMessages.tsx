import { useEffect, useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  reply?: string;
  userAgent?: string;
  deviceId?: string;
  createdAt: string;
}

const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [groupedMessages, setGroupedMessages] = useState<{ [key: string]: ContactMessage[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedPersonKey, setSelectedPersonKey] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [_whatsappNumber, setWhatsappNumber] = useState<string>('');

  useEffect(() => {
    fetchMessages();
    fetchWhatsAppNumber();
  }, []);

  const fetchWhatsAppNumber = async () => {
    try {
      const response = await api.get('/public/settings');
      if (response.data.settings?.whatsappNumber) {
        setWhatsappNumber(response.data.settings.whatsappNumber);
      }
    } catch (error) {
      console.error('Failed to fetch WhatsApp number:', error);
    }
  };

  useEffect(() => {
    let filtered = [...messages];

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(msg => msg.status === statusFilter);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    setFilteredMessages(filtered);
    
    // Mesajları kişilere göre grupla
    const groups = groupMessagesByPerson(filtered);
    
    // Her grup içindeki mesajları tarihe göre sırala
    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA; // En yeni önce
      });
    });
    
    setGroupedMessages(groups);
  }, [messages, statusFilter, sortOrder]);

  // Mesajları kişilere göre grupla
  const groupMessagesByPerson = (messages: ContactMessage[]) => {
    const groups: { [key: string]: ContactMessage[] } = {};
    
    messages.forEach(msg => {
      // Gruplama anahtarı: telefon numarası varsa telefon, yoksa email, yoksa deviceId
      const groupKey = msg.phone 
        ? `phone_${msg.phone.replace(/[^0-9]/g, '')}`
        : msg.deviceId 
        ? `device_${msg.deviceId}`
        : `email_${msg.email.toLowerCase()}`;
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(msg);
    });
    
    return groups;
  };

  // Kişi bilgisini al (grup için)
  const getPersonInfo = (personMessages: ContactMessage[]) => {
    const latestMessage = personMessages[0]; // En yeni mesaj
    const unreadCount = personMessages.filter(m => m.status === 'new').length;
    const hasReplied = personMessages.some(m => m.status === 'replied');
    
    return {
      name: latestMessage.name,
      email: latestMessage.email,
      phone: latestMessage.phone,
      latestMessage: latestMessage,
      messageCount: personMessages.length,
      unreadCount,
      hasReplied,
      lastMessageDate: latestMessage.createdAt,
    };
  };

  // Kişi bilgisini al (telefon, email veya deviceId'ye göre)
  const getPersonIdentifier = (message: ContactMessage) => {
    if (message.phone) {
      return `📞 ${message.phone}`;
    }
    if (message.deviceId) {
      // User agent'dan tarayıcı bilgisi çıkar
      if (message.userAgent) {
        if (message.userAgent.includes('Chrome')) return '🌐 Chrome';
        if (message.userAgent.includes('Firefox')) return '🦊 Firefox';
        if (message.userAgent.includes('Safari')) return '🧭 Safari';
        if (message.userAgent.includes('Edge')) return '🌐 Edge';
        return '💻 Web';
      }
      return '💻 Cihaz';
    }
    return `📧 ${message.email}`;
  };

  // Aynı kişiden gelen mesajları getir
  const _getRelatedMessages = (message: ContactMessage): ContactMessage[] => {
    const groupKey = message.phone 
      ? `phone_${message.phone.replace(/[^0-9]/g, '')}`
      : message.deviceId 
      ? `device_${message.deviceId}`
      : `email_${message.email.toLowerCase()}`;
    
    const groups = groupMessagesByPerson(messages);
    return groups[groupKey] || [message];
  };

  const fetchMessages = async () => {
    try {
      const response = await api.get('/admin/contact-messages');
      setMessages(response.data.messages);
    } catch (error) {
      toast.error('Mesajlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) {
      toast.error('Lütfen bir yanıt yazın');
      return;
    }
    try {
      await api.put(`/admin/contact-messages/${messageId}/reply`, { reply: replyText });
      toast.success('Yanıt kaydedildi');
      setSelectedMessage(null);
      setReplyText('');
      fetchMessages();
    } catch (error) {
      toast.error('Yanıt gönderilemedi');
    }
  };

  const handleSendWhatsApp = (message: ContactMessage) => {
    if (!message.phone) {
      toast.error('Bu mesajda telefon numarası bulunmuyor');
      return;
    }
    
    const phoneNumber = message.phone.replace(/[^0-9]/g, '');
    const replyMessage = replyText.trim() || message.reply || '';
    
    if (!replyMessage) {
      toast.error('Lütfen önce bir yanıt yazın');
      return;
    }

    // WhatsApp URL oluştur
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(replyMessage)}`;
    window.open(whatsappUrl, '_blank');
    
    // Yanıtı kaydet
    if (!message.reply && replyText.trim()) {
      handleReply(message.id);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await api.put(`/admin/contact-messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      toast.error('Mesaj okundu olarak işaretlenemedi');
    }
  };

  const handleDelete = async (messageId: string) => {
    try {
      await api.delete(`/admin/contact-messages/${messageId}`);
      toast.success('Mesaj silindi');
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      fetchMessages();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Mesaj silinemedi');
    }
  };

  const formatTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Dün';
    } else if (days < 7) {
      return d.toLocaleDateString('tr-TR', { weekday: 'short' });
    } else {
      return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
    }
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

  const unreadCount = messages.filter(m => m.status === 'new').length;

  // SVG Icons
  const MessageIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const _ReplyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
    </svg>
  );

  const _SendIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-green-500 to-green-600',
      'from-orange-500 to-orange-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-teal-500 to-teal-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full h-[calc(100vh-8rem)] flex flex-col bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-5 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <MessageIcon />
              </div>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse shadow-lg">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mesajlar</h1>
              {unreadCount > 0 ? (
                <p className="text-sm text-gray-600 mt-0.5">
                  <span className="font-bold text-red-600">{unreadCount}</span> okunmamış mesaj
                </p>
              ) : (
                <p className="text-sm text-gray-500 mt-0.5">Tüm mesajlar okundu</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="input text-sm py-2.5 bg-white border-2"
            >
              <option value="all">📋 Tümü</option>
              <option value="new">🆕 Yeni</option>
              <option value="read">👁️ Okundu</option>
              <option value="replied">✅ Yanıtlandı</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="input text-sm py-2.5 bg-white border-2"
            >
              <option value="newest">⬇️ Yeniden Eskiye</option>
              <option value="oldest">⬆️ Eskiden Yeniye</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content - Chat Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Messages List - Left Side */}
        <div className="w-full md:w-96 lg:w-[420px] border-r border-gray-200 bg-white flex flex-col shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">
                  {Object.keys(groupedMessages).length} kişi
                </p>
                <p className="text-xs text-gray-500">
                  {filteredMessages.length} mesaj
                </p>
              </div>
              {statusFilter !== 'all' && (
                <button
                  onClick={() => setStatusFilter('all')}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Filtreyi Temizle
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {Object.entries(groupedMessages)
              .sort(([, messagesA], [, messagesB]) => {
                const dateA = new Date(messagesA[0].createdAt).getTime();
                const dateB = new Date(messagesB[0].createdAt).getTime();
                return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
              })
              .map(([personKey, personMessages], index) => {
                const personInfo = getPersonInfo(personMessages);
                const isSelected = selectedPersonKey === personKey;
                
                return (
                  <div
                    key={personKey}
                    className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-l-blue-600 shadow-sm' 
                        : ''
                    } ${personInfo.unreadCount > 0 ? 'bg-blue-50/30' : ''}`}
                    onClick={() => {
                      setSelectedPersonKey(personKey);
                      setSelectedMessage(personInfo.latestMessage);
                      // Tüm yeni mesajları okundu olarak işaretle
                      personMessages.forEach(msg => {
                        if (msg.status === 'new') {
                          markAsRead(msg.id);
                        }
                      });
                    }}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(personInfo.name)} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md relative`}>
                        <span className="text-white font-bold text-lg">
                          {personInfo.name.charAt(0).toUpperCase()}
                        </span>
                        {personInfo.messageCount > 1 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                            {personInfo.messageCount}
                          </span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-gray-900 truncate">{personInfo.name}</h3>
                              {personInfo.unreadCount > 0 && (
                                <span className="w-2.5 h-2.5 bg-blue-600 rounded-full flex-shrink-0 animate-pulse shadow-lg"></span>
                              )}
                              {personInfo.hasReplied && (
                                <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <p className="text-sm font-semibold text-gray-700 truncate mt-0.5">{personInfo.latestMessage.subject}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 text-right">
                            <p className="text-xs font-medium text-gray-500">{formatTime(personInfo.lastMessageDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-xs text-gray-500 truncate">{personInfo.email}</p>
                          {personInfo.phone && (
                            <>
                              <span className="text-gray-300">•</span>
                              <p className="text-xs text-gray-500">{personInfo.phone}</p>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{personInfo.latestMessage.message}</p>
                        {personInfo.messageCount > 1 && (
                          <div className="mt-2 flex items-center space-x-1">
                            <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              {personInfo.messageCount} mesaj
                            </span>
                            {personInfo.unreadCount > 0 && (
                              <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
                                {personInfo.unreadCount} yeni
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            {Object.keys(groupedMessages).length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <MessageIcon />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {statusFilter === 'all' 
                    ? 'Henüz mesaj yok' 
                    : 'Bu filtreye uygun mesaj yok'}
                </h3>
                <p className="text-gray-500 text-sm">
                  {statusFilter === 'all' 
                    ? 'Müşterilerden gelen mesajlar burada görünecek' 
                    : 'Farklı bir filtre deneyin'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Message Detail - Right Side */}
        {selectedMessage ? (
          <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Message Header */}
            <div className="bg-white border-b border-gray-200 p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-14 h-14 bg-gradient-to-br ${getAvatarColor(selectedMessage.name)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <span className="text-white font-bold text-xl">
                      {selectedMessage.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h2 className="text-xl font-bold text-gray-900">{selectedMessage.name}</h2>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          selectedMessage.status === 'new'
                            ? 'bg-blue-100 text-blue-800 animate-pulse'
                            : selectedMessage.status === 'replied'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedMessage.status === 'new'
                          ? '🆕 Yeni'
                          : selectedMessage.status === 'replied'
                          ? '✅ Yanıtlandı'
                          : '👁️ Okundu'}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        <span>{selectedMessage.email}</span>
                      </div>
                      {selectedMessage.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span>{selectedMessage.phone}</span>
                        </div>
                      )}
                      {selectedMessage.userAgent && (
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="truncate max-w-xs">
                            {selectedMessage.userAgent.includes('Chrome') && '🌐 Chrome'}
                            {selectedMessage.userAgent.includes('Firefox') && '🦊 Firefox'}
                            {selectedMessage.userAgent.includes('Safari') && !selectedMessage.userAgent.includes('Chrome') && '🧭 Safari'}
                            {selectedMessage.userAgent.includes('Edge') && '🌐 Edge'}
                            {!selectedMessage.userAgent.includes('Chrome') && 
                             !selectedMessage.userAgent.includes('Firefox') && 
                             !selectedMessage.userAgent.includes('Safari') && 
                             !selectedMessage.userAgent.includes('Edge') && '💻 Web'}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <span className="font-semibold">Tanımlayıcı:</span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-mono">
                          {getPersonIdentifier(selectedMessage)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>
                          {new Date(selectedMessage.createdAt).toLocaleString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteConfirm(selectedMessage.id)}
                  className="p-2.5 hover:bg-red-100 rounded-xl transition-all duration-200 text-red-600 hover:scale-110"
                  title="Sil"
                >
                  <DeleteIcon />
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {selectedPersonKey && groupedMessages[selectedPersonKey] && (
                <>
                  {groupedMessages[selectedPersonKey]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((message) => (
                      <div key={message.id} className="space-y-4">
                        {/* Incoming Message */}
                        <div className="flex items-start space-x-4 animate-fade-in">
                          <div className={`w-12 h-12 bg-gradient-to-br ${getAvatarColor(message.name)} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-white font-bold text-lg">
                              {message.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 max-w-3xl">
                            <div className="bg-white rounded-3xl rounded-tl-none p-5 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-bold text-gray-900 text-lg">{message.subject}</p>
                                {message.status === 'new' && (
                                  <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                                )}
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{message.message}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2 ml-5">
                              <p className="text-xs text-gray-500">
                                {formatTime(message.createdAt)}
                              </p>
                              {message.status === 'replied' && (
                                <span className="text-xs text-green-600 font-semibold flex items-center space-x-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span>Yanıtlandı</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Reply Message */}
                        {message.reply && (
                          <div className="flex items-start space-x-4 justify-end animate-fade-in">
                            <div className="flex-1 flex justify-end max-w-3xl">
                              <div className="w-full">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-3xl rounded-tr-none p-5 shadow-lg hover:shadow-xl transition-shadow">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-xs font-semibold opacity-90">Yanıtınız</span>
                                  </div>
                                  <p className="whitespace-pre-wrap leading-relaxed">{message.reply}</p>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 mr-5 text-right">Yanıtlandı</p>
                              </div>
                            </div>
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                              <span className="text-white font-bold text-lg">A</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                </>
              )}
            </div>


            {/* Reply Input */}
            {!selectedMessage.reply && (
              <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="input resize-none text-base"
                      rows={4}
                      placeholder="Yanıtınızı yazın..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.ctrlKey) {
                          handleReply(selectedMessage.id);
                        }
                      }}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">Ctrl + Enter ile kaydet</p>
                      <p className="text-xs text-gray-400">{replyText.length} karakter</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={() => handleReply(selectedMessage.id)}
                      disabled={!replyText.trim()}
                      className="btn btn-secondary px-6 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-semibold">Kaydet</span>
                    </button>
                    {selectedMessage.phone && (
                      <button
                        onClick={() => handleSendWhatsApp(selectedMessage)}
                        disabled={!replyText.trim() && !selectedMessage.reply}
                        className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span className="font-semibold">WhatsApp</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reply Display with WhatsApp Button */}
            {selectedMessage.reply && (
              <div className="bg-white border-t border-gray-200 p-5 shadow-lg">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold text-green-900">Yanıt kaydedildi</span>
                    </div>
                    {selectedMessage.phone && (
                      <button
                        onClick={() => {
                          setReplyText(selectedMessage.reply || '');
                          handleSendWhatsApp(selectedMessage);
                        }}
                        className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-2 flex items-center space-x-2 text-sm shadow-md hover:shadow-lg transition-all"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>WhatsApp'a Gönder</span>
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedMessage.reply}</p>
                </div>
                <button
                  onClick={() => {
                    setReplyText(selectedMessage.reply || '');
                    setSelectedMessage({ ...selectedMessage, reply: undefined });
                  }}
                  className="w-full btn btn-secondary text-sm"
                >
                  Yanıtı Düzenle
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
            <div className="text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <MessageIcon />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Mesaj Seçin</h3>
              <p className="text-gray-500 text-base">Detayları görmek için soldan bir mesaj seçin</p>
              <div className="mt-6 flex items-center justify-center space-x-2 text-sm text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span>Mesaj listesinden birini seçin</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
              <DeleteIcon />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Mesajı Sil</h2>
            <p className="text-gray-600 text-center mb-6">
              Bu mesajı silmek istediğinize emin misiniz?
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
                onClick={() => {
                  handleDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
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

export default ContactMessages;

