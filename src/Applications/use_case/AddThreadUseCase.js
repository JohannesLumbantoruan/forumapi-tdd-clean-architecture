const Thread = require("../../Domains/threads/entities/Thread");

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        const newThread = new Thread(useCasePayload);

        const addedThread = await this._threadRepository.addThread(newThread);

        return addedThread;
    }
}

module.exports = AddThreadUseCase;