/* ==========================================================================
   MAGISTER SCENTS — cart.js
   LocalStorage-backed shopping cart. Loaded on every page so the nav
   cart-count badge always stays accurate.
   ========================================================================== */

const CART_KEY = "magisterScentsCart";

function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(id, qty = 1){
  const product = getProductById(id);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing){
    existing.qty += qty;
  } else {
    cart.push({ id: product.id, qty });
  }
  saveCart(cart);
  showToast(`${product.name} added to cart`);
}

function updateQty(id, qty){
  let cart = getCart();
  const item = cart.find(i => i.id === Number(id));
  if (!item) return;
  item.qty = qty;
  if (item.qty <= 0){
    cart = cart.filter(i => i.id !== Number(id));
  }
  saveCart(cart);
  if (typeof renderCartPage === "function") renderCartPage();
}

function removeFromCart(id){
  const cart = getCart().filter(i => i.id !== Number(id));
  saveCart(cart);
  if (typeof renderCartPage === "function") renderCartPage();
}

function clearCart(){
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  if (typeof renderCartPage === "function") renderCartPage();
}

function getCartCount(){
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function getCartTotal(){
  return getCart().reduce((sum, item) => {
    const p = getProductById(item.id);
    return p ? sum + p.price * item.qty : sum;
  }, 0);
}

function updateCartCount(){
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = getCartCount();
  });
}

/* Small toast confirmation shown after "Add to Cart" */
function showToast(message){
  let toast = document.querySelector(".ms-toast");
  if (!toast){
    toast = document.createElement("div");
    toast.className = "ms-toast";
    toast.style.cssText = `
      position:fixed; bottom:26px; left:50%; transform:translateX(-50%) translateY(20px);
      background:#0F0F0F; color:#D4AF37; padding:14px 28px; border-radius:4px;
      font-family:'Poppins',sans-serif; font-size:0.85rem; letter-spacing:0.5px;
      border:1px solid #D4AF37; z-index:3000; opacity:0; transition:0.35s ease;
      box-shadow:0 12px 30px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2200);
}

/* Delegate all "Add to Cart" buttons site-wide */
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-add-id]");
  if (btn){
    addToCart(Number(btn.dataset.addId));
  }
});

document.addEventListener("DOMContentLoaded", updateCartCount);
