const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(thread) {
        const { title, body, owner } = thread;
        const id = `thread-${this._idGenerator()}`;
        const date = new Date().toISOString();

        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, date]
        };

        const result = await this._pool.query(query);

        return new AddedThread(result.rows[0]);
    }

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId]
        };

        const result = await this._pool.query(query);

        if (result.rowCount === 0) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return result.rows[0];
    }

    async getThreadDetailById(threadId) {
        const threadQuery = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId]
        };

        const threadResult = await this._pool.query(threadQuery);

        if (threadResult.rowCount === 0) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        const thread = threadResult.rows[0];

        const userQuery = {
            text: 'SELECT username FROM users WHERE id = $1',
            values: [thread.owner]
        };

        const userResult = await this._pool.query(userQuery);

        const username = userResult.rows[0].username;

        thread['username'] = username;

        delete thread['owner'];

        const commentQuery = {
            text: 'SELECT * FROM threads_comments WHERE thread_id = $1 ORDER BY date',
            values: [threadId]
        };

        const commentResult = await this._pool.query(commentQuery);

        if (commentResult.rowCount === 0) {
            thread['comments'] = [];

            return thread;
        }

        const comments = commentResult.rows;

        for (const comment of comments) {
            const userQuery = {
                text: 'SELECT username FROM users WHERE id = $1',
                values: [comment.owner]
            };

            const userResult = await this._pool.query(userQuery);

            const username = userResult.rows[0].username;

            if (comment['is_delete']) {
                comment.content = '**komentar telah dihapus**'
            }

            delete comment['owner'];
            delete comment['is_delete'];
            delete comment['thread_id'];

            comment['username'] = username;

            const replyQuery = {
                text: 'SELECT * FROM threads_comments_replies WHERE thread_comment_id = $1 ORDER BY date',
                values: [comment.id]
            };

            const replyResult = await this._pool.query(replyQuery);

            const replies = replyResult.rows;

            for (const reply of replies) {
                const userQuery = {
                    text: 'SELECT username FROM users WHERE id = $1',
                    values: [reply.owner]
                };

                const userResult = await this._pool.query(userQuery);

                const username = userResult.rows[0].username;

                reply['username'] = username;

                if (reply['is_delete']) {
                    reply.content = '**balasan telah dihapus**'
                }

                delete reply['owner'];
                delete reply['is_delete'];
                delete reply['thread_comment_id'];
            };

            comment['replies'] = replies;
        };

        thread['comments'] = comments;

        return thread;
    }
}

module.exports = ThreadRepositoryPostgres;