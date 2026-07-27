const API_URL = "http://localhost:5000/api/auth";

/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export async function login(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  saveToken(data.token);

  saveUser(data.user);

  return data;
}

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export async function register(name, email, password) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| Token
|--------------------------------------------------------------------------
*/

export function saveToken(token) {
  localStorage.setItem("futuros_token", token);
}

export function getToken() {
  return localStorage.getItem("futuros_token");
}

/*
|--------------------------------------------------------------------------
| User
|--------------------------------------------------------------------------
*/

export function saveUser(user) {
  localStorage.setItem("futuros_user", JSON.stringify(user));
}

export function getUser() {
  const user = localStorage.getItem("futuros_user");

  return user ? JSON.parse(user) : null;
}

/*
|--------------------------------------------------------------------------
| Auth State
|--------------------------------------------------------------------------
*/

export function isLoggedIn() {
  return !!getToken();
}

/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export function logout() {
  localStorage.removeItem("futuros_token");

  localStorage.removeItem("futuros_user");
}