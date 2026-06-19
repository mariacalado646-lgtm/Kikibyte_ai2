const AUTH_KEY = "loggedInUser";

export function saveSession(user) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function getSession() {
  const data = localStorage.getItem(AUTH_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn() {
  return getSession() !== null;
}