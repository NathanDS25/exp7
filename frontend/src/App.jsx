import React, { useState, useEffect, useMemo } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api';
import TaskDashboard from './components/TaskDashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { ToastContainer, useToast } from './components/ToastContainer';
import { Plus } from 'lucide-react';
import './index.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const { toasts, addToast } = useToast();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      addToast('Cannot connect to backend server. Make sure it is running!', 'error');
    }
  };

  const handleCreateOrUpdate = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask._id, taskData);
        setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
        addToast('Task updated successfully!', 'success');
      } else {
        const created = await createTask(taskData);
        setTasks(prev => [created, ...prev]);
        addToast('Task created successfully!', 'success');
      }
    } catch (err) {
      addToast(`Error: ${err.message}`, 'error');
      throw err; // throw back to form so it doesn't close on error
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      const updated = await updateTask(task._id, { ...task, status: newStatus });
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
      addToast(
        newStatus === 'Completed' ? 'Great job! Marked as completed 🎉' : 'Marked as pending', 
        newStatus === 'Completed' ? 'success' : 'warning'
      );
    } catch (err) {
      addToast(`Error updating status: ${err.message}`, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      addToast('Task deleted!', 'info');
    } catch (err) {
      addToast(`Error deleting task: ${err.message}`, 'error');
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const filteredTasks = useMemo(() => {
    if (currentFilter === 'All') return tasks;
    return tasks.filter(t => t.status === currentFilter);
  }, [tasks, currentFilter]);

  return (
    <div className="app-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dot-grid" />

      <div className="container">
        <header>
          <div className="header-badge">✦ Task Manager</div>
          <h1 className="header-title">Task Tracker</h1>
          <p className="header-subtitle">Stay organized, stay productive.</p>
        </header>

        <TaskDashboard tasks={tasks} />

        <div className="action-bar">
          <div className="filters">
            {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${currentFilter === f ? 'active' : ''}`}
                onClick={() => setCurrentFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="btn btn-primary" onClick={openNewTaskModal}>
            <Plus size={18} /> New Task
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          currentFilter={currentFilter}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        <TaskForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={editingTask}
          onSubmit={handleCreateOrUpdate}
        />

        <ToastContainer toasts={toasts} />
      </div>
    </div>
  );
}

export default App;
