import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [pastMonthData, setPastMonthData] = useState({ totalExpenses: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
    fetchPastMonthData();
  }, []);

  useEffect(() => {
    fetchFilteredTransactions();
  }, [selectedMonth, selectedYear]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const fetchFilteredTransactions = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${selectedMonth}&year=${selectedYear}`);
      setFilteredTransactions(response.data);
    } catch (error) {
      console.error('Error fetching filtered transactions:', error);
      setFilteredTransactions([]);
    }
  };

  const fetchPastMonthData = async () => {
    const pastMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
    const pastYear = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
    try {
      const response = await axios.get(`http://localhost:5000/api/transactions?month=${pastMonth}&year=${pastYear}`);
      const pastExpenses = response.data.filter(t => parseFloat(t.amount) < 0).reduce((sum, t) => sum + Math.abs(parseFloat(t.amount)), 0);
      setPastMonthData({ totalExpenses: pastExpenses });
    } catch (error) {
      console.error('Error fetching past month data:', error);
      setPastMonthData({ totalExpenses: 0 });
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

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  const calculateTotal = (type, transList = transactions) => {
    return transList
      .filter(t => {
        const category = categories.find(cat => cat.id === t.category_id);
        return category && category.type === type;
      })
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  const handleAddTransaction = () => {
    navigate('/transactions');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  const currentMonthExpenses = Math.abs(calculateTotal('expense', filteredTransactions));
  const currentMonthIncome = calculateTotal('income', filteredTransactions);
  const currentMonthBalance = currentMonthIncome + calculateTotal('expense', filteredTransactions);

  const months = Array.from({length: 12}, (_, i) => i + 1);
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="dashboard">
      <h1>Budget Dashboard</h1>
      
      <div className="filter-section">
        <h2>Select Month and Year for Spendings</h2>
        <select value={selectedMonth} onChange={handleMonthChange}>
          {months.map(m => (
            <option key={m} value={m}>{new Date(0, m - 1).toLocaleString('default', { month: 'long' })}</option>
          ))}
        </select>
        <select value={selectedYear} onChange={handleYearChange}>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="summary-cards">
        <div className="card income">
          <h3>Total Income ({new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })})</h3>
          <p className="amount">${currentMonthIncome.toFixed(2)}</p>
        </div>
        <div className="card expense">
          <h3>Total Expenses</h3>
          <p className="amount">${currentMonthExpenses.toFixed(2)}</p>
        </div>
        <div className="card balance">
          <h3>Balance</h3>
          <p className="amount">${currentMonthBalance.toFixed(2)}</p>
        </div>
      </div>

      <div className="past-month-section">
        <h2>Past Month Data</h2>
        <p>Total Expenses: ${pastMonthData.totalExpenses.toFixed(2)}</p>
      </div>

      <button className="btn-add-transaction" onClick={handleAddTransaction}>Add Transaction</button>

      <div className="recent-transactions">
        <h2>Recent Transactions ({new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long', year: 'numeric' })})</h2>
        <div className="transaction-list">
          {filteredTransactions.slice(0, 5).map(transaction => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-info">
                <span className="description">{transaction.description}</span>
                <span className="category">{getCategoryName(transaction.category_id)}</span>
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
  );
}

export default Dashboard;
