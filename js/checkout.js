/* ==========================================================================
   MAGISTER SCENTS — checkout.js
   Form validation + WhatsApp order message generation.
   Runs only on checkout.html.
   ========================================================================== */

const WHATSAPP_NUMBER = "92XXXXXXXXXX"; // TODO: replace with real business number

function initCheckoutPage(){
  const form = document.getElementById("checkout-form");
  if (!form) return;

  renderOrderSummary();

  // Payment option highlight
  document.querySelectorAll(".payment-option").forEach(opt => {
    opt.addEventListener("click", () => {
      document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
      opt.classList.add("selected");
      opt.querySelector("input[type=radio]").checked = true;
    });
  });

  form.addEventListener("submit", handlePlaceOrder);
}

function renderOrderSummary(){
  const cart = getCart();
  const listEl = document.getElementById("os-items");
  const totalEl = document.getElementById("os-total");
  if (!listEl) return;

  if (!cart.length){
    listEl.innerHTML = `<p style="color:rgba(255,255,255,0.6); font-size:0.85rem;">Your cart is empty.</p>`;
    if (totalEl) totalEl.textContent = formatPKR(0);
    const submitBtn = document.querySelector("#checkout-form button[type=submit]");
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  listEl.innerHTML = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return "";
    return `<div class="os-item"><span>${p.name} × ${item.qty}</span><span>${formatPKR(p.price * item.qty)}</span></div>`;
  }).join("");

  if (totalEl) totalEl.textContent = formatPKR(getCartTotal());
}

function validateField(input, message){
  const group = input.closest(".form-group");
  const valid = input.checkValidity() && input.value.trim() !== "";
  group.classList.toggle("invalid", !valid);
  const errorEl = group.querySelector(".form-error");
  if (errorEl && message) errorEl.textContent = message;
  return valid;
}

function handlePlaceOrder(e){
  e.preventDefault();
  const form = e.target;

  const fullName = form.querySelector("#full-name");
  const phone = form.querySelector("#phone");
  const city = form.querySelector("#city");
  const address = form.querySelector("#address");
  const payment = form.querySelector("input[name=payment]:checked");

  let valid = true;
  valid = validateField(fullName, "Please enter your full name.") && valid;
  valid = validateField(phone, "Please enter a valid phone number (e.g. 03XXXXXXXXX).") && valid;
  valid = validateField(city, "Please enter your city.") && valid;
  valid = validateField(address, "Please enter your complete address.") && valid;

  const phonePattern = /^(\+92|0)?3\d{9}$/;
  if (phone.value.trim() && !phonePattern.test(phone.value.trim().replace(/[\s-]/g, ""))){
    phone.closest(".form-group").classList.add("invalid");
    phone.closest(".form-group").querySelector(".form-error").textContent = "Enter a valid Pakistani mobile number.";
    valid = false;
  }

  if (!payment){
    document.getElementById("payment-error").style.display = "block";
    valid = false;
  } else {
    document.getElementById("payment-error").style.display = "none";
  }

  const cart = getCart();
  if (!cart.length){
    alert("Your cart is empty. Add some products before checking out.");
    valid = false;
  }

  if (!valid) return;

  sendWhatsAppOrder({
    name: fullName.value.trim(),
    phone: phone.value.trim(),
    city: city.value.trim(),
    address: address.value.trim(),
    payment: payment.value
  });
}

function sendWhatsAppOrder(customer){
  const cart = getCart();
  const lines = [];

  lines.push("🛍️ *New Order — Magister Scents*");
  lines.push("");
  lines.push(`*Customer Name:* ${customer.name}`);
  lines.push(`*Phone Number:* ${customer.phone}`);
  lines.push(`*City:* ${customer.city}`);
  lines.push(`*Address:* ${customer.address}`);
  lines.push("");
  lines.push("*Ordered Products:*");

  cart.forEach(item => {
    const p = getProductById(item.id);
    if (!p) return;
    lines.push(`• ${p.name} — Qty: ${item.qty} — ${formatPKR(p.price * item.qty)}`);
  });

  lines.push("");
  lines.push(`*Grand Total:* ${formatPKR(getCartTotal())}`);
  lines.push(`*Payment Method:* ${customer.payment}`);
  lines.push("");
  lines.push("Thank you for shopping with Magister Scents! 🌹");

  const message = encodeURIComponent(lines.join("\n"));
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

  window.open(waUrl, "_blank");

  showOrderPlacedModal();
  clearCart();
  document.getElementById("checkout-form").reset();
  document.querySelectorAll(".payment-option").forEach(o => o.classList.remove("selected"));
}

function showOrderPlacedModal(){
  const modal = document.getElementById("order-modal");
  if (!modal) return;
  modal.classList.add("active");
  document.getElementById("close-order-modal")?.addEventListener("click", () => {
    modal.classList.remove("active");
    window.location.href = "index.html";
  });
}

document.addEventListener("DOMContentLoaded", initCheckoutPage);
