document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signin-form');
  const error = document.getElementById('form-error');
  const params = new URLSearchParams(window.location.search);
  if (params.has('registered')) { error.textContent = 'Cuenta creada. Inicia sesion para continuar.'; error.classList.add('success'); }
  if (params.has('expired')) error.textContent = 'La sesion vencio. Ingresa nuevamente.';

  document.getElementById('demo-admin')?.addEventListener('click', () => {
    form.email.value = 'admin@terminus.local';
    form.password.value = 'Admin#2026';
    M.updateTextFields();
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    error.classList.remove('success');
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    button.firstChild.textContent = 'Verificando... ';
    try {
      const data = await DeadSignalAuth.api('/api/auth/signIn', {
        method: 'POST',
        body: JSON.stringify({ email: form.email.value.trim(), password: form.password.value })
      });
      DeadSignalAuth.setToken(data.token);
      const payload = DeadSignalAuth.parseToken(data.token);
      window.location.replace(payload.roles?.includes('admin') ? '/admin' : '/dashboard');
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
      button.firstChild.textContent = 'Entrar a la zona segura ';
    }
  });
});
