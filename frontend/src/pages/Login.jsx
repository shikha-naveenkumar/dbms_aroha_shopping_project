import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, loginAdmin } from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', username: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let res;
      if (isAdmin) {
        res = await loginAdmin({ username: form.username, password: form.password });
      } else {
        res = await loginUser({ email: form.email, password: form.password });
      }
      login(res.user);
      navigate(isAdmin ? '/admin' : '/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">✦ Aroha</h1>
        <p className="auth-subtitle">Welcome back! Sign in to continue.</p>

        <div className="auth-toggle">
          <button
            className={`toggle-btn ${!isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(false)}
          >Customer</button>
          <button
            className={`toggle-btn ${isAdmin ? 'active' : ''}`}
            onClick={() => setIsAdmin(true)}
          >Admin</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isAdmin ? (
            <div className="form-group">
              <label>Username</label>
              <input
                type="text" value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="Enter admin username" required
              />
            </div>
          ) : (
            <div className="form-group">
              <label>Email</label>
              <input
                type="email" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Enter your email" required
              />
            </div>
          )}
          <div className="form-group">
            <label>Password</label>
            <input
              type="password" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Enter your password" required
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {!isAdmin && (
          <p className="auth-footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        )}
      </div>
    </div>
  );
}
