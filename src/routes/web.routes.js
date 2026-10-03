import express from 'express';

const router = express.Router();

router.get('/', (req, res) => res.redirect('/signIn'));
router.get('/signIn', (req, res) => res.render('signin', { title: 'Iniciar sesion' }));
router.get('/signUp', (req, res) => res.render('signup', { title: 'Crear cuenta' }));
router.get('/dashboard', (req, res) => res.render('dashboard', { title: 'Mi refugio' }));
router.get('/admin', (req, res) => res.render('admin', { title: 'Centro de mando' }));
router.get('/profile', (req, res) => res.render('profile', { title: 'Mi cuenta' }));
router.get('/403', (req, res) => res.status(403).render('403', { title: 'Acceso denegado' }));

export default router;
