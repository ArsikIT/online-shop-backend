// Admin panel for product management
import { getAuthUser, getPlaceholder } from './baadshop.js';

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
    toast.style.animation = 'slideIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Check if user is admin
function checkAdmin() {
  const user = getAuthUser();

  if (!user || !user.token) {
    window.location.href = 'login.html';
    return false;
  }

  if (user.user?.role !== 'admin') {
    showToast('Access denied. Admin only.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return false;
  }

  return true;
}

// Fetch all products
async function fetchProducts() {
  const loading = document.getElementById('loading');
  const table = document.getElementById('products-table');

  try {
    const response = await fetch(`${API_BASE}/products`);

    if (!response.ok) throw new Error('Failed to fetch products');

    const products = await response.json();

    loading.style.display = 'none';
    table.style.display = 'block';

    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
    loading.innerHTML = `<p class="text-muted">${error.message}</p>`;
  }
}

// Display products in table
function displayProducts(products) {
  const tbody = document.getElementById('products-list');
  tbody.innerHTML = '';

  if (!products || products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No products found</td></tr>';
    return;
  }

  products.forEach(product => {
    const row = document.createElement('tr');
    const imageUrl = product.images?.[0] || getPlaceholder(product.title);
    const inStock = product.stock > 0;

    row.innerHTML = `
            <td>
                <img src="${imageUrl}" style="width: 60px; height: 60px; object-fit: cover; border-radius: var(--radius-sm);">
            </td>
            <td>
                <strong>${product.title}</strong>
                <div class="text-muted" style="font-size: 0.8125rem;">${product.description?.substring(0, 50) || 'No description'}</div>
            </td>
            <td><strong>${product.price} KZT</strong></td>
            <td>${product.stock}</td>
            <td>
                <span class="badge ${inStock ? 'badge-success' : 'badge-danger'}">
                    ${inStock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-ghost btn-sm" onclick="editProduct('${product._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${product._id}', '${product.title}')">Delete</button>
                </div>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Show add product modal
window.showAddProductModal = function () {
  currentProduct = null;
  document.getElementById('modal-title').textContent = 'Add New Product';
  document.getElementById('product-form').reset();
  document.getElementById('product-modal').style.display = 'flex';
};

// Hide modal
window.hideProductModal = function () {
  document.getElementById('product-modal').style.display = 'none';
  currentProduct = null;
};

// Edit product
window.editProduct = async function (productId) {
  try {
    const response = await fetch(`${API_BASE}/products/${productId}`);
    if (!response.ok) throw new Error('Failed to fetch product');

    const product = await response.json();
    currentProduct = product;

    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-title').value = product.title || '';
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price || 0;
    document.getElementById('product-stock').value = product.stock || 0;
    document.getElementById('product-category').value = product.categoryId || '';
    document.getElementById('product-images').value = (product.images || []).join('\n');

    document.getElementById('product-modal').style.display = 'flex';
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// Delete product
window.deleteProduct = async function (productId, title) {
  if (!confirm(`Are you sure you want to delete "${title}"?`)) {
    return;
  }

  const user = getAuthUser();

  try {
    const response = await fetch(`${API_BASE}/products/${productId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });

    if (!response.ok) throw new Error('Failed to delete product');

    showToast('Product deleted successfully', 'success');
    fetchProducts();
  } catch (error) {
    showToast(error.message, 'error');
  }
};

// Handle form submission
const form = document.getElementById('product-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const user = getAuthUser();
  const submitBtn = e.target.querySelector('button[type="submit"]');
  const submitText = document.getElementById('submit-text');
  const submitLoading = document.getElementById('submit-loading');

  submitBtn.disabled = true;
  submitText.style.display = 'none';
  submitLoading.style.display = 'block';

  const imageUrls = document.getElementById('product-images').value
    .split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);

  const productData = {
    title: document.getElementById('product-title').value,
    description: document.getElementById('product-description').value,
    price: parseFloat(document.getElementById('product-price').value),
    stock: parseInt(document.getElementById('product-stock').value),
    images: imageUrls
  };

  const categoryId = document.getElementById('product-category').value.trim();
  if (categoryId) {
    productData.categoryId = categoryId;
  }

  try {
    const url = currentProduct
      ? `${API_BASE}/products/${currentProduct._id}`
      : `${API_BASE}/products`;

    const method = currentProduct ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(productData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to save product');
    }

    showToast(`Product ${currentProduct ? 'updated' : 'created'} successfully!`, 'success');
    hideProductModal();
    fetchProducts();
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitText.style.display = 'block';
    submitLoading.style.display = 'none';
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (checkAdmin()) {
    fetchProducts();
  }
});

// Close modal on background click
document.getElementById('product-modal').addEventListener('click', (e) => {
  if (e.target.id === 'product-modal') {
    hideProductModal();
  }
});