class GetThreadDetailUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);

        const thread = await this._threadRepository.getThreadDetailById(useCasePayload.threadId);

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