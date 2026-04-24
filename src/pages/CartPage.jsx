import { useState, useEffect } from 'react';
import Header from '../components/Header/Header';
import { getCart, removeFromCart } from '../api/api';
import './CartPage.css';

function CartPage({ cartCount }) {
  const [cart, setCart] = useState({ items: [], total_sum: '0' });

  const loadCart = async () => {
    const data = await getCart();
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    loadCart();
  };

  return (
    <div>
      <Header cartCount={cartCount} />
      
      <div className="cart-page">
        <h1>Корзина</h1>
        
        {cart.items.length === 0 ? (
          <div className="cart-empty">
            <p>Ваша корзина пуста</p>
            <p>Добавьте товары из каталога</p>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {cart.items.map(item => (
                <div key={item.id} className="cart-item">
                  <img 
                    src={item.product_image || 'https://via.placeholder.com/100'} 
                    alt={item.product_name} 
                  />
                  <div className="cart-item-info">
                    <h3>{item.product_name}</h3>
                    <p>Размер: {item.size}</p>
                    <p>{item.price_per_item} ₽ × {item.quantity} = <strong>{item.total_price} ₽</strong></p>
                  </div>
                  <button 
                    className="cart-item-remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-total">
                Итого: <strong>{cart.total_sum} ₽</strong>
              </div>
              <button className="cart-checkout">Оформить заказ</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;