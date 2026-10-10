# Lab 7 Dead Signal

Aplicacion web completa de autenticacion y autorizacion con Express, EJS, Materialize, MongoDB, Mongoose, bcrypt y JWT. La experiencia visual esta inspirada en el universo de supervivencia de The Walking Dead.

## Ejecucion

1. Verificar que MongoDB este iniciado.
2. Instalar dependencias con `npm install`.
3. Iniciar en desarrollo con `npm run dev` (recarga automatica mediante `node --watch`).
4. Abrir `http://localhost:3000/signIn`.

## Acceso administrativo local de laboratorio

- Correo: `admin@terminus.local`
- Contrasena: `Admin#2026`

Las credenciales se pueden cambiar con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`.
En produccion se usan credenciales privadas distintas y el acceso de practica
se oculta. Los datos para entrar a Render se conservan localmente en
`ACCESO-RENDER.txt`, excluido del repositorio.

## Endpoints

- `POST /api/auth/signUp`
- `POST /api/auth/signIn`
- `GET /api/users/me` con token Bearer
- `PATCH /api/users/me` con token Bearer
- `GET /api/users` con token Bearer y rol `admin`

## Paginas

- `/signIn` y `/signUp`
- `/dashboard` para usuarios autenticados
- `/profile` para consultar y editar la cuenta
- `/admin` para listar y revisar usuarios
- `/403` y pagina 404 para errores de navegacion

## Recursos visuales

El fondo tematico de The Walking Dead procede de Wallpapers.com y requiere atribucion: https://wallpapers.com/background/the-walking-dead-1920-x-1080-background-7fkqbfvfm2dj6jrk.html

Tambien se incluye un fondo posapocaliptico original generado para el proyecto como recurso alternativo local.

## Laboratorio 08 Parte 2 Despliegue JWT

- Aplicacion: https://express-auth-dionicio.onrender.com
- Health: https://express-auth-dionicio.onrender.com/health
- Repositorio: https://github.com/luisdionicio-lgtm/LAB07_NODE_MONGO_AUTENTICACION
- Base en MongoDB Atlas: `auth_db`, colecciones `users` y `roles`.
- Render: Web Service Node, rama `main`, plan Free, build `npm ci`, start `npm start`.
- Variables: `NODE_ENV=production`, `MONGODB_URI`, `JWT_SECRET`,
  `JWT_EXPIRES_IN`, `BCRYPT_SALT_ROUNDS`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
- Usar `.env.production.example` como referencia; los secretos no se publican.
- La configuracion local para Atlas esta en `.env.render`, excluido de Git.
  Para ejecutarla: `node --env-file=.env.render src/server.js` (puerto 3001).

El workflow `.github/workflows/deploy.yml` ejecuta `npm ci` y `npm test`.
Un push a `main` despliega el mismo commit en Render mediante el secreto
`RENDER_DEPLOY_HOOK_URL`, solamente si pasan las pruebas de JWT y autorizacion.
Los pull requests ejecutan las pruebas sin desplegar. Auto-Deploy de Render
queda Off para que GitHub Actions controle la publicacion.

La coleccion `Lab08-JWT.postman_collection.json` permite comprobar registro,
login, perfil con Bearer token y rechazo de acceso administrativo sin permisos.
El token se guarda automaticamente en una variable al iniciar sesion.
