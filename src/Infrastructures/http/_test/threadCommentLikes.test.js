const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads/{threadId}/comments/{commentId}/likes endpoint', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    let accessToken = '';
    let threadId = '';
    let commentId = '';

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // create a user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'johndoe',
                    password: 'johndoe',
                    fullname: 'John Doe'
                }
            });

            // get access token
            const auth = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'johndoe',
                    password: 'johndoe'
                }
            });

            accessToken = JSON.parse(auth.payload).data.accessToken;

            // create a thread
            const thread = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: {
                    title: 'My First Thread',
                    body: 'This is my first thread.'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            threadId = JSON.parse(thread.payload).data.addedThread.id;

            // create a thread comment
            const threadComment = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'This is a thread comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            commentId = JSON.parse(threadComment.payload).data.addedComment.id;

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/thread-12345/comments/${commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response status code 404 when thread comment not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${threadId}/comments/comment-12345/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar thread tidak ditemukan');
        });

        it('should response status code 200 and add/delete thread comment like correctly', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});