const express = require ('express');
const router = express.Router();
const Note = require('../models/Note.js'); // Assuming you have a Note model defined
const { isLoggedIn } = require('../middleware/auth.js'); // Middleware to check if user is logged in

router.get('/notes', isLoggedIn, async (req, res) => {
    try {
        //const notes = await Note.find({ user: req.user._id });
        const notes = await Note.find({}); //for testing purposes
        //res.render('notes/index', { notes, user: req.user }); // Assuming you have a view to render
          res.json(notes); // for testing purposes
      } catch (err) {
        res.status(500).json({ message: 'Error fetching notes' });
      }  
})

router.post('/notes', isLoggedIn, async (req, res) => {
    // Create note via API
    try {
        const { title, content } = req.body;
    
        const note = new Note({
          title,
          content,
          //user: req.user._id
        });
    
        await note.save();
        res.status(201).json(note); // Or redirect/render as needed
      } catch (err) {
        res.status(500).json({ message: 'Error creating note' });
      }  
  });

  module.exports = router;