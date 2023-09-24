const ThreadsCommentsTableTestHelper = require('../../../../tests/ThreadsCommentsTableTestHelper');
const ThreadsCommentsRepliesTableTestHelper = require('../../../../tests/ThreadsCommentsRepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadCommentReplyRepositoryPostgres = require('../ThreadCommentReplyRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadCommentReply = require('../../../Domains/threads/entities/ThreadCommentReply');
const AddedThreadCommentReply = require('../../../Domains/threads/entities/AddedThreadCommentReply');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentReplyRepositoryPostgres', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await ThreadsCommentsTableTestHelper.cleanTable();
        await ThreadsCommentsRepliesTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('addThreadCommentReply method', () => {
        it('should persist add thread comment reply and return it correctly', async () => {
            // Arrange
            const payload = new ThreadCommentReply({
                content: 'This is a comment reply',
                userId: 'user-12345',
                threadId: 'thread-12345',
                commentId: 'comment-12345'
            });
    
            const mockAddedThreadCommentReply = new AddedThreadCommentReply({
                id: 'reply-12345',
                content: 'This is a comment reply',
                owner: 'user-12345'
            });
    
            // create a user
            await UsersTableTestHelper.addUser({
                id: 'user-12345',
                username: 'johndoe',
                password: 'johndoe'
            });
    
            // create a thread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-12345',
                owner: 'user-12345'
            });
    
            // create a thread comment
            await ThreadsCommentsTableTestHelper.addThreadComment({
                id: 'comment-12345',
                owner: 'user-12345',
                threadId: 'thread-12345',
                content: 'This is a comment'
            });
    
            const fakeIdGenerator = () => '12345';
    
            const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, fakeIdGenerator);
    
            // Action
            const addedThreadCommentReply = await threadCommentReplyRepositoryPostgres.addThreadCommentReply(payload);
    
            // Assert
            expect(addedThreadCommentReply).toStrictEqual(mockAddedThreadCommentReply);
        });
    });

    describe('deleteThreadCommentReplyById method', () => {
        it('should throw NotFoundError when thread comment reply not found', async () => {
            // Arrange
            const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadCommentReplyRepositoryPostgres.deleteThreadCommentReplyById('reply-23456', 'comment-12345'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should delete thread comment reply from database correctly', async () => {
            // Arrange
            const threadCommentReplyRepositoryPostgres = new ThreadCommentReplyRepositoryPostgres(pool, {});

            // Action
            await threadCommentReplyRepositoryPostgres.deleteThreadCommentReplyById('reply-12345', 'comment-12345');

            // Assert
            const [{ is_delete: isDelete }] = await ThreadsCommentsRepliesTableTestHelper.getThreadCommentReplyById('reply-12345', 'comment-12345');

            expect(isDelete).toBe(true);
        });
    });
});