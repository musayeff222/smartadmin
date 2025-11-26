import 'reflect-metadata';
import dotenv from 'dotenv';
import { AppDataSource } from '../data-source';
import { User, UserRole } from '../entities/User';
import bcrypt from 'bcryptjs';

dotenv.config();

async function fixAdminRole() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    const userRepository = AppDataSource.getRepository(User);

    // Find admin user
    const adminUser = await userRepository.findOne({
      where: { email: 'admin@posrestaurant.com' },
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Creating new admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const superAdmin = userRepository.create({
        email: 'admin@posrestaurant.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      });
      await userRepository.save(superAdmin);
      console.log('✅ Super admin user created: admin@posrestaurant.com / admin123');
    } else {
      console.log('📋 Admin user found:', {
        id: adminUser.id,
        email: adminUser.email,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        role: adminUser.role,
        roleType: typeof adminUser.role,
        isActive: adminUser.isActive,
      });

      let needsUpdate = false;

      // Fix role if missing or invalid
      if (!adminUser.role || String(adminUser.role).trim() === '') {
        console.log('⚠️  Role is missing or empty. Fixing...');
        adminUser.role = UserRole.SUPER_ADMIN;
        needsUpdate = true;
      } else if (adminUser.role !== UserRole.SUPER_ADMIN && adminUser.role !== UserRole.ADMIN) {
        console.log('⚠️  Role is not admin. Fixing...');
        adminUser.role = UserRole.SUPER_ADMIN;
        needsUpdate = true;
      }

      // Fix firstName if missing or empty
      if (!adminUser.firstName || String(adminUser.firstName).trim() === '') {
        console.log('⚠️  FirstName is missing or empty. Fixing...');
        adminUser.firstName = 'Super';
        needsUpdate = true;
      }

      // Fix lastName if missing or empty
      if (!adminUser.lastName || String(adminUser.lastName).trim() === '') {
        console.log('⚠️  LastName is missing or empty. Fixing...');
        adminUser.lastName = 'Admin';
        needsUpdate = true;
      }

      // Ensure user is active
      if (!adminUser.isActive) {
        console.log('⚠️  User is inactive. Activating...');
        adminUser.isActive = true;
        needsUpdate = true;
      }

      // Save if any changes were made
      if (needsUpdate) {
        await userRepository.save(adminUser);
        console.log('✅ Admin user fixed successfully!');
      } else {
        console.log('✅ Admin user already has all valid fields');
      }
    }

    // Final verification
    const finalUser = await userRepository.findOne({
      where: { email: 'admin@posrestaurant.com' },
    });

    if (finalUser) {
      console.log('\n✅ Final verification:');
      console.log({
        id: finalUser.id,
        email: finalUser.email,
        firstName: finalUser.firstName,
        lastName: finalUser.lastName,
        role: finalUser.role,
        isActive: finalUser.isActive,
        status: (finalUser.role && finalUser.firstName && finalUser.lastName && finalUser.isActive) ? 'READY' : 'NEEDS_FIX',
      });
    }

    console.log('\n✅ Fix completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
    process.exit(1);
  }
}

fixAdminRole();

