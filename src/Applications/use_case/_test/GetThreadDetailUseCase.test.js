const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadCommentRepository = require('../../../Domains/threads/ThreadCommentRepository');
const ThreadCommentReplyRepository = require('../../../Domains/threads/ThreadCommentReplyRepository');
const UserRepository = require('../../../Domains/users/UserRepository');

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
        const mockThreadCommentRepository = new ThreadCommentRepository();
        const mockThreadCommentReplyRepository = new ThreadCommentReplyRepository();
        const mockUserRepository = new UserRepository();

        const mockDate = new Date().toISOString();

        const expectedThreadDetail = {
            id: 'thread-12345',
            username: 'johndoe',
            title: 'My First Thread',
            date: mockDate,
            body: 'This is my first thread.',
            comments: [
                {
                    id: 'comment-12345',
                    username: 'johndoe',
                    content: 'This is a comment',
                    date: mockDate,
                    replies: [
                        {
                            id: 'reply-12345',
                            username: 'johndoe',
                            content: 'This is a comment reply',
                            date: mockDate
                        },
                        {
                            id: 'reply-23456',
                            username: 'johndoe',
                            content: '**balasan telah dihapus**',
                            date: mockDate
                        }
                    ]
                },
                {
                    id: 'comment-23456',
                    username: 'johndoe',
                    content: '**komentar telah dihapus**',
                    date: mockDate,
                    replies: [
                        {
                            id: 'reply-12345',
                            username: 'johndoe',
                            content: 'This is a comment reply',
                            date: mockDate
                        },
                        {
                            id: 'reply-23456',
                            username: 'johndoe',
                            content: '**balasan telah dihapus**',
                            date: mockDate
                        }
                    ]
                }
            ]
        }

        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'thread-12345',
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345',
                date: mockDate
            }));

        mockThreadCommentRepository.getThreadCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([
                {
                    id: 'comment-12345',
                    content: 'This is a comment',
                    owner: 'user-12345',
                    date: mockDate,
                    thread_id: 'thread-12345',
                    is_delete: false
                },
                {
                    id: 'comment-23456',
                    content: 'This is the second comment',
                    owner: 'user-12345',
                    date: mockDate,
                    thread_id: 'thread-12345',
                    is_delete: true
                }
            ]));

        mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId = jest.fn()
            .mockImplementation(() => Promise.resolve([
                {
                    id: 'reply-12345',
                    content: 'This is a comment reply',
                    owner: 'user-12345',
                    thread_comment_id: 'comment-12345',
                    date: mockDate,
                    is_delete: false
                },
                {
                    id: 'reply-23456',
                    content: 'This is the second comment reply',
                    owner: 'user-12345',
                    thread_comment_id: 'comment-12345',
                    date: mockDate,
                    is_delete: true
                }
            ]));

        mockUserRepository.getUsernameById = jest.fn()
            .mockImplementation(() => Promise.resolve('johndoe'));

        const getThreadDetailUseCase = new GetThreadDetailUseCase({
            threadRepository: mockThreadRepository,
            threadCommentRepository: mockThreadCommentRepository,
            threadCommentReplyRepository: mockThreadCommentReplyRepository,
            userRepository: mockUserRepository
        });

        // Action
        const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

        // Assert
        expect(threadDetail).toStrictEqual(expectedThreadDetail);
        expect(mockThreadRepository.getThreadById).toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentRepository.getThreadCommentsByThreadId)
            .toBeCalledWith(useCasePayload.threadId);
        expect(mockThreadCommentReplyRepository.getThreadCommentRepliesByCommentId)
            .toBeCalledWith('comment-12345');
        expect(mockUserRepository.getUsernameById).toBeCalledWith('user-12345');
    });
});