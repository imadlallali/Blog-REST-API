const isValidPost = (body) => {
    return body.title && body.content && body.category && Array.isArray(body.tags);
};

module.exports = {
    isValidPost
};
