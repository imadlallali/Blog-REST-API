const { isValidPost } = require('../utils/validation');
const db = require('../config/database');

exports.createPost = (req, res) => {
    if (!isValidPost(req.body)) {
        return res.status(400).json({ error: 'Invalid post data' });
    }

    const { title, content, category, tags } = req.body;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const sql = `INSERT INTO posts (title, content, category, tags, createdAt, updatedAt) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [title, content, category, JSON.stringify(tags), createdAt, updatedAt], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({
            id: this.lastID,
            title,
            content,
            category,
            tags,
            createdAt,
            updatedAt
        });
    });
};

exports.getAllPosts = (req, res) => {
    const term = req.query.term;
    let sql = 'SELECT * FROM posts';
    let params = [];

    if (term) {
        sql += ' WHERE title LIKE ? OR content LIKE ? OR category LIKE ?';
        const searchTerm = `%${term}%`;
        params = [searchTerm, searchTerm, searchTerm];
    }

    db.all(sql, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Parse tags back to array
        const posts = rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags)
        }));

        res.json(posts);
    });
};

exports.getPostById = (req, res) => {
    const sql = 'SELECT * FROM posts WHERE id = ?';

    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({
            ...row,
            tags: JSON.parse(row.tags)
        });
    });
};

exports.updatePost = (req, res) => {
    if (!isValidPost(req.body)) {
        return res.status(400).json({ error: 'Invalid post data' });
    }

    const { title, content, category, tags } = req.body;
    const updatedAt = new Date().toISOString();

    const sql = `UPDATE posts 
                 SET title = ?, content = ?, category = ?, tags = ?, updatedAt = ? 
                 WHERE id = ?`;

    db.run(sql, [title, content, category, JSON.stringify(tags), updatedAt, req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.json({
            id: parseInt(req.params.id),
            title,
            content,
            category,
            tags,
            updatedAt
        });
    });
};

exports.deletePost = (req, res) => {
    const sql = 'DELETE FROM posts WHERE id = ?';

    db.run(sql, [req.params.id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(204).send();
    });
};