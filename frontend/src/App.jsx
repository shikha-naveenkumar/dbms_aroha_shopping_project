import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import OrdersPage from './pages/OrdersPage';
import History from './pages/History';
import Recommendations from './pages/Recommendations';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminCategories from './pages/AdminCategories';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import './App.css';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={user ? <Navigate to={user.role === 'admin' ? '/admin' : '/'} /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

      {/* Customer */}
      <Route path="/" element={<ProtectedRoute role="customer"><Dashboard /></ProtectedRoute>} />
      <Route path="/products" element={<ProtectedRoute role="customer"><Products /></ProtectedRoute>} />
      <Route path="/products/:id" element={<ProtectedRoute role="customer"><ProductDetail /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute role="customer"><OrdersPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute role="customer"><History /></ProtectedRoute>} />
      <Route path="/recommendations" element={<ProtectedRoute role="customer"><Recommendations /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute role="admin"><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main className="main-content">
          <AppRoutes />
        </main>
      </Router>
    </AuthProvider>
  );
}
