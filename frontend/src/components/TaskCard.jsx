import React, { useState } from 'react';
import {
  Calendar, Clock, Edit2, Trash2, CheckCircle,
  AlertTriangle, RotateCcw, ChevronDown, ChevronUp,
  StickyNote, ListChecks,
} from 'lucide-react';

const PRIORITY_CONFIG = {
  High:   { className: 'priority-high',   label: 'High' },
  Medium: { className: 'priority-medium', label: 'Medium' },
  Low:    { className: 'priority-low',    label: 'Low' },
};

const TaskCard = ({ task, onToggleStatus, onEdit, onDelete, onToggleSubtask, isBoardView }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showNotes, setShowNotes]         = useState(false);
  const [showSubtasks, setShowSubtasks]   = useState(true);

  const isCompleted  = task.status === 'Completed';
  const isInProgress = task.status === 'In Progress';
  const now          = new Date();

  // Deadline processing
  let deadlineDisplay = null;
  let isOverdue = false;
  let isUrgent  = false;
  if (task.deadline) {
    const dl = new Date(task.deadline);
    isOverdue = !isCompleted && dl < now;
    isUrgent  = !isCompleted && !isOverdue && (dl - now) < 24 * 60 * 60 * 1000;
    deadlineDisplay = dl.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true,
    });
  }

  const createdDisplay = new Date(task.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  // Badge classes
  let badgeClass = 'badge-pending';
  if (isCompleted)  badgeClass = 'badge-completed';
  else if (isInProgress) badgeClass = 'badge-inprogress';

  // Accent bar
  let accentClass = 'accent-pending';
  if (isCompleted)   accentClass = 'accent-completed';
  else if (isOverdue) accentClass = 'accent-overdue';
  else if (isUrgent)  accentClass = 'accent-urgent';
  else if (isInProgress) accentClass = 'accent-inprogress';

  // Toggle button
  let toggleLabel, toggleIcon, toggleClass;
  if (isCompleted) {
    toggleLabel = 'Mark Pending'; toggleIcon = <RotateCcw size={16} />; toggleClass = 'btn-warning';
  } else {
    toggleLabel = 'Mark Done';    toggleIcon = <CheckCircle size={16} />;  toggleClass = 'btn-success';
  }

  const priority    = task.priority || 'Medium';
  const priorityCfg = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.Medium;
  const tags        = task.tags || [];
  const subtasks    = task.subtasks || [];
  const doneCount   = subtasks.filter(s => s.done).length;
  const subPct      = subtasks.length > 0 ? (doneCount / subtasks.length) * 100 : 0;

  const cardClass = [
    'task-card glass-panel',
    isCompleted  ? 'completed'    : '',
    isOverdue    ? 'overdue-card' : '',
    isUrgent     ? 'urgent-card'  : '',
  ].filter(Boolean).join(' ');

  return (
    <article className={cardClass}>
      {/* Accent bar */}
      <div className={`task-accent ${accentClass}`} />

      {/* Header: title + badges */}
      <div className="task-card-header">
        <h3 className={`task-title ${isCompleted ? 'task-title-done' : ''}`}>{task.title}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
          <span className={`task-badge ${badgeClass}`}>{task.status}</span>
          <span className={`priority-badge ${priorityCfg.className}`}>{priorityCfg.label}</span>
        </div>
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="task-tags">
          {tags.map((tag, i) => <span key={i} className="tag-chip">#{tag}</span>)}
        </div>
      )}

      {/* Description */}
      {task.description && (
        <div 
          className="task-desc ql-editor-preview" 
          dangerouslySetInnerHTML={{ __html: task.description }} 
        />
      )}

      {/* Subtasks */}
      {subtasks.length > 0 && (
        <div className="card-subtasks">
          <div className="subtask-header">
            <button className="subtask-toggle-btn" onClick={() => setShowSubtasks(v => !v)}>
              <ListChecks size={12} />
              <span>Subtasks ({doneCount}/{subtasks.length})</span>
              {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
          </div>
          <div className="subtask-mini-progress">
            <div className="subtask-mini-fill" style={{ width: `${subPct}%` }} />
          </div>
          {showSubtasks && (
            <div className="subtask-check-list">
              {subtasks.map(s => (
                <label key={s._id} className={`subtask-check-item ${s.done ? 'done' : ''}`}>
                  <input
                    type="checkbox"
                    className="subtask-checkbox"
                    checked={s.done}
                    onChange={() => onToggleSubtask(task._id, s._id)}
                  />
                  <span>{s.text}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Notes toggle */}
      {task.notes && (
        <div style={{ marginTop: '0.45rem' }}>
          <button className="notes-toggle-btn" onClick={() => setShowNotes(v => !v)}>
            <StickyNote size={12} />
            <span>{showNotes ? 'Hide notes' : 'Show notes'}</span>
            {showNotes ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
          {showNotes && (
            <div 
              className="card-notes ql-editor-preview" 
              dangerouslySetInnerHTML={{ __html: task.notes }} 
            />
          )}
        </div>
      )}

      {/* Meta: deadline + created */}
      <div className="task-meta">
        {deadlineDisplay && (
          <div className={`task-meta-item ${isOverdue ? 'meta-overdue' : isUrgent ? 'meta-urgent' : ''}`}>
            {isOverdue ? <AlertTriangle size={14} /> : <Clock size={14} />}
            <span>
              {deadlineDisplay}
              {isOverdue && ' · Overdue'}
              {isUrgent  && ' · Due soon!'}
            </span>
          </div>
        )}
        <div className="task-meta-item">
          <Calendar size={14} />
          <span>Created {createdDisplay}</span>
        </div>
      </div>

      {/* Actions / Delete confirm */}
      {confirmDelete ? (
        <div className="delete-confirm">
          <span>Delete this task?</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-danger btn-sm"
              onClick={() => { onDelete(task._id); setConfirmDelete(false); }}>
              Yes, delete
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => setConfirmDelete(false)}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="task-actions">
          <button className={`btn ${toggleClass}`} onClick={() => onToggleStatus(task)} style={{ flexGrow: 1 }}>
            {toggleIcon} {toggleLabel}
          </button>
          <button className="btn btn-ghost btn-icon" onClick={() => onEdit(task)} aria-label="Edit task">
            <Edit2 size={16} />
          </button>
          <button className="btn btn-ghost btn-icon btn-icon-danger"
            onClick={() => setConfirmDelete(true)} aria-label="Delete task">
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </article>
  );
};

export default TaskCard;
