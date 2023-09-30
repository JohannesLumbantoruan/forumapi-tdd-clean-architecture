const LikeThreadCommentUseCase = require('../../../../Applications/use_case/LikeThreadCommentUseCase');

class ThreadCommentLikesHandler {
    constructor(container) {
        this._container = container;

        this.putThreadCommentLikeHandler = this.putThreadCommentLikeHandler.bind(this);
    }

    async putThreadCommentLikeHandler(request, h) {
        const payload = {
            ...request.params,
            userId: request.auth.credentials.id
        };

        const likeThreadCommentUseCase = this._container.getInstance(LikeThreadCommentUseCase.name);

        await likeThreadCommentUseCase.execute(payload);

        const response = h.response({
            status: 'success'
        });

        return response;
    }
}

module.exports = ThreadCommentLikesHandler;