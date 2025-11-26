import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

export async function login(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
  saveToken(res.data.token);
  return res.data;
}

export async function register(email: string, password: string) {
  const res = await axios.post(`${API_BASE}/auth/register`, { email, password });
  saveToken(res.data.token);
  return res.data;
}

export async function refresh() {
  const token = localStorage.getItem("refreshToken");
  if (!token) return null;

  const res = await axios.post(`${API_BASE}/auth/refresh`, { token });
  saveToken(res.data.token);
  return res.data;
}

export function saveToken(token: string) {
  localStorage.setItem("jwt", token);
}

export function getToken(): string | null {
  return localStorage.getItem("jwt");
}

export function logout() {
  localStorage.removeItem("jwt");
  localStorage.removeItem("refreshToken");
}

export function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
