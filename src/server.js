import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

const PORT = process.env.PORT || 3000;
try {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
    throw new Error('Configurar MONGODB_URI y JWT_SECRET');
  }
  if (process.env.NODE_ENV === 'production' &&
      (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.JWT_SECRET.length < 32)) {
    throw new Error('Configurar credenciales administrativas y JWT_SECRET de al menos 32 caracteres');
  }
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: true, serverSelectionTimeoutMS: 15000 });
  console.log('MongoDB Atlas conectado');
  await seedRoles();
  await seedUsers();
  const server = app.listen(PORT, '0.0.0.0', () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  server.on('error', async (err) => {
    console.error('No se pudo iniciar el servidor:', err.code);
    await mongoose.disconnect();
    process.exitCode = 1;
  });
} catch (err) {
  console.error('Error al iniciar:', err.name);
  await mongoose.disconnect();
  process.exitCode = 1;
}
