import React from 'react';
import { CheckCircle, Clock, Layers, AlertTriangle } from 'lucide-react';

const TaskDashboard = ({ tasks }) => {
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'Pending').length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const overdue = tasks.filter(t => {
    if (!t.deadline || t.status === 'Completed') return false;
    return new Date(t.deadline) < new Date();
  }).length;

  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard">
        <div className="stat-card glass-panel all">
          <div className="stat-icon-wrap stat-icon-all"><Layers size={20} /></div>
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card glass-panel pending">
          <div className="stat-icon-wrap stat-icon-pending"><Clock size={20} /></div>
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pending}</span>
        </div>
        <div className="stat-card glass-panel inprogress">
          <div className="stat-icon-wrap stat-icon-inprogress"><Clock size={20} /></div>
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgress}</span>
        </div>
        <div className="stat-card glass-panel completed">
          <div className="stat-icon-wrap stat-icon-completed"><CheckCircle size={20} /></div>
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completed}</span>
        </div>
        {overdue > 0 && (
          <div className="stat-card glass-panel overdue-stat">
            <div className="stat-icon-wrap stat-icon-overdue"><AlertTriangle size={20} /></div>
            <span className="stat-label">Overdue</span>
            <span className="stat-value overdue-value">{overdue}</span>
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="progress-section glass-panel">
          <div className="progress-header">
            <span className="progress-label">Overall Progress</span>
            <span className="progress-pct">{completionPct}%</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
