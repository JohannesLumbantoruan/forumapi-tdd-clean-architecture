class ThreadComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { content, owner, threadId } = payload;

        this.content = content;
        this.owner = owner;
        this.threadId = threadId;
    }

    _verifyPayload({ content, owner, threadId }) {
        if (!content || !owner || !threadId) {
            throw new Error('THREAD_COMMENT.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (
            typeof content !== 'string' ||
            typeof owner !== 'string' ||
            typeof threadId !== 'string'
        ) {
            throw new Error('THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ThreadComment;