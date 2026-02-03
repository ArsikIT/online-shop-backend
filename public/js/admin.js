// manage products UI
import { getProducts, saveProducts, updateCartCount, getPlaceholder } from './baadshop.js';

export const initAdmin = () => {
  const root = document.getElementById('list');
  const form = document.getElementById('product-form');
  if (!root || !form) return;

  const renderList = () => {
    const list = getProducts();
    root.innerHTML = list.length
      ? list.map(p => `
        <div style="padding:12px;border:1px solid #eee;border-radius:8px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
          <div><strong>${p.title}</strong> — ${p.price.toLocaleString()} KZT<br><small>${p.category}</small></div>
          <button class="btn-ghost" data-id="${p.id}" style="color:red">Delete</button>
        </div>
      `).join('')
      : '<p class="small">No products in database.</p>';

    // attach delete handlers
    root.querySelectorAll('button[data-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const products = getProducts().filter(item => item.id !== id);
        saveProducts(products);
        renderList();
        updateCartCount();
      });
    });
  };

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const title = document.getElementById('title').value.trim();
    const price = Number(document.getElementById('price').value || 0);
    const category = document.getElementById('category').value.trim() || 'General';
    const desc = document.getElementById('desc').value.trim();

    if (!title || price <= 0) {
      alert('Please enter a valid title and price');
      return;
    }

    const newProd = {
      id: 'p' + Date.now(),
      title,
      price,
      currency: 'KZT',
      category,
      desc,
      img: ''
    };

    const current = getProducts();
    current.push(newProd);
    saveProducts(current);
    form.reset();
    renderList();
    updateCartCount();
  });

  renderList();
};