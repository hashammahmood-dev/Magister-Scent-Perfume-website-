/* ==========================================================================
   MAGISTER SCENTS — script.js
   Navigation, home page dynamic sections, shop filters/search/sort,
   product detail rendering, and cart page rendering.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initSearchOverlay();
  initNewsletter();
  markActiveNavLink();
  initHeroSlider();

  renderFeaturedProducts();   // home page
  initShopPage();             // shop page
  initProductDetailPage();    // product page
  renderCartPage();           // cart page
});

/* ---------------------------------------------------------------------- */
/* Navigation: mobile hamburger menu + sticky shadow                       */
/* ---------------------------------------------------------------------- */
function initNav(){
  const hamburger = document.querySelector(".hamburger");
  const mobileNav = document.querySelector(".mobile-nav");
  const backdrop = document.querySelector(".overlay-backdrop");
  const closeBtn = document.querySelector(".mobile-nav-close");

  function openMobileNav(){
    mobileNav?.classList.add("active");
    backdrop?.classList.add("active");
  }
  function closeMobileNav(){
    mobileNav?.classList.remove("active");
    backdrop?.classList.remove("active");
  }

  hamburger?.addEventListener("click", openMobileNav);
  closeBtn?.addEventListener("click", closeMobileNav);
  backdrop?.addEventListener("click", closeMobileNav);
  document.querySelectorAll(".mobile-nav a").forEach(a => a.addEventListener("click", closeMobileNav));
}

function markActiveNavLink(){
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === page || (page === "" && href === "index.html")){
      a.classList.add("active");
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Search overlay (nav search icon)                                        */
/* ---------------------------------------------------------------------- */
function initSearchOverlay(){
  const searchBtn = document.querySelector(".search-trigger");
  const overlay = document.querySelector(".search-overlay");
  const closeBtn = document.querySelector(".search-close");
  const input = document.querySelector(".search-box input");

  searchBtn?.addEventListener("click", () => {
    overlay?.classList.add("active");
    setTimeout(() => input?.focus(), 300);
  });
  closeBtn?.addEventListener("click", () => overlay?.classList.remove("active"));
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.classList.remove("active");
  });

  input?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim()){
      window.location.href = `shop.html?search=${encodeURIComponent(input.value.trim())}`;
    }
  });
}

/* ---------------------------------------------------------------------- */
/* Newsletter (no backend — simulated subscribe)                           */
/* ---------------------------------------------------------------------- */
function initNewsletter(){
  const form = document.querySelector(".newsletter-form");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("input[type=email]");
    const msg = document.querySelector(".newsletter-msg");
    if (!emailInput.value.trim()){
      msg.textContent = "Please enter a valid email address.";
      return;
    }
    msg.textContent = "Thank you for subscribing to Magister Scents! ✨";
    form.reset();
  });
}

/* ---------------------------------------------------------------------- */
/* Home page — Featured Products (first 12)                                */
/* ---------------------------------------------------------------------- */
function renderFeaturedProducts(){
  const grid = document.querySelector("#featured-grid");
  if (!grid) return;
  renderProductGrid(grid, PRODUCTS.slice(0, 12));
}

