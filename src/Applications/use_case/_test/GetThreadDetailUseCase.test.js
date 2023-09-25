const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('GetThreadDetailUseCase', () => {
    it('should throw error when payload do not contains needed property', async () => {
        // Arrange
        const getThreadDetailUseCase = new GetThreadDetailUseCase({});

        // Action and Assert
        await expect(getThreadDetailUseCase.execute({}))
            .rejects.toThrowError('GET_THREAD_DETAIL_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload not string', async () => {
        // Arrange
        const getThreadDetailUseCase = new GetThreadDetailUseCase({});

        // Action and Assert
        await expect(getThreadDetailUseCase.execute({ threadId: 12345 }))
            .rejects.toThrowError('GET_THREAD_DETAIL_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating get detail thread use case correctly', async () => {
        // Arrange
        const useCasePayload = { threadId: 'thread-12345' };
        const mockThreadRepository = new ThreadRepository();

        const mockThreadDetail = {
            id: 'thread-12345',
            username: 'johndoe',
            title: 'My First Thread',
            date: new Date().toISOString(),
            body: 'This is my first thread.',
            comments: [
                {
                    id: 'comment-12345',
                    username: 'johndoe',
                    content: 'This is a thread comment',
                    date: new Date().toISOString(),
                    replies: [
                        {
                            id: 'reply-12345',
                            username: 'johndoe',
                            content: 'This is a thrad comment reply',
                            date: new Date().toISOString()
                        }
                    ]
                }
            ]
        }

        mockThreadRepository.getThreadDetailById = jest.fn()
            .mockImplementation(() => Promise.resolve(mockThreadDetail));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({ threadRepository: mockThreadRepository });

        // Action
        const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetail).toStrictEqual(mockThreadDetail);
        expect(mockThreadRepository.getThreadDetailById).toBeCalledWith(useCasePayload.threadId);
    });
});