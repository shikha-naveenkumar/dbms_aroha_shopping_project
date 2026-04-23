import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">✦ Aroha</Link>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {user && user.role === 'customer' && (
          <>
            <Link to="/">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/history">History</Link>
            <Link to="/recommendations">For You</Link>
          </>
        )}
        {user && user.role === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/categories">Categories</Link>
            <Link to="/admin/orders">Orders</Link>
            <Link to="/admin/users">Users</Link>
          </>
        )}
        {user && (
          <div className="navbar-user">
            <span className="navbar-greeting">Hi, {user.name || user.username}</span>
            <button onClick={handleLogout} className="btn btn-outline btn-sm">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}
