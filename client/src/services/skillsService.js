import { getToken } from "./authService";

const API_URL =
  import.meta.env.VITE_API_URL?.replace("/projects", "/skills") ||
  "http://localhost:5000/api/skills";


export async function getSkills() {
  const response = await fetch(API_URL);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getSkill(id) {
  const response = await fetch(`${API_URL}/${id}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function createSkill(formData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateSkill(id, formData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
    body: formData,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function archiveSkill(id) {
    const response = await fetch(
        `${API_URL}/${id}/archive`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message);
    }

    return data;
}

export async function getArchivedSkills() {
  const response = await fetch(`${API_URL}/archived`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function restoreSkill(id) {
  const response = await fetch(
    `${API_URL}/${id}/restore`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

// export async function getArchivedSkills() {
//   const response = await fetch(
//     `${API_URL}?archived=true`
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message);
//   }

//   return data;
// }

export async function deleteSkill(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}