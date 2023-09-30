const LikeThreadCommentUseCase = require('../LikeThreadCommentUseCase');
const ThreadCommentLikeRepository = require('../../../Domains/threads/ThreadCommentLikeRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');

describe('LikeThreadCommentUseCase', () => {
    it('should throw error when payload do not contains needed property', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-12345'
        };

        const likeThreadCommentUseCase = new LikeThreadCommentUseCase({});

        // Action and Assert
        await expect(likeThreadCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('LIKE_THREAD_COMMENT_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload not string', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: true
        };

        const likeThreadCommentUseCase = new LikeThreadCommentUseCase({});

        // Action and Assert
        await expect(likeThreadCommentUseCase.execute(useCasePayload))
            .rejects.toThrowError('LIKE_THREAD_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating like thread comment use case correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: 'user-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockThreadCommentRepository = new ThreadCommentRepository();
        const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

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
                date: new Date().toISOString(),
                thread_id: 'thread-12345',
                is_delete: false
            }));

        mockThreadCommentLikeRepository.getCommentLikeById = jest.fn()
            .mockImplementation(() => Promise.resolve([]));

        mockThreadCommentLikeRepository.addCommentLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const likeThreadCommentUseCase = new LikeThreadCommentUseCase({
            threadCommentLikeRepository: mockThreadCommentLikeRepository,
            threadRepository: mockThreadRepository,
            threadCommentRepository: mockThreadCommentRepository
        });

        // Action
        await likeThreadCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
        expect(mockThreadCommentLikeRepository.getCommentLikeById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockThreadCommentLikeRepository.addCommentLike)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });

    it('should orchestrating unlike thread comment use case correctly', async () => {
        // Arrange
        const useCasePayload = {
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: 'user-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockThreadCommentRepository = new ThreadCommentRepository();
        const mockThreadCommentLikeRepository = new ThreadCommentLikeRepository();

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
                date: new Date().toISOString(),
                thread_id: 'thread-12345',
                is_delete: false
            }));

        mockThreadCommentLikeRepository.getCommentLikeById = jest.fn()
            .mockImplementation(() => Promise.resolve([
                {
                    id: 'like-12345',
                    commentId: 'comment-12345',
                    userId: 'user-12345'
                }
            ]));

        mockThreadCommentLikeRepository.deleteCommentLike = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const likeThreadCommentUseCase = new LikeThreadCommentUseCase({
            threadCommentLikeRepository: mockThreadCommentLikeRepository,
            threadRepository: mockThreadRepository,
            threadCommentRepository: mockThreadCommentRepository
        });

        // Action
        await likeThreadCommentUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
        expect(mockThreadCommentLikeRepository.getCommentLikeById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockThreadCommentLikeRepository.deleteCommentLike)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
    });
});