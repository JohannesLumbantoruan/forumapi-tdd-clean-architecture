const ThreadComment = require("../../Domains/threads/entities/ThreadComment");

class AddThreadCommentUseCase {
    constructor({ threadCommentRepository, threadRepository }) {
        this._threadCommentRepository = threadCommentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const threadComment = new ThreadComment(useCasePayload);

        await this._threadRepository.getThreadById(threadComment.threadId);

        const addedThreadComment = await this._threadCommentRepository.addThreadComment(useCasePayload);

        return addedThreadComment;
    }
}

module.exports = AddThreadCommentUseCase;