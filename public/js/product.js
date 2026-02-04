// Product detail page
import { getAuthUser, updateCartCount, getPlaceholder } from './baadshop.js';

const API_BASE = '/api';
let currentProduct = null;

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

// Get product ID from URL
function getProductId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Fetch product details
async function fetchProduct() {
  const productId = getProductId();

  if (!productId) {
    window.location.href = 'index.html';
    return;
  }

  const loading = document.getElementById('loading');
  const productDetails = document.getElementById('product-details');

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);

    if (!response.ok) {
      throw new Error('Product not found');
    }

    const product = await response.json();
    currentProduct = product;

    loading.style.display = 'none';
    productDetails.style.display = 'block';

    displayProduct(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    loading.innerHTML = `
            <h3>Product not found</h3>
            <p class="text-muted mt-2">${error.message}</p>
            <a href="index.html" class="btn btn-primary mt-3">Back to catalog</a>
        `;
  }
}

// Display product details
function displayProduct(product) {
  const imageUrl = product.images && product.images[0]
    ? product.images[0]
    : getPlaceholder(product.title);

  document.getElementById('product-image').src = imageUrl;
  document.getElementById('product-image').alt = product.title;
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-description').textContent = product.description || 'No description available';
  document.getElementById('product-price').textContent = `${product.price} ${product.currency || 'KZT'}`;

  const inStock = product.stock > 0;
  const stockElement = document.getElementById('product-stock');
  stockElement.innerHTML = inStock
    ? `<span class="badge badge-success">In Stock (${product.stock} available)</span>`
    : `<span class="badge badge-danger">Out of Stock</span>`;

  const addButton = document.getElementById('add-to-cart-btn');
  if (!inStock) {
    addButton.disabled = true;
    addButton.textContent = 'Out of Stock';
  }
}

// Change quantity
window.changeQuantity = function (delta) {
  const input = document.getElementById('quantity');
  const newValue = parseInt(input.value) + delta;

  if (newValue >= 1 && currentProduct && newValue <= currentProduct.stock) {
    input.value = newValue;
  }
};

// Add to cart
window.addToCart = async function () {
  const user = getAuthUser();

  if (!user || !user.token) {
    showToast('Please login to add items to cart', 'error');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
    return;
  }

  const quantity = parseInt(document.getElementById('quantity').value);

  try {
    const response = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        productId: currentProduct._id,
        quantity
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add to cart');
    }

    showToast(`Added ${quantity} item(s) to cart!`, 'success');
    updateCartCount();

    setTimeout(() => {
      window.location.href = 'cart.html';
    }, 1500);
  } catch (error) {
    console.error('Error adding to cart:', error);
    showToast(error.message, 'error');
  }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchProduct();
  updateCartCount();

  // Show admin link for admin users
  const user = getAuthUser();
  const adminLink = document.getElementById('admin-link');
  if (adminLink && user?.user?.role === 'admin') {
    adminLink.style.display = 'inline';
  }
});