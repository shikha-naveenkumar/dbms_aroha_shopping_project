import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, getTrending } from '../api';
import { useAuth } from '../AuthContext';
import ProductCard from '../components/ProductCard';
import { addToCart } from '../api';

export default function Dashboard() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [trendData, allData] = await Promise.all([
          getTrending(),
          getProducts()
        ]);
        setTrending(trendData.slice(0, 4));
        setNewArrivals(allData.slice(0, 8));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleAddToCart = async (product) => {
    if (!user) return;
    try {
      await addToCart({ user_id: user.user_id, product_id: product.product_id, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to <span className="brand-gradient">Aroha</span></h1>
          <p>Discover the latest trends in fashion. Curated styles for every occasion.</p>
          <Link to="/products" className="btn btn-primary btn-lg">Shop Now</Link>
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="section">
          <h2 className="section-title">🔥 Trending Now</h2>
          <div className="product-grid">
            {trending.map(p => (
              <ProductCard key={p.product_id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="section">
        <h2 className="section-title">✨ New Arrivals</h2>
        <div className="product-grid">
          {newArrivals.map(p => (
            <ProductCard key={p.product_id} product={p} onAddToCart={handleAddToCart} />
          ))}
        </div>
        <div className="section-cta">
          <Link to="/products" className="btn btn-outline">View All Products →</Link>
        </div>
      </section>
    </div>
  );
}
