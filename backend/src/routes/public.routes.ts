import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Package } from '../entities/Package';
import { ContactMessage, MessageStatus } from '../entities/ContactMessage';
import { SiteContent } from '../entities/SiteContent';
import { Settings } from '../entities/Settings';
import { NotificationSubscription } from '../entities/NotificationSubscription';
import { Subscription } from '../entities/Subscription';
import { VisitorLog } from '../entities/VisitorLog';
import { authenticate } from '../middleware/auth.middleware';
import { MoreThanOrEqual } from 'typeorm';

const router = Router();

// Track visitor - frontend'den çağrılacak
router.post('/track-visitor', async (req, res) => {
  try {
    const { path } = req.body;
    const ipAddress = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown';
    const userAgent = req.headers['user-agent'] || null;
    const referer = req.headers.referer || null;

    // Device ID oluştur (IP + User Agent hash)
    const crypto = require('crypto');
    const deviceIdString = `${ipAddress}_${userAgent}`.toLowerCase();
    const deviceId = crypto.createHash('md5').update(deviceIdString).digest('hex');

    const visitorLogRepository = AppDataSource.getRepository(VisitorLog);
    
    // Bugün aynı cihazdan aynı sayfaya ziyaret var mı kontrol et
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const existingVisit = await visitorLogRepository.findOne({
      where: {
        deviceId,
        path: path || '/',
        createdAt: MoreThanOrEqual(today) as any,
      },
    });

    // Eğer bugün aynı cihazdan aynı sayfaya ziyaret yoksa logla
    if (!existingVisit) {
      const visitorLog = visitorLogRepository.create({
        ipAddress: String(ipAddress),
        userAgent,
        deviceId,
        referer,
        path: path || '/',
      });

      await visitorLogRepository.save(visitorLog);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Visitor tracking error:', error);
    res.json({ success: false });
  }
});

// Get all active packages
router.get('/packages', async (req, res) => {
  try {
    const packageRepository = AppDataSource.getRepository(Package);
    const packages = await packageRepository.find({
      where: { isActive: true },
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

// Get single package
router.get('/packages/:id', async (req, res) => {
  try {
    const packageRepository = AppDataSource.getRepository(Package);
    const pkg = await packageRepository.findOne({
      where: { id: req.params.id, isActive: true },
    });

    if (!pkg) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Features'ı JSON string'den array'e çevir
    const packageWithParsedFeatures = {
      ...pkg,
      features: typeof pkg.features === 'string' ? JSON.parse(pkg.features) : pkg.features
    };

    res.json({ package: packageWithParsedFeatures });
  } catch (error) {
    console.error('Get package error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit contact message
router.post('/contact', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const userAgent = req.headers['user-agent'] || null;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    // Device ID oluştur (telefon + email hash)
    const crypto = require('crypto');
    const deviceIdString = `${phone || ''}_${email}`.toLowerCase();
    const deviceId = crypto.createHash('md5').update(deviceIdString).digest('hex');

    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const contactMessage = contactRepository.create({
      name,
      email,
      phone,
      subject,
      message,
      userAgent,
      deviceId,
    });

    await contactRepository.save(contactMessage);

    res.status(201).json({
      message: 'Contact message submitted successfully',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get site content
router.get('/content/:key', async (req, res) => {
  try {
    const contentRepository = AppDataSource.getRepository(SiteContent);
    const content = await contentRepository.findOne({
      where: { key: req.params.key },
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json({ content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all site contents
router.get('/contents', async (req, res) => {
  try {
    const contentRepository = AppDataSource.getRepository(SiteContent);
    const contents = await contentRepository.find();

    res.json({ contents });
  } catch (error) {
    console.error('Get contents error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Submit package order
router.post('/order', async (req, res) => {
  try {
    const { packageId, packageName, packagePrice, durationMonths, totalAmount, name, restaurantName, email, phone, password } = req.body;

    if (!name || !restaurantName || !email || !phone || !password || !packageId) {
      return res.status(400).json({ message: 'Tüm alanlar zorunludur' });
    }

    // Create order message
    const orderMessage = `
PAKET SİPARİŞİ

Paket Bilgileri:
- Paket Adı: ${packageName}
- Aylık Fiyat: ${packagePrice} AZN
- Abonelik Süresi: ${durationMonths || 1} ay
- Toplam Tutar: ${totalAmount || packagePrice} AZN
- Paket ID: ${packageId}

Müşteri Bilgileri:
- Adı Soyadı: ${name}
- Restoran Adı: ${restaurantName}
- E-mail: ${email}
- Telefon: ${phone}
- Şifre: ${password}

Sipariş Tarihi: ${new Date().toLocaleString('tr-TR')}
`.trim();

    // Device ID oluştur (telefon + email hash)
    const crypto = require('crypto');
    const deviceIdString = `${phone || ''}_${email}`.toLowerCase();
    const deviceId = crypto.createHash('md5').update(deviceIdString).digest('hex');
    const userAgent = req.headers['user-agent'] || null;

    const contactRepository = AppDataSource.getRepository(ContactMessage);
    const orderMessageEntity = contactRepository.create({
      name,
      email,
      phone,
      subject: `Paket Siparişi: ${packageName}`,
      message: orderMessage,
      status: MessageStatus.NEW,
      userAgent,
      deviceId,
    });

    await contactRepository.save(orderMessageEntity);

    res.status(201).json({
      message: 'Siparişiniz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.',
      id: orderMessageEntity.id,
    });
  } catch (error) {
    console.error('Order submission error:', error);
    res.status(500).json({ message: 'Sipariş gönderilirken bir hata oluştu' });
  }
});

// Get web settings (public)
router.get('/settings', async (req, res) => {
  try {
    const settingsRepository = AppDataSource.getRepository(Settings);
    const settings = await settingsRepository.findOne({ where: {} });
    
    if (!settings) {
      // Eğer settings yoksa, varsayılan değerler döndür
      return res.json({
        settings: {
          companyName: 'SmartCafe',
          companyDescription: 'Restoranlar için modern ve kullanıcı dostu POS çözümü. Sipariş yönetiminden stok takibine kadar her şey tek platformda.',
          email: 'info@posrestaurant.com',
          phone: '+90 (212) 123 45 67',
          whatsappNumber: null,
          instagramUrl: null,
          tiktokUrl: null,
          facebookUrl: null,
          twitterUrl: null,
          linkedinUrl: null,
          contactLink: null,
          faqLink: null,
          documentationLink: null,
          siteTitle: null,
          metaDescription: null,
          metaKeywords: null,
          faviconUrl: null,
          logoUrl: null,
        },
      });
    }
    
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Subscribe to notifications
router.post('/notifications/subscribe', async (req, res) => {
  try {
    const { endpoint, keys, userAgent, userId } = req.body;

    if (!endpoint || !keys) {
      return res.status(400).json({ message: 'Endpoint and keys are required' });
    }

    if (!keys.p256dh || !keys.auth) {
      return res.status(400).json({ message: 'Keys.p256dh and keys.auth are required' });
    }

    const subscriptionRepository = AppDataSource.getRepository(NotificationSubscription);
    
    // Check if subscription already exists
    const existing = await subscriptionRepository.findOne({
      where: { endpoint },
    });

    if (existing) {
      // Update existing subscription
      existing.p256dh = keys.p256dh;
      existing.auth = keys.auth;
      existing.userAgent = userAgent || null;
      existing.userId = userId || null;
      existing.isActive = true;
      await subscriptionRepository.save(existing);
      console.log('Subscription updated:', existing.id);
      return res.json({ message: 'Subscription updated', id: existing.id });
    }

    // Create new subscription
    const subscription = subscriptionRepository.create({
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: userAgent || null,
      userId: userId || null,
      isActive: true,
    });

    await subscriptionRepository.save(subscription);
    console.log('New subscription created:', subscription.id);
    res.status(201).json({ message: 'Subscribed successfully', id: subscription.id });
  } catch (error: any) {
    console.error('Subscribe error:', error);
    res.status(500).json({ 
      message: 'Abonelik kaydedilirken bir hata oluştu',
      error: error.message || 'Unknown error'
    });
  }
});

// Unsubscribe from notifications
router.post('/notifications/unsubscribe', async (req, res) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({ message: 'Endpoint is required' });
    }

    const subscriptionRepository = AppDataSource.getRepository(NotificationSubscription);
    const subscription = await subscriptionRepository.findOne({
      where: { endpoint },
    });

    if (subscription) {
      subscription.isActive = false;
      await subscriptionRepository.save(subscription);
    }

    res.json({ message: 'Unsubscribed successfully' });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get VAPID public key
router.get('/notifications/vapid-key', async (req, res) => {
  try {
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
    console.log('VAPID Public Key requested. Key exists:', !!vapidPublicKey);
    console.log('Key length:', vapidPublicKey.length);
    
    if (!vapidPublicKey) {
      console.error('⚠️ VAPID_PUBLIC_KEY is not set in environment variables!');
      return res.status(500).json({ 
        publicKey: '',
        error: 'VAPID_PUBLIC_KEY is not configured. Please add it to backend/.env file and restart the server.'
      });
    }
    
    res.json({ publicKey: vapidPublicKey });
  } catch (error: any) {
    console.error('Get VAPID key error:', error);
    res.status(500).json({ 
      publicKey: '',
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Get user's subscriptions (authenticated users only)
router.get('/my-subscriptions', authenticate, async (req: any, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscriptions = await subscriptionRepository.find({
      where: { userId },
      relations: ['package'],
      order: { createdAt: 'DESC' },
    });

    res.json({ subscriptions });
  } catch (error: any) {
    console.error('Get my subscriptions error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Get subscription invoice (authenticated users only)
router.get('/subscriptions/:id/invoice', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const subscriptionRepository = AppDataSource.getRepository(Subscription);
    const subscription = await subscriptionRepository.findOne({
      where: { id, userId },
      relations: ['user', 'package'],
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Abonelik bulunamadı' });
    }

    const { generateInvoicePDF } = await import('../utils/pdfGenerator');
    const pdfBuffer = await generateInvoicePDF(subscription);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=fatura-${subscription.id.substring(0, 8)}.pdf`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ message: 'PDF oluşturulurken hata oluştu', error: error.message });
  }
});

export default router;

