/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('threads_comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        content: {
            type: 'TEXT',
            notNull: true
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users',
            onDelete: 'cascade'
        },
        date: {
            type: 'TEXT',
            notNull: true
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'threads',
            onDelete: 'cascade'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('threads_comments');
};
