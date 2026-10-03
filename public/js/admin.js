document.addEventListener('DOMContentLoaded', async () => {
  if (!DeadSignalAuth.guard(['admin'])) return;
  const table = document.getElementById('users-table');
  let users = [];

  const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[char]));
  const date = (value) => value ? new Intl.DateTimeFormat('es-PE', { dateStyle: 'medium' }).format(new Date(value)) : '--';
  function render(list) {
    table.innerHTML = list.length ? list.map((user, index) => `
      <tr><td><strong>${esc(user.name)} ${esc(user.lastName)}</strong><br><small>${esc(user.email)}</small></td><td>${esc(user.phoneNumber || '--')}</td><td>${user.age ?? '--'}</td><td>${date(user.createdAt)}</td><td>${user.roles.map((role) => `<span class="role-badge">${esc(role)}</span>`).join('')}</td><td><button class="icon-action" data-user-index="${index}" aria-label="Ver ${esc(user.name)}"><i class="material-icons">visibility</i></button></td></tr>
    `).join('') : '<tr><td colspan="6" class="loading-row">No hay resultados.</td></tr>';
    table.querySelectorAll('[data-user-index]').forEach((button) => button.addEventListener('click', () => showUser(list[Number(button.dataset.userIndex)])));
  }
  function showUser(user) {
    document.getElementById('user-modal-content').innerHTML = `<p class="status-line"><span></span> Detalle de cuenta</p><h2>${esc(user.name)} ${esc(user.lastName)}</h2><div class="detail-list"><div><span>Correo</span><strong>${esc(user.email)}</strong></div><div><span>Telefono</span><strong>${esc(user.phoneNumber || '--')}</strong></div><div><span>Fecha de nacimiento</span><strong>${date(user.birthdate)}</strong></div><div><span>Edad calculada</span><strong>${user.age ?? '--'}</strong></div><div><span>Direccion</span><strong>${esc(user.address || 'Sin registrar')}</strong></div><div><span>Roles</span><strong>${esc(user.roles.join(', '))}</strong></div></div>`;
    M.Modal.getInstance(document.getElementById('user-modal')).open();
  }

  try {
    users = await DeadSignalAuth.api('/api/users');
    document.getElementById('user-count').textContent = users.length;
    render(users);
  } catch (err) { table.innerHTML = `<tr><td colspan="6" class="loading-row">${esc(err.message)}</td></tr>`; }
  document.getElementById('user-search').addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();
    render(users.filter((user) => `${user.name} ${user.lastName} ${user.email}`.toLowerCase().includes(query)));
  });
});
