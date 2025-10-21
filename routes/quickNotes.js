const express = require('express');
const router = express.Router();
const QuickNote = require('../models/QuickNote');

// Middleware to ensure user is authenticated
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

// GET all quick notes
router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const quickNotes = await QuickNote.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.render('quick-notes/index', { quickNotes });
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// POST create new quick note
router.post('/', ensureAuthenticated, async (req, res) => {
    try {
        await QuickNote.create({
            content: req.body.content,
            userId: req.user.id
        });
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// DELETE a quick note
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await QuickNote.findByIdAndDelete(req.params.id);
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.redirect('/dashboard');
    }
});

// GET edit form for a quick note
router.get('/:id/edit', ensureAuthenticated, async (req, res) => {
    try {
        const quickNote = await QuickNote.findById(req.params.id);
        
        // Make sure the note belongs to the current user
        if (quickNote.userId !== req.user.id) {
            return res.redirect('/quick-notes');
        }
        
        res.render('quick-notes/edit', { quickNote });
    } catch (err) {
        console.error(err);
        res.redirect('/quick-notes');
    }
});

// PUT update a quick note
router.put('/:id', ensureAuthenticated, async (req, res) => {
    try {
        await QuickNote.findByIdAndUpdate(req.params.id, {
            content: req.body.content
        });
        res.redirect('/quick-notes');
    } catch (err) {
        console.error(err);
        res.redirect('/quick-notes');
    }
});

module.exports = router;