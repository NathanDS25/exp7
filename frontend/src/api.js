export const API_BASE = '/_/backend/tasks';

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

export const toggleSubtask = async (taskId, subId) => {
  const res = await fetch(`${API_BASE}/${taskId}/subtasks/${subId}`, {
    method: 'PATCH',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle subtask');
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

export const exportTasksCSV = (tasks) => {
  const headers = [
    'Title', 'Description', 'Status', 'Priority', 'Tags',
    'Deadline', 'Created At', 'Notes', 'Subtasks',
  ];
  const esc = (v) => `"${(v || '').toString().replace(/"/g, '""')}"`;

  const rows = tasks.map(t => [
    esc(t.title),
    esc(t.description),
    t.status || '',
    t.priority || 'Medium',
    esc((t.tags || []).join('; ')),
    t.deadline ? new Date(t.deadline).toLocaleString('en-IN') : '',
    new Date(t.createdAt).toLocaleString('en-IN'),
    esc(t.notes),
    esc((t.subtasks || []).map(s => `${s.done ? '[x]' : '[ ]'} ${s.text}`).join(' | ')),
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tasks-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
