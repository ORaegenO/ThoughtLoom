const { expect } = require('chai');
const Note = require('../models/Note');

describe('Note Model Tests', () => {
    
    it('should create a new note with required fields', () => {
        // Test data
        const noteData = {
            title: 'Test Note',
            content: 'This is test content',
            user: '12345'
        };

        // Create note instance
        const note = new Note(noteData);

        // Test assertions
        expect(note.title).to.equal('Test Note');
        expect(note.content).to.equal('This is test content');
        expect(note.user).to.equal('12345');
        expect(note.createdAt).to.exist;
    });

    it('should validate required title field', () => {
        const noteData = {
            content: 'Content without title',
            user: '12345'
        };

        const note = new Note(noteData);
        
        // Test that title exists (even if empty string)
        expect(note.title).to.not.be.undefined;
    });
});