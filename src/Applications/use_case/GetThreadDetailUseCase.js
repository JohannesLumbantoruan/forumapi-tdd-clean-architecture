class GetThreadDetailUseCase {
    constructor({
        threadRepository,
        threadCommentRepository,
        threadCommentReplyRepository,
        userRepository
    }) {
        this._threadRepository = threadRepository;
        this._threadCommentRepository = threadCommentRepository;
        this._threadCommentReplyRepository = threadCommentReplyRepository;
        this._userRepository = userRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const thread = await this._threadRepository.getThreadById(useCasePayload.threadId);
        const username = await this._userRepository.getUsernameById(thread.owner);
        thread['username'] = username;
        delete thread['owner'];
        

        const comments = await this._threadCommentRepository.getThreadCommentsByThreadId(thread.id);

        for (const comment of comments) {
            const username = await this._userRepository.getUsernameById(comment.owner);

            if (comment['is_delete']) {
                comment.content = '**komentar telah dihapus**'
            }

            comment['username'] = username;
            delete comment['owner'];
            delete comment['is_delete'];
            delete comment['thread_id'];

            const replies = await this._threadCommentReplyRepository.getThreadCommentRepliesByCommentId(comment.id);

            for (const reply of replies) {
                const username = await this._userRepository.getUsernameById(reply.owner);

                if (reply['is_delete']) {
                    reply.content = '**balasan telah dihapus**'
                }

                reply['username'] = username;
                delete reply['owner'];
                delete reply['is_delete'];
                delete reply['thread_comment_id'];
            }

            comment['replies'] = replies;
        }

        thread['comments'] = comments;

        return thread;
    }

    _verifyPayload({ threadId }) {
        if (!threadId) {
            throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
        }

        if (typeof threadId !== 'string') {
            throw new Error('GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = GetThreadDetailUseCase;