/* ---------------------------------------------------------------------- */
/* Shop page — search, category filter, sort                               */
/* ---------------------------------------------------------------------- */
function initShopPage(){
  const grid = document.querySelector("#shop-grid");
  if (!grid) return;

  const searchInput = document.querySelector("#shop-search");
  const sortSelect = document.querySelector("#shop-sort");
  const chips = document.querySelectorAll(".chip");
  const resultsCount = document.querySelector("#results-count");

  const params = new URLSearchParams(window.location.search);
  let state = {
    search: params.get("search") || "",
    category: params.get("category") || "all",
    sort: "default"
  };

  if (searchInput) searchInput.value = state.search;
  chips.forEach(chip => {
    if (chip.dataset.category === state.category) chip.classList.add("active");
    else chip.classList.remove("active");
  });

  function apply(){
    let results = PRODUCTS.filter(p => {
      const matchesCategory = state.category === "all" || p.category === state.category;
      const matchesSearch = (p.name + " " + p.brand + " " + p.shortDescription)
        .toLowerCase().includes(state.search.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (state.sort === "low-high") results.sort((a, b) => a.price - b.price);
    if (state.sort === "high-low") results.sort((a, b) => b.price - a.price);

    renderProductGrid(grid, results);
    if (resultsCount){
      resultsCount.textContent = `${results.length} fragrance${results.length !== 1 ? "s" : ""} found`;
    }
  }

  searchInput?.addEventListener("input", (e) => {
    state.search = e.target.value;
    apply();
  });

  sortSelect?.addEventListener("change", (e) => {
    state.sort = e.target.value;
    apply();
  });

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state.category = chip.dataset.category;
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      apply();
    });
  });

  apply();
}

