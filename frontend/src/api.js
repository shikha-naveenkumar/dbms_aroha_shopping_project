const API_BASE = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }
  const res = await fetch(url, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Something went wrong');
  return data;
}

// Auth
export const registerUser = (data) => request('/auth/register', { method: 'POST', body: data });
export const loginUser = (data) => request('/auth/login', { method: 'POST', body: data });
export const loginAdmin = (data) => request('/auth/admin/login', { method: 'POST', body: data });

// Products
export const getProducts = (params = {}) => {
  const q = new URLSearchParams(params).toString();
  return request(`/products${q ? '?' + q : ''}`);
};
export const getProduct = (id) => request(`/products/${id}`);
export const getCategories = () => request('/categories');

// Cart
export const getCart = (userId) => request(`/cart/${userId}`);
export const addToCart = (data) => request('/cart', { method: 'POST', body: data });
export const updateCart = (cartId, data) => request(`/cart/${cartId}`, { method: 'PUT', body: data });
export const removeFromCart = (cartId, userId) => request(`/cart/${cartId}?user_id=${userId}`, { method: 'DELETE' });

// Orders
export const placeOrder = (data) => request('/orders', { method: 'POST', body: data });
export const getOrders = (userId) => request(`/orders/${userId}`);
export const getOrderItems = (orderId) => request(`/orders/${orderId}/items`);
export const getOrderDetails = (userId) => request(`/orders/details/${userId}`);

// Reviews
export const getReviews = (productId) => request(`/reviews/${productId}`);
export const addReview = (data) => request('/reviews', { method: 'POST', body: data });

// History
export const getHistory = (userId) => request(`/history/${userId}`);
export const addHistory = (data) => request('/history', { method: 'POST', body: data });

// Recommendations
export const getTrending = () => request('/recommendations/trending');
export const getRecommendations = (userId) => request(`/recommendations/${userId}`);

// Admin
export const getDashboardStats = () => request('/admin/dashboard');
export const addProduct = (data) => request('/admin/products', { method: 'POST', body: data });
export const updateProduct = (id, data) => request(`/admin/products/${id}`, { method: 'PUT', body: data });
export const deleteProduct = (id) => request(`/admin/products/${id}`, { method: 'DELETE' });
export const addCategory = (data) => request('/admin/categories', { method: 'POST', body: data });
export const updateCategory = (id, data) => request(`/admin/categories/${id}`, { method: 'PUT', body: data });
export const deleteCategory = (id) => request(`/admin/categories/${id}`, { method: 'DELETE' });
export const getAllOrders = () => request('/admin/orders');
export const updateOrderStatus = (id, data) => request(`/admin/orders/${id}`, { method: 'PUT', body: data });
export const getAllUsers = () => request('/admin/users');
