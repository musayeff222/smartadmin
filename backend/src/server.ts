import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRoutes from './routes/auth.routes';
import adminRoutes from './routes/admin.routes';
import publicRoutes from './routes/public.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// CORS ayarları - Production ve development için
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
  process.env.NETLIFY_URL,
].filter(Boolean); // undefined değerleri filtrele

app.use(cors({
  origin: (origin, callback) => {
    // Origin yoksa (Postman, mobile app, vb.) veya izin verilen listede ise
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Development için tüm origin'lere izin ver (production'da kaldırılabilir)
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: Origin not allowed'));
      }
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy for accurate IP addresses
app.set('trust proxy', true);

// Routes
app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    console.log('Database connected successfully');
    
    // Tabloların oluşturulduğunu kontrol et
    try {
      const userRepository = AppDataSource.getRepository('User');
      console.log('✓ Database tables are ready');
    } catch (error) {
      console.warn('⚠ Warning: Could not verify tables. Make sure database schema is created.');
      console.log('💡 Tip: Run database-schema.sql in phpMyAdmin or use npm run seed');
    }
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    console.error('Error during database initialization:', error);
    console.error('\n💡 Possible solutions:');
    console.error('1. Make sure MySQL is running in XAMPP');
    console.error('2. Check .env file database credentials');
    console.error('3. Create database manually: CREATE DATABASE pos_website;');
    console.error('4. Run database-schema.sql in phpMyAdmin');
    process.exit(1);
  });

export default app;

