const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadCommentReplyUseCase = require('../AddThreadCommentReplyUseCase');
const ThreadCommentReply = require('../../../Domains/threads/entities/ThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/threads/entities/AddedThreadCommentReply');

describe('AddThreadCommentReplyUseCase', () => {
    it('should orchestrating add thread comment reply correctly', async () => {
        // Arrange
        const useCasePayload = new ThreadCommentReply({
            content: 'This is a comment reply',
            threadId: 'thread-12345',
            commentId: 'comment-12345',
            userId: 'user-12345'
        });

        const mockAddedThreadCommentReply = new AddedThreadCommentReply({
            id: 'reply-12345',
            content: 'This is a comment reply',
            owner: 'user-12345'
        });

        const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockThreadCommentRepository = new ThreadCommentRepository();

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadCommentRepository.getThreadCommentById = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadCommentRepository.verifyThreadCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadCommentReplyRepository.addThreadCommentReply = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThreadCommentReply));

        const addThreadCommentReplyUseCase = new AddThreadCommentReplyUseCase({
            threadCommentReplyRepository: mockThreadCommentReplyRepository,
            threadRepository: mockThreadRepository,
            threadCommentRepository: mockThreadCommentRepository
        });

        // Action
        const addedThreadCommentReply = await addThreadCommentReplyUseCase.execute(useCasePayload);

        // Assert
        expect(addedThreadCommentReply).toStrictEqual(mockAddedThreadCommentReply);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
        expect(mockThreadCommentRepository.verifyThreadCommentOwner)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.userId);
        expect(mockThreadCommentReplyRepository.addThreadCommentReply)
            .toBeCalledWith(useCasePayload);
    });
});