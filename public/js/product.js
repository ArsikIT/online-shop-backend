import { getProducts, readCart, saveCart, getPlaceholder } from './baadshop.js';

export const initProduct = () => {
  const id = new URLSearchParams(location.search).get('id');
  const products = getProducts();
  const product = products.find(p => p.id === id);
  if (!product) {
    const container = document.querySelector('.container');
    if (container) container.innerHTML = '<h2>Product not found</h2><a href="index.html">Back to catalog</a>';
    return;
  }

  const titleEl = document.getElementById('p-title');
  const priceEl = document.getElementById('p-price');
  const descEl = document.getElementById('p-desc');
  const catEl = document.getElementById('p-cat');
  const imgEl = document.getElementById('p-img');

  if (titleEl) titleEl.textContent = product.title;
  if (priceEl) priceEl.textContent = `${product.price.toLocaleString()} KZT`;
  if (descEl) descEl.textContent = product.desc || 'No description available.';
  if (catEl) catEl.textContent = product.category;
  if (imgEl) imgEl.src = product.img || getPlaceholder(product.title);

  const addBtn = document.getElementById('add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const qty = Math.max(1, parseInt(document.getElementById('qty').value) || 1);
      const cart = readCart();
      const found = cart.find(it => it.id === product.id);
      if (found) {
        found.quantity += qty;
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          currency: product.currency,
          img: product.img,
          quantity: qty
        });
      }
      saveCart(cart);
      alert('Product added to cart!');
      location.href = 'cart.html';
    });
  }
};