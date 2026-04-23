import { useNavigate } from 'react-router-dom';

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/products/${product.product_id}`)}>
      <div className="product-card-image">
        <img
          src={product.image_url || 'https://via.placeholder.com/300x350?text=No+Image'}
          alt={product.name}
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x350?text=No+Image'; }}
        />
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">₹{product.price?.toLocaleString()}</p>
        {product.category_name && (
          <span className="product-category">{product.category_name}</span>
        )}
        {onAddToCart && (
          <button
            className="btn btn-primary btn-sm"
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
