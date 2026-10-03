import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import seedRoles from './utils/seedRoles.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.status(200).json({
  message: 'API de autenticacion y seguridad en funcionamiento',
  health: '/health',
  endpoints: {
    signUp: 'POST /api/auth/signUp',
    signIn: 'POST /api/auth/signIn',
    profile: 'GET /api/users/me',
    users: 'GET /api/users (solo admin)'
  }
}));

app.get('/health', (req, res) => res.status(200).json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI, { autoIndex: true })
  .then(async () => {
    console.log('Mongo connected');
    await seedRoles();
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
  })
  .catch((err) => {
    console.error('Error al conectar con Mongo:', err);
    process.exit(1);
  });
