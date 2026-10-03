document.addEventListener('DOMContentLoaded', async () => {
  const payload = DeadSignalAuth.guard(['user', 'admin']);
  if (!payload) return;
  try {
    const user = await DeadSignalAuth.api('/api/users/me');
    document.getElementById('welcome-name').textContent = user.name;
    document.getElementById('full-name').textContent = `${user.name} ${user.lastName || ''}`.trim();
    document.getElementById('email-value').textContent = user.email;
    document.getElementById('age-value').textContent = user.age ?? 'Pendiente';
    document.getElementById('phone-value').textContent = user.phoneNumber || 'Sin registrar';
    document.getElementById('address-value').textContent = user.address || 'Sin registrar';
    document.getElementById('access-level').textContent = user.roles.includes('admin') ? 'ADMIN' : 'USER';
    if (user.url_profile) document.getElementById('avatar').src = user.url_profile;
  } catch (err) { M.toast({ html: err.message }); }
});
