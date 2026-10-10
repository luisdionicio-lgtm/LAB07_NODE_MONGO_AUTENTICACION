import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/users.routes.js';
import webRoutes from './routes/web.routes.js';



const app = express();
app.locals.showDemoAccess = process.env.NODE_ENV !== 'production';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/health', (req, res) => res.status(200).json({ ok: true }));
app.use(webRoutes);

app.use((req, res) => res.status(404).render('404', { title: 'Pagina no encontrada' }));

app.use((err, req, res, next) => {
  const status = err.status || (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : 500);
  res.status(status).json({ message: status < 500 ? err.message : 'Error interno del servidor' });
});


export default app;

