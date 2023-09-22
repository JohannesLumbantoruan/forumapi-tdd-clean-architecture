/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.createTable('threads_comments_replies', {
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
            references: 'users',
            notNull: true,
            onDelete: 'cascade'
        },
        thread_comment_id: {
            type: 'VARCHAR(50)',
            references: 'threads_comments',
            notNull: true,
            onDelete: 'cascade'
        },
        date: {
            type: 'TEXT',
            notNull: true
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('threads_comments_replies');
};
