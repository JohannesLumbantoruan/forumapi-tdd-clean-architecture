const AddedThreadCommentReply = require('../AddedThreadCommentReply');

describe('AddedThreadCommentReply entity', () => {
    it('should throw error when payload do not contains needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-12345',
            content: 'This is a comment reply'
        };

        // Action and Assert
        expect(() => new AddedThreadCommentReply(payload))
            .toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload is not string', () => {
        // Arrange
        const payload = {
            id: 'reply-12345',
            content: 12345,
            owner: 'user-12345'
        };

        // Action and Assert
        expect(() => new AddedThreadCommentReply(payload))
            .toThrowError('ADDED_THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create AddedThreadCommentReply instance correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-12345',
            content: 'This is a comment reply',
            owner: 'user-12345'
        };

        // Action
        const { id, content, owner } = new AddedThreadCommentReply(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});