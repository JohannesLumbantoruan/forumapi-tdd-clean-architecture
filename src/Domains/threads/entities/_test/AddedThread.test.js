const AddedThread = require('../AddedThread');

describe('AddedThread entity', () => {
    it('should throw error when payload do not contains needed property', () => {
        // Arrange
        const payload = {
            title: 'My First Thread',
            owner: 'user-12345'
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload data type not string', () => {
        // Arrange
        const payload = {
            id: 'thread-12345',
            title: 'My First Thread',
            owner: true
        };

        // Action and Assert
        expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThread instance correctly', () => {
        // Arrange
        const payload = {
            id: 'thread-12345',
            title: 'My First Thread',
            owner: 'user-12345'
        };

        // Action
        const { id, title, owner } = new AddedThread(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(title).toEqual(payload.title);
        expect(owner).toEqual(payload.owner);
    });
});