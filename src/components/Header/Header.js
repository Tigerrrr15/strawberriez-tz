import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Header.css';

function Header({ cartCount }) {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/catalog?search=${search}`);
    }
  };

  return (
    <header className="header">
      <Link to="/catalog" className="header-logo">
        🍓 StrawberrieZ
      </Link>
      
      <form className="header-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">🔍</button>
      </form>
      
      <nav className="header-nav">
        <Link to="/cart" className="header-cart">
          🛒 Корзина {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </Link>
      </nav>
    </header>
  );
}

export default Header;