const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: String,
    completed: {
        type: Boolean,
        default: false
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date,
        default: null
    }
});

const Note = mongoose.model('Note', noteSchema);
module.exports = Note;