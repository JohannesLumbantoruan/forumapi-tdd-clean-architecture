class ThreadCommentRepository {
    async addThreadComment(comment) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteThreadCommentById(commentId, threadId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThreadCommentOwner(commentId, userId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadCommentById(commentId, threadId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadCommentsByThreadId(threadId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadCommentRepository;