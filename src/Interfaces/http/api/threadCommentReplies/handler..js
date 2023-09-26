const AddThreadCommentReplyUseCase = require("../../../../Applications/use_case/AddThreadCommentReplyUseCase");
const DeleteThreadCommentReplyUseCase = require("../../../../Applications/use_case/DeleteThreadCommentReplyUseCase");

class ThreadCommentRepliesHandler {
    constructor(container) {
        this._container = container;

        this.postThreadCommentReplyHandler = this.postThreadCommentReplyHandler.bind(this);
        this.deleteThreadCommentReplyHandler = this.deleteThreadCommentReplyHandler.bind(this);
    }

    async postThreadCommentReplyHandler(request, h) {
        const payload = {
            ...request.params,
            userId: request.auth.credentials.id,
            ...request.payload
        };

        const addThreadCommentReplyUseCase = this._container.getInstance(AddThreadCommentReplyUseCase.name);

        const addedReply = await addThreadCommentReplyUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            data: {
                addedReply
            }
        });

        response.code(201);

        return response;
    }

    async deleteThreadCommentReplyHandler(request, h) {
        const payload = {
            ...request.params,
            userId: request.auth.credentials.id
        };

        const deleteThreadCommentReplyUseCase = this._container.getInstance(DeleteThreadCommentReplyUseCase.name);

        await deleteThreadCommentReplyUseCase.execute(payload);

        const response = await h.response({
            status: 'success',
            message: 'balasan komentar thread berhasil dihapus'
        });

        return response;
    }
}

module.exports = ThreadCommentRepliesHandler;