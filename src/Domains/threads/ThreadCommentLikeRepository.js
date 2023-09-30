/* eslint-disable no-unused-vars */

class ThreadCommentLikeRepository {
    async getCommentLikeCountByCommentId(commentId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getCommentLikeById(commentId, userId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async addCommentLike(commentId, userId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteCommentLike(commentId, userId) {
        throw new Error('THREAD_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadCommentLikeRepository;