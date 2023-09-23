class DeleteThreadCommentUseCase {
    constructor({
        threadCommentRepository,
        threadRepository
    }) {
        this._threadCommentRepository = threadCommentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const { commentId, threadId, userId } = useCasePayload;

        await this._threadRepository.getThreadById(threadId);

        await this._threadCommentRepository.getThreadCommentById(commentId, threadId);

        await this._threadCommentRepository.verifyThreadCommentOwner(commentId, userId);

        await this._threadCommentRepository.deleteThreadCommentById(commentId, threadId);
    }

    _verifyPayload({ threadId, commentId, userId }) {
        if (!threadId || !commentId || !userId) {
            throw new Error('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (
            typeof threadId !== 'string' ||
            typeof commentId !== 'string' ||
            typeof userId !== 'string'
        ) {
            throw new Error('DELETE_THREAD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteThreadCommentUseCase;