const ThreadComment = require('../ThreadComment');

describe('ThreadComment entity', () => {
    it('should throw error when payload do not contains needed properties', () => {
        // Arrange
        const payload = {
            content: 'This is a comment',
            owner: 'user-12345'
        };

        // Action and Assert
        expect(() => new ThreadComment(payload))
            .toThrowError('THREAD_COMMENT.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload not string', () => {
        // Arrange
        const payload = {
            content: 'This is a comment',
            owner: true,
            threadId: 'thread-12345'
        };

        // Action and Assert
        expect(() => new ThreadComment(payload))
            .toThrowError('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadComment instance correctly', () => {
        // Arrange
        const payload = {
            content: 'This is a comment',
            owner: 'user-12345',
            threadId: 'thread-12345'
        };

        // Action
        const { content, owner, threadId } = new ThreadComment(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
        expect(threadId).toEqual(payload.threadId);
    });
});