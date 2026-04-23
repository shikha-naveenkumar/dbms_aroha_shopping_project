import { useState, useEffect } from 'react';
import { getHistory } from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getHistory(user.user_id)
      .then(setHistory)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-page">
      <h1 className="page-title">Browsing History</h1>

      {history.length === 0 ? (
        <div className="empty-state">No browsing history yet.</div>
      ) : (
        <div className="history-list">
          {history.map(item => (
            <div
              key={item.history_id}
              className="history-item"
              onClick={() => navigate(`/products/${item.product_id}`)}
            >
              <img
                src={item.image_url || 'https://via.placeholder.com/80x80'}
                alt={item.name}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80'; }}
              />
              <div className="history-item-info">
                <h3>{item.name}</h3>
                <p>{item.brand}</p>
                <p className="history-item-price">₹{item.price?.toLocaleString()}</p>
              </div>
              <small className="history-item-date">
                {new Date(item.viewed_at).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
