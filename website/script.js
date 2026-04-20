// ДАННЫЕ ТОВАРОВ (как будто из базы данных)
const products = [
    { id: 1, name: "Клубника квадратная игрушка", price: 2990, oldPrice: 3990, category: "Игрушки", stock: 15, image: "https://img.freepik.com/premium-photo/isolated-strawberry-single-strawberry-fruit-isolated-white-background-with-clipping-path-image_120872-32587.jpg" },
    { id: 2, name: "Клубничный рюкзак", price: 2500, oldPrice: null, category: "Аксессуары", stock: 8, image: "https://img.freepik.com/free-psd/strawberry-backpack-isolated_23-2151026867.jpg" },
    { id: 3, name: "Футболка с клубникой", price: 1200, oldPrice: 1800, category: "Одежда", stock: 25, image: "https://img.freepik.com/free-photo/t-shirt-mockup_1194-6616.jpg" },
    { id: 4, name: "Клубничная кружка", price: 450, oldPrice: null, category: "Аксессуары", stock: 40, image: "https://img.freepik.com/free-photo/coffee-cup-mockup_1194-6603.jpg" },
    { id: 5, name: "Клубничная шапка", price: 890, oldPrice: 1200, category: "Одежда", stock: 12, image: "https://img.freepik.com/free-photo/knitted-hat-mockup_1194-6608.jpg" },
    { id: 6, name: "Мягкая игрушка Клубника", price: 1890, oldPrice: 2500, category: "Игрушки", stock: 7, image: "https://img.freepik.com/free-photo/plush-toy-mockup_1194-6611.jpg" }
];

// КОРЗИНА (хранится в памяти)
let cart = [];

// Функция отображения товаров
function displayProducts(productsToShow) {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<div style="text-align:center; width:100%;">Товаров не найдено</div>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/200'">
            <h3>${product.name}</h3>
            <div>
                <span class="price">${product.price} ₽</span>
                ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ₽</span>` : ''}
            </div>
            <div class="stock ${product.stock < 5 ? 'out' : ''}">
                ${product.stock > 0 ? `✅ В наличии: ${product.stock} шт` : '❌ Нет в наличии'}
            </div>
            <button class="add-to-cart" onclick="addToCart(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                🛒 Добавить в корзину
            </button>
        </div>
    `).join('');
}

// Фильтрация товаров
function filterProducts() {
    const searchText = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const minPrice = parseInt(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseInt(document.getElementById('maxPrice')?.value) || Infinity;
    const category = document.getElementById('categoryFilter')?.value || 'all';
    
    const filtered = products.filter(product => {
        const matchSearch = product.name.toLowerCase().includes(searchText);
        const matchPrice = product.price >= minPrice && product.price <= maxPrice;
        const matchCategory = category === 'all' || product.category === category;
        return matchSearch && matchPrice && matchCategory;
    });
    
    displayProducts(filtered);
}

// Поиск (вызывается при вводе текста)
function searchProducts() {
    filterProducts();
}

// Сброс фильтров
function resetFilters() {
    if (document.getElementById('minPrice')) document.getElementById('minPrice').value = '';
    if (document.getElementById('maxPrice')) document.getElementById('maxPrice').value = '';
    if (document.getElementById('categoryFilter')) document.getElementById('categoryFilter').value = 'all';
    if (document.getElementById('searchInput')) document.getElementById('searchInput').value = '';
    filterProducts();
}

// Добавление в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`${product.name} добавлен в корзину!`);
}

// Обновление интерфейса корзины
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
    
    const cartItemsContainer = document.getElementById('cartItems');
    if (cartItemsContainer) {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Корзина пуста</p>';
        } else {
            cartItemsContainer.innerHTML = cart.map(item => `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        ${item.price} ₽ × ${item.quantity}
                    </div>
                    <div>
                        <strong>${item.price * item.quantity} ₽</strong>
                        <button onclick="removeFromCart(${item.id})">🗑</button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    const cartTotal = document.getElementById('cartTotal');
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total;
    }
}

// Удаление из корзины
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    showNotification('Товар удалён из корзины');
}

// Уведомление
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #2e7d32;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        animation: fadeOut 2s forwards;
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

// Открыть корзину
function openCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'block';
    updateCartUI();
}

// Закрыть корзину
function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

// Закрытие по клику вне окна
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) closeCart();
}

// Загрузка страницы
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(products);
});
