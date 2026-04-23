import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, getReviews, addReview, addToCart, addHistory } from '../api';
import { useAuth } from '../AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const [prod, revs] = await Promise.all([
          getProduct(id),
          getReviews(id)
        ]);
        setProduct(prod);
        setReviews(revs);
        // Record browsing history
        if (user && user.role === 'customer') {
          addHistory({ user_id: user.user_id, product_id: parseInt(id) }).catch(() => {});
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user]);

  const handleAddToCart = async () => {
    if (!user) return alert('Please login first');
    try {
      await addToCart({ user_id: user.user_id, product_id: product.product_id, quantity });
      alert('Added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return alert('Please login first');
    try {
      await addReview({
        user_id: user.user_id,
        product_id: parseInt(id),
        rating: parseInt(reviewForm.rating),
        comment: reviewForm.comment
      });
      const revs = await getReviews(id);
      setReviews(revs);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="empty-state">Product not found.</div>;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'No ratings';

  return (
    <div className="product-detail-page">
      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={product.image_url || 'https://via.placeholder.com/500x600?text=No+Image'}
            alt={product.name}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x600?text=No+Image'; }}
          />
        </div>
        <div className="product-detail-info">
          <span className="product-brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <span className="product-category">{product.category_name}</span>
          <p className="product-detail-price">₹{product.price?.toLocaleString()}</p>
          <p className="product-detail-rating">⭐ {avgRating} ({reviews.length} reviews)</p>
          <p className="product-detail-desc">{product.description}</p>
          <p className="product-detail-stock">
            {product.stock > 0 ? `✅ ${product.stock} in stock` : '❌ Out of stock'}
          </p>

          {user && user.role === 'customer' && product.stock > 0 && (
            <div className="product-detail-actions">
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
              <button className="btn btn-primary btn-lg" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        {user && user.role === 'customer' && (
          <form className="review-form" onSubmit={handleReview}>
            <div className="form-row">
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                >
                  {[5, 4, 3, 2, 1].map(n => (
                    <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ flex: 2 }}>
                <label>Comment</label>
                <input
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Write your review..."
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Submit Review</button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="empty-state">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="reviews-list">
            {reviews.map(r => (
              <div key={r.review_id} className="review-card">
                <div className="review-header">
                  <strong>{r.user_name}</strong>
                  <span className="review-stars">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p>{r.comment}</p>
                <small>{new Date(r.review_date).toLocaleDateString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
