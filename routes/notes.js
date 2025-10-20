const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const Category = require('../models/Category');
const { isLoggedIn } = require('../middleware/auth');

// Show form to create new note
router.get('/new', isLoggedIn, async (req, res) => {
    try {
        const categoryId = req.query.category;
        const category = await Category.findOne({ _id: categoryId, user: req.user.id })
            .populate('project');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.render('notes/new', { category, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error loading form' });
    }
});

// Create new note
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const note = new Note({
            title,
            content,
            category,
            user: req.user.id
        });
        await note.save();
        res.redirect('/categories/' + category);
    } catch (err) {
        res.status(500).json({ message: 'Error creating note' });
    }
});

// View single note
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id })
            .populate({
                path: 'category',
                populate: { path: 'project' }
            });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.render('notes/show', { note, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching note' });
    }
});

// Show edit form
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id })
            .populate('category');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.render('notes/edit', { note, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching note' });
    }
});

// Update note
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const { title, content } = req.body;
        const updatedNote = await Note.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, content },
            { new: true }
        );
        if (updatedNote) {
            res.redirect('/notes/' + updatedNote._id);
        } else {
            res.status(404).json({ message: 'Note not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating note' });
    }
});

// Delete note
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        const categoryId = note.category;
        await Note.deleteOne({ _id: req.params.id });
        res.redirect('/categories/' + categoryId);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting note' });
    }
});

// Toggle note completion
router.post('/:id/toggle', isLoggedIn, async (req, res) => {
  try {
      const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }
      
      note.completed = !note.completed;
      note.completedAt = note.completed ? new Date() : null;
      await note.save();
      
      res.redirect('/categories/' + note.category);
  } catch (err) {
      res.status(500).json({ message: 'Error updating note' });
  }
});

module.exports = router;