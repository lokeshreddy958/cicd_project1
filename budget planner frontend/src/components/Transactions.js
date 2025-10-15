import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    user_id: '',
    category_id: '',
    amount: '',
    description: '',
    transaction_date: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
    fetchUsers();
    fetchCategories();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories');
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/transactions', newTransaction);
      setNewTransaction({
        user_id: '',
        category_id: '',
        amount: '',
        description: '',
        transaction_date: ''
      });
      fetchTransactions();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    return user ? user.name : 'Unknown';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === parseInt(categoryId));
    return category ? category.name : 'Unknown';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="transactions">
      <h1>Transaction Management</h1>
      
      <div className="transactions-container">
        <div className="add-transaction">
          <h2>Add New Transaction</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>User:</label>
              <select
                name="user_id"
                value={newTransaction.user_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select User</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Category:</label>
              <select
                name="category_id"
                value={newTransaction.category_id}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Amount:</label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={newTransaction.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description:</label>
              <input
                type="text"
                name="description"
                value={newTransaction.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                name="transaction_date"
                value={newTransaction.transaction_date}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Add Transaction</button>
          </form>
        </div>

        <div className="transactions-list">
          <h2>Transactions</h2>
          <div className="transaction-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="description">{transaction.description}</span>
                  <span className="user">User: {getUserName(transaction.user_id)}</span>
                  <span className="category">Category: {getCategoryName(transaction.category_id)}</span>
                </div>
                <div className="transaction-amount">
                  <span className={parseFloat(transaction.amount) >= 0 ? 'positive' : 'negative'}>
                    ${parseFloat(transaction.amount).toFixed(2)}
                  </span>
                  <span className="date">{new Date(transaction.transaction_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transactions;
