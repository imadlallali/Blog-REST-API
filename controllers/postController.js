let posts = [];
let currentID = 1;

const isValidPost = (body) => {
    return body.title && body.content && body.category && Array.isArray(body.tags) ;
};

exports.createPost = (req, res) => {
    if (!isValidPost(req.body)) {
        return res.status(400).json({ error: 'Invalid post data' });
    }
    const newPost = { id: currentID++
        , ...req.body
        ,  createdAt: new Date().toISOString()
        , updatedAt: new Date().toISOString()
    };
    posts.push(newPost);
    res.status(201).json(newPost);
};

exports.getAllPosts = (req, res) => {
    const term = req.query.term;
    if (term) {
        const lowerTerm = term.toLowerCase();
        const filteredPosts = posts.filter(p => 
            p.title.toLowerCase().includes(lowerTerm) ||
            p.content.toLowerCase().includes(lowerTerm) ||
            p.category.toLowerCase().includes(lowerTerm)
       );
        return res.json(filteredPosts);
    }
    res.json(posts);
};

exports.getPostById = (req, res) => {
    const post = posts.find(p => p.id === parseInt(req.params.id));
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
};

exports.updatePost = (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    if (!isValidPost(req.body)) {
        return res.status(400).json({ error: 'Invalid post data' });
    }

    const updatedPost = { ...posts[index]
        , ...req.body
        , updatedAt: new Date().toISOString()
    };
    posts[index] = updatedPost;
    res.json(updatedPost);
};

exports.deletePost = (req, res) => {
    const index = posts.findIndex(p => p.id === parseInt(req.params.id));
    if (index === -1) {
        return res.status(404).json({ error: 'Post not found' });
    }
    posts.splice(index, 1);
    res.status(204).send();
};