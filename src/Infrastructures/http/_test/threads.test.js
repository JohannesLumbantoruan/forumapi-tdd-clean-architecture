const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");
const container = require("../../container");

describe('/thread endpoint', () => {
    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();
        await pool.end();
    });

    let accessToken = '';

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