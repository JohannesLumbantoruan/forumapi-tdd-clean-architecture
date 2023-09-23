/* istanbul ignore file */
require('dotenv').config();

const { Pool } = require('pg');

const testConfig = {
    host: process.env.PGHOST_TEST,
    port: process.env.PGPORT_TEST,
    user: process.env.PGUSER_TEST,
    password: process.env.PGPASSWORD_TEST,
    database: process.env.PGDATABASE_TEST,
  };

const pool = new Pool(testConfig);

const db = {
    async addThreadComment({
        id = 'comment-12345', content = 'This is a comment', owner = 'user-12345', threadId = 'thread-12345', date = new Date().toISOString()
    }) {
        const query = {
            text: 'INSERT INTO threads_comments VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [id, content, owner, date, threadId]
        };

        const result = await pool.query(query);

        return result.rows[0];
    },

    async deleteThreadCommentById(id) {
        const query = {
            text: 'DELETE FROM threads_comments WHERE id = $1',
            values: [id]
        };

        await pool.query(query);
    },

    async getThreadCommentById(id) {
        console.log(id);
        
        const query = {
            text: 'SELECT * FROM threads_comments WHERE id = $1',
            values: [id]
        };

        const result = await pool.query(query);

        return result.rows;
    },

    async cleanTable() {
        await pool.query('DELETE FROM users');
    },

    async addThread({
        id = 'thread-12345',
        title = 'My First Thread',
        body = 'This is my first thread',
        owner = 'user-12345',
        date = new Date().toISOString()
    }) {        
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING *',
            values: [id, title, body, owner, date]
        };

        const result = await pool.query(query);

        return result.rows[0];
    },

    async addUser({
        id = 'user-123', username = 'dicoding', password = 'secret', fullname = 'Dicoding Indonesia',
      }) {
        const query = {
          text: 'INSERT INTO users VALUES($1, $2, $3, $4) RETURNING *',
          values: [id, username, password, fullname],
        };
    
        const result = await pool.query(query);

        return result.rows[0];
      }
};

async function testDB() {
    await db.cleanTable();

    const user = await db.addUser({ id: 'user-12345' });

    console.log(user);

    const thread = await db.addThread({ id: 'thread-12345'});

    console.log(thread);

    const comment = await db.addThreadComment({ id: 'comment-12345'});

    console.log(comment);

    const addedComment = await db.getThreadCommentById('comment-12345');

    return addedComment;
}

testDB().then(async (comment) => {
    console.log(comment);

    await db.cleanTable();
    await pool.end();
});