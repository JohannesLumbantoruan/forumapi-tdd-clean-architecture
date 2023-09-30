/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsCommentsLikesTableTestHelper = {
    async addCommentLike({
        id = 'like-12345', commentId = 'comment-12345', userId = 'user-12345'
    }) {
        const query = {
            text: 'INSERT INTO comments_likes VALUES ($1, $2, $3)',
            values: [id, commentId, userId]
        };

        await pool.query(query);
    },

    async getCommentLikeById(commentId, userId) {
        const query = {
            text: 'SELECT * FROM comments_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId]
        };

        const result = await pool.query(query);

        return result.rows;
    }
};

module.exports = ThreadsCommentsLikesTableTestHelper;