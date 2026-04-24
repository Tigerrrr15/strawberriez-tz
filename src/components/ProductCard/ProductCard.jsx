import { Link } from 'react-router-dom';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img 
          src={product.main_image_url || 'https://via.placeholder.com/300'} 
          alt={product.name} 
        />
        {!product.is_in_stock && <span className="out-of-stock">Нет в наличии</span>}
      </div>
      <div className="product-card-info">
        <h3>{product.name}</h3>
        <div className="product-card-price">
          <span className="current-price">{product.price} ₽</span>
          {product.old_price && (
            <span className="old-price">{product.old_price} ₽</span>
          )}
        </div>
        {product.is_in_stock ? (
          <span className="in-stock">В наличии</span>
        ) : (
          <span className="not-in-stock">Нет в наличии</span>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;