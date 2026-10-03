document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const error = document.getElementById('form-error');
  const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@]).{8,}$/;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    if (!passwordPattern.test(form.password.value)) {
      error.textContent = 'La contrasena no cumple los requisitos de seguridad.';
      return;
    }
    const birthdate = new Date(`${form.birthdate.value}T00:00:00`);
    if (Number.isNaN(birthdate.getTime()) || birthdate > new Date()) {
      error.textContent = 'Ingresa una fecha de nacimiento valida.';
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await DeadSignalAuth.api('/api/auth/signUp', {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(new FormData(form)))
      });
      window.location.replace('/signIn?registered=1');
    } catch (err) {
      error.textContent = err.message;
      button.disabled = false;
    }
  });
});
