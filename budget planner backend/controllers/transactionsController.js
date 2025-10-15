const db = require('../db/connection');

// Get all transactions
exports.getTransactions = (req, res) => {
  let query = 'SELECT * FROM transactions';
  let params = [];

  if (req.query.month && req.query.year) {
    query += ' WHERE YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?';
    params = [req.query.year, req.query.month];
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Add a transaction
exports.addTransaction = (req, res) => {
  const { user_id, category_id, amount, description, transaction_date } = req.body;
  db.query(
    'INSERT INTO transactions (user_id, category_id, amount, description, transaction_date) VALUES (?, ?, ?, ?, ?)',
    [user_id, category_id, amount, description, transaction_date],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Transaction added', transactionId: results.insertId });
    }
  );
};
