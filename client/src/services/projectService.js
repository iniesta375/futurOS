import { getToken } from "./authService";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/projects";

// ============================
// GET ALL PROJECTS
// ============================

export async function getProjects() {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch projects");
  }

  return data;
}

// ============================
// GET SINGLE PROJECT
// ============================

export async function getProject(id) {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Project not found");
  }

  return data;
}

// ============================
// CREATE PROJECT
// ============================

export async function createProject(project) {
  const token = getToken();

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create project");
  }

  return data;
}

// ============================
// UPDATE PROJECT
// ============================

export async function updateProject(id, project) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update project");
  }

  return data;
}

// ============================
// DELETE PROJECT
// ============================

export async function deleteProject(id) {
  const token = getToken();

  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete project");
  }

  return data;
}