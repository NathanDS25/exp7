import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const TaskForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle]             = useState('');
  const [description, setDescription] = useState('');
  const [deadlineDate, setDeadlineDate] = useState('');
  const [deadlineTime, setDeadlineTime] = useState('');
  const [status, setStatus]           = useState('Pending');
  const [priority, setPriority]       = useState('Medium');
  const [tagsInput, setTagsInput]     = useState('');
  const [notes, setNotes]             = useState('');
  const [subtasks, setSubtasks]       = useState([]);
  const [subtaskInput, setSubtaskInput] = useState('');
  const [error, setError]             = useState('');
  const [isLoading, setIsLoading]     = useState(false);
  const subInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '');
        setDescription(initialData.description || '');
        setStatus(initialData.status || 'Pending');
        setPriority(initialData.priority || 'Medium');
        setTagsInput((initialData.tags || []).join(', '));
        setNotes(initialData.notes || '');
        setSubtasks(initialData.subtasks || []);

        if (initialData.deadline) {
          const dt = new Date(initialData.deadline);
          const yyyy = dt.getFullYear();
          const mm   = String(dt.getMonth() + 1).padStart(2, '0');
          const dd   = String(dt.getDate()).padStart(2, '0');
          setDeadlineDate(`${yyyy}-${mm}-${dd}`);
          const hh  = String(dt.getHours()).padStart(2, '0');
          const min = String(dt.getMinutes()).padStart(2, '0');
          setDeadlineTime(`${hh}:${min}`);
        } else {
          setDeadlineDate('');
          setDeadlineTime('');
        }
      } else {
        setTitle(''); setDescription(''); setDeadlineDate(''); setDeadlineTime('');
        setStatus('Pending'); setPriority('Medium'); setTagsInput('');
        setNotes(''); setSubtasks([]);
      }
      setSubtaskInput('');
      setError('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const addSubtask = () => {
    const text = subtaskInput.trim();
    if (!text) return;
    setSubtasks(prev => [...prev, { text, done: false }]);
    setSubtaskInput('');
    subInputRef.current?.focus();
  };

  const removeSubtask = (idx) => setSubtasks(prev => prev.filter((_, i) => i !== idx));

  const handleSubtaskKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); addSubtask(); } };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Title is required'); return; }

    let deadlineISO = null;
    if (deadlineDate) {
      const timeStr = deadlineTime || '00:00';
      deadlineISO = new Date(`${deadlineDate}T${timeStr}:00`).toISOString();
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    setIsLoading(true);
    try {
      await onSubmit({
        title, description, deadline: deadlineISO, status, priority, tags, notes,
        subtasks: subtasks.map(s => ({ text: s.text, done: s.done })),
      });
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
              id="task-title" type="text"
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
              id="task-description" className="form-control"
              placeholder="Add some details... (HTML allowed)"
              value={description} onChange={e => setDescription(e.target.value)}
              style={{ minHeight: '80px', fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-pills">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p} type="button"
                  className={`priority-pill priority-pill-${p.toLowerCase()} ${priority === p ? 'priority-pill-active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-tags">Tags (comma-separated)</label>
            <input
              id="task-tags" type="text" className="form-control"
              placeholder="e.g. work, urgent, design"
              value={tagsInput} onChange={e => setTagsInput(e.target.value)}
            />
          </div>

          {/* Deadline */}
          <div className="form-group">
            <label className="form-label">Deadline (optional)</label>
            <div className="deadline-row">
              <div className="deadline-field">
                <label className="deadline-sub-label" htmlFor="task-deadline-date">Date</label>
                <input id="task-deadline-date" type="date" className="form-control"
                  value={deadlineDate} onChange={e => setDeadlineDate(e.target.value)} />
              </div>
              <div className="deadline-field">
                <label className="deadline-sub-label" htmlFor="task-deadline-time">Time</label>
                <input id="task-deadline-time" type="time" className="form-control"
                  value={deadlineTime} onChange={e => setDeadlineTime(e.target.value)}
                  disabled={!deadlineDate} />
              </div>
            </div>
            {deadlineDate && (
              <button type="button" className="clear-deadline-btn"
                onClick={() => { setDeadlineDate(''); setDeadlineTime(''); }}>
                Clear deadline
              </button>
            )}
          </div>

          {/* Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <div className="status-pills">
              {['Pending', 'In Progress', 'Completed'].map(s => (
                <button key={s} type="button"
                  className={`status-pill ${status === s ? 'status-pill-active' : ''} status-pill-${s.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setStatus(s)}>{s}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label" htmlFor="task-notes">Notes (optional)</label>
            <textarea
              id="task-notes" className="form-control"
              placeholder="Any additional context or notes... (HTML allowed)"
              value={notes} onChange={e => setNotes(e.target.value)}
              style={{ minHeight: '80px', fontFamily: 'monospace', fontSize: '0.85rem' }}
            />
          </div>

          {/* Subtasks */}
          <div className="form-group">
            <label className="form-label">Subtasks</label>
            <div className="subtask-input-row">
              <input
                type="text" className="form-control"
                placeholder="Add a subtask and press Enter…"
                value={subtaskInput}
                onChange={e => setSubtaskInput(e.target.value)}
                onKeyDown={handleSubtaskKey}
                ref={subInputRef}
              />
              <button type="button" className="btn btn-ghost" onClick={addSubtask}
                style={{ flexShrink: 0 }} aria-label="Add subtask">
                <Plus size={16} />
              </button>
            </div>
            {subtasks.length > 0 && (
              <div className="subtask-list-form">
                {subtasks.map((s, idx) => (
                  <div key={idx} className="subtask-list-item">
                    <span>{s.text}</span>
                    <button type="button" className="subtask-remove"
                      onClick={() => removeSubtask(idx)} aria-label="Remove subtask">
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
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
