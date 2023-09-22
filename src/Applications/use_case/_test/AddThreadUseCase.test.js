const AddThreadUseCase = require('../AddThreadUseCase');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadUseCase', () => {
    it('should orchestrating add thread use case correctly', async () => {
        // Arrange
        const useCasePayload = new Thread({
            title: 'My First Thread',
            body: 'This is my first thread.',
            owner: 'user-12345'
        });

        const mockAddedThread = new AddedThread({
            id: 'thread-12345',
            title: useCasePayload.title,
            owner: 'user-12345'
        });

        // mocking dependencies of use case
        const mockThreadRepository = new ThreadRepository();

        // mocking needed method
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(mockAddedThread));

        // create use case instance
        const addedThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository
        });

        // Action
        const addedThread = await addedThreadUseCase.execute(useCasePayload);

        // Assert
        expect(addedThread).toStrictEqual(mockAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(useCasePayload);
    });
});