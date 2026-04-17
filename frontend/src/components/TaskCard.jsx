import React, { useState } from 'react';
import { Calendar, Clock, Edit2, Trash2, CheckCircle, Circle, AlertTriangle, RotateCcw } from 'lucide-react';

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isCompleted = task.status === 'Completed';
  const isInProgress = task.status === 'In Progress';

  // Format deadline
  let deadlineDisplay = null;
  let isOverdue = false;
  if (task.deadline) {
    const dl = new Date(task.deadline);
    const now = new Date();
    isOverdue = !isCompleted && dl < now;
    deadlineDisplay = dl.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }

  const createdDisplay = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  // Determine badge class
  let badgeClass = 'badge-pending';
  if (isCompleted) badgeClass = 'badge-completed';
  else if (isInProgress) badgeClass = 'badge-inprogress';

  // Next status for toggle
  let toggleLabel, toggleIcon, toggleClass;
  if (isCompleted) {
    toggleLabel = 'Mark Pending';
    toggleIcon = <RotateCcw size={16} />;
    toggleClass = 'btn-warning';
  } else {
    toggleLabel = 'Mark Done';
    toggleIcon = <CheckCircle size={16} />;
    toggleClass = 'btn-success';
  }

  return (
    <article className={`task-card glass-panel ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue-card' : ''}`}>
      {/* Accent bar */}
      <div className={`task-accent ${isCompleted ? 'accent-completed' : isOverdue ? 'accent-overdue' : isInProgress ? 'accent-inprogress' : 'accent-pending'}`} />

      <div className="task-card-header">
        <h3 className={`task-title ${isCompleted ? 'task-title-done' : ''}`}>{task.title}</h3>
        <span className={`task-badge ${badgeClass}`}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        {deadlineDisplay && (
          <div className={`task-meta-item ${isOverdue ? 'meta-overdue' : ''}`}>
            {isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
            <span>{deadlineDisplay}{isOverdue && ' · Overdue'}</span>
          </div>
        )}
        <div className="task-meta-item">
          <Calendar size={14} />
          <span>Created {createdDisplay}</span>
        </div>
      </div>

      {/* Delete confirm UI */}
      {confirmDelete ? (
        <div className="delete-confirm">
          <span>Delete this task?</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-danger btn-sm" onClick={() => { onDelete(task._id); setConfirmDelete(false); }}>
              Yes, delete
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-actions">
          <button
            className={`btn ${toggleClass}`}
            onClick={() => onToggleStatus(task)}
            style={{ flexGrow: 1 }}
          >
            {toggleIcon}
            {toggleLabel}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => onEdit(task)} aria-label="Edit task">
            <Edit2 size={16} />
          </button>
          <button
            className="btn btn-ghost btn-icon btn-icon-danger"
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
