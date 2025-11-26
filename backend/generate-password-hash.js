// Şifre hash oluşturucu
// Kullanım: node generate-password-hash.js

const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('\n================================');
  console.log('Şifre: admin123');
  console.log('Hash:', hash);
  console.log('================================\n');
  
  // Doğrulama
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash doğrulama:', isValid ? '✓ Başarılı' : '✗ Başarısız');
  console.log('\nBu hash\'i SQL dosyasındaki password alanına yapıştırın.\n');
}

generateHash().catch(console.error);





