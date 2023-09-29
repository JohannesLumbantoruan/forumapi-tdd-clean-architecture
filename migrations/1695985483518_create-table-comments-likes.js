/* eslint-disable camelcase */

exports.up = (pgm) => {
    pgm.createTable('comments_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true
        },
        comment_id: {
            type: 'VARCHAR(50)',
            references: 'threads_comments',
            notNull: true,
            onDelete: 'cascade'
        },
        user_id: {
            type: 'VARCHAR(50)',
            references: 'users',
            notNull: true,
            onDelete: 'cascade'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments_likes');
};
