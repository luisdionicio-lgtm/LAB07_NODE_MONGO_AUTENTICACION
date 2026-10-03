import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository.js';
import roleRepository from '../repositories/RoleRepository.js';

class AuthService {
  async signUp({ email, password, name, lastName, phoneNumber, birthdate, url_profile = '', address = '', roles = ['user'] }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      const err = new Error('El email ya se encuentra en uso');
      err.status = 400;
      throw err;
    }

    const saltRounds = Number.parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const roleDocs = [];
    for (const roleName of roles) {
      let roleDoc = await roleRepository.findByName(roleName);
      if (!roleDoc) {
        roleDoc = await roleRepository.create({ name: roleName });
      }
      roleDocs.push(roleDoc._id);
    }

    const user = await userRepository.create({
      email,
      password: hashed,
      name,
      lastName,
      phoneNumber,
      birthdate,
      url_profile,
      address,
      roles: roleDocs
    });

    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      roles
    };
  }

  async signIn({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      const err = new Error('Credenciales invalidas');
      err.status = 401;
      throw err;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      const err = new Error('Credenciales invalidas');
      err.status = 401;
      throw err;
    }

    const token = jwt.sign(
      {
        sub: user._id,
        roles: user.roles.map((role) => role.name)
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
    );

    return { token };
  }
}

export default new AuthService();
