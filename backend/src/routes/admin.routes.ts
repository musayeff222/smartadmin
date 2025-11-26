import { Router } from 'express';
import { authenticate, requireAdmin, requireSuperAdmin, AuthRequest } from '../middleware/auth.middleware';
import { AppDataSource } from '../data-source';
import { MoreThanOrEqual, LessThan, In } from 'typeorm';
import { Package } from '../entities/Package';
import { Subscription, PaymentType, SubscriptionStatus, PaymentStatus } from '../entities/Subscription';
import { PaymentLog, PaymentLogStatus } from '../entities/PaymentLog';
import { ContactMessage } from '../entities/ContactMessage';
import { SiteContent } from '../entities/SiteContent';
import { Settings } from '../entities/Settings';
import { NotificationSubscription } from '../entities/NotificationSubscription';
import { VisitorLog } from '../entities/VisitorLog';
import { User, UserRole } from '../entities/User';
import { AdvertisingCustomer, AdvertisingChannel } from '../entities/AdvertisingCustomer';
import bcrypt from 'bcryptjs';
import webpush from 'web-push';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const router = Router();

// All admin routes require authentication
router.use(authenticate);

// Debug endpoint - kullanıcı bilgilerini göster
router.get('/me', async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        role: req.user.role,
        isActive: req.user.isActive,
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== PACKAGE MANAGEMENT ==========
router.get('/packages', requireAdmin, async (req, res) => {
  try {
    const packageRepository = AppDataSource.getRepository(Package);
    const packages = await packageRepository.find({
      order: { displayOrder: 'ASC' },
    });
    // Features'ı JSON string'den array'e çevir
    const packagesWithParsedFeatures = packages.map(pkg => ({
      ...pkg,
      features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
    }));
    res.json({ packages: packagesWithParsedFeatures });
  } catch (error) {
    console.error('Get packages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/packages', requireAdmin, async (req, res) => {
  try {
    const { name, description, features, price, price1Month, price6Months, price12Months, duration, displayOrder, isActive } = req.body;
    
    // Validation
    if (!name || !description) {
      return res.status(400).json({ message: 'Ad ve açıklama zorunludur' });
    }
    
    if (!price || isNaN(price) || price <= 0) {
      return res.status(400).json({ message: 'Geçerli bir fiyat giriniz' });
    }
    
    if (!duration || isNaN(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Geçerli bir süre giriniz (gün cinsinden)' });
    }
    
    const packageRepository = AppDataSource.getRepository(Package);
    
    // Features'ı JSON string'e çevir
    let featuresString = JSON.stringify([]);
    if (Array.isArray(features) && features.length > 0) {
      featuresString = JSON.stringify(features);
    } else if (typeof features === 'string' && features.trim()) {
      // Eğer string olarak geliyorsa (satır satır), array'e çevir
      const featuresArray = features.split('\n').filter((f: string) => f.trim());
      featuresString = JSON.stringify(featuresArray);
    }
    
    const pkg = packageRepository.create({
      name: name.trim(),
      description: description.trim(),
      features: featuresString,
      price: parseFloat(price),
      price1Month: price1Month ? parseFloat(price1Month) : null,
      price6Months: price6Months ? parseFloat(price6Months) : null,
      price12Months: price12Months ? parseFloat(price12Months) : null,
      duration: parseInt(duration),
      displayOrder: displayOrder ? parseInt(displayOrder) : 0,
      isActive: isActive !== undefined ? isActive : true,
    });
    
    await packageRepository.save(pkg);
    
    // Response'da features'ı array olarak döndür
    const packageWithParsedFeatures = {
      ...pkg,
      features: JSON.parse(pkg.features)
    };
    
    res.status(201).json({ package: packageWithParsedFeatures });
  } catch (error: any) {
    console.error('Create package error:', error);
    const errorMessage = error.message || 'Paket oluşturulurken bir hata oluştu';
    res.status(500).json({ message: errorMessage });
  }
});

router.put('/packages/:id', requireAdmin, async (req, res) => {
  try {
    const { name, description, features, price, price1Month, price6Months, price12Months, duration, displayOrder, isActive } = req.body;
    const packageRepository = AppDataSource.getRepository(Package);
    const pkg = await packageRepository.findOne({ where: { id: req.params.id } });
    
    if (!pkg) {
      return res.status(404).json({ message: 'Paket bulunamadı' });
    }
    
    // Validation
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ message: 'Ad boş olamaz' });
    }
    
    if (description !== undefined && !description.trim()) {
      return res.status(400).json({ message: 'Açıklama boş olamaz' });
    }
    
    if (price !== undefined && (isNaN(price) || price <= 0)) {
      return res.status(400).json({ message: 'Geçerli bir fiyat giriniz' });
    }
    
    if (duration !== undefined && (isNaN(duration) || duration <= 0)) {
      return res.status(400).json({ message: 'Geçerli bir süre giriniz (gün cinsinden)' });
    }
    
    // Features'ı JSON string'e çevir
    if (features !== undefined) {
      let featuresString = JSON.stringify([]);
      if (Array.isArray(features) && features.length > 0) {
        featuresString = JSON.stringify(features);
      } else if (typeof features === 'string' && features.trim()) {
        const featuresArray = features.split('\n').filter((f: string) => f.trim());
        featuresString = JSON.stringify(featuresArray);
      }
      pkg.features = featuresString;
    }
    
    // Diğer alanları güncelle
    if (name !== undefined) pkg.name = name.trim();
    if (description !== undefined) pkg.description = description.trim();
    if (price !== undefined) pkg.price = parseFloat(price);
    if (price1Month !== undefined) pkg.price1Month = price1Month ? parseFloat(price1Month) : null;
    if (price6Months !== undefined) pkg.price6Months = price6Months ? parseFloat(price6Months) : null;
    if (price12Months !== undefined) pkg.price12Months = price12Months ? parseFloat(price12Months) : null;
    if (duration !== undefined) pkg.duration = parseInt(duration);
    if (displayOrder !== undefined) pkg.displayOrder = parseInt(displayOrder);
    if (isActive !== undefined) pkg.isActive = isActive;
    
    await packageRepository.save(pkg);
    
    // Response'da features'ı array olarak döndür
    const packageWithParsedFeatures = {
      ...pkg,
      features: JSON.parse(pkg.features)
    };
    
    res.json({ package: packageWithParsedFeatures });
  } catch (error: any) {
    console.error('Update package error:', error);
    const errorMessage = error.message || 'Paket güncellenirken bir hata oluştu';
    res.status(500).json({ message: errorMessage });
  }
});

router.post('/packages/create-demo', requireAdmin, async (req, res) => {
  try {
    const packageRepository = AppDataSource.getRepository(Package);
    
    // Demo paket oluştur
    const demoPackage = packageRepository.create({
      name: 'Demo Paket',
      description: 'Bu bir demo pakettir. Restoran yönetimi için temel özellikler içerir.',
      features: JSON.stringify([
        'Sınırsız ürün yönetimi',
        'Masa rezervasyon sistemi',
        'Temel raporlama',
        'Mobil uyumlu arayüz',
        'Email desteği',
        'Aylık güncellemeler'
      ]),
      price: 99.99, // Aylık fiyat
      price1Month: 99.99, // 1 ay için özel fiyat
      price6Months: 549.99, // 6 ay için özel fiyat (yaklaşık %8 indirim)
      price12Months: 999.99, // 12 ay için özel fiyat (yaklaşık %17 indirim)
      duration: 30, // 30 gün
      displayOrder: 0,
      isActive: true,
    });

    await packageRepository.save(demoPackage);
    
    // Response'da features'ı array olarak döndür
    const packageWithParsedFeatures = {
      ...demoPackage,
      features: JSON.parse(demoPackage.features)
    };
    
    res.status(201).json({ package: packageWithParsedFeatures });
  } catch (error: any) {
    console.error('Create demo package error:', error);
    const errorMessage = error.message || 'Demo paket oluşturulurken bir hata oluştu';
    res.status(500).json({ message: errorMessage });
  }
});

router.delete('/packages/:id', requireAdmin, async (req, res) => {
  try {
    const packageRepository = AppDataSource.getRepository(Package);
    const result = await packageRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json({ message: 'Package deleted successfully' });
  } catch (error) {
    console.error('Delete package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== SUBSCRIPTION MANAGEMENT ==========
router.get('/subscriptions', requireAdmin, async (req, res) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscriptions = await subscriptionRepository.find({
      relations: ['user', 'package', 'paymentLogs'],
      order: { createdAt: 'DESC' },
    });
    res.json({ subscriptions });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/subscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'package', 'paymentLogs'],
    });
    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }
    res.json({ subscription });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Create 10 demo subscriptions
router.post('/subscriptions/create-demo', requireAdmin, async (req, res) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);
    const packageRepository = AppDataSource.getRepository(Package);

    // Aktif paketleri al
    const packages = await packageRepository.find({ where: { isActive: true } });
    if (packages.length === 0) {
      return res.status(400).json({ message: 'Aktif paket bulunamadı. Önce paket oluşturun.' });
    }

    const demoData = [
      { customerId: '10001', customerName: 'Ahmet Yılmaz', customerEmail: 'ahmet@example.com', customerPhone: '+994501234567', restaurantName: 'Lezzet Durağı', restaurantAddress: 'Bakü, Nizami Caddesi No:15' },
      { customerId: '10002', customerName: 'Ayşe Demir', customerEmail: 'ayse@example.com', customerPhone: '+994501234568', restaurantName: 'Tadım Restoran', restaurantAddress: 'Bakü, Füzuli Caddesi No:42' },
      { customerId: '10003', customerName: 'Mehmet Kaya', customerEmail: 'mehmet@example.com', customerPhone: '+994501234569', restaurantName: 'Gurme Sofrası', restaurantAddress: 'Bakü, İstiqlaliyyet Caddesi No:78' },
      { customerId: '10004', customerName: 'Fatma Şahin', customerEmail: 'fatma@example.com', customerPhone: '+994501234570', restaurantName: 'Nefis Köşk', restaurantAddress: 'Bakü, Torgovaya Caddesi No:23' },
      { customerId: '10005', customerName: 'Ali Öztürk', customerEmail: 'ali@example.com', customerPhone: '+994501234571', restaurantName: 'Zevk Lokantası', restaurantAddress: 'Bakü, Bulvar Caddesi No:56' },
      { customerId: '10006', customerName: 'Zeynep Arslan', customerEmail: 'zeynep@example.com', customerPhone: '+994501234572', restaurantName: 'Lezzet Bahçesi', restaurantAddress: 'Bakü, Rasulzade Caddesi No:89' },
      { customerId: '10007', customerName: 'Mustafa Çelik', customerEmail: 'mustafa@example.com', customerPhone: '+994501234573', restaurantName: 'Tatlı Köşk', restaurantAddress: 'Bakü, Azadlıq Caddesi No:12' },
      { customerId: '10008', customerName: 'Elif Yıldız', customerEmail: 'elif@example.com', customerPhone: '+994501234574', restaurantName: 'Güzel Sofra', restaurantAddress: 'Bakü, Nəsimi Caddesi No:34' },
      { customerId: '10009', customerName: 'Can Aydın', customerEmail: 'can@example.com', customerPhone: '+994501234575', restaurantName: 'Mükemmel Restoran', restaurantAddress: 'Bakü, Xətai Caddesi No:67' },
      { customerId: '10010', customerName: 'Selin Özkan', customerEmail: 'selin@example.com', customerPhone: '+994501234576', restaurantName: 'Harika Lezzet', restaurantAddress: 'Bakü, Səbail Caddesi No:90' },
    ];

    const createdSubscriptions = [];

    for (const demo of demoData) {
      // Rastgele bir paket seç
      const randomPackage = packages[Math.floor(Math.random() * packages.length)];
      const packagePrice = typeof randomPackage.price === 'string' ? parseFloat(randomPackage.price) : randomPackage.price;
      
      // Rastgele süre (1, 3, 6, 12 ay)
      const durations = [1, 3, 6, 12];
      const durationMonths = durations[Math.floor(Math.random() * durations.length)];
      
      // Rastgele ödeme türü
      const paymentTypes = [PaymentType.ONE_TIME, PaymentType.MONTHLY];
      const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
      
      // Başlangıç tarihi (bugünden itibaren rastgele 0-30 gün arası)
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
      
      // Bitiş tarihi
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + durationMonths);
      
      // Toplam tutar
      const amount = packagePrice * durationMonths;
      
      // Abonelik oluştur
      const subscription = subscriptionRepository.create({
        userId: null,
        packageId: randomPackage.id,
        customerId: demo.customerId,
        customerName: demo.customerName,
        customerEmail: demo.customerEmail,
        customerPhone: demo.customerPhone,
        customerLogin: `user${demo.customerId}`,
        customerPassword: `pass${demo.customerId}`,
        restaurantName: demo.restaurantName,
        restaurantAddress: demo.restaurantAddress,
        durationMonths,
        paymentType,
        startDate,
        endDate,
        amount,
        status: SubscriptionStatus.ACTIVE,
        paymentStatus: Math.random() > 0.5 ? PaymentStatus.PAID : PaymentStatus.PENDING,
        notes: 'Demo abonelik',
      });

      const savedSubscription = await subscriptionRepository.save(subscription);

      // Aylık ödeme ise payment logları oluştur
      if (paymentType === PaymentType.MONTHLY) {
        const paymentLogs = [];
        for (let month = 1; month <= durationMonths; month++) {
          const paymentDate = new Date(startDate);
          paymentDate.setMonth(paymentDate.getMonth() + month - 1);
          
          const isPaid = Math.random() > 0.3; // %70 ihtimalle ödenmiş
          
          const paymentLog = paymentLogRepository.create({
            subscriptionId: savedSubscription.id,
            amount: packagePrice,
            month,
            year: paymentDate.getFullYear(),
            status: isPaid ? PaymentLogStatus.PAID : PaymentLogStatus.PENDING,
            paymentDate: isPaid ? paymentDate : null,
          });
          
          paymentLogs.push(paymentLog);
        }
        await paymentLogRepository.save(paymentLogs);
      }

      createdSubscriptions.push(savedSubscription);
    }

    res.json({ 
      message: '10 demo abonelik başarıyla oluşturuldu',
      count: createdSubscriptions.length
    });
  } catch (error) {
    console.error('Create demo subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/subscriptions', requireAdmin, async (req, res) => {
  try {
    const { 
      // Müşteri bilgileri (manuel)
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerLogin,
      customerPassword,
      // Paket ve süre
      packageId, 
      durationMonths, // Kaç ay (1, 3, 6, 12)
      // Restoran bilgileri
      restaurantName, 
      restaurantAddress,
      // Tarihler
      startDate, 
      // Ödeme bilgileri
      paymentType, // 'one_time' veya 'monthly'
      amount, // Toplam tutar
      notes,
      paymentStatus 
    } = req.body;

    if (!packageId || !startDate || !amount || !durationMonths) {
      return res.status(400).json({ message: 'Gerekli alanlar eksik (packageId, startDate, amount, durationMonths)' });
    }

    // Müşteri bilgileri opsiyonel (sadece kayıt/not amaçlı)

    // Paket bilgilerini al
    const packageRepository = AppDataSource.getRepository(Package);
    const packageData = await packageRepository.findOne({ where: { id: packageId } });
    if (!packageData) {
      return res.status(404).json({ message: 'Paket bulunamadı' });
    }

    // Bitiş tarihini hesapla
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + parseInt(durationMonths));

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);

    // CustomerId validasyonu (5 rakamlı, sadece sayılar)
    if (customerId && (!/^\d{5}$/.test(customerId))) {
      return res.status(400).json({ message: 'Müşteri ID 5 rakamlı olmalıdır (sadece sayılar)' });
    }

    // Abonelik oluştur
    const subscription = subscriptionRepository.create({
      userId: null, // Manuel müşteri için userId null
      packageId,
      customerId: customerId?.trim() || null,
      customerName: customerName?.trim() || null,
      customerEmail: customerEmail?.trim() || null,
      customerPhone: customerPhone?.trim() || null,
      customerLogin: customerLogin?.trim() || null,
      customerPassword: customerPassword?.trim() || null,
      restaurantName: restaurantName?.trim() || null,
      restaurantAddress: restaurantAddress?.trim() || null,
      durationMonths: parseInt(durationMonths),
      paymentType: paymentType || PaymentType.ONE_TIME,
      startDate: start,
      endDate: end,
      amount: parseFloat(amount),
      notes: notes?.trim() || null,
      paymentStatus: paymentStatus || 'pending',
      status: 'active',
    });
    
    const savedSubscription = await subscriptionRepository.save(subscription);
    
    // Eğer aylık ödeme ise, ödeme planı oluştur
    if (paymentType === PaymentType.MONTHLY) {
      const monthlyAmount = parseFloat(amount) / parseInt(durationMonths);
      const paymentLogs: PaymentLog[] = [];

      for (let i = 0; i < parseInt(durationMonths); i++) {
        const paymentDate = new Date(start);
        paymentDate.setMonth(paymentDate.getMonth() + i);
        
        const paymentLog = paymentLogRepository.create({
          subscriptionId: savedSubscription.id,
          amount: monthlyAmount,
          month: paymentDate.getMonth() + 1, // 1-12
          year: paymentDate.getFullYear(),
          status: PaymentLogStatus.PENDING,
          notes: `${i + 1}. ay ödemesi`,
        });
        
        paymentLogs.push(paymentLog);
      }

      await paymentLogRepository.save(paymentLogs);
    }
    
    // Relations ile birlikte döndür
    const subscriptionWithRelations = await subscriptionRepository.findOne({
      where: { id: savedSubscription.id },
      relations: ['user', 'package', 'paymentLogs'],
    });
    
    res.status(201).json({ subscription: subscriptionWithRelations });
  } catch (error: any) {
    console.error('Create subscription error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.put('/subscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      customerLogin,
      customerPassword,
      restaurantName,
      restaurantAddress,
      startDate,
      endDate,
      amount,
      notes,
      paymentStatus,
      status,
    } = req.body;

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'package'],
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    // CustomerId validasyonu (5 rakamlı, sadece sayılar)
    if (customerId !== undefined) {
      if (customerId && (!/^\d{5}$/.test(customerId))) {
        return res.status(400).json({ message: 'Müşteri ID 5 rakamlı olmalıdır (sadece sayılar)' });
      }
      subscription.customerId = customerId?.trim() || null;
    }

    if (customerName !== undefined) subscription.customerName = customerName?.trim() || null;
    if (customerEmail !== undefined) subscription.customerEmail = customerEmail?.trim() || null;
    if (customerPhone !== undefined) subscription.customerPhone = customerPhone?.trim() || null;
    if (customerLogin !== undefined) subscription.customerLogin = customerLogin?.trim() || null;
    if (customerPassword !== undefined) subscription.customerPassword = customerPassword?.trim() || null;
    if (restaurantName !== undefined) subscription.restaurantName = restaurantName;
    if (restaurantAddress !== undefined) subscription.restaurantAddress = restaurantAddress;
    if (startDate) subscription.startDate = new Date(startDate);
    if (endDate) subscription.endDate = new Date(endDate);
    if (amount !== undefined) subscription.amount = parseFloat(amount);
    if (notes !== undefined) subscription.notes = notes;
    if (paymentStatus) subscription.paymentStatus = paymentStatus;
    if (status) subscription.status = status;

    await subscriptionRepository.save(subscription);
    
    const updatedSubscription = await subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'package'],
    });

    res.json({ subscription: updatedSubscription });
  } catch (error: any) {
    console.error('Update subscription error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.delete('/subscriptions/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);
    
    const subscription = await subscriptionRepository.findOne({ 
      where: { id },
      relations: ['paymentLogs']
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    // Önce ilişkili payment logları sil
    if (subscription.paymentLogs && subscription.paymentLogs.length > 0) {
      await paymentLogRepository.remove(subscription.paymentLogs);
    }

    // Sonra aboneliği sil
    await subscriptionRepository.remove(subscription);
    res.json({ message: 'Abonelik başarıyla silindi' });
  } catch (error: any) {
    console.error('Delete subscription error:', error);
    res.status(500).json({ 
      message: 'Abonelik silinirken hata oluştu',
      error: error.message 
    });
  }
});

