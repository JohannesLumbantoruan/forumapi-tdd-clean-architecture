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
    let threadId = '';

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

            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });
    });
});