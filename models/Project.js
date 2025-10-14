const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    color: {
        type: String,
        default: '#3B82F6' // Default blue color
    },
    user: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;