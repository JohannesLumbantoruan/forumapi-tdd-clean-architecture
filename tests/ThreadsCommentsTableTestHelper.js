/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsCommentsTableTestHelper = {
    async addThreadComment({
        id = 'comment-12345', content = 'This is a comment', owner = 'user-12345', threadId = 'thread-12345', date = new Date().toISOString()
    }) {
        const query = {
            text: 'INSERT INTO threads_comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, content, owner, date, threadId, false]
        };

        await pool.query(query);
    },

    async getThreadCommentById(commentId, threadId) {
        const query = {
            text: 'SELECT * FROM threads_comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async deleteThreadCommentById(commentId, threadId) {
        const query = {
            text: `UPDATE threads_comments SET is_delete = TRUE
            WHERE id = $1 AND thread_id = $2`,
            values: [commentId, threadId]
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads_comments');
    }
};

module.exports = ThreadsCommentsTableTestHelper;