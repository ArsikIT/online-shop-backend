// Shopping cart with API integration
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

// Fetch cart from API
async function fetchCart() {
  const user = getAuthUser();

  if (!user || !user.token) {
    window.location.href = 'login.html';
    return;
  }

  const loading = document.getElementById('loading');
  const emptyCart = document.getElementById('empty-cart');
  const cartContent = document.getElementById('cart-content');

  try {
    const response = await fetch(`${API_BASE}/cart`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        window.location.href = 'login.html';
        return;
      }
      throw new Error('Failed to fetch cart');
    }

    const cart = await response.json();

    loading.style.display = 'none';

    if (!cart.items || cart.items.length === 0) {
      emptyCart.style.display = 'block';
      return;
    }

    displayCart(cart);
    cartContent.style.display = 'block';
  } catch (error) {
    console.error('Error fetching cart:', error);
    loading.style.display = 'none';
    showToast(error.message, 'error');
  }
}

// Display cart items
function displayCart(cart) {
  const tbody = document.getElementById('cart-items');
  const totalElement = document.getElementById('cart-total');
  tbody.innerHTML = '';

  let total = 0;

  cart.items.forEach(item => {
    const product = item.product;
    const itemTotal = item.priceAtAdd * item.quantity;
    total += itemTotal;

    const row = document.createElement('tr');
    row.innerHTML = `
            <td>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <img src="${product.images?.[0] || getPlaceholder(product.title)}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
                    <div>
                        <strong>${product.title}</strong>
                        <div class="text-muted" style="font-size: 0.85rem;">${product.description?.substring(0, 50) || ''}</div>
                    </div>
                </div>
            </td>
            <td>${item.priceAtAdd} KZT</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <button class="btn-icon btn-ghost" onclick="updateQuantity('${product._id}', ${item.quantity - 1})">−</button>
                    <span style="min-width: 30px; text-align: center; font-weight: 600;">${item.quantity}</span>
                    <button class="btn-icon btn-ghost" onclick="updateQuantity('${product._id}', ${item.quantity + 1})">+</button>
                </div>
            </td>
            <td><strong>${itemTotal} KZT</strong></td>
            <td>
                <button class="btn btn-ghost btn-sm" onclick="removeItem('${product._id}')">Remove</button>
            </td>
        `;
    tbody.appendChild(row);
  });

  totalElement.textContent = `${total} KZT`;
}

// Update item quantity
window.updateQuantity = async function (productId, newQuantity) {
  if (newQuantity < 1) {
    removeItem(productId);
    return;
  }

  const user = getAuthUser();

  try {
    const response = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({ quantity: newQuantity })
    });

    if (!response.ok) throw new Error('Failed to update cart');

    fetchCart();
    updateCartCount();
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// Remove item from cart
window.removeItem = async function (productId) {
  const user = getAuthUser();

  try {
    const response = await fetch(`${API_BASE}/cart/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) throw new Error('Failed to remove item');

    showToast('Item removed from cart', 'success');
    fetchCart();
    updateCartCount();
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// Proceed to checkout
window.checkout = function () {
  window.location.href = 'checkout.html';
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchCart();
  updateCartCount();

  // Show admin link for admin users
  const user = getAuthUser();
  const adminLink = document.getElementById('admin-link');
  if (adminLink && user?.user?.role === 'admin') {
    adminLink.style.display = 'inline';
  }
});