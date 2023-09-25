const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadsCommentsTableTestHelper = require('../../../../tests/ThreadsCommentsTableTestHelper');
const ThreadsCommentsRepliesTableTestHelper = require('../../../../tests/ThreadsCommentsRepliesTableTestHelper');
const pool = require('../../database/postgres/pool');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();

        await pool.end();
    })

    describe('addThread method', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            const newThread = new Thread({
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345'
            });

            const fakeIdGenerator = () => '12345';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: newThread.owner });

            // Action
            await threadRepositoryPostgres.addThread(newThread);

            // Assert
            const thread = await ThreadsTableTestHelper.getThreadById('thread-12345');

            expect(thread).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const newThread = new Thread({
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345'
            });

            const mockAddedThread = new AddedThread({
                id: 'thread-12345',
                title: 'My First Thread',
                owner: 'user-12345'
            });

            const fakeIdGenerator = () => '12345';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread);

            // Assert
            expect(addedThread).toStrictEqual(mockAddedThread);
        });
    });

    describe('getThreadById', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.getThreadById('user-23456'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return thread properties and values correctly', async () => {
            // Arrange
            const newThread = new Thread({
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345'
            });

            await ThreadsTableTestHelper.addThread(newThread);

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action
            const {
                id, title, body, owner, date
            } = await threadRepositoryPostgres.getThreadById('thread-12345');

            // Assert
            expect(id).toEqual('thread-12345');
            expect(title).toEqual(newThread.title);
            expect(body).toEqual(newThread.body);
            expect(owner).toEqual(newThread.owner);
            expect(date).toBeDefined();
        });
    });

    describe('getThreadDetailById method', () => {
        it('should throw NotFoundError when thread not found', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadRepositoryPostgres.getThreadDetailById('thread-12345'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should return thread detail properties and values correctly', async () => {
            // Arrange
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // create a thread
            await ThreadsTableTestHelper.addThread({ id: 'thread-12345' });

            // create a thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345' });
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-23456' });

            // delete 1 of the thread comment
            await ThreadsCommentsTableTestHelper.deleteThreadCommentById('comment-23456', 'thread-12345');

            // create a thread comment reply
            await ThreadsCommentsRepliesTableTestHelper.addThreadCommentReply({ id: 'reply-12345' });
            await ThreadsCommentsRepliesTableTestHelper.addThreadCommentReply({ id: 'reply-23456' });

            // delete 1 of the thread comment reply
            await ThreadsCommentsRepliesTableTestHelper.deleteThreadCommentReplyById('reply-23456', 'comment-12345');

            // Action
            const threadDetail = await threadRepositoryPostgres.getThreadDetailById('thread-12345');

            // Assert
            expect(threadDetail).toBeDefined();
            expect(threadDetail.comments).toBeDefined();
        });
    });
});