/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsCommentsRepliesTableTestHelper = {
    async addThreadCommentReply({
        id = 'reply-12345', owner = 'user-12345', commentId = 'comment-12345', content = 'This is a comment reply', date = new Date().toISOString()
    }) {
        const query = {
            text: 'INSERT INTO threads_comments_replies VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, commentId, date, false]
        };

        await pool.query(query);
    },

    async getThreadCommentReplyById(replyId, commentId) {
        const query = {
            text: 'SELECT * FROM threads_comments_replies WHERE id = $1 AND thread_comment_id = $2',
            values: [replyId, commentId]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async deleteThreadCommentReplyById(replyId, commentId) {
        const query = {
            text: `UPDATE threads_comments_replies SET is_delete = TRUE
            WHERE id = $1 AND thread_comment_id = $2`,
            values: [replyId, commentId]
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads_comments_replies');
    }
};

module.exports = ThreadsCommentsRepliesTableTestHelper;