const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const pool = require('../../database/postgres/pool');
const Thread = require('../../../Domains/threads/entities/Thread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await UsersTableTestHelper.cleanTable();

        await pool.end();
    })

    describe('addThread method', () => {
        it('should persist add thread and return added thread correctly', async () => {
            // Arrange
            const newThread = new Thread({
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345'
            });

            const fakeIdGenerator = () => '12345';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            await UsersTableTestHelper.addUser({ id: newThread.owner });

            // Action
            await threadRepositoryPostgres.addThread(newThread);

            // Assert
            const thread = await ThreadsTableTestHelper.getThreadById('thread-12345');

            expect(thread).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const newThread = new Thread({
                title: 'My First Thread',
                body: 'This is my first thread.',
                owner: 'user-12345'
            });

            const mockAddedThread = new AddedThread({
                id: 'thread-12345',
                title: 'My First Thread',
                owner: 'user-12345'
            });

            const fakeIdGenerator = () => '12345';

            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(newThread);

            // Assert
            expect(addedThread).toStrictEqual(mockAddedThread);
        });
    });
});