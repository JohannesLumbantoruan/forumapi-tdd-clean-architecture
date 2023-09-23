const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentRepository = require('../../Domains/threads/ThreadCommentRepository');
const AddedThreadComment = require('../../Domains/threads/entities/AddedThreadComment');

class ThreadCommentRepositoryPostres extends ThreadCommentRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThreadComment(comment) {
        const { content, owner, threadId } = comment;
        const id = `comment-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads_comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, owner, date, threadId, false]
        };

        const result = await this._pool.query(query);

        return new AddedThreadComment(result.rows[0]);
    }

    async deleteThreadCommentById(commentId, threadId) {
        const query = {
            text: `UPDATE threads_comments
            SET is_delete = TRUE
            WHERE id = $1 AND thread_id = $2 RETURNING id`,
            values: [commentId, threadId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('komentar thread tidak ditemukan');
        }
    }

    async verifyThreadCommentOwner(commentId, userId) {
        const query = {
            text: 'SELECT * FROM threads_comments WHERE id = $1 AND owner = $2',
            values: [commentId, userId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async getThreadCommentById(commentId, threadId) {
        const query = {
            text: 'SELECT * FROM threads_comments WHERE id = $1 AND thread_id = $2',
            values: [commentId, threadId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('komentar thread tidak ditemukan');
        }

        return result.rows[0];
    }
}

module.exports = ThreadCommentRepositoryPostres;