const DeleteThreadCommentUseCase = require('../DeleteThreadCommentUseCase');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteThreadCommentUseCase', () => {
    it('should throw error when payload do not contains needed properties', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            userId: 'user-12345'
        };

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

        // Action and Assert
        await expect(deleteThreadCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload not string', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 12345,
            userId: 'user-12345'
        };

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({});

        // Action and Assert
        await expect(deleteThreadCommentUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_THREAD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating delete thread comment use case correctly', async () => {
        // Arrange
        const useCasePayload = {
            commentId: 'comment-12345',
            threadId: 'thread-12345',
            userId: 'user-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockThreadCommentRepository = new ThreadCommentRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'thread-12345',
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345',
                date: new Date().toISOString()
            }));
        mockThreadCommentRepository.getThreadCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'comment-12345',
                content: 'This is a thread comment',
                owner: 'user-12345',
                thread_id: 'thread-12345',
                is_delete: false,
                date: new Date().toISOString()
            }));
        mockThreadCommentRepository.verifyThreadCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadCommentRepository.deleteThreadCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentUseCase = new DeleteThreadCommentUseCase({
            threadCommentRepository: mockThreadCommentRepository,
            threadRepository: mockThreadRepository
        });

        // Action
        await deleteThreadCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
        expect(mockThreadCommentRepository.verifyThreadCommentOwner)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockThreadCommentRepository.deleteThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    });
});