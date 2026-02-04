import { getAuthUser, readOrders, saveAuthUser } from './baadshop.js';

export const initProfile = () => {
  const rawUser = localStorage.getItem('badshop_user') || 'null';
  const userObj = JSON.parse(rawUser);
  if (!userObj) return location.href = 'login.html';

  const user = userObj.user || userObj;
  const userInfo = document.getElementById('user-info');
  if (userInfo) userInfo.innerHTML = `<div><strong>${user.name || user.username || user.email}</strong><div class="small">${user.email}</div></div>`;

  const logoutBtn = document.getElementById('logout');
  if (logoutBtn) logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('badshop_user');
    location.href = 'index.html';
  });

  const orders = JSON.parse(localStorage.getItem('badshop_orders') || '[]');
  const root = document.getElementById('orders');
  if (!root) return;
  if (orders.length === 0) root.textContent = 'No orders yet';
  else root.innerHTML = orders.map(o => `
    <div style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px">
      <div style="font-weight:700">${o.id}</div>
      <div class="small">Date: ${new Date(o.createdAt).toLocaleString()}</div>
      <div>Items: ${o.items.length} — Total: ${o.total.toLocaleString()} KZT</div>
    </div>`).join('');
};