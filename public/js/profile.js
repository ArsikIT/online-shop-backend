// Profile page with API integration
import { getAuthUser, clearAuthUser, updateCartCount } from './baadshop.js';

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

// Fetch user profile
async function fetchProfile() {
  const user = getAuthUser();

  if (!user || !user.token) {
    window.location.href = 'login.html';
    return;
  }

  const loading = document.getElementById('loading');
  const profileContent = document.getElementById('profile-content');

  try {
    const response = await fetch(`${API_BASE}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      if (response.status === 401) {
        clearAuthUser();
        window.location.href = 'login.html';
        return;
      }
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    const userData = data.data?.user || data.user || data;

    loading.style.display = 'none';
    profileContent.style.display = 'block';

    displayProfile(userData);
    fetchOrders();
  } catch (error) {
    console.error('Error fetching profile:', error);
    loading.style.display = 'none';
    showToast(error.message, 'error');
  }
}

// Display profile information
function displayProfile(userData) {
  document.getElementById('user-username').textContent = userData.username || 'N/A';
  document.getElementById('user-email').textContent = userData.email || 'N/A';

  const roleElement = document.getElementById('user-role');
  const isAdmin = userData.role === 'admin';
  roleElement.innerHTML = `<span class="badge ${isAdmin ? 'badge-warning' : 'badge-success'}">${userData.role || 'user'}</span>`;

  if (userData.createdAt) {
    const date = new Date(userData.createdAt);
    document.getElementById('user-joined').textContent = date.toLocaleDateString();
  }
}

// Fetch user orders
async function fetchOrders() {
  const user = getAuthUser();
  const ordersList = document.getElementById('orders-list');

  try {
    const response = await fetch(`${API_BASE}/orders/my`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) throw new Error('Failed to fetch orders');

    const orders = await response.json();

    if (!orders || orders.length === 0) {
      ordersList.innerHTML = '<p class="text-muted">No orders yet</p>';
      return;
    }

    ordersList.innerHTML = orders.slice(0, 5).map(order => `
            <div style="padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius-md); margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>Order #${order._id.slice(-6)}</strong>
                        <div class="text-muted" style="font-size: 0.85rem;">${new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                        <span class="badge badge-${getStatusColor(order.status)}">${order.status}</span>
                    </div>
                </div>
                <div style="margin-top: 0.5rem;">
                    <strong>${order.totalAmount} ${order.currency || 'KZT'}</strong>
                </div>
            </div>
        `).join('');
  } catch (error) {
    console.error('Error fetching orders:', error);
    ordersList.innerHTML = '<p class="text-muted">Unable to load orders</p>';
  }
}

// Get status badge color
function getStatusColor(status) {
  const colors = {
    'created': 'warning',
    'processing': 'warning',
    'shipped': 'success',
    'delivered': 'success',
    'cancelled': 'danger'
  };
  return colors[status] || 'success';
}

// Logout function
window.logout = function () {
  clearAuthUser();
  showToast('Logged out successfully', 'success');
  setTimeout(() => {
    window.location.href = 'index.html';
  }, 1000);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  fetchProfile();
  updateCartCount();

  // Show admin link for admin users
  const user = getAuthUser();
  const adminLink = document.getElementById('admin-link');
  if (adminLink && user?.user?.role === 'admin') {
    adminLink.style.display = 'inline';
  }
});