import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="admin-dashboard">
      <h1 className="page-title">Aroha Dashboard</h1>

      <div className="stats-grid">
        <div className="stat-card stat-users">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{stats?.total_users || 0}</div>
          <div className="stat-label">Total Users</div>
        </div>
        <div className="stat-card stat-products">
          <div className="stat-icon">📦</div>
          <div className="stat-value">{stats?.total_products || 0}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card stat-orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-value">{stats?.total_orders || 0}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card stat-revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-value">₹{(stats?.total_revenue || 0).toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
        </div>
      </div>
    </div>
  );
}
