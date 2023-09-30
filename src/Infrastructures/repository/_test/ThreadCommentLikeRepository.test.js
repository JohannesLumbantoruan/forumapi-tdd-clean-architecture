const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadsCommentsTableTestHelper = require('../../../../tests/ThreadsCommentsTableTestHelper');
const ThreadsCommentsLikesTableTestHelper = require('../../../../tests/ThreadsCommentsLikesTableTestHelper');
const ThreadCommentLikeRepositoryPostgres = require('../ThreadCommentLikeRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadCommentLikeRepositoryPostgres', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    describe('getCommentLikeCountByCommentId method', () => {
        it('should return a thread comment like count correctly', async () => {
            // Arrange
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

            // create users
            await UsersTableTestHelper.addUser({ id: 'user-12345' });
            await UsersTableTestHelper.addUser({ id: 'user-23456', username: 'johndoe' });

            // create a thread
            await ThreadsTableTestHelper.addThread({ id: 'thread-12345' });

            // create a comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-12345' });

            // add comment likes
            await ThreadsCommentsLikesTableTestHelper.addCommentLike({
                id: 'like-12345', commentId: 'comment-12345', userId: 'user-12345'
            });
            await ThreadsCommentsLikesTableTestHelper.addCommentLike({
                id: 'like-23456', commentId: 'comment-12345', userId: 'user-23456'
            });

            // Action
            const likeCount = await threadCommentLikeRepositoryPostgres
                .getCommentLikeCountByCommentId('comment-12345');

            // Assert
            expect(likeCount).toBe(2);
        });
    });

    describe('getCommentLikeById method', () => {
        it('should return empty array when thread comment like not found', async () => {
            // Arrange
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadCommentLikeRepositoryPostgres.getCommentLikeById('comment-23456', 'user-12345'))
                .resolves.toEqual([]);
        });

        it('should return array with length 1 when thread comment like found', async () => {
            // Arrange
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadCommentLikeRepositoryPostgres.getCommentLikeById('comment-12345', 'user-12345'))
                .resolves.toHaveLength(1);
        });
    });

    describe('addCommentLike method', () => {
        it('should add thread comment like to database correctly', async () => {
            // Arrange
            const fakeIdGenerator = () => '12345';
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, fakeIdGenerator);

            // create a comment
            await ThreadsCommentsTableTestHelper.addThreadComment({ id: 'comment-23456' });

            // Action
            await threadCommentLikeRepositoryPostgres.addCommentLike('comment-23456', 'user-12345');

            // Assert
            const commentLike = await ThreadsCommentsLikesTableTestHelper
                .getCommentLikeById('comment-23456', 'user-12345');

            expect(commentLike).toHaveLength(1);
        });
    });

    describe('deleteCommentLike method', () => {
        it('should throw NotFoundError when thread comment like not found', async () => {
            // Arrange
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

            // Action and Assert
            await expect(threadCommentLikeRepositoryPostgres.deleteCommentLike('comment-34567', 'user-12345'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should delete a thread comment like from database correctly', async () => {
            // Arrange
            const threadCommentLikeRepositoryPostgres = new ThreadCommentLikeRepositoryPostgres(pool, {});

            // Action
            await threadCommentLikeRepositoryPostgres.deleteCommentLike('comment-12345', 'user-12345');

            // Assert
            const commentLike = await ThreadsCommentsLikesTableTestHelper
                .getCommentLikeById('comment-12345', 'user-12345');

            expect(commentLike).toHaveLength(0);
        });
    });
});