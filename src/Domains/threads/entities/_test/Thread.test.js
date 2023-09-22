const Thread = require('../Thread');

describe('Thread entity', () => {
    it('should throw error when payload do not contains needed property', () => {
        // Arrange
        const payload = {
            title: 'My First Thread',
            body: 'This is my first thread.'
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload data type not string', () => {
        // Arrange
        const payload = {
            title: 'My First Thread',
            body: 12345,
            owner: 'user-12345'
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should craete a Thread instance correctly', () => {
        // Arrange
        const payload = {
            title: 'My First Thread',
            body: 'This is my first thread.',
            owner: 'user-12345'
        };

        // Action
        const { title, body, owner } = new Thread(payload);

        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(owner).toEqual(payload.owner);
    });
});