const BASE_URL = '/api';

export const getProducts = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${BASE_URL}/products/?${params}`);
  return response.json();
};

export const getCategories = async () => {
  const response = await fetch(`${BASE_URL}/categories/`);
  return response.json();
};

export const getCart = async () => {
  const response = await fetch(`${BASE_URL}/cart/`, {
    credentials: 'include'
  });
  return response.json();
};

export const addToCart = async (productId, quantity, size) => {
  const response = await fetch(`${BASE_URL}/cart/items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      product_id: productId,
      quantity: quantity,
      size: size
    })
  });
  return response.json();
};

export const removeFromCart = async (itemId) => {
  const response = await fetch(`${BASE_URL}/cart/items/${itemId}/`, {
    method: 'DELETE',
    credentials: 'include'
  });
  return response.json();
};