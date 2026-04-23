import { useState, useEffect } from 'react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct } from '../api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: '', brand: '', price: '', description: '', image_url: '', stock: '', category_id: ''
  });
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const resetForm = () => {
    setForm({ name: '', brand: '', price: '', description: '', image_url: '', stock: '', category_id: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name, brand: p.brand || '', price: p.price, description: p.description || '',
      image_url: p.image_url || '', stock: p.stock || 0, category_id: p.category_id || ''
    });
    setEditing(p.product_id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock || 0),
        category_id: parseInt(form.category_id)
      };
      if (editing) {
        await updateProduct(editing, payload);
      } else {
        await addProduct(payload);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-products-page">
      <div className="page-header">
        <h1 className="page-title">Manage Products</h1>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Brand</label>
              <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Price * (must be &gt; 500)</label>
              <input type="number" min="501" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
              <option value="">Select Category</option>
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows="3" />
          </div>
          <button type="submit" className="btn btn-primary">
            {editing ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th><th>Image</th><th>Name</th><th>Brand</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.product_id}>
                <td>{p.product_id}</td>
                <td>
                  <img src={p.image_url || 'https://via.placeholder.com/40x40'} alt="" className="table-thumb"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40x40'; }} />
                </td>
                <td>{p.name}</td>
                <td>{p.brand}</td>
                <td>₹{p.price?.toLocaleString()}</td>
                <td>{p.stock}</td>
                <td>{p.category_name}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => handleEdit(p)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.product_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
