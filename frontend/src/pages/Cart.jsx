import { useState, useEffect } from 'react';
import { getCart, updateCart, removeFromCart, placeOrder } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);

  const loadCart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getCart(user.user_id);
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, [user]);

  const handleUpdate = async (cartId, newQty) => {
    try {
      if (newQty <= 0) {
        await removeFromCart(cartId, user.user_id);
      } else {
        await updateCart(cartId, { user_id: user.user_id, quantity: newQty });
      }
      loadCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRemove = async (cartId) => {
    try {
      await removeFromCart(cartId, user.user_id);
      loadCart();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePlaceOrder = async () => {
    setOrdering(true);
    try {
      const res = await placeOrder({ user_id: user.user_id });
      alert(`Order placed! Order #${res.order_id} — Total: ₹${res.total.toLocaleString()}`);
      navigate('/orders');
    } catch (err) {
      alert(err.message);
    } finally {
      setOrdering(false);
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) return <div className="loading">Loading cart...</div>;

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Cart</h1>

      {items.length === 0 ? (
        <div className="empty-state">
          <p>Your cart is empty.</p>
          <button className="btn btn-primary" onClick={() => navigate('/products')}>
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map(item => (
              <div key={item.cart_id} className="cart-item">
                <img
                  src={item.image_url || 'https://via.placeholder.com/100x100'}
                  alt={item.name}
                  className="cart-item-image"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/100x100'; }}
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p className="cart-item-brand">{item.brand}</p>
                  <p className="cart-item-price">₹{item.price?.toLocaleString()}</p>
                </div>
                <div className="cart-item-actions">
                  <div className="quantity-control">
                    <button onClick={() => handleUpdate(item.cart_id, item.quantity - 1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleUpdate(item.cart_id, item.quantity + 1)}>+</button>
                  </div>
                  <p className="cart-item-subtotal">₹{(item.price * item.quantity).toLocaleString()}</p>
                  <button className="btn btn-danger btn-sm" onClick={() => handleRemove(item.cart_id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total ({items.length} items)</span>
              <span className="cart-total-price">₹{total.toLocaleString()}</span>
            </div>
            <button
              className="btn btn-primary btn-lg btn-full"
              onClick={handlePlaceOrder}
              disabled={ordering}
            >
              {ordering ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
