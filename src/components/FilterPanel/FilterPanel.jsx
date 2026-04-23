import { useState, useEffect } from 'react';
import { getCategories } from '../../api/api';
import './FilterPanel.css';

function FilterPanel({ filters, setFilters }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const handleCategoryChange = (categoryId) => {
    setFilters(prev => {
      const current = prev.category || [];
      if (current.includes(categoryId)) {
        return { ...prev, category: current.filter(id => id !== categoryId) };
      } else {
        return { ...prev, category: [...current, categoryId] };
      }
    });
  };

  const handlePriceChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleReset = () => {
    setFilters({});
  };

  const renderCategories = (cats, level = 0) => {
    return cats.map(cat => (
      <div key={cat.id} style={{ marginLeft: level * 20 }}>
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={(filters.category || []).includes(cat.id)}
            onChange={() => handleCategoryChange(cat.id)}
          />
          {cat.name}
        </label>
        {cat.children && renderCategories(cat.children, level + 1)}
      </div>
    ));
  };

  return (
    <div className="filter-panel">
      <h3>Фильтры</h3>
      
      <div className="filter-section">
        <h4>Цена</h4>
        <div className="price-inputs">
          <input
            type="number"
            placeholder="От"
            value={filters.min_price || ''}
            onChange={(e) => handlePriceChange('min_price', e.target.value)}
          />
          <span>—</span>
          <input
            type="number"
            placeholder="До"
            value={filters.max_price || ''}
            onChange={(e) => handlePriceChange('max_price', e.target.value)}
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Категории</h4>
        {renderCategories(categories)}
      </div>

      <button className="filter-reset" onClick={handleReset}>
        Сбросить фильтры
      </button>
    </div>
  );
}

export default FilterPanel;