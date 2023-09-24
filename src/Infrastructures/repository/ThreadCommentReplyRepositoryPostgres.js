const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentReplyRepository = require('../../Domains/threads/ThreadCommentReplyRepository');
const AddedThreadCommentReply = require('../../Domains/threads/entities/AddedThreadCommentReply');

class ThreadCommentReplyRepositoryPostgres extends ThreadCommentReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThreadCommentReply(reply) {
        const { content, userId, commentId } = reply;
        const id = `reply-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads_comments_replies VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [id, content, userId, commentId, date, false]
        };

        const result = await this._pool.query(query);

        return new AddedThreadCommentReply({ ...result.rows[0] });
    }

    async deleteThreadCommentReplyById(replyId, commentId) {
        const query = {
            text: `UPDATE threads_comments_replies SET is_delete = TRUE
            WHERE id = $1 AND thread_comment_id = $2 RETURNING id`,
            values: [replyId, commentId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('balasan komentar thread tidak ditemukan');
        }
    }
}

module.exports = ThreadCommentReplyRepositoryPostgres;