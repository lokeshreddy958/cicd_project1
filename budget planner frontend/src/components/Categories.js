import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

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
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/categories', newCategory);
      setNewCategory({ name: '', type: 'expense' });
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="categories">
      <h1>Category Management</h1>
      
      <div className="categories-container">
        <div className="add-category">
          <h2>Add New Category</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={newCategory.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Type:</label>
              <select
                name="type"
                value={newCategory.type}
                onChange={handleInputChange}
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Add Category</button>
          </form>
        </div>

        <div className="categories-list">
          <h2>Categories</h2>
          <div className="category-grid">
            {categories.map(category => (
              <div key={category.id} className={`category-card ${category.type}`}>
                <h3>{category.name}</h3>
                <p className="type">{category.type}</p>
                <small>Created: {new Date(category.created_at).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Categories;
