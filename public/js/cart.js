import { readCart, saveCart, updateCartCount, getPlaceholder } from './baadshop.js';

export const initCart = () => {
  const tbody = document.querySelector('#cart-table tbody');
  const emptyMsg = document.getElementById('empty');
  const cartArea = document.getElementById('cart-area');
  if (!tbody) return;

  const render = () => {
    const cart = readCart();
    if (cart.length === 0) {
      emptyMsg.style.display = 'block';
      cartArea.style.display = 'none';
      updateCartCount();
      return;
    }
    emptyMsg.style.display = 'none';
    cartArea.style.display = 'block';

    let total = 0;
    tbody.innerHTML = cart.map((it, idx) => {
      const sum = it.price * it.quantity;
      total += sum;
      const imgSrc = it.img || getPlaceholder(it.title);
      return `
        <tr>
          <td>
            <div style="display:flex;gap:12px;align-items:center">
              <img src="${imgSrc}" style="width:60px;height:45px;object-fit:cover;border-radius:4px">
              <div><strong>${it.title}</strong></div>
            </div>
          </td>
          <td>${it.price.toLocaleString()} KZT</td>
          <td><input class="qty-input input" type="number" min="1" value="${it.quantity}" data-idx="${idx}" style="width:70px"></td>
          <td><strong>${sum.toLocaleString()} KZT</strong></td>
          <td><button class="btn-ghost remove" data-idx="${idx}">✕</button></td>
        </tr>`;
    }).join('');

    document.getElementById('subtotal').textContent = `Total: ${total.toLocaleString()} KZT`;
    attachListeners();
  };

  const attachListeners = () => {
    document.querySelectorAll('.qty-input').forEach(inp => {
      inp.addEventListener('change', e => {
        const idx = Number(e.target.dataset.idx);
        const cart = readCart();
        cart[idx].quantity = Math.max(1, parseInt(e.target.value) || 1);
        saveCart(cart);
        render();
      });
    });

    document.querySelectorAll('.remove').forEach(btn => {
      btn.addEventListener('click', e => {
        const idx = Number(btn.dataset.idx);
        const cart = readCart();
        cart.splice(idx, 1);
        saveCart(cart);
        render();
      });
    });
  };

  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) checkoutBtn.onclick = () => location.href = 'checkout.html';

  render();
};