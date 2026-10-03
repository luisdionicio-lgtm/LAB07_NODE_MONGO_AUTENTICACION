document.addEventListener('DOMContentLoaded', async () => {
  if (!DeadSignalAuth.guard(['user', 'admin'])) return;
  const form = document.getElementById('profile-form');
  const error = document.getElementById('form-error');
  let currentUser;

  function fill(user) {
    currentUser = user;
    ['name', 'lastName', 'phoneNumber', 'url_profile', 'address'].forEach((field) => { form[field].value = user[field] || ''; });
    form.birthdate.value = user.birthdate ? user.birthdate.slice(0, 10) : '';
    document.getElementById('profile-name').textContent = `${user.name} ${user.lastName || ''}`.trim();
    document.getElementById('profile-role').textContent = user.roles.join(' + ');
    document.getElementById('profile-email').textContent = user.email;
    if (user.url_profile) document.getElementById('profile-avatar').src = user.url_profile;
    M.updateTextFields();
  }

  try { fill(await DeadSignalAuth.api('/api/users/me')); } catch (err) { error.textContent = err.message; }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    try {
      const updated = await DeadSignalAuth.api('/api/users/me', { method: 'PATCH', body: JSON.stringify(Object.fromEntries(new FormData(form))) });
      fill(updated);
      M.toast({ html: 'Cambios guardados' });
    } catch (err) { error.textContent = err.message; }
  });
});
