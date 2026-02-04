// real API integration
import { saveAuthUser } from './baadshop.js';

const STORAGE_KEY = 'badshop_user';
export const API_BASE = window.API_BASE || '/api'; // keep window.API_BASE for runtime injection

async function apiPost(path, body) {
  const res = await fetch((API_BASE || '') + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errMsg = data?.message || `HTTP ${res.status}`;
    throw new Error(errMsg);
  }
  return data;
}

export const initAuth = () => {
  const loginBtn = document.getElementById('login-btn');
  const regBtn = document.getElementById('reg-btn');

  if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (!email || !password) { alert('Enter email and password'); return; }

      try {
        const resp = await apiPost('/auth/login', { email, password });
        const payload = resp.data || resp;
        const user = payload.user || null;
        const token = payload.token || null;
        if (!token) throw new Error('No token returned from server');

        saveAuthUser({ user, token });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
        window.location.href = 'profile.html';
      } catch (err) {
        alert('Login failed: ' + err.message);
      }
    });
  }

  if (regBtn) {
    regBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;
      if (!name || !email || !password) { alert('Fill required fields'); return; }

      const [firstName, ...rest] = name.split(' ');
      const lastName = rest.join(' ') || '';

      try {
        const resp = await apiPost('/auth/register', { username: name, email, password, firstName, lastName });
        const payload = resp.data || resp;
        const user = payload.user || null;
        const token = payload.token || null;
        if (!token) throw new Error('No token returned from server');

        saveAuthUser({ user, token });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
        window.location.href = 'profile.html';
      } catch (err) {
        alert('Registration failed: ' + err.message);
      }
    });
  }
};