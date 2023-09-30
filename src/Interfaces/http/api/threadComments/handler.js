const AddThreadCommentUseCase = require('../../../../Applications/use_case/AddThreadCommentUseCase');
const DeleteThreadCommentUseCase = require('../../../../Applications/use_case/DeleteThreadCommentUseCase');

class ThreadCommentsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
        this.deleteThreadCommentHandler = this.deleteThreadCommentHandler.bind(this);
    }

    async postThreadCommentHandler(request, h) {
        const payload = {
            content: request.payload.content,
            threadId: request.params.threadId,
            owner: request.auth.credentials.id
        };

        const addThreadCommentUseCase = this._container.getInstance(AddThreadCommentUseCase.name);

        const addedComment = await addThreadCommentUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment
            }
        });

        response.code(201);

        return response;
    }

    async deleteThreadCommentHandler(request, h) {
        const payload = {
            ...request.params,
            userId: request.auth.credentials.id
        };

        const deleteThreadCommentUseCase = this._container.getInstance(DeleteThreadCommentUseCase.name);

        await deleteThreadCommentUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            message: 'komentar thread berhasil dihapus'
        });

        return response;
    }
}

module.exports = ThreadCommentsHandler;