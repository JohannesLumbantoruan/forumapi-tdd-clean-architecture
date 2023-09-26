const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const GetThreadDetailUseCase = require("../../../../Applications/use_case/GetThreadDetailUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadDetailByIdHandler = this.getThreadDetailByIdHandler.bind(this);
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

    async getThreadDetailByIdHandler(request, h) {
        const payload = { ...request.params };

        const getThreadDetailByIdUseCase = this._container.getInstance(GetThreadDetailUseCase.name);

        const thread = await getThreadDetailByIdUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            data: {
                thread
            }
        });

        return response;
    }
}

module.exports = ThreadsHandler;