/* ---------------------------------------------------------------------- */
/* Product Detail page                                                     */
/* ---------------------------------------------------------------------- */
function initProductDetailPage(){
  const wrapper = document.querySelector("#pd-wrapper");
  if (!wrapper) return;

  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id")) || PRODUCTS[0].id;
  const product = getProductById(id) || PRODUCTS[0];

  document.title = `${product.name} — Magister Scents`;

  wrapper.innerHTML = `
    <div class="pd-image">
      <img src="${product.image}" alt="${product.name} by ${product.brand}">
    </div>
    <div class="pd-info">
      <span class="product-brand">${product.brand}</span>
      <h1>${product.name}</h1>
      <div class="pd-rating">
        <span class="stars">${renderStars(product.rating)}</span>
        <span>${product.rating} out of 5</span>
      </div>
      <div class="pd-price">
        ${formatPKR(product.price)}
        ${product.oldPrice ? `<span class="price-old">${formatPKR(product.oldPrice)}</span>` : ""}
        ${product.oldPrice ? `<span class="price-discount">${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}% OFF</span>` : ""}
      </div>
      <p class="pd-description">${product.description}</p>

      <div class="qty-selector">
        <button type="button" id="pd-qty-minus">−</button>
        <input type="number" id="pd-qty" value="1" min="1" readonly>
        <button type="button" id="pd-qty-plus">+</button>
      </div>

      <div class="pd-actions">
        <button class="btn btn-gold" id="pd-add-cart">Add to Cart</button>
        <a href="cart.html" class="btn btn-outline-dark">View Cart</a>
      </div>

      <div class="fragrance-pyramid">
        <h3>Fragrance Pyramid</h3>
        <div class="pyramid-levels">
          <div class="pyramid-level">
            <span class="pyramid-tag">Top Notes<small>First impression</small></span>
            <span class="pyramid-notes">${product.topNotes}</span>
          </div>
          <div class="pyramid-level">
            <span class="pyramid-tag">Middle Notes<small>The heart</small></span>
            <span class="pyramid-notes">${product.middleNotes}</span>
          </div>
          <div class="pyramid-level">
            <span class="pyramid-tag">Base Notes<small>The lasting trail</small></span>
            <span class="pyramid-notes">${product.baseNotes}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const qtyInput = document.querySelector("#pd-qty");
  document.querySelector("#pd-qty-minus").addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });
  document.querySelector("#pd-qty-plus").addEventListener("click", () => {
    qtyInput.value = Number(qtyInput.value) + 1;
  });
  document.querySelector("#pd-add-cart").addEventListener("click", () => {
    addToCart(product.id, Number(qtyInput.value));
  });

  // Related products: same category, excluding current
  const related = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const relatedGrid = document.querySelector("#related-grid");
  if (relatedGrid) renderProductGrid(relatedGrid, related.length ? related : PRODUCTS.filter(p => p.id !== product.id).slice(0, 4));
}

/* ---------------------------------------------------------------------- */
/* Cart page                                                                */
/* ---------------------------------------------------------------------- */
function renderCartPage(){
  const container = document.querySelector("#cart-container");
  if (!container) return;

  const cart = getCart();

  if (!cart.length){
    container.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added any fragrances yet.</p>
        <a href="shop.html" class="btn btn-gold">Continue Shopping</a>
      </div>`;
    const summary = document.querySelector("#cart-summary-wrap");
    if (summary) summary.style.display = "none";
    return;
  }

  const summary = document.querySelector("#cart-summary-wrap");
  if (summary) summary.style.display = "block";

  const rows = cart.map(item => {
    const p = getProductById(item.id);
    if (!p) return "";
    return `
      <tr class="cart-row" data-id="${p.id}">
        <td>
          <div class="cart-product">
            <img src="${p.image}" alt="${p.name}">
            <div>
              <div class="cart-product-name">${p.name}</div>
              <div class="cart-product-brand">${p.brand}</div>
            </div>
          </div>
        </td>
        <td>${formatPKR(p.price)}</td>
        <td>
          <div class="cart-qty">
            <button type="button" class="cart-qty-minus" data-id="${p.id}">−</button>
            <span>${item.qty}</span>
            <button type="button" class="cart-qty-plus" data-id="${p.id}">+</button>
          </div>
        </td>
        <td>${formatPKR(p.price * item.qty)}</td>
        <td><button type="button" class="remove-item" data-id="${p.id}">Remove</button></td>
      </tr>`;
  }).join("");

  container.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th><th></th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <a href="#" class="clear-cart-btn" id="clear-cart">Clear Cart</a>
  `;

  container.querySelectorAll(".cart-qty-plus").forEach(btn => {
    btn.addEventListener("click", () => {
      const cart = getCart();
      const item = cart.find(i => i.id === Number(btn.dataset.id));
      updateQty(btn.dataset.id, item.qty + 1);
    });
  });
  container.querySelectorAll(".cart-qty-minus").forEach(btn => {
    btn.addEventListener("click", () => {
      const cart = getCart();
      const item = cart.find(i => i.id === Number(btn.dataset.id));
      updateQty(btn.dataset.id, item.qty - 1);
    });
  });
  container.querySelectorAll(".remove-item").forEach(btn => {
    btn.addEventListener("click", () => removeFromCart(btn.dataset.id));
  });
  document.querySelector("#clear-cart")?.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Remove all items from your cart?")) clearCart();
  });

  // Summary totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 250 : 0;
  const total = subtotal + shipping;
  const subtotalEl = document.querySelector("#summary-subtotal");
  const shippingEl = document.querySelector("#summary-shipping");
  const totalEl = document.querySelector("#summary-total");
  if (subtotalEl) subtotalEl.textContent = formatPKR(subtotal);
  if (shippingEl) shippingEl.textContent = formatPKR(shipping);
  if (totalEl) totalEl.textContent = formatPKR(total);
}

/* ---------------------------------------------------------------------- */
/* Hero Slideshow                                                          */
/* ---------------------------------------------------------------------- */
function initHeroSlider(){
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const prevBtn = document.querySelector(".hero-prev");
  const nextBtn = document.querySelector(".hero-next");
  if (!slides.length) return;

  let current = 0;
  let timer;

  function goTo(index){
    slides[current].classList.remove("active");
    dots[current]?.classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current]?.classList.add("active");
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  function startAutoplay(){
    timer = setInterval(next, 4000);
  }
  function resetAutoplay(){
    clearInterval(timer);
    startAutoplay();
  }

  nextBtn?.addEventListener("click", () => { next(); resetAutoplay(); });
  prevBtn?.addEventListener("click", () => { prev(); resetAutoplay(); });
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      goTo(parseInt(dot.dataset.index));
      resetAutoplay();
    });
  });

  startAutoplay();
}
