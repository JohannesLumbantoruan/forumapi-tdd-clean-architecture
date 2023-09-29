const routes = (handler) => [
    {
        method: 'POST',
        path: '/threads/{threadId}/comments/{commentId}/replies',
        handler: handler.postThreadCommentReplyHandler,
        options: {
            auth: 'forumapi_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        handler: handler.deleteThreadCommentReplyHandler,
        options: {
            auth: 'forumapi_jwt'
        }
    }
];

module.exports = routes;