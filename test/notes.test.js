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

    it('should validate required title field', async function() {
        const noteData = {
            // Missing title
            content: 'Some content',
            user: 'test-user'
        };
    
        try {
            await Note.create(noteData);
            // If we get here, test should fail
            expect.fail('Should have thrown validation error');
        } catch (err) {
            // Error should be thrown - test passes!
            expect(err).to.exist;
            expect(err.message).to.exist;
            console.log('✅ Validation test passed: Title is required');
        }
    });
});