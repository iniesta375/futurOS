const API_URL =
  import.meta.env.VITE_API_URL?.replace("/projects", "/dashboard") ||
  "http://localhost:5000/api/dashboard";

export async function getDashboardStats() {
  const response = await fetch(`${API_URL}/stats`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}