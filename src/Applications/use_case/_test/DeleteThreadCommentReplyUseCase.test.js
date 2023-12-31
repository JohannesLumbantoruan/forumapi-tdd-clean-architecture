const DeleteThreadCommentReplyUseCase = require('../DeleteThreadCommentReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');

describe('DeleteThreadCommentReplyUseCase', () => {
    it('should throw error when payload do not contains needed properties', async () => {
        // Arrange
        const useCasePayload = {
            replyId: 'reply-12345',
            commentId: 'comment-12345',
            threadId: 'thread-12345'
        };

        const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

        // Action and Assert
        await expect(deleteThreadCommentReplyUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_THREAD_COMMENT_REPLY_USE_CASE.NOT_CONTAINS_NEEDED_PROPERTY');
    });

    it('should throw error when payload is not string', async () => {
        // Arrange
        const useCasePayload = {
            replyId: 'reply-12345',
            commentId: 'comment-12345',
            threadId: 'thread-12345',
            userId: 12345
        };

        const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({});

        // Action and Assert
        await expect(deleteThreadCommentReplyUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_THREAD_COMMENT_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating delete thread comment reply correctly', async () => {
        // Arrange
        const useCasePayload = {
            replyId: 'reply-12345',
            commentId: 'comment-12345',
            threadId: 'thread-12345',
            userId: 'user-12345'
        };

        const mockThreadRepository = new ThreadRepository();
        const mockThreadCommentRepository = new ThreadCommentRepository();
        const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();

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
        mockThreadCommentReplyRepository.getThreadCommentReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'comment-12345',
                conten: 'This is a thread comment reply',
                owner: 'user-12345',
                thread_comment_id: 'comment-12345',
                date: new Date().toISOString(),
                is_delete: false
            }));
        mockThreadCommentReplyRepository.verifyThreadCommentReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadCommentReplyRepository.deleteThreadCommentReplyById = jest.fn()
            .mockImplementation(() => Promise.resolve());

        const deleteThreadCommentReplyUseCase = new DeleteThreadCommentReplyUseCase({
            threadCommentReplyRepository: mockThreadCommentReplyRepository,
            threadRepository: mockThreadRepository,
            threadCommentRepository: mockThreadCommentRepository
        });

        // Action
        await deleteThreadCommentReplyUseCase.execute(useCasePayload);

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentById)
            .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
        expect(mockThreadCommentReplyRepository.getThreadCommentReplyById)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.commentId);
        expect(mockThreadCommentReplyRepository.verifyThreadCommentReplyOwner)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.userId);
        expect(mockThreadCommentReplyRepository.deleteThreadCommentReplyById)
            .toBeCalledWith(useCasePayload.replyId, useCasePayload.commentId);
    });
});