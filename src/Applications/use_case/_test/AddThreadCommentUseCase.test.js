const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const AddedThreadComment = require('../../../Domains/threads/entities/AddedThreadComment');
const ThreadComment = require('../../../Domains/threads/entities/ThreadComment');
const AddThreadCommentUseCase = require('../AddThreadCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('AddThreadCommentUseCase', () => {
    it('should orchestrating add thread comment use case correctly', async () => {
        // Arrange
        const useCasePayload = new ThreadComment({
            content: 'This is a comment',
            owner: 'user-12345',
            threadId: 'thread-12345'
        });

        const mockAddedThreadComment = new AddedThreadComment({
            id: 'comment-12345',
            content: 'This is a comment',
            owner: 'user-12345'
        });

        const mockThreadCommentRepository = new ThreadCommentRepository();
        const mockThreadRepository = new ThreadRepository();

        mockThreadCommentRepository.addThreadComment = jest.fn()
            .mockImplementation(() => Promise.resolve(mockAddedThreadComment));
        
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve([{}]));

        const addThreadCommentUseCase = new AddThreadCommentUseCase({
            threadCommentRepository: mockThreadCommentRepository,
            threadRepository: mockThreadRepository
        });

        // Action
        const addedThreadComment = await addThreadCommentUseCase.execute(useCasePayload);

        // Assert
        expect(addedThreadComment).toStrictEqual(mockAddedThreadComment);
        expect(mockThreadCommentRepository.addThreadComment).toBeCalledWith(useCasePayload);
    });
});