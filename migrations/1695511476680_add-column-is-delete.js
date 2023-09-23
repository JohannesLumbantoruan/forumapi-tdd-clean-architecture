/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
    pgm.addColumn('threads_comments', {
        is_delete: {
            type: 'boolean',
            notNull: true,
            default: false,
            check: '"is_delete" IN (FALSE, TRUE)'
        }
    });

    pgm.addColumn('threads_comments_replies', {
        is_delete: {
            type: 'boolean',
            notNull: true,
            default: false,
            check: '"is_delete" IN (FALSE, TRUE)'
        }
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('threads_comments', 'is_delete');
    pgm.dropColumn('threads_comments_replies', 'is_delete');
};
