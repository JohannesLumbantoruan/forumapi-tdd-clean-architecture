const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsCommentsTableTestHelper = require('../../../../tests/ThreadsCommentsTableTestHelper');
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe('/thread endpoint', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await ThreadsCommentsTableTestHelper.cleanTable();
        await pool.end();
    });

    let accessToken = '';
    let accessToken2 = '';
    let threadId = '';
    let commentId = '';
    let replyId = '';

    describe('when POST /threads', () => {
        it('should response status code 201 and added thread', async () => {
            // Arrange
            const server = await createServer(container);
    
            const requestPayload = {
                title: 'My First Thread',
                body: 'This is my first thread'
            };
    
            // create user
            await server.inject({
                method: 'POST',
                url: '/users',
                payload: {
                    username: 'johndoe',
                    password: 'johndoe',
                    fullname: 'John Doe'
                }
            });
    
            // get accessToken
            const authentication = await server.inject({
                method: 'POST',
                url: '/authentications',
                payload: {
                    username: 'johndoe',
                    password: 'johndoe'
                }
            });
    
            accessToken = JSON.parse(authentication.payload).data.accessToken;
    
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            })
    
            // Assert
            const responseJson = JSON.parse(response.payload);

            threadId = responseJson.data.addedThread.id;
    
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    
        it('should response status code 400 when payload do not contains needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'My First Thread'
            };
    
            const server = await createServer(container);
    
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            // Assert
            const responseJson = JSON.parse(response.payload);
    
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('harus mengirimkan title dan body thread');
        });
    
        it('should response status code 400 when payload not string', async () => {
            // Arrange
            const requestPayload = {
                title: 'My First Thread',
                body: 12345
            };
    
            const server = await createServer(container);
    
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            // Assert
            const responseJson = JSON.parse(response.payload);
    
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('title dan body thread harus berupa string');
        });
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('should response status code 400 when payload do not contains neeeded properties', async () => {
            // Arrange
            const server = await createServer(container);
            
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

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('should response status code 201 and added reply', async () => {
            // Arrange
            const requestPayload = {
                content: 'This is a comment reply'
            };

            const server = await createServer(container);

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

    describe('when GET /threads/{threadId}', () => {
        it('should response status code 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/thread-12345`
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response status code 200 when thread found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: `/threads/${threadId}`
            });

            // Assert
            const responseJson = JSON.parse(response.payload);

            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
        });
    });
});