import React from 'react';
import TaskCard from './TaskCard';
import { Layers } from 'lucide-react';

const TaskList = ({ tasks, onToggleStatus, onEdit, onDelete, currentFilter, onToggleSubtask }) => {
  if (tasks.length === 0) {
    return (
      <div className="empty-state glass-panel">
        <Layers className="empty-icon" />
        <h3>No tasks found</h3>
        <p>{currentFilter === 'All' ? 'Create your first task above!' : `No ${currentFilter} tasks right now.`}</p>
      </div>
    );
  }

  return (
    <div className="task-grid">
      {tasks.map((task, index) => (
        <div
          key={task._id}
          className="task-card-wrapper"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <TaskCard
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleSubtask={onToggleSubtask}
          />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
