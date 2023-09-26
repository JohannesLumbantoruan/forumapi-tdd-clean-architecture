const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    let accessToken = '';
    let threadId = '';
    let commentId = '';

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response status code 400 when payload do not contains neeeded properties', async () => {
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
            
            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan content comment');
        });

        it('should response status code 400 when payload not string', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 12345
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            
            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('content comment harus berupa string');
        });

        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-23456/comments',
                payload: {
                    content: 'This is a comment'
                },
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

        it('should response status code 201 and return added comment correctly', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: {
                    content: 'This is a comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            commentId = responseJson.data.addedComment.id;

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/thread-12345/comments/${commentId}`,
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
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-12345`,
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

        it('should response status code 403 when user is not owner of the thread comment', async () => {
            // Arrange
            const server = await createServer(container);

            // create a new user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'janedoe',
                    password: 'janedoe',
                    fullname: 'Jane Doe'
                }
            });

            // get access token
            const janeDoe = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'janedoe',
                    password: 'janedoe'
                }
            });

            accessToken2 = JSON.parse(janeDoe.payload).data.accessToken;

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken2}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('anda tidak berhak mengakses resource ini');
        });

        it('should response status code 200 when thread comment deleted successfully', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('komentar thread berhasil dihapus');
        });
    });
});