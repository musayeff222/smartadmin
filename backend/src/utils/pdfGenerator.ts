import PDFDocument from 'pdfkit';
import { Subscription } from '../entities/Subscription';
import { PaymentLog } from '../entities/PaymentLog';
import { AppDataSource } from '../data-source';
import { Settings } from '../entities/Settings';
import path from 'path';
import fs from 'fs';

// Unicode karakterleri destekleyen font yolu (sistem fontları kullanılacak)
function getFontPath() {
  // Windows için Arial font yolu
  if (process.platform === 'win32') {
    const arialPath = 'C:/Windows/Fonts/arial.ttf';
    if (fs.existsSync(arialPath)) {
      return arialPath;
    }
    // Alternatif Windows font yolları
    const arialUnicodePath = 'C:/Windows/Fonts/ARIALUNI.TTF';
    if (fs.existsSync(arialUnicodePath)) {
      return arialUnicodePath;
    }
  }
  // Linux için DejaVu Sans font yolu
  const dejaVuPath = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';
  if (fs.existsSync(dejaVuPath)) {
    return dejaVuPath;
  }
  // macOS için Arial font yolu
  if (process.platform === 'darwin') {
    const arialPath = '/System/Library/Fonts/Supplemental/Arial.ttf';
    if (fs.existsSync(arialPath)) {
      return arialPath;
    }
  }
  return null; // Font bulunamazsa varsayılan font kullanılacak
}

