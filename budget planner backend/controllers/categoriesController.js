const db = require('../db/connection');

// Get all categories
exports.getCategories = (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a category
exports.addCategory = (req, res) => {
  const { name, type } = req.body;
  db.query(
    'INSERT INTO categories (name, type) VALUES (?, ?)',
    [name, type],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Category added', categoryId: results.insertId });
    }
  );
};
