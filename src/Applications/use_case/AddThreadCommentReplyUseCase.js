const AddedThreadCommentReply = require("../../Domains/threads/entities/AddedThreadCommentReply");
const ThreadCommentReply = require("../../Domains/threads/entities/ThreadCommentReply");

class AddThreadCommentReplyUseCase {
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
        const {
            threadId, commentId, userId
        } = new ThreadCommentReply(useCasePayload);

        await this._threadRepository.getThreadById(threadId);
        await this._threadCommentRepository.getThreadCommentById(commentId, threadId);

        const addedThreadCommentReply = await this._threadCommentReplyRepository
            .addThreadCommentReply(useCasePayload);

        return new AddedThreadCommentReply(addedThreadCommentReply);
    }
}

module.exports = AddThreadCommentReplyUseCase;