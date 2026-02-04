// Checkout page
import { getAuthUser, updateCartCount } from './baadshop.js';

const API_BASE = '/api';
let cartData = null;

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

// Fetch cart
async function fetchCart() {
  const user = getAuthUser();

  if (!user || !user.token) {
    window.location.href = 'login.html';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/cart`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch cart');

    const cart = await response.json();
    cartData = cart;

    if (!cart.items || cart.items.length === 0) {
      window.location.href = 'cart.html';
      return;
    }

    displayOrderSummary(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    showToast(error.message, 'error');
  }
}

// Display order summary
function displayOrderSummary(cart) {
  const orderItems = document.getElementById('order-items');
  const subtotal = document.getElementById('order-subtotal');
  const total = document.getElementById('order-total');

  let totalAmount = 0;

  orderItems.innerHTML = cart.items.map(item => {
    const itemTotal = item.priceAtAdd * item.quantity;
    totalAmount += itemTotal;

    return `
            <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border);">
                <div>
                    <strong>${item.product.title}</strong>
                    <div class="text-muted" style="font-size: 0.85rem;">Qty: ${item.quantity}</div>
                </div>
                <div><strong>${itemTotal} KZT</strong></div>
            </div>
        `;
  }).join('');

  subtotal.textContent = `${totalAmount} KZT`;
  total.textContent = `${totalAmount} KZT`;
}

// Handle checkout
const form = document.getElementById('checkout-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = getAuthUser();

  const shippingAddress = {
    fullName: document.getElementById('fullName').value,
    street: document.getElementById('street').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    country: document.getElementById('country').value
  };

  const paymentInfo = {
    provider: document.getElementById('paymentProvider').value,
    status: 'pending'
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify({
        shippingAddress,
        paymentInfo
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create order');
    }

    showToast('Order placed successfully!', 'success');
    updateCartCount();

    setTimeout(() => {
      window.location.href = 'profile.html';
    }, 2000);
  } catch (error) {
    console.error('Error creating order:', error);
    showToast(error.message, 'error');
  }
});

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