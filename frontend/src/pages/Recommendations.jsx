import { useState, useEffect } from 'react';
import { getRecommendations, getTrending, addToCart } from '../api';
import { useAuth } from '../AuthContext';
import ProductCard from '../components/ProductCard';

export default function Recommendations() {
  const { user } = useAuth();
  const [personalized, setPersonalized] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [pers, trend] = await Promise.all([
          user ? getRecommendations(user.user_id) : Promise.resolve([]),
          getTrending()
        ]);
        setPersonalized(pers);
        setTrending(trend);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const handleAddToCart = async (product) => {
    if (!user) return;
    try {
      await addToCart({ user_id: user.user_id, product_id: product.product_id, quantity: 1 });
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading recommendations...</div>;

  return (
    <div className="recommendations-page">
      <h1 className="page-title">Recommended for You</h1>

      {personalized.length > 0 && (
        <section className="section">
          <h2 className="section-title">🎯 Personalized Picks</h2>
          <div className="product-grid">
            {personalized.map(p => (
              <ProductCard key={p.product_id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">🔥 Trending Products</h2>
        {trending.length === 0 ? (
          <div className="empty-state">No trending data yet.</div>
        ) : (
          <div className="product-grid">
            {trending.map(p => (
              <ProductCard key={p.product_id} product={p} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
