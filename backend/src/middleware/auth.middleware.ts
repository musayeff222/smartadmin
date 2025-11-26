import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../entities/User';
import { AppDataSource } from '../data-source';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId, isActive: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Debug: Kullanıcı bilgilerini logla
  console.log('User role check:', {
    userId: req.user.id,
    userEmail: req.user.email,
    userRole: req.user.role,
    requiredRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN],
    isAdmin: req.user.role === UserRole.ADMIN,
    isSuperAdmin: req.user.role === UserRole.SUPER_ADMIN,
  });

  if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ 
      message: 'Admin access required',
      userRole: req.user.role,
      requiredRoles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    });
  }

  next();
};

export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  if (req.user.role !== UserRole.SUPER_ADMIN) {
    return res.status(403).json({ message: 'Super admin access required' });
  }

  next();
};

