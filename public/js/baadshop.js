// core storage + helpers
const STORAGE_PRODUCTS = 'badshop_demo_products';
const STORAGE_CART = 'badshop_cart';
const STORAGE_ORDERS = 'badshop_orders';
const STORAGE_USER = 'badshop_user';

export const getProducts = () => {
  try {
    const p = JSON.parse(localStorage.getItem(STORAGE_PRODUCTS));
    return Array.isArray(p) ? p : [];
  } catch (e) {
    return [];
  }
};

export const saveProducts = (products) => {
  localStorage.setItem(STORAGE_PRODUCTS, JSON.stringify(products));
};

export const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_CART) || '[]');
  } catch (e) {
    return [];
  }
};

export const saveCart = (items) => {
  localStorage.setItem(STORAGE_CART, JSON.stringify(items));
  updateCartCount();
};

export const readOrders = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_ORDERS) || '[]');
  } catch {
    return [];
  }
};

export const saveOrders = (orders) => {
  localStorage.setItem(STORAGE_ORDERS, JSON.stringify(orders));
};

export const getAuthUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_USER) || 'null');
  } catch {
    return null;
  }
};

export const saveAuthUser = (obj) => {
  localStorage.setItem(STORAGE_USER, JSON.stringify(obj));
};

export const clearAuthUser = () => {
  localStorage.removeItem(STORAGE_USER);
};

export const updateCartCount = () => {
  const countElem = document.getElementById('cart-count');
  if (!countElem) return;
  const cnt = readCart().reduce((total, item) => total + (Number(item.quantity) || 0), 0);
  countElem.textContent = cnt;
};

export const getPlaceholder = (title) => {
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-size='26'>${encodeURIComponent(title || 'No Image')}</text></svg>`;
};

// initialize cart count on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});
