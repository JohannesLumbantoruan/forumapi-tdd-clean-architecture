const ThreadCommentReplyRepository = require('../ThreadCommentReplyRepository');

describe('ThreadCommentReplyRepository interface', () => {
    it('should throw error when invoke unimplemented method', async () => {
        // Arrange
        const threadCommentReplyRepository = new ThreadCommentReplyRepository();

        // Action and Assert
        await expect(threadCommentReplyRepository.addThreadCommentReply())
            .rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentReplyRepository.deleteThreadCommentReplyById())
            .rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentReplyRepository.verifyThreadCommentReplyOwner())
            .rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        
        await expect(threadCommentReplyRepository.getThreadCommentReplyById())
            .rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');

        await expect(threadCommentReplyRepository.getThreadCommentRepliesByCommentId())
            .rejects.toThrowError('THREAD_COMMENT_REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});