import axios from 'axios';

const api = axios.create({ timeout: 10000 });

export async function fetchAll(url) {
  try {
    const { data } = await api.get(url);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function createEntity(url, payload) {
  const { data } = await api.post(url, payload);
  return data;
}

export async function updateEntity(url, id, payload) {
  const { data } = await api.put(`${url}/${id}`, payload);
  return data;
}

export async function deleteEntity(url, id) {
  await api.delete(`${url}/${id}`);
}
