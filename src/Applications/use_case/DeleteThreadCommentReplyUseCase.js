class DeleteThreadCommentReplyUseCase {
    constructor({
        threadCommentReplyRepository,
        threadRepository,
        threadCommentRepository
    }) {
        this._threadCommentReplyRepository = threadCommentReplyRepository;
        this._threadRepository = threadRepository;
        this._threadCommentRepository = threadCommentRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const { replyId, commentId, threadId, userId } = useCasePayload;

        await this._threadRepository.getThreadById(threadId);
        await this._threadCommentRepository.getThreadCommentById(commentId, threadId);
        await this._threadCommentReplyRepository.getThreadCommentReplyById(replyId, commentId);
        await this._threadCommentReplyRepository.verifyThreadCommentReplyOwner(replyId, userId);
        await this._threadCommentReplyRepository.deleteThreadCommentReplyById(replyId, commentId);
    }

    _verifyPayload({
        replyId, commentId, threadId, userId
    }) {
        if (!replyId || !commentId || !threadId || !userId) {
            throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (
            typeof replyId !== 'string' ||
            typeof commentId !== 'string' ||
            typeof threadId !== 'string' ||
            typeof userId !== 'string'
        ) {
            throw new Error('DELETE_THREAD_COMMENT_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DeleteThreadCommentReplyUseCase;