// Ödeme logunu güncelle (aylık ödeme için)
router.put('/subscriptions/:id/payments/:paymentId', requireAdmin, async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const { status, paymentDate, notes } = req.body;

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({ where: { id } });
    
    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);
    const paymentLog = await paymentLogRepository.findOne({
      where: { id: paymentId, subscriptionId: id },
    });

    if (!paymentLog) {
      return res.status(404).json({ message: 'Ödeme kaydı bulunamadı' });
    }

    if (status) paymentLog.status = status;
    if (paymentDate) paymentLog.paymentDate = new Date(paymentDate);
    if (notes !== undefined) paymentLog.notes = notes;

    await paymentLogRepository.save(paymentLog);

    // Tüm ödemeler ödendiyse, aboneliğin genel durumunu güncelle
    const allPayments = await paymentLogRepository.find({ where: { subscriptionId: id } });
    const allPaid = allPayments.every((p) => p.status === PaymentLogStatus.PAID);
    if (allPaid) {
      subscription.paymentStatus = 'paid';
      await subscriptionRepository.save(subscription);
    }

    const updatedPaymentLog = await paymentLogRepository.findOne({
      where: { id: paymentId },
      relations: ['subscription'],
    });

    res.json({ paymentLog: updatedPaymentLog });
  } catch (error: any) {
    console.error('Update payment log error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// PDF Fatura oluştur
router.get('/subscriptions/:id/invoice', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'package', 'paymentLogs'],
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    const pdfBuffer = await generateInvoicePDF(subscription);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fatura-${subscription.id.substring(0, 8)}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ message: 'PDF oluşturulurken hata oluştu', error: error.message });
  }
});

// Tek bir ödeme için PDF Fatura oluştur
router.get('/subscriptions/:id/payments/:paymentId/invoice', requireAdmin, async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { id },
      relations: ['user', 'package'],
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);
    const paymentLog = await paymentLogRepository.findOne({
      where: { id: paymentId, subscriptionId: id },
    });

    if (!paymentLog) {
      return res.status(404).json({ message: 'Ödeme kaydı bulunamadı' });
    }

    const { generatePaymentInvoicePDF } = await import('../utils/pdfGenerator');
    const pdfBuffer = await generatePaymentInvoicePDF(subscription, paymentLog);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=odeme-faturasi-${paymentLog.id.substring(0, 8)}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Generate payment invoice error:', error);
    res.status(500).json({ message: 'PDF oluşturulurken hata oluştu', error: error.message });
  }
});

// ========== CONTACT MESSAGES ==========
router.get('/contact-messages', requireAdmin, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const messages = await contactRepository.find({
      order: { createdAt: 'DESC' },
    });
    res.json({ messages });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/contact-messages/:id/reply', requireAdmin, async (req, res) => {
  try {
    const { reply } = req.body;
    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const message = await contactRepository.findOne({ where: { id: req.params.id } });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    message.reply = reply;
    message.status = 'replied';
    message.repliedBy = (req as AuthRequest).user!.id;
    await contactRepository.save(message);
    res.json({ message });
  } catch (error) {
    console.error('Reply message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/contact-messages/:id/read', requireAdmin, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const message = await contactRepository.findOne({ where: { id: req.params.id } });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    if (message.status === 'new') {
      message.status = 'read';
      await contactRepository.save(message);
    }
    res.json({ message });
  } catch (error) {
    console.error('Mark message as read error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/contact-messages/:id', requireAdmin, async (req, res) => {
  try {
    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const result = await contactRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Mesaj bulunamadı' });
    }
    res.json({ message: 'Mesaj başarıyla silindi' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== SITE CONTENT MANAGEMENT ==========
router.get('/contents', requireAdmin, async (req, res) => {
  try {
    const contentRepository = AppDataSource.getRepository(SiteContent);
    const contents = await contentRepository.find();
    res.json({ contents });
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/contents', requireAdmin, async (req, res) => {
  try {
    const { key, content, type } = req.body;
    const contentRepository = AppDataSource.getRepository(SiteContent);
    const siteContent = contentRepository.create({ key, content, type });
    await contentRepository.save(siteContent);
    res.status(201).json({ content: siteContent });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/contents/:id', requireAdmin, async (req, res) => {
  try {
    const contentRepository = AppDataSource.getRepository(SiteContent);
    const content = await contentRepository.findOne({ where: { id: req.params.id } });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    Object.assign(content, req.body);
    await contentRepository.save(content);
    res.json({ content });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== STATISTICS ==========
router.get('/statistics', requireAdmin, async (req, res) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const packageRepository = AppDataSource.getRepository(Package);
    const userRepository = AppDataSource.getRepository(User);
    const visitorLogRepository = AppDataSource.getRepository(VisitorLog);
    const paymentLogRepository = AppDataSource.getRepository(PaymentLog);

    // Bugünün başlangıcı
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // 3 gün sonra
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysLaterEnd = new Date(threeDaysLater);
    threeDaysLaterEnd.setDate(threeDaysLaterEnd.getDate() + 1);
    
    // Bu ayın başlangıcı ve sonu
    const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currentMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);

    const [
      totalSubscriptions,
      activeSubscriptions,
      totalMessages,
      newMessages,
      totalPackages,
      totalUsers,
      todayVisitors,
    ] = await Promise.all([
      subscriptionRepository.count(),
      subscriptionRepository.count({ where: { status: 'active' } }),
      contactRepository.count(),
      contactRepository.count({ where: { status: 'new' } }),
      packageRepository.count({ where: { isActive: true } }),
      userRepository.count(),
      visitorLogRepository
        .createQueryBuilder('visitor')
        .where('visitor.createdAt >= :today', { today })
        .andWhere('visitor.createdAt < :tomorrow', { tomorrow })
        .getCount(),
    ]);

    // Ödeme istatistikleri
    // Bugün ödeme yapan kişiler (paymentDate bugün olan ve status='paid')
    const todayPaidPayments = await paymentLogRepository.find({
      where: {
        status: PaymentLogStatus.PAID,
        paymentDate: MoreThanOrEqual(today),
      },
      relations: ['subscription'],
    });
    const todayPaidFiltered = todayPaidPayments.filter(p => {
      const paymentDate = new Date(p.paymentDate!);
      return paymentDate >= today && paymentDate < tomorrow;
    });
    const todayPaidCount = todayPaidFiltered.length;
    const todayPaidCustomers = todayPaidFiltered.map(p => ({
      subscriptionId: p.subscriptionId,
      customerId: p.subscription.customerId,
      customerName: p.subscription.customerName || p.subscription.user?.firstName + ' ' + p.subscription.user?.lastName || 'Bilinmeyen',
      restaurantName: p.subscription.restaurantName,
      amount: parseFloat(p.amount.toString()),
      paymentDate: p.paymentDate,
    }));

    // Aktif abonelikleri ve payment loglarını al
    const activeSubs = await subscriptionRepository.find({
      where: { status: SubscriptionStatus.ACTIVE },
      relations: ['paymentLogs', 'user', 'package'],
    });

    // Bugün ödeme yapacak olan kişiler
    const todayDueCustomers: any[] = [];
    // 3 gün sonra ödeme yapacak olan kişiler
    const threeDaysDueCustomers: any[] = [];
    // Bu ay toplam alınacak ödemeler
    let monthlyTotalAmount = 0;
    const monthlyCustomers: any[] = [];

    for (const sub of activeSubs) {
      if (sub.paymentType === PaymentType.MONTHLY && sub.paymentLogs) {
        for (const paymentLog of sub.paymentLogs) {
          if (paymentLog.status === PaymentLogStatus.PENDING) {
            // Ödeme tarihini hesapla (subscription startDate'inden itibaren)
            // paymentLog.month ve year takvim ayını gösteriyor
            const startDate = new Date(sub.startDate);
            const paymentDueDate = new Date(paymentLog.year, paymentLog.month - 1, startDate.getDate());
            
            const customerInfo = {
              subscriptionId: sub.id,
              customerId: sub.customerId,
              customerName: sub.customerName || (sub.user ? `${sub.user.firstName} ${sub.user.lastName}` : 'Bilinmeyen'),
              restaurantName: sub.restaurantName,
              amount: parseFloat(paymentLog.amount.toString()),
              dueDate: paymentDueDate,
            };
            
            // Bugün ödeme yapacak olanlar
            if (paymentDueDate >= today && paymentDueDate < tomorrow) {
              todayDueCustomers.push(customerInfo);
            }
            
            // 3 gün sonra ödeme yapacak olanlar
            if (paymentDueDate >= threeDaysLater && paymentDueDate < threeDaysLaterEnd) {
              threeDaysDueCustomers.push(customerInfo);
            }
            
            // Bu ay içinde ödeme yapacak olanlar
            if (paymentDueDate >= currentMonthStart && paymentDueDate <= currentMonthEnd) {
              monthlyTotalAmount += parseFloat(paymentLog.amount.toString());
              monthlyCustomers.push(customerInfo);
            }
          }
        }
      }
    }

    res.json({
      statistics: {
        totalSubscriptions,
        activeSubscriptions,
        totalMessages,
        newMessages,
        totalPackages,
        totalUsers,
        todayVisitors,
        // Ödeme istatistikleri
        todayPaidCount, // Bugün ödeme yapan kişiler
        todayPaidCustomers, // Bugün ödeme yapan kişiler listesi
        todayDueCount: todayDueCustomers.length, // Bugün ödeme yapacak olan kişiler
        todayDueCustomers, // Bugün ödeme yapacak olan kişiler listesi
        threeDaysDueCount: threeDaysDueCustomers.length, // 3 gün sonra ödeme yapacak olan kişiler
        threeDaysDueCustomers, // 3 gün sonra ödeme yapacak olan kişiler listesi
        monthlyTotalAmount: parseFloat(monthlyTotalAmount.toFixed(2)), // Bu ay toplam alınacak ödemeler
        monthlyCustomers, // Bu ay ödeme yapacak olan kişiler listesi
      },
    });
  } catch (error) {
    console.error('Get statistics error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get today's visitors with times
router.get('/visitors/today', requireAdmin, async (req, res) => {
  try {
    const visitorLogRepository = AppDataSource.getRepository(VisitorLog);

    // Bugünün başlangıcı
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const visitors = await visitorLogRepository
      .createQueryBuilder('visitor')
      .where('visitor.createdAt >= :today', { today })
      .andWhere('visitor.createdAt < :tomorrow', { tomorrow })
      .orderBy('visitor.createdAt', 'DESC')
      .getMany();

    // Benzersiz cihaz sayısı
    const uniqueDevices = new Set(visitors.map(v => v.deviceId)).size;

    // Her ziyaretçi için daha önce giriş yapıp yapmadığını kontrol et
    const visitorsWithStatus = await Promise.all(
      visitors.map(async (v) => {
        if (!v.deviceId) {
          return {
            id: v.id,
            ipAddress: v.ipAddress,
            userAgent: v.userAgent,
            deviceId: v.deviceId,
            path: v.path,
            createdAt: v.createdAt,
            isNewVisitor: true, // deviceId yoksa yeni say
          };
        }

        // Bugünden önce aynı deviceId ile giriş var mı?
        const previousVisit = await visitorLogRepository.findOne({
          where: {
            deviceId: v.deviceId,
            createdAt: LessThan(today),
          },
        });

        return {
          id: v.id,
          ipAddress: v.ipAddress,
          userAgent: v.userAgent,
          deviceId: v.deviceId,
          path: v.path,
          createdAt: v.createdAt,
          isNewVisitor: !previousVisit, // Daha önce giriş yoksa yeni ziyaretçi
        };
      })
    );

    res.json({
      visitors: visitorsWithStatus,
      totalVisits: visitors.length,
      uniqueVisitors: uniqueDevices,
    });
  } catch (error) {
    console.error('Get today visitors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a visitor log
router.delete('/visitors/:id', requireAdmin, async (req, res) => {
  try {
    const visitorLogRepository = AppDataSource.getRepository(VisitorLog);
    const { id } = req.params;

    const visitor = await visitorLogRepository.findOne({ where: { id } });
    if (!visitor) {
      return res.status(404).json({ message: 'Ziyaretçi bulunamadı' });
    }

    await visitorLogRepository.remove(visitor);
    res.json({ message: 'Ziyaretçi başarıyla silindi' });
  } catch (error) {
    console.error('Delete visitor error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all today's visitors
router.delete('/visitors/today/all', requireAdmin, async (req, res) => {
  try {
    const visitorLogRepository = AppDataSource.getRepository(VisitorLog);

    // Bugünün başlangıcı
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const result = await visitorLogRepository
      .createQueryBuilder()
      .delete()
      .from(VisitorLog)
      .where('createdAt >= :today', { today })
      .andWhere('createdAt < :tomorrow', { tomorrow })
      .execute();

    res.json({ 
      message: 'Bugünkü tüm ziyaretçiler başarıyla silindi',
      deletedCount: result.affected || 0
    });
  } catch (error) {
    console.error('Delete all today visitors error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== SUPER ADMIN ONLY ==========
// User management
// Get all users (for admin subscription management)
router.get('/users', requireAdmin, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'isActive', 'createdAt'],
    });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/users', requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || UserRole.ADMIN,
    });
    await userRepository.save(user);
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: req.params.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    Object.assign(user, req.body);
    await userRepository.save(user);
    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/users/:id', requireSuperAdmin, async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const result = await userRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== WEB SETTINGS MANAGEMENT ==========
router.get('/settings', requireAdmin, async (req, res) => {
  try {
    const settingsRepository = AppDataSource.getRepository(Settings);
    let settings = await settingsRepository.findOne({ where: {} });
    
    // Eğer settings yoksa, varsayılan bir tane oluştur
    if (!settings) {
      settings = settingsRepository.create({
        companyName: 'SmartCafe',
        companyDescription: 'Restoranlar için modern ve kullanıcı dostu POS çözümü. Sipariş yönetiminden stok takibine kadar her şey tek platformda.',
        email: 'info@posrestaurant.com',
        phone: '+90 (212) 123 45 67',
      });
      await settingsRepository.save(settings);
    }
    
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/settings', requireAdmin, async (req, res) => {
  try {
    const settingsRepository = AppDataSource.getRepository(Settings);
    let settings = await settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Eğer settings yoksa, yeni oluştur
      settings = settingsRepository.create(req.body);
    } else {
      // Mevcut settings'i güncelle
      Object.assign(settings, req.body);
    }
    
    await settingsRepository.save(settings);
    res.json({ settings });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ========== NOTIFICATION MANAGEMENT ==========
router.get('/notifications/subscriptions', requireAdmin, async (req, res) => {
  try {
    const subscriptionRepository = AppDataSource.getRepository(NotificationSubscription);
    const subscriptions = await subscriptionRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
    
    // Debug: VAPID key kontrolü
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    console.log('VAPID Public Key exists:', !!vapidPublicKey);
    console.log('VAPID Private Key exists:', !!vapidPrivateKey);
    console.log('Total active subscriptions:', subscriptions.length);
    
    res.json({ 
      subscriptions,
      debug: {
        vapidConfigured: !!(vapidPublicKey && vapidPrivateKey),
        subscriptionCount: subscriptions.length
      }
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/notifications/send', requireAdmin, async (req, res) => {
  try {
    const { title, message, url, targetSubscriptionId } = req.body;

    if (!title || !message) {
      return res.status(400).json({ message: 'Title and message are required' });
    }

    // VAPID keys kontrolü
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
    const vapidEmail = process.env.VAPID_EMAIL || 'mailto:admin@posrestaurant.com';

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('VAPID keys are missing. Please run: npm run generate-vapid-keys');
      return res.status(500).json({ 
        message: 'VAPID anahtarları yapılandırılmamış. Lütfen backend/.env dosyasına VAPID_PUBLIC_KEY ve VAPID_PRIVATE_KEY ekleyin.',
        error: 'VAPID keys not configured'
      });
    }

    try {
      webpush.setVapidDetails(vapidEmail, vapidPublicKey, vapidPrivateKey);
    } catch (vapidError: any) {
      console.error('VAPID setup error:', vapidError);
      return res.status(500).json({ 
        message: 'VAPID anahtarları geçersiz. Lütfen geçerli VAPID anahtarları oluşturun.',
        error: vapidError.message 
      });
    }

    const subscriptionRepository = AppDataSource.getRepository(NotificationSubscription);
    let subscriptions;

    if (targetSubscriptionId) {
      // Belirli bir aboneye gönder
      const subscription = await subscriptionRepository.findOne({
        where: { id: targetSubscriptionId, isActive: true },
      });
      subscriptions = subscription ? [subscription] : [];
    } else {
      // Tüm aktif abonelere gönder
      subscriptions = await subscriptionRepository.find({
        where: { isActive: true },
      });
    }

    if (subscriptions.length === 0) {
      return res.status(400).json({ 
        message: 'Aktif abone bulunamadı. Lütfen önce bildirim izni veren kullanıcıların olduğundan emin olun.' 
      });
    }

    const payload = JSON.stringify({
      title,
      body: message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      url: url || '/',
    });

    const results = await Promise.allSettled(
      subscriptions.map(async (subscription) => {
        try {
          if (!subscription.p256dh || !subscription.auth) {
            throw new Error('Subscription keys are missing');
          }

          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth,
              },
            },
            payload
          );
          return { success: true, id: subscription.id };
        } catch (error: any) {
          console.error(`Notification send error for subscription ${subscription.id}:`, error);
          // Eğer subscription geçersizse, deaktif et
          if (error.statusCode === 410 || error.statusCode === 404 || error.statusCode === 400) {
            subscription.isActive = false;
            await subscriptionRepository.save(subscription);
          }
          return { 
            success: false, 
            id: subscription.id, 
            error: error.message || 'Unknown error',
            statusCode: error.statusCode 
          };
        }
      })
    );

    const successful = results.filter((r) => r.status === 'fulfilled' && r.value.success).length;
    const failed = results.length - successful;

    res.json({
      message: `Bildirim gönderildi: ${successful} başarılı, ${failed} başarısız`,
      total: subscriptions.length,
      successful,
      failed,
      results: results.map((r) => (r.status === 'fulfilled' ? r.value : { success: false, error: String(r.reason) })),
    });
  } catch (error: any) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      message: 'Bildirim gönderilirken bir hata oluştu',
      error: error.message || 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// ========== ADVERTISING CUSTOMERS MANAGEMENT ==========
// ÖNEMLİ: Özel route'lar parametreli route'lardan ÖNCE olmalı!

// Test WhatsApp automation (Puppeteer kontrolü) - ÖZEL ROUTE
router.get('/advertising-customers/test-automation', requireAdmin, async (req, res) => {
  try {
    // Puppeteer'ın yüklü olup olmadığını kontrol et (farklı yöntemlerle)
    let puppeteerAvailable = false;
    let errorMessage = '';
    
    // Method 1: Dynamic import
    try {
      const puppeteer = await import('puppeteer');
      if (puppeteer && puppeteer.default) {
        puppeteerAvailable = true;
      }
    } catch (e: any) {
      errorMessage = e.message || 'Import hatası';
      console.log('Dynamic import hatası:', e.message);
    }
    
    // Method 2: require (Node.js'te daha güvenilir)
    if (!puppeteerAvailable) {
      try {
        const puppeteer = require('puppeteer');
        if (puppeteer) {
          puppeteerAvailable = true;
        }
      } catch (e: any) {
        errorMessage = e.message || 'Require hatası';
        console.log('Require hatası:', e.message);
      }
    }

    // Method 3: fs ile node_modules kontrolü
    if (!puppeteerAvailable) {
      try {
        const fs = require('fs');
        const path = require('path');
        const puppeteerPath = path.join(__dirname, '../../node_modules/puppeteer');
        if (fs.existsSync(puppeteerPath)) {
          puppeteerAvailable = true;
        }
      } catch (e) {
        // Ignore
      }
    }

    res.json({
      puppeteerInstalled: puppeteerAvailable,
      message: puppeteerAvailable 
        ? '✅ Puppeteer yüklü ve hazır' 
        : `❌ Puppeteer yüklenemedi: ${errorMessage || 'Bilinmeyen hata'}`,
      error: errorMessage || undefined,
    });
  } catch (error: any) {
    console.error('Test automation error:', error);
    res.status(500).json({
      puppeteerInstalled: false,
      error: error.message,
      message: `Hata: ${error.message}`,
    });
  }
});

// Get message templates - ÖZEL ROUTE
router.get('/advertising-customers/message-templates', requireAdmin, async (req, res) => {
  try {
    const settingsRepository = AppDataSource.getRepository(Settings);
    const templatesSetting = await settingsRepository.findOne({ 
      where: { key: 'advertisingMessageTemplates' } 
    });
    
    const templates = templatesSetting 
      ? JSON.parse(templatesSetting.value || '[]')
      : [];
    
    res.json({ templates });
  } catch (error: any) {
    console.error('Get message templates error:', error);
    res.status(500).json({ message: 'Şablonlar yüklenirken bir hata oluştu' });
  }
});

// Save message template - ÖZEL ROUTE
router.post('/advertising-customers/message-templates', requireAdmin, async (req, res) => {
  try {
    const { name, content } = req.body;
    
    if (!name || !content) {
      return res.status(400).json({ message: 'Şablon adı ve içeriği zorunludur' });
    }
    
    const settingsRepository = AppDataSource.getRepository(Settings);
    
    // Get existing templates
    const templatesSetting = await settingsRepository.findOne({ 
      where: { key: 'advertisingMessageTemplates' } 
    });
    
    const templates = templatesSetting 
      ? JSON.parse(templatesSetting.value || '[]')
      : [];
    
    // Add new template
    const newTemplate = {
      id: Date.now().toString(),
      name: name.trim(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    
    templates.push(newTemplate);
    
    // Save templates
    if (templatesSetting) {
      templatesSetting.value = JSON.stringify(templates);
      await settingsRepository.save(templatesSetting);
    } else {
      const newSetting = settingsRepository.create({
        key: 'advertisingMessageTemplates',
        value: JSON.stringify(templates),
      });
      await settingsRepository.save(newSetting);
    }
    
    res.status(201).json({ message: 'Şablon başarıyla kaydedildi', template: newTemplate });
  } catch (error: any) {
    console.error('Save message template error:', error);
    res.status(500).json({ message: 'Şablon kaydedilirken bir hata oluştu' });
  }
});

// Delete message template - ÖZEL ROUTE
router.delete('/advertising-customers/message-templates/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const settingsRepository = AppDataSource.getRepository(Settings);
    const templatesSetting = await settingsRepository.findOne({ 
      where: { key: 'advertisingMessageTemplates' } 
    });
    
    if (!templatesSetting) {
      return res.status(404).json({ message: 'Şablon bulunamadı' });
    }
    
    const templates = JSON.parse(templatesSetting.value || '[]');
    const filteredTemplates = templates.filter((t: any) => t.id !== id);
    
    templatesSetting.value = JSON.stringify(filteredTemplates);
    await settingsRepository.save(templatesSetting);
    
    res.json({ message: 'Şablon başarıyla silindi' });
  } catch (error: any) {
    console.error('Delete message template error:', error);
    res.status(500).json({ message: 'Şablon silinirken bir hata oluştu' });
  }
});

// Send bulk WhatsApp messages - ÖZEL ROUTE
router.post('/advertising-customers/bulk-message', requireAdmin, async (req, res) => {
  console.log('📨 Toplu mesaj gönderme isteği alındı');
  console.log('Request body:', { 
    customerIds: req.body.customerIds?.length, 
    hasMessage: !!req.body.message,
    hasTemplate: !!req.body.templateId 
  });

  try {
    const { customerIds, message, templateId } = req.body;
    
    if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
      console.error('❌ Geçersiz istek: Müşteri seçilmemiş');
      return res.status(400).json({ message: 'En az bir müşteri seçilmelidir' });
    }
    
    if (!message && !templateId) {
      console.error('❌ Geçersiz istek: Mesaj veya şablon yok');
      return res.status(400).json({ message: 'Mesaj veya şablon seçilmelidir' });
    }
    
    console.log('📋 Müşteriler veritabanından alınıyor...');
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    const customers = await customerRepository.find({
      where: { id: In(customerIds) }
    });
    
    console.log(`📋 ${customers.length} müşteri bulundu`);
    
    if (customers.length === 0) {
      console.error('❌ Müşteri bulunamadı');
      return res.status(404).json({ message: 'Seçilen müşteriler bulunamadı' });
    }

    // WhatsApp otomasyon servisini import et
    console.log('🔧 WhatsApp otomasyon servisi yükleniyor...');
    let whatsapp;
    try {
      // Önce require ile dene (daha güvenilir)
      const whatsappModule = require('../services/whatsappAutomation');
      whatsapp = whatsappModule.getWhatsAppAutomation();
      console.log('✅ WhatsApp otomasyon servisi yüklendi (require)');
    } catch (requireError: any) {
      console.log('Require başarısız, dynamic import deneniyor...', requireError.message);
      try {
        // Dynamic import ile dene
        const whatsappModule = await import('../services/whatsappAutomation');
        whatsapp = whatsappModule.getWhatsAppAutomation();
        console.log('✅ WhatsApp otomasyon servisi yüklendi (dynamic import)');
      } catch (importError: any) {
        console.error('❌ WhatsApp automation import error:', importError);
        console.error('Require error:', requireError.message);
        console.error('Import error:', importError.message);
        console.error('Stack:', importError.stack);
        return res.status(500).json({ 
          message: 'WhatsApp otomasyon servisi yüklenemedi',
          error: importError.message || requireError.message || 'Bilinmeyen hata',
          details: 'Backend yeniden başlatılmalı veya Puppeteer kontrol edilmeli',
          stack: process.env.NODE_ENV === 'development' ? importError.stack : undefined
        });
      }
    }

    // WhatsApp Web'i başlat (ilk seferde QR kod gösterecek)
    console.log('🌐 WhatsApp Web başlatılıyor...');
    try {
      await whatsapp.initialize();
      console.log('✅ WhatsApp Web başlatıldı ve hazır!');
    } catch (error: any) {
      console.error('❌ WhatsApp Web başlatma hatası:', error);
      console.error('Hata mesajı:', error.message);
      console.error('Stack trace:', error.stack);
      return res.status(500).json({ 
        message: 'WhatsApp Web başlatılamadı',
        error: error.message || 'Bilinmeyen hata',
        details: 'Lütfen backend konsolunu kontrol edin. WhatsApp Web penceresi açıldı mı?',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }

    // Her müşteri için mesaj hazırla
    const messages = customers.map(customer => {
      const personalizedMessage = message
        ? message.replace('{customerName}', customer.customerName)
                  .replace('{restaurantName}', customer.restaurantName)
        : 'Merhaba, SmartCafe hakkında bilgi almak ister misiniz?';
      
      return {
        phone: customer.phone,
        message: personalizedMessage,
        customerName: customer.customerName,
      };
    });

    // Mesajları otomatik gönder (bot gibi)
    console.log(`\n📤 ${messages.length} mesaj gönderiliyor...`);
    let result;
    try {
      result = await whatsapp.sendBulkMessages(messages);
      console.log(`\n✅ Mesaj gönderme tamamlandı: ${result.success} başarılı, ${result.failed} başarısız`);
    } catch (sendError: any) {
      console.error('\n❌ Mesaj gönderme hatası:', sendError);
      console.error('Hata mesajı:', sendError.message);
      console.error('Stack trace:', sendError.stack);
      return res.status(500).json({ 
        message: 'Mesajlar gönderilirken hata oluştu',
        error: sendError.message || 'Bilinmeyen hata',
        details: 'Lütfen backend konsolunu kontrol edin',
        stack: process.env.NODE_ENV === 'development' ? sendError.stack : undefined
      });
    }

    console.log('✅ İşlem başarıyla tamamlandı, yanıt gönderiliyor...');
    res.json({ 
      message: `${result.success} müşteriye mesaj otomatik olarak gönderildi`,
      success: result.success,
      failed: result.failed,
      total: customers.length
    });
  } catch (error: any) {
    console.error('\n❌❌❌ GENEL HATA ❌❌❌');
    console.error('Bulk message error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Toplu mesaj gönderilirken bir hata oluştu',
      error: error.message || 'Bilinmeyen hata',
      details: 'Lütfen backend konsolunu kontrol edin',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get all advertising customers with filters
router.get('/advertising-customers', requireAdmin, async (req, res) => {
  try {
    const { search, channel, qrMenuRequest } = req.query;
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    
    const queryBuilder = customerRepository.createQueryBuilder('customer');
    
    if (search) {
      const searchTerm = `%${search}%`;
      queryBuilder.where(
        '(customer.customerName LIKE :search OR customer.phone LIKE :search OR customer.restaurantName LIKE :search)',
        { search: searchTerm }
      );
    }
    
    if (channel) {
      queryBuilder.andWhere('customer.channel = :channel', { channel });
    }
    
    if (qrMenuRequest !== undefined) {
      queryBuilder.andWhere('customer.qrMenuRequest = :qrMenuRequest', { 
        qrMenuRequest: qrMenuRequest === 'true' 
      });
    }
    
    queryBuilder.orderBy('customer.createdAt', 'DESC');
    
    const customers = await queryBuilder.getMany();
    res.json({ customers });
  } catch (error: any) {
    console.error('Get advertising customers error:', error);
    res.status(500).json({ message: 'Müşteriler yüklenirken bir hata oluştu' });
  }
});

// Get single advertising customer
router.get('/advertising-customers/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    const customer = await customerRepository.findOne({ where: { id } });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    res.json({ customer });
  } catch (error: any) {
    console.error('Get advertising customer error:', error);
    res.status(500).json({ message: 'Müşteri yüklenirken bir hata oluştu' });
  }
});

// Create new advertising customer
router.post('/advertising-customers', requireAdmin, async (req, res) => {
  try {
    const { customerName, phone, restaurantName, tableCount, qrMenuRequest, notes, channel } = req.body;
    
    if (!customerName || !phone || !restaurantName) {
      return res.status(400).json({ message: 'Müşteri adı, telefon ve restoran adı zorunludur' });
    }
    
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    const customer = customerRepository.create({
      customerName: customerName.trim(),
      phone: phone.trim(),
      restaurantName: restaurantName.trim(),
      tableCount: tableCount ? parseInt(tableCount) : null,
      qrMenuRequest: qrMenuRequest === true || qrMenuRequest === 'true',
      notes: notes ? notes.trim() : null,
      channel: channel || AdvertisingChannel.WHATSAPP,
    });
    
    await customerRepository.save(customer);
    res.status(201).json({ message: 'Müşteri başarıyla eklendi', customer });
  } catch (error: any) {
    console.error('Create advertising customer error:', error);
    res.status(500).json({ message: 'Müşteri eklenirken bir hata oluştu' });
  }
});

// Update advertising customer
router.put('/advertising-customers/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, phone, restaurantName, tableCount, qrMenuRequest, notes, channel } = req.body;
    
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    const customer = await customerRepository.findOne({ where: { id } });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    if (customerName) customer.customerName = customerName.trim();
    if (phone) customer.phone = phone.trim();
    if (restaurantName) customer.restaurantName = restaurantName.trim();
    if (tableCount !== undefined) customer.tableCount = tableCount ? parseInt(tableCount) : null;
    if (qrMenuRequest !== undefined) customer.qrMenuRequest = qrMenuRequest === true || qrMenuRequest === 'true';
    if (notes !== undefined) customer.notes = notes ? notes.trim() : null;
    if (channel) customer.channel = channel;
    
    await customerRepository.save(customer);
    res.json({ message: 'Müşteri başarıyla güncellendi', customer });
  } catch (error: any) {
    console.error('Update advertising customer error:', error);
    res.status(500).json({ message: 'Müşteri güncellenirken bir hata oluştu' });
  }
});

// Delete advertising customer
router.delete('/advertising-customers/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const customerRepository = AppDataSource.getRepository(AdvertisingCustomer);
    const customer = await customerRepository.findOne({ where: { id } });
    
    if (!customer) {
      return res.status(404).json({ message: 'Müşteri bulunamadı' });
    }
    
    await customerRepository.remove(customer);
    res.json({ message: 'Müşteri başarıyla silindi' });
  } catch (error: any) {
    console.error('Delete advertising customer error:', error);
    res.status(500).json({ message: 'Müşteri silinirken bir hata oluştu' });
  }
});

export default router;
