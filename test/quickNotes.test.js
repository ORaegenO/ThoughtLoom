const assert = require('assert');
const mongoose = require('mongoose');
const QuickNote = require('../models/QuickNote');
require('dotenv').config();

describe('QuickNote Model Tests', function() {
    // Increase timeout for database operations
    this.timeout(5000);

    // Connect to test database before running tests
    before(async function() {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                dbName: 'midterm_test' // Use a separate test database
            });
            console.log('✅ Test database connected');
        } catch (err) {
            console.error('❌ Test database connection error:', err);
            throw err;
        }
    });

    // Clean up after each test
    afterEach(async function() {
        await QuickNote.deleteMany({});
    });

    // Disconnect after all tests
    after(async function() {
        await mongoose.connection.close();
        console.log('✅ Test database disconnected');
    });

    // Test 1: Create a Quick Note
    it('should create a new quick note successfully', async function() {
        const noteData = {
            content: 'This is a test note',
            userId: 'test-user-123'
        };

        const note = await QuickNote.create(noteData);
        
        assert.strictEqual(note.content, noteData.content);
        assert.strictEqual(note.userId, noteData.userId);
        assert.ok(note.createdAt); // Check that timestamp was created
        console.log('✅ Test 1 passed: Quick note created successfully');
    });

    // Test 2: Require content field
    it('should fail to create a quick note without content', async function() {
        const noteData = {
            userId: 'test-user-123'
            // Missing content field
        };

        try {
            await QuickNote.create(noteData);
            assert.fail('Should have thrown validation error');
        } catch (err) {
            assert.ok(err); // Error should be thrown
            assert.ok(err.message.includes('required')); // Should be a required field error
            console.log('✅ Test 2 passed: Validation works correctly');
        }
    });

    // Test 3: Read/Find Quick Notes
    it('should retrieve quick notes by userId', async function() {
        // Create multiple notes for different users
        await QuickNote.create({
            content: 'User 1 note',
            userId: 'user-1'
        });
        await QuickNote.create({
            content: 'User 2 note',
            userId: 'user-2'
        });

        // Find notes for user-1
        const user1Notes = await QuickNote.find({ userId: 'user-1' });
        
        assert.strictEqual(user1Notes.length, 1);
        assert.strictEqual(user1Notes[0].content, 'User 1 note');
        console.log('✅ Test 3 passed: Quick notes retrieved by userId');
    });

    // Test 4: Update a Quick Note
    it('should update a quick note successfully', async function() {
        const note = await QuickNote.create({
            content: 'Original content',
            userId: 'test-user-123'
        });

        await QuickNote.findByIdAndUpdate(note._id, {
            content: 'Updated content'
        });

        const updatedNote = await QuickNote.findById(note._id);
        assert.strictEqual(updatedNote.content, 'Updated content');
        console.log('✅ Test 4 passed: Quick note updated successfully');
    });

    // Test 5: Delete a Quick Note
    it('should delete a quick note successfully', async function() {
        const note = await QuickNote.create({
            content: 'Note to be deleted',
            userId: 'test-user-123'
        });

        await QuickNote.findByIdAndDelete(note._id);

        const deletedNote = await QuickNote.findById(note._id);
        assert.strictEqual(deletedNote, null); // Should be null after deletion
        console.log('✅ Test 5 passed: Quick note deleted successfully');
    });
});