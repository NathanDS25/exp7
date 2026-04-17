import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setStatus(initialData.status || 'Pending');

        if (initialData.deadline) {
          const dt = new Date(initialData.deadline);
          // Format date as YYYY-MM-DD for date input
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          setDeadlineDate(`${yyyy}-${mm}-${dd}`);
          // Format time as HH:MM for time input
          const hh = String(dt.getHours()).padStart(2, '0');
          const min = String(dt.getMinutes()).padStart(2, '0');
          setDeadlineTime(`${hh}:${min}`);
        } else {
          setDeadlineDate('');
          setDeadlineTime('');
        }
      } else {
        setTitle('');
        setDescription('');
        setDeadlineDate('');
        setDeadlineTime('');
        setStatus('Pending');
      }
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    // Combine date + time into ISO string, or null if no date
    let deadlineISO = null;
    if (deadlineDate) {
      const timeStr = deadlineTime || '00:00';
      deadlineISO = new Date(`${deadlineDate}T${timeStr}:00`).toISOString();
    }

    setIsLoading(true);
    try {
      await onSubmit({ title, description, deadline: deadlineISO, status });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const isEdit = !!initialData;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content glass-panel"
        style={{ background: 'var(--bg-dark)' }}
        onClick={e => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={22} />
        </button>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem', fontWeight: 600 }}>
          {isEdit ? '✏️ Edit Task' : '✨ Create New Task'}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-title">Task Title *</label>
            <input
              id="task-title"
              type="text"
              className={`form-control ${error ? 'invalid' : ''}`}
              placeholder="What needs to be done?"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              autoFocus
            />
            {error && (
              <span style={{ color: 'var(--danger)', fontSize: '0.82rem', marginTop: '0.4rem', display: 'block' }}>
                ⚠ {error}
              </span>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-description">Description (optional)</label>
            <textarea
              id="task-description"
              className="form-control"
              placeholder="Add some details..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* Deadline — split into date + time */}
          <div className="form-group">
            <label className="form-label">Deadline (optional)</label>
            <div className="deadline-row">
              <div className="deadline-field">
                <label className="deadline-sub-label" htmlFor="task-deadline-date">Date</label>
                <input
                  id="task-deadline-date"
                  type="date"
                  className="form-control"
                  value={deadlineDate}
                  onChange={e => setDeadlineDate(e.target.value)}
                />
              </div>
              <div className="deadline-field">
                <label className="deadline-sub-label" htmlFor="task-deadline-time">Time</label>
                <input
                  id="task-deadline-time"
                  type="time"
                  className="form-control"
                  value={deadlineTime}
                  onChange={e => setDeadlineTime(e.target.value)}
                  disabled={!deadlineDate}
                />
              </div>
            </div>
            {deadlineDate && (
              <button
                type="button"
                className="clear-deadline-btn"
                onClick={() => { setDeadlineDate(''); setDeadlineTime(''); }}
              >
                Clear deadline
              </button>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-status">Status</label>
            <div className="status-pills">
              {['Pending', 'In Progress', 'Completed'].map(s => (
                <button
                  key={s}
                  type="button"
                  className={`status-pill ${status === s ? 'status-pill-active' : ''} status-pill-${s.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setStatus(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
