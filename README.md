# Lab 7 Autenticacion y seguridad

Backend desarrollado con Express, MongoDB, Mongoose, bcrypt y JWT siguiendo el procedimiento previo a la seccion TAREA de la guia.

## Ejecucion

1. Verificar que MongoDB este iniciado.
2. Instalar dependencias con `npm install`.
3. Iniciar en desarrollo con `npm run dev` (recarga automatica mediante `node --watch`).
4. Consultar `http://localhost:3000/health`.

## Endpoints

- `POST /api/auth/signUp`
- `POST /api/auth/signIn`
- `GET /api/users/me` con token Bearer
- `GET /api/users` con token Bearer y rol `admin`
