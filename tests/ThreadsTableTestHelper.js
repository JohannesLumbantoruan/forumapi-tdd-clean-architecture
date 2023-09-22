/* istanbul ignore file */

const pool = require('../src/Infrastructures/database/postgres/pool');
const UsersTableTestHelper = require('./UsersTableTestHelper');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-12345',
        title = 'My First Thread',
        body = 'This is my first thread',
        owner = 'user-12345',
        date = new Date().toISOString()
    }) {
        await UsersTableTestHelper.addUser({ id: owner });
        
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, date]
        };

        await pool.query(query);
    },

    async getThreadById(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM threads');
    }
};

module.exports = ThreadsTableTestHelper;