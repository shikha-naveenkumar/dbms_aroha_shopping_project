import { useState, useEffect } from 'react';
import { getOrders, getOrderItems } from '../api';
import { useAuth } from '../AuthContext';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getOrders(user.user_id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const toggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      return;
    }
    setExpandedOrder(orderId);
    if (!orderItems[orderId]) {
      try {
        const items = await getOrderItems(orderId);
        setOrderItems(prev => ({ ...prev, [orderId]: items }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <h1 className="page-title">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state">You haven't placed any orders yet.</div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.order_id} className="order-card">
              <div className="order-header" onClick={() => toggleOrder(order.order_id)}>
                <div>
                  <h3>Order #{order.order_id}</h3>
                  <p className="order-date">{new Date(order.order_date).toLocaleDateString()}</p>
                </div>
                <div className="order-meta">
                  <span className={`order-status status-${order.status?.toLowerCase()}`}>
                    {order.status}
                  </span>
                  <span className="order-total">₹{order.total_amount?.toLocaleString()}</span>
                </div>
              </div>

              {expandedOrder === order.order_id && (
                <div className="order-items">
                  {(orderItems[order.order_id] || []).map(item => (
                    <div key={item.item_id} className="order-item">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/60x60'}
                        alt={item.product_name}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/60x60'; }}
                      />
                      <div>
                        <p>{item.product_name}</p>
                        <small>Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</small>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
