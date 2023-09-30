class LikeThreadCommentUseCase {
    constructor({
        threadCommentLikeRepository,
        threadRepository,
        threadCommentRepository
    }) {
        this._threadCommentLikeRepository = threadCommentLikeRepository;
        this._threadRepository = threadRepository;
        this._threadCommentRepository = threadCommentRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const { threadId, commentId, userId } = useCasePayload;

        await this._threadRepository.getThreadById(threadId);
        await this._threadCommentRepository.getThreadCommentById(commentId, threadId);
        const commentLike = await this._threadCommentLikeRepository
            .getCommentLikeById(commentId, userId);

        if (commentLike.length === 0) {
            await this._threadCommentLikeRepository.addCommentLike(commentId, userId);
        } else {
            await this._threadCommentLikeRepository.deleteCommentLike(commentId, userId);
        }
    }

    _verifyPayload({ threadId, commentId, userId }) {
        if (!threadId || !commentId || !userId) {
            throw new Error('LIKE_THREAD_COMMENT_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (
            typeof threadId !== 'string' ||
            typeof commentId !== 'string' ||
            typeof userId !== 'string'
        ) {
            throw new Error('LIKE_THREAD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = LikeThreadCommentUseCase;