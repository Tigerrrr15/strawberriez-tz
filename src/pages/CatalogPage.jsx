import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header/Header';
import FilterPanel from '../components/FilterPanel/FilterPanel';
import ProductCard from '../components/ProductCard/ProductCard';
import { getProducts } from '../api/api';
import './CatalogPage.css';

function CatalogPage({ cartCount }) {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({});
  const [sorting, setSorting] = useState('-created_at');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters(prev => ({ ...prev, search }));
    }
  }, [searchParams]);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const params = { ...filters, ordering: sorting };
      const data = await getProducts(params);
      setProducts(data.results || []);
      setLoading(false);
    };
    loadProducts();
  }, [filters, sorting]);

  return (
    <div>
      <Header cartCount={cartCount} />
      
      <div className="catalog-layout">
        <aside className="catalog-sidebar">
          <FilterPanel filters={filters} setFilters={setFilters} />
        </aside>
        
        <main className="catalog-main">
          <div className="catalog-sort">
            <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
              <option value="-created_at">Новинки</option>
              <option value="price">Цена: по возрастанию</option>
              <option value="-price">Цена: по убыванию</option>
              <option value="-views_count">Популярные</option>
            </select>
          </div>

          {loading ? (
            <div className="catalog-loading">Загрузка...</div>
          ) : (
            <div className="catalog-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="catalog-empty">
              <p>Товары не найдены</p>
              <p>Попробуйте изменить параметры фильтрации</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CatalogPage;