import userRepository from '../repositories/UserRepository.js';

class UserService {
  calculateAge(birthdate) {
    if (!birthdate) return null;
    const today = new Date();
    const born = new Date(birthdate);
    if (Number.isNaN(born.getTime())) return null;
    let age = today.getFullYear() - born.getFullYear();
    const monthDifference = today.getMonth() - born.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < born.getDate())) {
      age -= 1;
    }
    return age;
  }

  toPublicUser(user) {
    return {
      id: user._id,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      birthdate: user.birthdate,
      age: this.calculateAge(user.birthdate),
      url_profile: user.url_profile,
      address: user.address,
      roles: user.roles.map((role) => role.name),
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async getAll() {
    const users = await userRepository.getAll();
    return users.map((user) => this.toPublicUser(user));
  }

  async getById(id) {
    const user = await userRepository.findById(id);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }

    return this.toPublicUser(user);
  }

  async updateMe(id, payload) {
    const allowedFields = ['name', 'lastName', 'phoneNumber', 'birthdate', 'url_profile', 'address'];
    const updates = Object.fromEntries(
      Object.entries(payload).filter(([key]) => allowedFields.includes(key))
    );
    const user = await userRepository.updateById(id, updates);
    if (!user) {
      const err = new Error('Usuario no encontrado');
      err.status = 404;
      throw err;
    }
    return this.toPublicUser(user);
  }
}

export default new UserService();
