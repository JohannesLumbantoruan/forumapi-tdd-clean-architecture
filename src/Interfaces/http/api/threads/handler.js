const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const AddThreadCommentUseCase = require("../../../../Applications/use_case/AddThreadCommentUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.postThreadCommentHandler = this.postThreadCommentHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const payload = {
            ...request.payload,
            owner: request.auth.credentials.id
        };

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);

        const addedThread = await addThreadUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread
            }
        });

        response.code(201);

        return response;
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
}

module.exports = ThreadsHandler;