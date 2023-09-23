const ThreadCommentRepository = require('../ThreadCommentRepository');

describe('ThreadCommentRepository', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const threadCommentRepository = new ThreadCommentRepository();

        // Action and Assert
        await expect(threadCommentRepository.addThreadComment(''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentRepository.deleteThreadCommentById('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentRepository.verifyThreadCommentOwner('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentRepository.getThreadCommentById('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});