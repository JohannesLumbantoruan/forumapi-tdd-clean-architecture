const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe('/threads/{threadId}/comments/{commentId}/replies', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    let accessToken = '';
    let accessToken2 = '';
    let threadId = '';
    let commentId = '';
    let replyId = '';

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response status code 201 and added reply', async () => {
            // Arrange
            const requestPayload = {
                content: 'This is a comment reply'
            };

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
                    content: 'This is a comment'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            commentId = JSON.parse(threadComment.payload).data.addedComment.id;

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            replyId = responseJson.data.addedReply.id;

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });

        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/thread-23456/comments/${commentId}/replies`,
                payload: {
                    content: 'This is a comemnt reply'
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

        it('should respone status code 404 when thread comment not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/comment-12345/replies`,
                payload: {
                    content: 'This is a comment reply'
                },
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

        it('shoud respons status code 400 when payload do not contains needed property', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                payload: {},
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan isi balasan komentar thread');
        });

        it('shoud respons status code 400 when payload not string', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments/${commentId}/replies`,
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
            expect(responseJson.message).toEqual('balasan komentar thread harus berupa string');
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/thread-12345/comments/${commentId}/replies/${replyId}`,
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
                url: `/threads/${threadId}/comments/comment-12345/replies/${replyId}`,
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

        it('should response status code 404 when thread comment reply not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/reply-12345`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('balasan komentar thread tidak ditemukan');
        });

        it('should response status code 403 when user not owner of the thread comment reply', async () => {
            // Arrange
            const server = await createServer(container);

            // create a user
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
            const auth2 = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'janedoe',
                    password: 'janedoe'
                }
            });

            accessToken2 = JSON.parse(auth2.payload).data.accessToken;

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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

        it('should response status code 401 when request not authenticated', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(401);
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it('should response status code 200 when thread comment reply successfully deleted', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.message).toEqual('balasan komentar thread berhasil dihapus');
        });
    });
});