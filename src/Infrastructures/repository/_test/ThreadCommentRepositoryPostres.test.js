const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const ThreadCommentRepositoryPostres = require('../ThreadCommentRepositoryPostres');
const ThreadsCommentsTableTestHelper = require('../../../../tests/ThreadsCommentsTableTestHelper');
const ThreadComment = require('../../../Domains/threads/entities/ThreadComment');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const AddedThreadComment = require('../../../Domains/threads/entities/AddedThreadComment');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');

describe('ThreadCommentRepositoryPostres', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();

        await pool.end();
    });

    afterEach(async () => {
        await ThreadsCommentsTableTestHelper.cleanTable();
    });

    describe('addThreadComment method', () => {
        it('should persist add thread comment and return it correctly', async () => {
            // Arrange
            const newThreadComment = new ThreadComment({
                content: 'This is a comment',
                owner: 'user-12345',
                threadId: 'thread-12345'
            });

            const mockAddedThreadComment = new AddedThreadComment({
                id: 'comment-12345',
                content: 'This is a comment',
                owner: 'user-12345'
            });

            // create user
            await UsersTableTestHelper.addUser({ id: newThreadComment.owner });

            // create thread
            await ThreadsTableTestHelper.addThread({ id: newThreadComment.threadId, owner: newThreadComment.owner });

            const fakeIdGenerator = () => '12345';

            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, fakeIdGenerator);

            // Action
            const addedThreadComment = await threadCommentRepositoryPostgres.addThreadComment(newThreadComment);

            // Assert
            expect(addedThreadComment).toStrictEqual(mockAddedThreadComment);
        });
    });

    describe('deleteThreadCommentById', () => {
        it('should throw NotFoundError when thread comment not found', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // Action and Assert
            await expect(threadCommentRepositoryPostgres.deleteThreadCommentById('comment-23456', 'thread-12345'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should delete thread comment from database correctly', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // create thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345' });

            // Action
            await threadCommentRepositoryPostgres.deleteThreadCommentById('comment-12345', 'thread-12345');

            // Assert
            const { is_delete: isDelete } = await ThreadsCommentsTableTestHelper.getThreadCommentById('comment-12345', 'thread-12345');

            expect(isDelete).toBe(true);
        });
    });

    describe('verifyThreadCommentOwner method', () => {
        it('should throw AuthorizationError when user do not owner of the thread comment', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // create a thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345', owner: 'user-12345' })

            // Action and Assert
            await expect(threadCommentRepositoryPostgres.verifyThreadCommentOwner('comment-12345', 'user-23456'))
                .rejects
                .toThrowError(AuthorizationError);
        });

        it('should not throw AuthrorizationError when user is owner of the thread comment', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // create a thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345', owner: 'user-12345' })

            // Action and Assert
            await expect(threadCommentRepositoryPostgres.verifyThreadCommentOwner('comment-12345', 'user-12345'))
                .resolves
                .not
                .toThrowError(AuthorizationError);
        });
    });

    describe('getThreadCommentById method', () => {
        it('should throw NotFoundError when thread comment not found', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // Action and Assert
            await expect(threadCommentRepositoryPostgres.getThreadCommentById('comment-12345', 'user-12345'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return thread comment correctly when it found', async () => {
            // Arrange
            const threadCommentRepositoryPostgres = new ThreadCommentRepositoryPostres(pool, {});

            // create a thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345', threadId: 'thread-12345' })

            // Action
            const {
                id, content, owner, date, thread_id
            } = await threadCommentRepositoryPostgres.getThreadCommentById('comment-12345', 'thread-12345');

            // Assert
            expect(id).toEqual('comment-12345');
            expect(content).toEqual('This is a comment');
            expect(owner).toEqual('user-12345');
            expect(date).toBeDefined();
            expect(thread_id).toEqual('thread-12345');
        });
    });
});