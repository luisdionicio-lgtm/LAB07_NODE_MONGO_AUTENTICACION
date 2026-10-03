# Lab 7 Dead Signal

Aplicacion web completa de autenticacion y autorizacion con Express, EJS, Materialize, MongoDB, Mongoose, bcrypt y JWT. La experiencia visual esta inspirada en el universo de supervivencia de The Walking Dead.

## Ejecucion

1. Verificar que MongoDB este iniciado.
2. Instalar dependencias con `npm install`.
3. Iniciar en desarrollo con `npm run dev` (recarga automatica mediante `node --watch`).
4. Abrir `http://localhost:3000/signIn`.

## Acceso administrativo de laboratorio

- Correo: `admin@terminus.local`
- Contrasena: `Admin#2026`

Las credenciales se pueden cambiar con `ADMIN_EMAIL` y `ADMIN_PASSWORD` en `.env`.

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
