const ThreadCommentRepliesHandler = require("./handler.");
const routes = require("./routes");

module.exports = {
    name: 'threadCommentReplies',
    version: '1.0.0',
    register: async (server, { container }) => {
        const threadCommentRepliesHandler = new ThreadCommentRepliesHandler(container);

        server.route(routes(threadCommentRepliesHandler));
    }
}