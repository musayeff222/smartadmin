import api from './api';

// Import api for VAPID key fetch

export interface NotificationSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  userAgent?: string;
  userId?: string;
}

export const notificationService = {
  // VAPID public key'i backend'den al
  async getVapidPublicKey(): Promise<string> {
    try {
      const response = await api.get('/public/notifications/vapid-key');
      return response.data.publicKey || '';
    } catch (error) {
      console.error('VAPID key fetch error:', error);
      // Fallback to env variable
      return import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
    }
  },

  // Bildirim izni iste ve abone ol
  async subscribe(): Promise<NotificationSubscriptionData | null> {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Bu tarayıcı bildirimleri desteklemiyor');
      return null;
    }

    try {
      console.log('Step 1: Requesting notification permission...');
      // Bildirim izni iste
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      
      if (permission !== 'granted') {
        console.warn('Notification permission denied:', permission);
        return null;
      }

      console.log('Step 2: Fetching VAPID public key...');
      // VAPID key kontrolü
      const vapidKey = await this.getVapidPublicKey();
      console.log('VAPID key received:', vapidKey ? `${vapidKey.substring(0, 20)}...` : 'EMPTY');
      
      if (!vapidKey || vapidKey.trim() === '') {
        console.error('VAPID public key bulunamadı veya boş!');
        throw new Error('VAPID public key bulunamadı. Lütfen backend sunucusunun çalıştığından ve .env dosyasında VAPID_PUBLIC_KEY olduğundan emin olun.');
      }

      console.log('Step 3: Registering service worker...');
      // Service Worker kaydet
      let registration;
      try {
        registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('Service worker registered:', registration.scope);
      } catch (swError: any) {
        console.error('Service worker registration error:', swError);
        throw new Error(`Service Worker kaydı başarısız: ${swError.message}`);
      }

      // Service worker'ın aktif olmasını bekle
      await navigator.serviceWorker.ready;
      console.log('Service worker is ready');

      console.log('Step 4: Creating push subscription...');
      // Push subscription oluştur
      let subscription;
      try {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
        });
        console.log('Push subscription created:', subscription.endpoint.substring(0, 50) + '...');
      } catch (subError: any) {
        console.error('Push subscription error:', subError);
        throw new Error(`Push aboneliği oluşturulamadı: ${subError.message}`);
      }

      const p256dhKey = subscription.getKey('p256dh');
      const authKey = subscription.getKey('auth');

      if (!p256dhKey || !authKey) {
        throw new Error('Subscription keys eksik');
      }

      const subscriptionData: NotificationSubscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: this.arrayBufferToBase64(p256dhKey),
          auth: this.arrayBufferToBase64(authKey),
        },
        userAgent: navigator.userAgent,
      };

      console.log('Step 5: Saving subscription to backend...');
      console.log('Subscription data:', {
        endpoint: subscriptionData.endpoint.substring(0, 50) + '...',
        hasKeys: !!(subscriptionData.keys.p256dh && subscriptionData.keys.auth),
      });

      // Backend'e kaydet
      try {
        const response = await api.post('/public/notifications/subscribe', subscriptionData);
        console.log('✅ Subscription saved successfully:', response.data);
        return subscriptionData;
      } catch (error: any) {
        console.error('❌ Failed to save subscription:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
      }
    } catch (error: any) {
      console.error('❌ Bildirim aboneliği hatası:', error);
      console.error('Error message:', error.message);
      throw error; // Hata mesajını yukarı fırlat
    }
  },

  // Abonelikten çık
  async unsubscribe(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        await api.post('/public/notifications/unsubscribe', {
          endpoint: subscription.endpoint,
        });
      }
    } catch (error) {
      console.error('Abonelikten çıkma hatası:', error);
    }
  },

  // Helper functions
  urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  },

  arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  },
};

