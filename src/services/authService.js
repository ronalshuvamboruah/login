import api from './api.js';

export async function login(name, email, password) {
  try {
    // call backend login endpoint (include name if your API expects it)
    const res = await api.post('/users', { name, email, password });
    const token = res.data && res.data.token;
    if (token) localStorage.setItem('auth_token', token);
    return res.data;
  } catch (err) {
    const message = err?.response?.data?.message || err?.message || 'Login failed';
    throw new Error(message);
  }
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function getToken() {
  return localStorage.getItem('auth_token');
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}