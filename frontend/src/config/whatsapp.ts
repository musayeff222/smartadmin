// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  // WhatsApp numarası (ülke kodu ile, + işareti olmadan)
  // Örnek: 994501234567 (Azerbaycan), 905551234567 (Türkiye)
  phoneNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '994501234567',
  
  // Varsayılan mesaj
  defaultMessage: 'Merhaba, SmartCafe hakkında bilgi almak istiyorum.',
};

export const getWhatsAppUrl = (message: string, phoneNumber?: string) => {
  const number = phoneNumber || WHATSAPP_CONFIG.phoneNumber;
  // Sadece rakamları al
  const cleanNumber = number.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

