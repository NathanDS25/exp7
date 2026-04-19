const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST /tasks — Create a new task
router.post('/', async (req, res) => {
  try {
    const { title, description, deadline, status, priority, tags, subtasks, notes } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ message: 'Title is required.' });
    }

    const task = new Task({ title, description, deadline, status, priority, tags, subtasks, notes });
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /tasks — Get all tasks (optional ?status= filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /tasks/:id — Get single task
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /tasks/:id — Update a task
router.put('/:id', async (req, res) => {
  try {
    const { title, description, deadline, status, priority, tags, subtasks, notes } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, deadline, status, priority, tags, subtasks, notes },
      { new: true, runValidators: true }
    );

    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /tasks/:id/subtasks/:subId — Toggle a subtask's done state
router.patch('/:id/subtasks/:subId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const subtask = task.subtasks.id(req.params.subId);
    if (!subtask) return res.status(404).json({ message: 'Subtask not found.' });

    subtask.done = !subtask.done;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    res.json({ message: 'Task deleted successfully.', id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
