const ThreadCommentReply = require('../ThreadCommentReply');

describe('ThreadCommentReply entity', () => {
    it('should throw error when payload do not contains needed properties', () => {
        // Arrange
        const payload = {
            content: 'This is a comment reply',
            threadId: 'thread-12345',
            commentId: 'comment-12345'
        };

        // Action and Assert
        expect(() => new ThreadCommentReply(payload)).toThrowError('THREAD_COMMENT_REPLY.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload is not string', () => {
        // Arrange
        const payload = {
            content: 'This is a comment reply',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: 12345
        };

        // Action and Assert
        expect(() => new ThreadCommentReply(payload)).toThrowError('THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create ThreadCommentReply instance correctly', () => {
        // Arrange
        const payload = {
            content: 'This is a comment reply',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: 'user-12345'
        };

        // Action
        const {
            content, threadId, commentId, userId
        } = new ThreadCommentReply(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(commentId).toEqual(payload.commentId);
        expect(threadId).toEqual(payload.threadId);
        expect(userId).toEqual(payload.userId);
    });
});