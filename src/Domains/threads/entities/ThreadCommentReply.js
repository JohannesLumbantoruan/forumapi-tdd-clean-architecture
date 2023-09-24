class ThreadCommentReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const {
            content, commentId, threadId, userId
        } = payload;

        this.content = content;
        this.commentId = commentId;
        this.threadId = threadId;
        this.userId = userId;
    }

    _verifyPayload({
        content, threadId, commentId, userId
    }) {
        if (!content || !threadId || !commentId || !userId) {
            throw new Error('THREAD_COMMENT_REPLY.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (
            typeof content !== 'string' ||
            typeof commentId !== 'string' ||
            typeof threadId !== 'string' ||
            typeof userId !== 'string'
        ) {
            throw new Error('THREAD_COMMENT_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadCommentReply;