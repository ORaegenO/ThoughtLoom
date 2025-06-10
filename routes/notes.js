const express = require('express');
const router = express.Router();
const passport = require('passport');
const Note = require('../models/Note.js'); // Assuming you have a Note model defined
const { isLoggedIn } = require('../middleware/auth.js'); // Middleware to check if user is logged in




//get all notes
router.get('/',isLoggedIn, async (req, res) => {
    try {
      const notes = await Note.find({ user: req.user.id });
    res.render('notes/index', { notes, user: req.user }); 
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes' });
  }  
});

//get new note form
router.get('/new', isLoggedIn, async (req, res) => {
  res.render('notes/new', { user: req.user || null });
});

/*//get notes by category
router.get('/category/:category', isLoggedIn, async (req, res) => {
  try {
    const category = req.params.category;
    const notes = await Note.find({ user: req.user.id, category: category });
    res.render('notes/index', { notes, user: req.user });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes by category' });
  }
});
*/

//edit a note by id
router.get('/:id/edit', isLoggedIn, async (req, res) => {
  try {
      const note = await Note.findOne({ _id: req.params.id, user: req.user.id});
      if (!note) {
          return res.status(404).json({ message: 'Note not found' });
      }
      res.render('notes/edit', { note, user: req.user });
  } catch (err) {
      res.status(500).json({ message: 'Error fetching note' });
  }
});


//create a new note
router.post('/', isLoggedIn, async (req, res) => {
  try {
      const { title, content } = req.body;
  
      const note = new Note({
        title,
        content,
        user: req.user.id  
      });
  
      await note.save();
      res.redirect('/notes');
    } catch (err) {
      res.status(500).json({ message: 'Error creating note' });
    }  
});

//get a note by id
router.get('/:id', isLoggedIn, async (req, res) => {
     try {
        const note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    
        if (!note) {
          return res.status(404).json({ message: 'Note not found' });
        }
    
        res.render('notes/show', { note, user: req.user });
      } catch (err) {
        res.status(500).json({ message: 'Error fetching note' });
      }
});

//update a note by id
router.put('/:id', isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body; // Get the data to update

    const updatedNote = await Note.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id}, //user: req.user._id }, // Find this note for this user
        { title, content }, // Update with new title and content
        { new: true } // Return the updated version
    );
    if (updatedNote) {
res.redirect('/notes/' + updatedNote._id); // Redirect to the updated note's page
} else {
res.status(404).json({ message: 'Note not found' });
}

} catch (err) {
    res.status(500).json({ message: 'Error updating note' });
}
});


//delete a note by id
router.delete('/:id', isLoggedIn, async (req, res) => {
  try {
      const note = await Note.deleteOne({ _id: req.params.id, user: req.user.id });
      if (note.deletedCount > 0) {
          res.redirect('/notes'); // Redirect to notes index after deletion
      } else {
          res.status(404).json({ message: 'Note not found' });
      }
  } catch (err) {
      res.status(500).json({ message: 'Error deleting note' });
  }
});

module.exports = router;