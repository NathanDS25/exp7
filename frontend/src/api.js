export const API_BASE = '/tasks';

export const fetchTasks = async (status = '') => {
  const url = status && status !== 'All' ? `${API_BASE}?status=${status}` : API_BASE;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
};

export const createTask = async (taskData) => {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to create task');
  return data;
};

export const updateTask = async (id, taskData) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update task');
  return data;
};

export const deleteTask = async (id) => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to delete task');
  return data;
};
