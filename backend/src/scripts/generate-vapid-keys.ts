// @ts-ignore - web-push doesn't have types
import webpush from 'web-push';

console.log('🔑 VAPID Keys oluşturuluyor...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('✅ VAPID Keys başarıyla oluşturuldu!\n');
console.log('📋 Aşağıdaki değerleri .env dosyanıza ekleyin:\n');
console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('VAPID_EMAIL=mailto:admin@posrestaurant.com\n');
console.log('⚠️  ÖNEMLİ: Private key\'i asla paylaşmayın ve güvenli tutun!');

