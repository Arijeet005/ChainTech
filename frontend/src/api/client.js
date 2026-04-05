import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  timeout: 10000
});

export async function fetchTasks(category) {
  const params = category ? { category } : undefined;
  const { data } = await api.get("/api/tasks", { params });
  return data;
}

export async function createTask(payload) {
  const { data } = await api.post("/api/tasks", payload);
  return data;
}

export async function updateTask(id, payload) {
  const { data } = await api.put(`/api/tasks/${id}`, payload);
  return data;
}

export async function completeTask(id) {
  const { data } = await api.patch(`/api/tasks/${id}/complete`);
  return data;
}

export async function deleteTask(id) {
  const { data } = await api.delete(`/api/tasks/${id}`);
  return data;
}
