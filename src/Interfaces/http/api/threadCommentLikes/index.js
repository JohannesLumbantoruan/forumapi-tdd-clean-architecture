const ThreadCommentLikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'threadCommentLikes',
    version: '1.0.0',
    register: async (server, { container }) => {
        const threadCommentLikesHandler = new ThreadCommentLikesHandler(container);

        server.route(routes(threadCommentLikesHandler));
    }
};