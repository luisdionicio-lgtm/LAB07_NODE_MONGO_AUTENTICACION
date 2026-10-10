import assert from 'node:assert/strict';
import { once } from 'node:events';
import { after, before, mock, test } from 'node:test';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userRepository from '../src/repositories/UserRepository.js';

process.env.NODE_ENV = 'production';
process.env.JWT_SECRET = 'secret-exclusivo-de-pruebas-no-usar-en-produccion';
const { default: app } = await import('../src/app.js');
let server;
let base;
before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  base = `http://127.0.0.1:${server.address().port}`;
});
after(async () => { await new Promise(resolve => server.close(resolve)); });

const sign = (roles = ['user'], options = {}) => jwt.sign(
  { sub: '507f1f77bcf86cd799439011', roles }, process.env.JWT_SECRET,
  { expiresIn: '1h', ...options }
);
const auth = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

test('Health responde y la pagina de login no publica acceso admin de practica', async () => {
  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { ok: true });
  const page = await fetch(`${base}/signIn`);
  assert.equal(page.status, 200);
  assert.doesNotMatch(await page.text(), /id="demo-admin"/);
});

test('Perfil sin token devuelve 401', async () => {
  assert.equal((await fetch(`${base}/api/users/me`)).status, 401);
});

test('Token adulterado y token expirado devuelven 401', async () => {
  assert.equal((await fetch(`${base}/api/users/me`, auth('token.invalido'))).status, 401);
  assert.equal((await fetch(`${base}/api/users/me`, auth(sign(['user'], { expiresIn: -1 })))).status, 401);
});

test('Un usuario normal no puede listar usuarios administrativos: 403', async () => {
  assert.equal((await fetch(`${base}/api/users`, auth(sign()))).status, 403);
});

test('Registro incompleto devuelve 400 antes de escribir en la base', async () => {
  const response = await fetch(`${base}/api/auth/signUp`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
  });
  assert.equal(response.status, 400);
});

test('Un token valido permite consultar perfil sin exponer password', async () => {
  const stub = mock.method(userRepository, 'findById', async (id) => ({
    _id: id, email: 'test@example.com', name: 'Luis', lastName: 'Dionicio',
    password: 'no-publicar', roles: [{ name: 'user' }], birthdate: new Date('2000-01-01')
  }));
  try {
    const response = await fetch(`${base}/api/users/me`, auth(sign()));
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.email, 'test@example.com');
    assert.equal('password' in body, false);
  } finally { stub.mock.restore(); }
});

test('El rol admin permite listar usuarios', async () => {
  const stub = mock.method(userRepository, 'getAll', async () => []);
  try {
    const response = await fetch(`${base}/api/users`, auth(sign(['user', 'admin'])));
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), []);
  } finally { stub.mock.restore(); }
});

test('Login verifica bcrypt y emite un JWT firmado con el rol del usuario', async () => {
  const stub = mock.method(userRepository, 'findByEmail', async () => ({
    _id: '507f1f77bcf86cd799439011', password: await bcrypt.hash('Prueba#2026', 4),
    roles: [{ name: 'user' }]
  }));
  try {
    const response = await fetch(`${base}/api/auth/signIn`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'Prueba#2026' })
    });
    assert.equal(response.status, 200);
    const payload = jwt.verify((await response.json()).token, process.env.JWT_SECRET);
    assert.equal(payload.sub, '507f1f77bcf86cd799439011');
    assert.deepEqual(payload.roles, ['user']);
  } finally { stub.mock.restore(); }
});

test('Login con password incorrecto devuelve 401', async () => {
  const stub = mock.method(userRepository, 'findByEmail', async () => ({
    password: await bcrypt.hash('Prueba#2026', 4), roles: [{ name: 'user' }]
  }));
  try {
    const response = await fetch(`${base}/api/auth/signIn`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'Incorrecto#2026' })
    });
    assert.equal(response.status, 401);
  } finally { stub.mock.restore(); }
});
