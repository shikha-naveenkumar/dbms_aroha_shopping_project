import { useState, useEffect } from 'react';
import { getProducts, getCategories, addToCart } from '../api';
import { useAuth } from '../AuthContext';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory) params.category_id = selectedCategory;
    if (search) params.search = search;
    getProducts(params).then(setProducts).catch(console.error).finally(() => setLoading(false));
  }, [selectedCategory, search]);

  const handleAddToCart = async (product) => {
    if (!user) return alert('Please login first');
    try {
      await addToCart({ user_id: user.user_id, product_id: product.product_id, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="products-page">
      <h1 className="page-title">All Products</h1>

      <div className="filters">
        <input
          type="text" placeholder="Search products..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          <option value="">All Categories</option>
          {categories.map(c => (
            <option key={c.category_id} value={c.category_id}>{c.category_name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map(p => (
            <ProductCard key={p.product_id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
