const ThreadCommentLikeRepository = require('../ThreadCommentLikeRepository');

describe('ThreadCommentLikeRepository', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const threadCommentLikeRepository = new ThreadCommentLikeRepository();

        // Action and Assert
        await expect(threadCommentLikeRepository.getCommentLikeCountByCommentId(''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadCommentLikeRepository.getCommentLikeById('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadCommentLikeRepository.addCommentLike('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(threadCommentLikeRepository.deleteCommentLike('', ''))
            .rejects.toThrowError('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});