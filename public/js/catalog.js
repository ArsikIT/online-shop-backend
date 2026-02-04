// Product catalog with API integration
import { getAuthUser, updateCartCount, getPlaceholder } from './baadshop.js';

const API_BASE = '/api';

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div style="font-weight: 600;">${type === 'success' ? '✓' : '✗'}</div>
        <div>${message}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Fetch products from API
async function fetchProducts() {
    const loading = document.getElementById('loading');
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');

    try {
        const response = await fetch(`${API_BASE}/products`);

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const products = await response.json();

        loading.style.display = 'none';

        if (!products || products.length === 0) {
            emptyState.style.display = 'block';
            return;
        }

        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        loading.style.display = 'none';
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <h3>Unable to load products</h3>
            <p class="text-muted">${error.message}</p>
            <button class="btn btn-primary mt-2" onclick="location.reload()">Retry</button>
        `;
    }
}

// Display products in grid
function displayProducts(products) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        grid.appendChild(card);
    });
}

// Create product card element
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.animationDelay = `${index * 0.1}s`;

    const imageUrl = product.images && product.images[0]
        ? product.images[0]
        : getPlaceholder(product.title);

    const inStock = product.stock > 0;
    const stockBadge = inStock
        ? `<span class="badge badge-success">In Stock</span>`
        : `<span class="badge badge-danger">Out of Stock</span>`;

    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.title}" class="card-image" loading="lazy">
        <div class="card-content">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-description">${product.description || 'Premium quality product'}</p>
            <div class="card-footer">
                <div>
                    <div class="price">${product.price} ${product.currency || 'KZT'}</div>
                    <div class="mt-1">${stockBadge}</div>
                </div>
                <button 
                    class="btn btn-primary btn-sm" 
                    onclick="addToCart('${product._id}')"
                    ${!inStock ? 'disabled' : ''}
                >
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Make card clickable to view details
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
            window.location.href = `product.html?id=${product._id}`;
        }
    });

    return card;
}

// Add product to cart
window.addToCart = async function (productId) {
    const user = getAuthUser();

    if (!user || !user.token) {
        showToast('Please login to add items to cart', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                productId,
                quantity: 1
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add to cart');
        }

        showToast('Product added to cart!', 'success');
        updateCartCount();
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast(error.message, 'error');
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    updateCartCount();
});
