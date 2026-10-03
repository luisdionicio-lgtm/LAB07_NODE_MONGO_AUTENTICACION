import bcrypt from 'bcrypt';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

export default async function seedUsers() {
  const email = process.env.ADMIN_EMAIL || 'admin@terminus.local';
  const password = process.env.ADMIN_PASSWORD || 'Admin#2026';
  const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    const passwordMatches = await bcrypt.compare(password, existing.password);
    if (!passwordMatches) {
      await userRepository.updatePassword(existing._id, await bcrypt.hash(password, saltRounds));
      console.log(`Admin credentials synchronized: ${email}`);
    }
    return;
  }

  const adminRole = await roleRepository.findByName('admin');
  const userRole = await roleRepository.findByName('user');
  await userRepository.create({
    email,
    password: await bcrypt.hash(password, saltRounds),
    roles: [userRole._id, adminRole._id],
    name: 'Rick',
    lastName: 'Grimes',
    phoneNumber: '999888777',
    birthdate: new Date('1985-09-14'),
    url_profile: '',
    address: 'Zona segura Alexandria'
  });

  console.log(`Admin seeded: ${email}`);
}
