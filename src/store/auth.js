import { atom } from 'nanostores';
import Cookies from 'js-cookie';

export const $user = atom(null);
export const $isAuthenticated = atom(false);

// Simulated user data for demo purposes
const DEMO_USER = {
  id: 1,
  email: 'john.doe@aaas.com',
  name: 'John Doe',
  role: 'Senior Life Engineer',
  avatar: 'JD'
};

export function login(email, password) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password) {
        const token = 'demo-jwt-token-' + Date.now();
        Cookies.set('auth-token', token, { expires: 7 });
        $user.set(DEMO_USER);
        $isAuthenticated.set(true);
        resolve({ success: true, user: DEMO_USER });
      } else {
        resolve({ success: false, error: 'Credenciales inválidas' });
      }
    }, 1000);
  });
}

export function register(email, password, name) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (email && password && name) {
        const token = 'demo-jwt-token-' + Date.now();
        Cookies.set('auth-token', token, { expires: 7 });
        const newUser = { ...DEMO_USER, email, name };
        $user.set(newUser);
        $isAuthenticated.set(true);
        resolve({ success: true, user: newUser });
      } else {
        resolve({ success: false, error: 'Todos los campos son obligatorios' });
      }
    }, 1000);
  });
}

export function logout() {
  Cookies.remove('auth-token');
  $user.set(null);
  $isAuthenticated.set(false);
}

export function checkAuth() {
  const token = Cookies.get('auth-token');
  if (token) {
    $user.set(DEMO_USER);
    $isAuthenticated.set(true);
    return true;
  }
  return false;
}