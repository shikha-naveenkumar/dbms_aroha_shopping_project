import { useState, useEffect } from 'react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ category_name: '', description: '' });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getCategories().then(setCategories).catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ category_name: '', description: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (c) => {
    setForm({ category_name: c.category_name, description: c.description || '' });
    setEditing(c.category_id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateCategory(editing, form);
      } else {
        await addCategory(form);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-categories-page">
      <div className="page-header">
        <h1 className="page-title">Manage Categories</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Category Name *</label>
            <input value={form.category_name} onChange={(e) => setForm({ ...form, category_name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="2" />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update' : 'Add'} Category
          </button>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr><th>ID</th><th>Name</th><th>Description</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.category_id}>
                <td>{c.category_id}</td>
                <td>{c.category_name}</td>
                <td>{c.description}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(c)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c.category_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
