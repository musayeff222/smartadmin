import * as fs from 'fs';
import * as path from 'path';

// Puppeteer import - runtime'da kontrol edilecek
let puppeteer: any = null;

interface MessageData {
  phone: string;
  message: string;
  customerName?: string;
}

class WhatsAppAutomation {
  private browser: any = null;
  private page: any = null;
  private isReady: boolean = false;
  private sessionPath: string;

  constructor() {
    // WhatsApp Web oturum bilgilerini saklamak için klasör
    const sessionDir = path.join(__dirname, '../../whatsapp-session');
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    this.sessionPath = path.join(sessionDir, 'session');
  }

  async initialize(): Promise<void> {
    if (this.browser && this.isReady) {
      console.log('WhatsApp Web zaten hazır, yeniden başlatılmıyor.');
      return;
    }

    try {
      console.log('WhatsApp Web başlatılıyor...');
      
      // Puppeteer'ı başlat
      console.log('Puppeteer başlatılıyor...');
      
      // Puppeteer'ı yükle (runtime'da - TypeScript derleme sonrası)
      if (!puppeteer) {
        try {
          // CommonJS require kullan (TypeScript derleme sonrası çalışır)
          const puppeteerModule = require('puppeteer');
          puppeteer = puppeteerModule.default || puppeteerModule;
          console.log('✅ Puppeteer yüklendi (require)');
        } catch (e: any) {
          console.error('❌ Puppeteer require hatası:', e.message);
          // Dynamic import dene
          try {
            const puppeteerModule = await import('puppeteer');
            puppeteer = puppeteerModule.default || puppeteerModule;
            console.log('✅ Puppeteer yüklendi (dynamic import)');
          } catch (importError: any) {
            throw new Error(`Puppeteer yüklenemedi. Hata: ${e.message || importError.message}`);
          }
        }
      }
      
      this.browser = await puppeteer.launch({
        headless: false, // Görünür mod (QR kod görmek için)
        defaultViewport: null,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
          '--disable-web-security',
        ],
        userDataDir: this.sessionPath, // Oturum bilgilerini sakla
        timeout: 60000, // 60 saniye timeout
      });

      console.log('Puppeteer başlatıldı, sayfa oluşturuluyor...');
      this.page = await this.browser.newPage();
      
      // User agent ayarla (WhatsApp Web'in bot algılamasını önlemek için)
      await this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // WhatsApp Web'i aç
      console.log('WhatsApp Web açılıyor...');
      await this.page.goto('https://web.whatsapp.com', {
        waitUntil: 'domcontentloaded', // networkidle2 yerine daha hızlı
        timeout: 60000,
      });

      console.log('WhatsApp Web yüklendi, giriş kontrolü yapılıyor...');
      
      // QR kod ile giriş yapılmasını bekle (maksimum 90 saniye)
      await this.waitForLogin();

      this.isReady = true;
      console.log('✅ WhatsApp Web hazır!');
    } catch (error: any) {
      console.error('❌ WhatsApp Web başlatma hatası:', error);
      console.error('Hata detayları:', error.message);
      console.error('Stack trace:', error.stack);
      
      // Browser'ı kapat
      if (this.browser) {
        try {
          await this.browser.close();
        } catch (closeError) {
          console.error('Browser kapatma hatası:', closeError);
        }
        this.browser = null;
        this.page = null;
      }
      
      throw new Error(`WhatsApp Web başlatılamadı: ${error.message}`);
    }
  }

  private async waitForLogin(): Promise<void> {
    if (!this.page) {
      throw new Error('Sayfa hazır değil');
    }

    try {
      console.log('🔍 Giriş durumu kontrol ediliyor...');
      
      // Önce zaten giriş yapılmış mı kontrol et
      try {
        await this.page.waitForSelector('div[data-testid="chat-list"]', {
          timeout: 3000,
        });
        console.log('✅ Zaten giriş yapılmış!');
        return;
      } catch (e) {
        console.log('⏳ Giriş yapılmamış, QR kod bekleniyor...');
      }

      // QR kod ekranının kaybolmasını bekle (giriş yapıldığını gösterir)
      console.log('📱 QR kod ile giriş yapılması bekleniyor (maksimum 120 saniye)...');
      
      // QR kod ekranının kaybolmasını bekle
      let qrCodeDisappeared = false;
      let attempts = 0;
      const maxAttempts = 120; // 120 saniye (her saniye kontrol)
      
      while (!qrCodeDisappeared && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // 1 saniye bekle
        
        // QR kod var mı kontrol et
        const qrCode = await this.page.$('div[data-ref] canvas');
        const qrCodeAlt = await this.page.$('canvas[aria-label*="QR"]');
        
        if (!qrCode && !qrCodeAlt) {
          // QR kod yok, giriş yapılmış olabilir
          // Chat list'i kontrol et
          try {
            await this.page.waitForSelector('div[data-testid="chat-list"]', {
              timeout: 2000,
            });
            console.log('✅ QR kod kayboldu, chat list görünüyor - Giriş başarılı!');
            qrCodeDisappeared = true;
            break;
          } catch (e) {
            // Chat list henüz yok, devam et
          }
        }
        
        attempts++;
        if (attempts % 10 === 0) {
          console.log(`⏳ Hala bekleniyor... (${attempts}/${maxAttempts} saniye)`);
        }
      }

      if (!qrCodeDisappeared) {
        throw new Error('QR kod ile giriş zaman aşımı');
      }

      // Ek kontrol: Chat list'in görünür olduğundan emin ol
      await this.page.waitForSelector('div[data-testid="chat-list"]', {
        timeout: 10000,
      });
      
      console.log('✅ WhatsApp Web girişi tamamlandı ve hazır!');
    } catch (error: any) {
      console.error('❌ Giriş hatası:', error.message);
      throw new Error(`WhatsApp Web girişi zaman aşımına uğradı. Lütfen QR kod ile giriş yapın. (${error.message})`);
    }
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    if (!this.isReady || !this.page) {
      console.log('⚠️ WhatsApp Web hazır değil, yeniden başlatılıyor...');
      await this.initialize();
    }

    if (!this.page) {
      throw new Error('WhatsApp Web sayfası hazır değil');
    }

    try {
      console.log(`📱 Mesaj gönderiliyor: ${phone}`);
      
      // Telefon numarasını temizle
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      console.log(`📞 Temizlenmiş telefon: ${cleanPhone}`);
      
      // WhatsApp Web URL'i ile direkt mesaj sayfasına git
      const whatsappUrl = `https://web.whatsapp.com/send?phone=${cleanPhone}`;
      console.log(`🌐 WhatsApp URL'ine gidiliyor: ${whatsappUrl}`);
      
      await this.page.goto(whatsappUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      console.log('⏳ Sayfa yükleniyor, bekleniyor...');
      // Sayfanın yüklenmesini bekle
      await new Promise(resolve => setTimeout(resolve, 3000));

      // "Continue to Chat" veya benzeri butonları kontrol et ve tıkla
      try {
        const continueButton = await this.page.$('button[aria-label*="Continue"]');
        if (continueButton) {
          console.log('🔘 "Continue" butonu bulundu, tıklanıyor...');
          await continueButton.click();
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (e) {
        // Buton yoksa devam et
      }

      // Mesaj kutusunun yüklenmesini bekle (farklı selector'ları dene)
      console.log('🔍 Mesaj kutusu aranıyor...');
      let messageBox = null;
      
      // Daha fazla bekleme süresi (sayfa tam yüklensin)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      const selectors = [
        'div[data-testid="conversation-compose-box-input"]',
        'div[contenteditable="true"][data-tab="10"]',
        'div[contenteditable="true"][role="textbox"]',
        'div[contenteditable="true"][data-tab]',
        'div[contenteditable="true"]',
        'p.selectable-text.copyable-text',
        'div[spellcheck="true"]',
        'div[contenteditable="true"][aria-label*="mesaj"]',
        'div[contenteditable="true"][aria-label*="message"]',
        'div[contenteditable="true"][aria-label*="Type"]',
        'div[contenteditable="true"][aria-label*="type"]',
        'div[contenteditable="true"][title*="mesaj"]',
        'div[contenteditable="true"][title*="message"]',
        'div[contenteditable="true"][title*="Type"]',
      ];

      // XPath ile de dene
      const xpathSelectors = [
        '//div[@contenteditable="true" and @role="textbox"]',
        '//div[@contenteditable="true" and @data-tab="10"]',
        '//p[@class="selectable-text copyable-text"]',
      ];

      // Önce normal selector'ları dene
      for (const selector of selectors) {
        try {
          console.log(`  - Deneniyor: ${selector}`);
          await this.page.waitForSelector(selector, { timeout: 8000, visible: true });
          messageBox = await this.page.$(selector);
          if (messageBox) {
            const isVisible = await messageBox.evaluate((el: any) => {
              // In Puppeteer context, window is available in browser context
              // @ts-ignore - window is available in browser context
              const style = window.getComputedStyle(el);
              return style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
            });
            if (isVisible) {
              console.log(`✅ Mesaj kutusu bulundu (görünür): ${selector}`);
              break;
            }
          }
        } catch (e) {
          continue;
        }
      }

      // XPath ile dene
      if (!messageBox) {
        console.log('🔍 XPath ile mesaj kutusu aranıyor...');
        for (const xpath of xpathSelectors) {
          try {
            const elements = await this.page.$x(xpath);
            if (elements.length > 0) {
              messageBox = elements[0];
              console.log(`✅ Mesaj kutusu bulundu (XPath): ${xpath}`);
              break;
            }
          } catch (e) {
            continue;
          }
        }
      }

      // Son çare: Tüm contenteditable elementlerini kontrol et
      if (!messageBox) {
        console.log('🔍 Tüm contenteditable elementleri kontrol ediliyor...');
        const allEditable = await this.page.$$('div[contenteditable="true"]');
        for (const elem of allEditable) {
          const text = await elem.evaluate((el: any) => el.getAttribute('data-tab') || el.getAttribute('role') || '');
          if (text.includes('textbox') || text === '10') {
            messageBox = elem;
            console.log('✅ Mesaj kutusu bulundu (tüm elementler arasından)');
            break;
          }
        }
      }

      if (!messageBox) {
        console.error('❌ Mesaj kutusu bulunamadı!');
        // Sayfa içeriğini logla (debug için)
        const pageContent = await this.page.content();
        console.error('Sayfa içeriği (ilk 1000 karakter):', pageContent.substring(0, 1000));
        throw new Error('Mesaj kutusu bulunamadı');
      }

      // Mesaj kutusuna tıkla ve focus et
      console.log('🖱️ Mesaj kutusuna tıklanıyor ve focus ediliyor...');
      await messageBox.click({ clickCount: 2 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Focus'u garanti et (evaluate ile)
      await messageBox.evaluate((el: any) => el.focus());
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mesaj kutusunun içeriğini kontrol et
      const messageContent = await messageBox.evaluate((el: any) => el.textContent || el.innerText || '');
      console.log(`📝 Mevcut içerik: "${messageContent.substring(0, 50)}..."`);
      
      // Her zaman mesajı yaz (URL'den gelen mesajı kullanma)
      console.log('⌨️ Mesaj yazılıyor...');
      
      // Tüm metni seç ve temizle (Ctrl+A)
      await this.page.keyboard.down('Control');
      await this.page.keyboard.press('a');
      await this.page.keyboard.up('Control');
      await new Promise(resolve => setTimeout(resolve, 500));
      await this.page.keyboard.press('Backspace');
      await new Promise(resolve => setTimeout(resolve, 800));

      // Mesajı yaz (daha yavaş, daha güvenilir)
      console.log(`📝 Mesaj yazılıyor: "${message.substring(0, 50)}..."`);
      await this.page.keyboard.type(message, { delay: 80 });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mesajın yazıldığını kontrol et
      const writtenContent = await messageBox.evaluate((el: any) => el.textContent || el.innerText || '');
      console.log(`✅ Yazılan içerik: "${writtenContent.substring(0, 50)}..."`);
      
      if (!writtenContent.includes(message.substring(0, 20))) {
        console.warn('⚠️ Mesaj düzgün yazılmamış gibi görünüyor, tekrar deneniyor...');
        // Tekrar dene
        await this.page.keyboard.down('Control');
        await this.page.keyboard.press('a');
        await this.page.keyboard.up('Control');
        await new Promise(resolve => setTimeout(resolve, 300));
        await this.page.keyboard.type(message, { delay: 100 });
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Enter tuşuna bas (mesajı gönder)
      console.log('📤 Enter tuşuna basılıyor (mesaj gönderiliyor)...');
      await this.page.keyboard.press('Enter');
      
      // Mesajın gönderildiğini doğrula (5 saniye bekle)
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Mesajın gönderildiğini kontrol et (mesaj kutusunun boşalması)
      const finalContent = await messageBox.evaluate((el: any) => el.textContent || el.innerText || '');
      if (finalContent.trim().length === 0 || finalContent !== writtenContent) {
        console.log('✅ Mesaj kutusu boşaldı - mesaj gönderildi!');
      } else {
        console.warn('⚠️ Mesaj kutusu hala dolu, mesaj gönderilmemiş olabilir');
      }

      console.log(`✅ Mesaj gönderildi: ${phone} - ${message.substring(0, 50)}...`);
      return true;
    } catch (error: any) {
      console.error(`❌ Mesaj gönderme hatası (${phone}):`, error.message);
      console.error('Stack:', error.stack);
      return false;
    }
  }

  async sendBulkMessages(messages: MessageData[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;
    const total = messages.length;

    console.log(`\n🚀 ========== TOPLU MESAJ GÖNDERME BAŞLADI ==========`);
    console.log(`📤 Toplam ${total} mesaj gönderilecek...`);
    console.log(`⏰ Başlangıç zamanı: ${new Date().toLocaleString()}\n`);

    for (let i = 0; i < messages.length; i++) {
      const msgData = messages[i];
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      console.log(`📨 [${i + 1}/${total}] ${msgData.customerName || msgData.phone} için mesaj gönderiliyor...`);
      console.log(`📞 Telefon: ${msgData.phone}`);
      console.log(`💬 Mesaj: ${msgData.message.substring(0, 100)}...`);
      
      try {
        const result = await this.sendMessage(msgData.phone, msgData.message);
        if (result) {
          success++;
          console.log(`✅ [${i + 1}/${total}] BAŞARILI: ${msgData.customerName || msgData.phone}`);
        } else {
          failed++;
          console.log(`❌ [${i + 1}/${total}] BAŞARISIZ: ${msgData.customerName || msgData.phone}`);
        }
      } catch (error: any) {
        failed++;
        console.error(`❌ [${i + 1}/${total}] HATA: ${msgData.customerName || msgData.phone} - ${error.message}`);
      }

      // Her mesaj arasında 3 saniye bekle (rate limiting)
      if (i < messages.length - 1) {
        console.log(`⏳ 3 saniye bekleniyor (rate limiting)...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`📊 ========== TOPLU MESAJ GÖNDERME TAMAMLANDI ==========`);
    console.log(`✅ Başarılı: ${success}`);
    console.log(`❌ Başarısız: ${failed}`);
    console.log(`📈 Toplam: ${total}`);
    console.log(`⏰ Bitiş zamanı: ${new Date().toLocaleString()}`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
    
    return { success, failed };
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
      this.isReady = false;
    }
  }
}

// Singleton instance
let whatsappInstance: WhatsAppAutomation | null = null;

export const getWhatsAppAutomation = (): WhatsAppAutomation => {
  if (!whatsappInstance) {
    whatsappInstance = new WhatsAppAutomation();
  }
  return whatsappInstance;
};

export default WhatsAppAutomation;