export async function generateInvoicePDF(subscription: Subscription): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Settings'den şirket bilgilerini al
      const settingsRepository = AppDataSource.getRepository(Settings);
      const settings = await settingsRepository.findOne({ where: {} });

      const fontPath = getFontPath();
      const doc = new PDFDocument({ 
        margin: 50, 
        size: 'A4',
        autoFirstPage: true,
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Unicode karakterleri desteklemek için font yükle
      let fontFamily = 'Helvetica'; // Varsayılan font
      let boldFontFamily = 'Helvetica-Bold';
      
      if (fontPath) {
        try {
          doc.registerFont('Unicode', fontPath);
          // Bold için ayrı bir font dosyası gerekebilir, şimdilik normal font kullan
          doc.registerFont('Unicode-Bold', fontPath);
          fontFamily = 'Unicode';
          boldFontFamily = 'Unicode-Bold';
        } catch (fontError) {
          console.warn('Font yüklenemedi, varsayılan font kullanılıyor:', fontError);
        }
      }

      // Helper function to safely render text with Unicode support
      const renderText = (text: string, x: number, y: number, options?: any) => {
        try {
          doc.font(fontFamily);
          doc.text(text || '', x, y, options);
        } catch (error) {
          // Fallback to Helvetica if Unicode font fails
          doc.font('Helvetica').text(text || '', x, y, options);
        }
      };

      const renderBoldText = (text: string, x: number, y: number, options?: any) => {
        try {
          doc.font(boldFontFamily);
          doc.text(text || '', x, y, options);
        } catch (error) {
          doc.font('Helvetica-Bold').text(text || '', x, y, options);
        }
      };

      // Header
      doc.fontSize(20);
      renderBoldText(settings?.companyName || 'SmartCafe', 50, 50);
      doc.fontSize(10);
      renderText('FATURA / QƏBZ', 50, 80);
      
      // Şirket bilgileri
      doc.fontSize(9);
      if (settings?.companyDescription) {
        renderText(settings.companyDescription, 50, 100, { width: 200 });
      }
      if (settings?.email) {
        renderText(`Email: ${settings.email}`, 50, 120);
      }
      if (settings?.phone) {
        renderText(`Telefon: ${settings.phone}`, 50, 135);
      }

      // Fatura bilgileri (sağ üst)
      doc.fontSize(10);
      renderBoldText('FATURA MƏLUMATLARI', 350, 50, { align: 'right' });
      doc.fontSize(9);
      renderText(`Fatura №: ${subscription.id.substring(0, 8).toUpperCase()}`, 350, 70, { align: 'right' });
      renderText(`Tarix: ${new Date(subscription.createdAt).toLocaleDateString('az-AZ')}`, 350, 85, { align: 'right' });
      renderText(`Status: ${subscription.paymentStatus === 'paid' ? 'ÖDƏNİB' : 'GÖZLƏYİR'}`, 350, 100, { align: 'right' });

      // Müşteri bilgileri
      doc.fontSize(12);
      renderBoldText('MÜŞTƏRİ MƏLUMATLARI', 50, 180);
      doc.fontSize(10);
      // Manuel müşteri bilgileri varsa onları kullan, yoksa user'dan al
      if (subscription.customerName) {
        renderText(`Ad Soyad: ${subscription.customerName}`, 50, 200);
        if (subscription.customerEmail) {
          renderText(`Email: ${subscription.customerEmail}`, 50, 215);
        }
        if (subscription.customerPhone) {
          renderText(`Telefon: ${subscription.customerPhone}`, 50, 230);
        }
      } else if (subscription.user) {
        renderText(`Ad Soyad: ${subscription.user.firstName} ${subscription.user.lastName}`, 50, 200);
        renderText(`Email: ${subscription.user.email}`, 50, 215);
      }
      
      let yPos = subscription.customerPhone || subscription.user ? 245 : 230;
      
      // Giriş bilgileri (sadece kayıt/not amaçlı)
      if (subscription.customerLogin || subscription.customerPassword) {
        doc.fontSize(10);
        renderBoldText('GİRİŞ MƏLUMATLARI (Yalnız qeyd üçün)', 50, yPos);
        yPos += 15;
        if (subscription.customerLogin) {
          renderText(`Login: ${subscription.customerLogin}`, 50, yPos);
          yPos += 15;
        }
        if (subscription.customerPassword) {
          renderText(`Şifrə: ${subscription.customerPassword}`, 50, yPos);
          yPos += 15;
        }
      }
      
      if (subscription.restaurantName) {
        renderText(`Restoran Adı: ${subscription.restaurantName}`, 50, yPos);
        yPos += 15;
      }
      if (subscription.restaurantAddress) {
        renderText(`Ünvan: ${subscription.restaurantAddress}`, 50, yPos, { width: 300 });
        yPos += 20;
      }

      // Abonelik detayları
      doc.fontSize(12);
      renderBoldText('ABUNƏLİK DƏTALLARI', 50, yPos + 20);
      doc.fontSize(10);
      renderText(`Paket: ${subscription.package.name}`, 50, yPos + 40);
      renderText(`Başlama Tarixi: ${new Date(subscription.startDate).toLocaleDateString('az-AZ')}`, 50, yPos + 55);
      renderText(`Bitmə Tarixi: ${new Date(subscription.endDate).toLocaleDateString('az-AZ')}`, 50, yPos + 70);
      renderText(`Müddət: ${subscription.durationMonths} ay`, 50, yPos + 85);
      renderText(`Ödəniş Növü: ${subscription.paymentType === 'monthly' ? 'Aylıq' : 'Bir dəfəlik'}`, 50, yPos + 100);
      renderText(`Status: ${subscription.status === 'active' ? 'Aktiv' : subscription.status === 'expired' ? 'Müddəti Bitib' : 'Ləğv Edilib'}`, 50, yPos + 115);

      // Notlar
      let notesYPos = yPos + 140;
      if (subscription.notes) {
        doc.fontSize(10);
        renderBoldText('QEYDLƏR:', 50, notesYPos);
        doc.fontSize(9);
        renderText(subscription.notes, 50, notesYPos + 15, { width: 500 });
        notesYPos += 30;
      }

      // Toplam tutar (alt kısım)
      const yPosition = notesYPos + 20;
      doc.rect(50, yPosition, 495, 80).stroke();
      doc.fontSize(14);
      renderBoldText('ÜMUMİ MƏBLƏĞ', 350, yPosition + 20, { align: 'right' });
      doc.fontSize(20);
      renderBoldText(`${Number(subscription.amount).toFixed(2)} AZN`, 350, yPosition + 40, { align: 'right' });
      
      doc.fontSize(10);
      if (subscription.paymentStatus === 'paid') {
        doc.fillColor('green');
        renderText('✓ ÖDƏNİB', 350, yPosition + 65, { align: 'right' });
        doc.fillColor('black');
      } else {
        doc.fillColor('red');
        renderText('ÖDƏNİŞ GÖZLƏYİR', 350, yPosition + 65, { align: 'right' });
        doc.fillColor('black');
      }

      // Aylık ödeme detayları (eğer varsa)
      if (subscription.paymentType === 'monthly' && subscription.paymentLogs && subscription.paymentLogs.length > 0) {
        let paymentYPos = yPosition + 100;
        doc.fontSize(10);
        renderBoldText('AYLIQ ÖDƏNİŞ PLANI', 50, paymentYPos);
        doc.fontSize(9);
        
        const paidCount = subscription.paymentLogs.filter((p: any) => p.status === 'paid').length;
        const totalCount = subscription.paymentLogs.length;
        const paidAmount = subscription.paymentLogs
          .filter((p: any) => p.status === 'paid')
          .reduce((sum: number, p: any) => sum + Number(p.amount), 0);
        const remainingAmount = Number(subscription.amount) - paidAmount;

        renderText(`Ödənilmiş: ${paidCount}/${totalCount} ay`, 50, paymentYPos + 20);
        renderText(`Ödənilmiş Məbləğ: ${paidAmount.toFixed(2)} AZN`, 50, paymentYPos + 35);
        renderText(`Qalan Borc: ${remainingAmount.toFixed(2)} AZN`, 50, paymentYPos + 50);
      }

      // Footer
      doc.fontSize(8);
      doc.fillColor('gray');
      renderText('Bu sənəd elektron mühitdə yaradılmışdır.', 50, 750, { align: 'center' });
      doc.fillColor('black');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Tek bir ödeme için PDF oluştur
export async function generatePaymentInvoicePDF(subscription: Subscription, paymentLog: PaymentLog): Promise<Buffer> {
  return new Promise(async (resolve, reject) => {
    try {
      // Settings'den şirket bilgilerini al
      const settingsRepository = AppDataSource.getRepository(Settings);
      const settings = await settingsRepository.findOne({ where: {} });

      const fontPath = getFontPath();
      const doc = new PDFDocument({ 
        margin: 50, 
        size: 'A4',
        autoFirstPage: true,
      });
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);

      // Unicode karakterleri desteklemek için font yükle
      let fontFamily = 'Helvetica';
      let boldFontFamily = 'Helvetica-Bold';
      
      if (fontPath) {
        try {
          doc.registerFont('Unicode', fontPath);
          doc.registerFont('Unicode-Bold', fontPath);
          fontFamily = 'Unicode';
          boldFontFamily = 'Unicode-Bold';
        } catch (fontError) {
          console.warn('Font yüklenemedi, varsayılan font kullanılıyor:', fontError);
        }
      }

      // Helper functions
      const renderText = (text: string, x: number, y: number, options?: any) => {
        try {
          doc.font(fontFamily);
          doc.text(text || '', x, y, options);
        } catch (error) {
          doc.font('Helvetica').text(text || '', x, y, options);
        }
      };

      const renderBoldText = (text: string, x: number, y: number, options?: any) => {
        try {
          doc.font(boldFontFamily);
          doc.text(text || '', x, y, options);
        } catch (error) {
          doc.font('Helvetica-Bold').text(text || '', x, y, options);
        }
      };

      // Ay isimleri
      const getMonthName = (month: number) => {
        const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];
        return months[month - 1] || month.toString();
      };

      // Header
      doc.fontSize(20);
      renderBoldText(settings?.companyName || 'SmartCafe', 50, 50);
      doc.fontSize(10);
      renderText('ÖDƏMƏ FATURASI', 50, 80);
      
      // Şirket bilgileri
      doc.fontSize(9);
      if (settings?.companyDescription) {
        renderText(settings.companyDescription, 50, 100, { width: 200 });
      }
      if (settings?.email) {
        renderText(`Email: ${settings.email}`, 50, 120);
      }
      if (settings?.phone) {
        renderText(`Telefon: ${settings.phone}`, 50, 135);
      }

      // Fatura bilgileri (sağ üst)
      doc.fontSize(10);
      renderBoldText('FATURA MƏLUMATLARI', 350, 50, { align: 'right' });
      doc.fontSize(9);
      renderText(`Fatura №: ${paymentLog.id.substring(0, 8).toUpperCase()}`, 350, 70, { align: 'right' });
      renderText(`Tarix: ${new Date().toLocaleDateString('az-AZ')}`, 350, 85, { align: 'right' });
      renderText(`Status: ${paymentLog.status === 'paid' ? 'ÖDƏNİB' : 'GÖZLƏYİR'}`, 350, 100, { align: 'right' });

      // Müşteri bilgileri
      doc.fontSize(12);
      renderBoldText('MÜŞTƏRİ MƏLUMATLARI', 50, 180);
      doc.fontSize(10);
      if (subscription.customerName) {
        renderText(`Ad Soyad: ${subscription.customerName}`, 50, 200);
        if (subscription.customerEmail) {
          renderText(`Email: ${subscription.customerEmail}`, 50, 215);
        }
        if (subscription.customerPhone) {
          renderText(`Telefon: ${subscription.customerPhone}`, 50, 230);
        }
      } else if (subscription.user) {
        renderText(`Ad Soyad: ${subscription.user.firstName} ${subscription.user.lastName}`, 50, 200);
        renderText(`Email: ${subscription.user.email}`, 50, 215);
      }
      
      let yPos = subscription.customerPhone || subscription.user ? 245 : 230;
      
      if (subscription.restaurantName) {
        renderText(`Restoran Adı: ${subscription.restaurantName}`, 50, yPos);
        yPos += 15;
      }
      if (subscription.restaurantAddress) {
        renderText(`Ünvan: ${subscription.restaurantAddress}`, 50, yPos, { width: 300 });
        yPos += 20;
      }

      // Ödeme detayları
      doc.fontSize(12);
      renderBoldText('ÖDƏMƏ DƏTALLARI', 50, yPos + 20);
      doc.fontSize(10);
      renderText(`Paket: ${subscription.package.name}`, 50, yPos + 40);
      renderText(`Dövr: ${getMonthName(paymentLog.month)} ${paymentLog.year}`, 50, yPos + 55);
      renderText(`Ödəniş Tarixi: ${paymentLog.paymentDate ? new Date(paymentLog.paymentDate).toLocaleDateString('az-AZ') : '-'}`, 50, yPos + 70);
      renderText(`Status: ${paymentLog.status === 'paid' ? 'Ödənib' : paymentLog.status === 'overdue' ? 'Gecikmiş' : 'Gözləyir'}`, 50, yPos + 85);

      // Notlar
      if (paymentLog.notes) {
        let notesYPos = yPos + 100;
        doc.fontSize(10);
        renderBoldText('QEYDLƏR:', 50, notesYPos);
        doc.fontSize(9);
        renderText(paymentLog.notes, 50, notesYPos + 15, { width: 500 });
        notesYPos += 30;
      }

      // Toplam tutar (alt kısım)
      const yPosition = paymentLog.notes ? yPos + 140 : yPos + 100;
      doc.rect(50, yPosition, 495, 80).stroke();
      doc.fontSize(14);
      renderBoldText('ÖDƏMƏ MƏBLƏĞİ', 350, yPosition + 20, { align: 'right' });
      doc.fontSize(20);
      renderBoldText(`${Number(paymentLog.amount).toFixed(2)} AZN`, 350, yPosition + 40, { align: 'right' });
      
      doc.fontSize(10);
      if (paymentLog.status === 'paid') {
        doc.fillColor('green');
        renderText('✓ ÖDƏNİB', 350, yPosition + 65, { align: 'right' });
        doc.fillColor('black');
      } else {
        doc.fillColor('red');
        renderText('ÖDƏNİŞ GÖZLƏYİR', 350, yPosition + 65, { align: 'right' });
        doc.fillColor('black');
      }

      // Footer
      doc.fontSize(8);
      doc.fillColor('gray');
      renderText('Bu sənəd elektron mühitdə yaradılmışdır.', 50, 750, { align: 'center' });
      doc.fillColor('black');

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
