import React, { useState, useEffect, useMemo } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask, toggleSubtask, exportTasksCSV } from './api';
import TaskDashboard from './components/TaskDashboard';
import TaskList from './components/TaskList';
import TaskBoard from './components/TaskBoard';
import TaskCalendar from './components/TaskCalendar';
import TaskForm from './components/TaskForm';
import SearchSortBar from './components/SearchSortBar';
import AnalyticsPanel from './components/AnalyticsPanel';
import DarkLightToggle from './components/DarkLightToggle';
import { ToastContainer, useToast } from './components/ToastContainer';
import { Plus, Download, List, LayoutGrid, Calendar as CalendarIcon } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import './index.css';

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

function App() {
  const [tasks, setTasks]               = useState([]);
  const [currentFilter, setCurrentFilter] = useState('All');
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [searchQuery, setSearchQuery]   = useState('');
  const [sortBy, setSortBy]             = useState('newest');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode]         = useState('list');
  const [theme, setTheme] = useState(() => localStorage.getItem('tt-theme') || 'dark');
  const { toasts, addToast } = useToast();

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tt-theme', theme);
  }, [theme]);

  useEffect(() => { loadTasks(); }, []);

  const loadTasks = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
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
      throw err;
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

  const handleChangeStatus = async (taskId, newStatus) => {
    // Used explicitly by the drag and drop Kanban Board
    // Optimistic UI update for DND responsiveness
    const taskTarget = tasks.find(t => t._id === taskId);
    if (!taskTarget || taskTarget.status === newStatus) return;

    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      await updateTask(taskId, { ...taskTarget, status: newStatus });
      if (newStatus === 'Completed') addToast('Great job! Marked as completed 🎉', 'success');
    } catch (err) {
      // Revert if error
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: taskTarget.status } : t));
      addToast(`Error moving task: ${err.message}`, 'error');
    }
  };

  const handleToggleSubtask = async (taskId, subId) => {
    try {
      const updated = await toggleSubtask(taskId, subId);
      setTasks(prev => prev.map(t => t._id === updated._id ? updated : t));
    } catch (err) {
      addToast(`Error toggling subtask: ${err.message}`, 'error');
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

  const handleExportCSV = () => {
    if (tasks.length === 0) { addToast('No tasks to export!', 'warning'); return; }
    exportTasksCSV(tasks);
    addToast(`Exported ${tasks.length} tasks as CSV! 📥`, 'success');
  };

  const openNewTaskModal = () => { setEditingTask(null); setIsModalOpen(true); };
  const openEditModal    = (task) => { setEditingTask(task); setIsModalOpen(true); };

  // Count per status for filter badges
  const statusCounts = useMemo(() => ({
    All:          tasks.length,
    Pending:      tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed:    tasks.filter(t => t.status === 'Completed').length,
  }), [tasks]);

  // Filter + Search + Sort
  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (currentFilter !== 'All') {
      result = result.filter(t => t.status === currentFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q))) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':   return new Date(a.createdAt) - new Date(b.createdAt);
        case 'deadline':
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline) - new Date(b.deadline);
        case 'priority':
          return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
        case 'title':    return a.title.localeCompare(b.title);
        default:         return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [tasks, currentFilter, searchQuery, sortBy]);

  return (
    <div className="app-root">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      <div className="dot-grid" />
      <ParticleBackground theme={theme} />

      <div className="container">
        <header>
          <div className="header-top-row">
            <div className="header-badge">✦ Task Manager</div>
            <DarkLightToggle theme={theme} onToggle={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} />
          </div>
          <h1 className="header-title">Task Tracker</h1>
          <p className="header-subtitle">Stay organized, stay productive.</p>
        </header>

        <TaskDashboard
          tasks={tasks}
          showAnalytics={showAnalytics}
          onToggleAnalytics={() => setShowAnalytics(v => !v)}
        />

        {showAnalytics && <AnalyticsPanel tasks={tasks} />}

        <div className="action-bar">
          <div className="filters">
            {['All', 'Pending', 'In Progress', 'Completed'].map(f => (
              <button
                key={f}
                className={`filter-btn ${currentFilter === f ? 'active' : ''}`}
                onClick={() => setCurrentFilter(f)}
              >
                {f}
                <span className="filter-count">{statusCounts[f]}</span>
              </button>
            ))}
          </div>
          <div className="action-bar-right">
            <div className="view-switcher glass-panel">
              <button 
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} 
                onClick={() => setViewMode('list')} title="List View"
              >
                <List size={16} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'board' ? 'active' : ''}`} 
                onClick={() => setViewMode('board')} title="Kanban Board View"
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`} 
                onClick={() => setViewMode('calendar')} title="Calendar View"
              >
                <CalendarIcon size={16} />
              </button>
            </div>
            <button className="btn btn-export" onClick={handleExportCSV} title="Export all tasks as CSV" id="export-csv-btn">
              <Download size={15} /> Export
            </button>
            <button className="btn btn-primary" onClick={openNewTaskModal} id="new-task-btn">
              <Plus size={18} /> New Task
            </button>
          </div>
        </div>

        <SearchSortBar
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          sortBy={sortBy}
          onSort={setSortBy}
        />

        {viewMode === 'list' && (
          <TaskList
            tasks={filteredTasks}
            currentFilter={currentFilter}
            onToggleStatus={handleToggleStatus}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleSubtask={handleToggleSubtask}
          />
        )}
        
        {viewMode === 'board' && (
          <TaskBoard
            tasks={filteredTasks}
            onToggleStatus={handleToggleStatus}
            onChangeStatus={handleChangeStatus}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {viewMode === 'calendar' && (
          <TaskCalendar
            tasks={filteredTasks}
            onSelectTask={openEditModal}
          />
        )}

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
