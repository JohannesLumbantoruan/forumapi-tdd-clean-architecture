const AddedThreadComment = require('../AddedThreadComment');

describe('AddedThreadComment', () => {
    it('should throw error when payload do contains needed properties', () => {
        // Arrange
        const payload = {
            id: 'comment-12345',
            content: 'This is a comment'
        };

        // Action and Assert
        expect(() => new AddedThreadComment(payload))
            .toThrowError('ADDED_THREAD_COMMENT.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload data type not string', () => {
        // Arrange
        const payload = {
            id: 'comment-12345',
            content: 12345,
            owner: 'user-12345'
        };

        // Action and Assert
        expect(() => new AddedThreadComment(payload))
            .toThrowError('ADDED_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThreadComment instance correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-12345',
            content: 'This is a comment',
            owner: 'user-12345'
        };

        // Action
        const { id, content, owner } = new AddedThreadComment(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});