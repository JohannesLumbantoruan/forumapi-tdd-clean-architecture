const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadCommentLikeRepository = require('../../Domains/threads/ThreadCommentLikeRepository');

class ThreadCommentLikeRepositoryPostgres extends ThreadCommentLikeRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async getCommentLikeCountByCommentId(commentId) {
        const query = {
            text: 'SELECT COUNT(*) FROM comments_likes WHERE comment_id = $1',
            values: [commentId]
        };

        const result = await this._pool.query(query);

        return Number(result.rows[0].count);
    }

    async getCommentLikeById(commentId, userId) {
        const query = {
            text: 'SELECT * FROM comments_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId]
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async addCommentLike(commentId, userId) {
        const id = this._idGenerator();

        const query = {
            text: 'INSERT INTO comments_likes VALUES ($1, $2, $3)',
            values: [id, commentId, userId]
        };

        await this._pool.query(query);
    }

    async deleteCommentLike(commentId, userId) {
        const query = {
            text: 'DELETE FROM comments_likes WHERE comment_id = $1 AND user_id = $2',
            values: [commentId, userId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('suka komentar thread tidak ditemukan');
        }
    }
}

module.exports = ThreadCommentLikeRepositoryPostgres;