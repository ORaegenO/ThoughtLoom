const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Project = require('../models/Project');
const Note = require('../models/Note'); 
const { isLoggedIn } = require('../middleware/auth');

// Show form to create new category
router.get('/new', isLoggedIn, async (req, res) => {
    try {
        const projectId = req.query.project;
        const project = await Project.findOne({ _id: projectId, user: req.user.id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.render('categories/new', { project, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error loading form' });
    }
});

// Create new category
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { name, description, color, project } = req.body;
        const category = new Category({
            name,
            description,
            color: color || '#10B981',
            project,
            user: req.user.id
        });
        await category.save();
        res.redirect('/projects/' + project);
    } catch (err) {
        res.status(500).json({ message: 'Error creating category' });
    }
});

// View single category with its notes
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, user: req.user.id })
            .populate('project');
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        // Fetch notes for this category
        const Note = require('../models/Note');
        const notes = await Note.find({ category: category._id, user: req.user.id }).sort({ createdAt: -1 });
        
        res.render('categories/show', { category, notes, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching category' });
    }
});

// Delete category
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const category = await Category.findOne({ _id: req.params.id, user: req.user.id });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const projectId = category.project;
        await Category.deleteOne({ _id: req.params.id });
        res.redirect('/projects/' + projectId);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting category' });
    }
});

module.exports = router;