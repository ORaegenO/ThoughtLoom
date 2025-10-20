const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Category = require('../models/Category');  // ADD THIS LINE
const { isLoggedIn } = require('../middleware/auth');

// Get all projects for current user
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.render('projects/index', { projects, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Show form to create new project
router.get('/new', isLoggedIn, async (req, res) => {
    res.render('projects/new', { user: req.user });
});

// Create new project
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const project = new Project({
            name,
            description,
            color: color || '#3B82F6',
            user: req.user.id
        });
        await project.save();
        res.redirect('/projects');
    } catch (err) {
        res.status(500).json({ message: 'Error creating project' });
    }
});

// View single project with its categories
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        // Fetch categories for this project
        const Category = require('../models/Category');
        const categories = await Category.find({ project: project._id, user: req.user.id });
        
        res.render('projects/show', { project, categories, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project' });
    }
});
// Delete project
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.deleteOne({ _id: req.params.id, user: req.user.id });
        if (project.deletedCount > 0) {
            res.redirect('/projects');
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error deleting project' });
    }
});

// Show edit form for project
router.get('/:id/edit', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, user: req.user.id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.render('projects/edit', { project, user: req.user });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching project' });
    }
});

// Update project
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const { name, description, color } = req.body;
        const updatedProject = await Project.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { name, description, color },
            { new: true }
        );
        if (updatedProject) {
            res.redirect('/projects/' + updatedProject._id);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error updating project' });
    }
});

module.exports = router;