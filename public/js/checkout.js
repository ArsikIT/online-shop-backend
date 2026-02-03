// place order
import { readCart, saveOrders, updateCartCount } from './baadshop.js';

export const initCheckout = () => {
  const placeBtn = document.getElementById('place-order');
  if (!placeBtn) return;

  placeBtn.addEventListener('click', () => {
    const cart = readCart();
    if (cart.length === 0) { alert('Cart is empty'); return; }

    const fullName = document.getElementById('fullName').value.trim();
    if (!fullName) { alert('Enter your full name'); return; }

    const order = {
      id: 'order_' + Date.now(),
      createdAt: new Date().toISOString(),
      items: cart,
      shipping: {
        fullName,
        street: document.getElementById('street').value.trim(),
        city: document.getElementById('city').value.trim(),
        postalCode: document.getElementById('postalCode').value.trim(),
        country: document.getElementById('country').value.trim()
      },
      total: cart.reduce((s, i) => s + (i.price * i.quantity), 0)
    };

    const history = JSON.parse(localStorage.getItem('badshop_orders') || '[]');
    history.push(order);
    localStorage.setItem('badshop_orders', JSON.stringify(history));
    localStorage.removeItem('badshop_cart');
    updateCartCount();

    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.textContent = 'Thank you! Order created: ' + order.id;
    setTimeout(() => location.href = 'index.html', 1800);
  });
};