import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

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
      role: UserRole.USER,
    });

    await userRepository.save(user);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      console.log('Login attempt - User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      console.log('Login attempt - User inactive:', email);
      return res.status(401).json({ message: 'Account is disabled' });
    }

    console.log('Login attempt - User found:', {
      email: user.email,
      role: user.role,
      roleType: typeof user.role,
      roleValue: String(user.role || ''),
      isActive: user.isActive,
      passwordHashLength: user.password?.length || 0,
    });
    
    // Role kontrolü - eğer role boşsa veya geçersizse hata ver
    if (!user.role || String(user.role).trim() === '') {
      console.error('User role is empty or invalid:', user);
      return res.status(500).json({ 
        message: 'Kullanıcı rolü tanımlı değil. Lütfen veritabanını kontrol edin.' 
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      console.log('Login attempt - Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Login successful for:', email);

    const jwtSecret = process.env.JWT_SECRET || 'default-secret';
    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string }
    );

    // Role'u string olarak döndür (enum'dan string'e çevir)
    const userRole = typeof user.role === 'string' ? user.role : String(user.role);
    
    console.log('Login response - User role:', {
      originalRole: user.role,
      roleType: typeof user.role,
      stringRole: userRole,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: userRole,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req.user!.id },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'createdAt'],
    });

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;

