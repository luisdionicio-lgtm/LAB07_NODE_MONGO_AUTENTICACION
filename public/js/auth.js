const DeadSignalAuth = (() => {
  const tokenKey = 'deadSignalToken';

  function getToken() { return sessionStorage.getItem(tokenKey); }
  function setToken(token) { sessionStorage.setItem(tokenKey, token); }
  function logout() { sessionStorage.removeItem(tokenKey); window.location.href = '/signIn'; }

  function parseToken(token = getToken()) {
    try {
      if (!token) return null;
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(atob(base64).split('').map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`).join('')));
    } catch { return null; }
  }

  function isValid(payload = parseToken()) {
    return Boolean(payload && payload.exp && payload.exp * 1000 > Date.now());
  }

  function guard(requiredRoles = []) {
    const payload = parseToken();
    if (!isValid(payload)) {
      sessionStorage.removeItem(tokenKey);
      window.location.replace('/signIn?expired=1');
      return null;
    }
    if (requiredRoles.length && !requiredRoles.some((role) => payload.roles?.includes(role))) {
      window.location.replace('/403');
      return null;
    }
    return payload;
  }

  async function api(url, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401 && !url.includes('/signIn')) {
      sessionStorage.removeItem(tokenKey);
      window.location.replace('/signIn?expired=1');
      throw new Error('La sesion vencio');
    }
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'No se pudo completar la solicitud');
    return data;
  }

  function initPage() {
    document.querySelectorAll('.js-logout').forEach((button) => button.addEventListener('click', logout));
    document.querySelectorAll('[data-toggle-password]').forEach((button) => button.addEventListener('click', () => {
      const input = document.getElementById(button.dataset.togglePassword);
      input.type = input.type === 'password' ? 'text' : 'password';
      button.querySelector('i').textContent = input.type === 'password' ? 'visibility' : 'visibility_off';
    }));
    if (window.M) {
      M.Sidenav.init(document.querySelectorAll('.sidenav'));
      M.Modal.init(document.querySelectorAll('.modal'));
    }
    const payload = parseToken();
    if (payload?.roles?.includes('admin')) document.querySelectorAll('.admin-link').forEach((item) => item.classList.remove('hide'));
  }

  document.addEventListener('DOMContentLoaded', initPage);
  return { getToken, setToken, logout, parseToken, guard, api };
})();
