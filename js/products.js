/* ==========================================================================
   MAGISTER SCENTS — products.js
   Product data + shared rendering helpers (cards, stars, currency).
   Note: data is embedded directly (mirrors data/products.json) so the site
   works fully offline via file:// without needing a fetch/server call.
   ========================================================================== */

const PRODUCTS = [
  { id: 1, name: "Noir Imperial", brand: "Magister Scents", category: "men", price: 8500, oldPrice: 10000, rating: 4.8,
    image: "images/perfumes/bottle-3.jpg",
    shortDescription: "A commanding blend of oud, leather and dark spice.",
    description: "Noir Imperial is a bold, commanding fragrance built for the man who leads the room. Dark spice opens into a heart of smoked leather, settling into a rich oud and amber base that lingers for hours.",
    topNotes: "Black Pepper, Bergamot, Cardamom", middleNotes: "Smoked Leather, Cedarwood, Iris", baseNotes: "Oud, Amber, Dark Musk" },

  { id: 2, name: "Golden Aristocrat", brand: "Magister Scents", category: "men", price: 7200, oldPrice: null, rating: 4.6,
    image: "images/perfumes/bottle-1.jpg",
    shortDescription: "Sophisticated woody notes with a citrus opening.",
    description: "Golden Aristocrat opens with crisp citrus and settles into a refined heart of sandalwood and tobacco, finished with a warm vanilla-amber base — timeless elegance in a bottle.",
    topNotes: "Sicilian Lemon, Grapefruit, Mint", middleNotes: "Sandalwood, Tobacco Leaf, Nutmeg", baseNotes: "Vanilla, Amber, Tonka Bean" },

  { id: 3, name: "Steel Legacy", brand: "Magister Scents", category: "men", price: 6800, oldPrice: 7500, rating: 4.5,
    image: "images/perfumes/bottle-3.jpg",
    shortDescription: "Fresh aquatic notes for the modern gentleman.",
    description: "Steel Legacy is crisp, clean and confident — an aquatic signature scent with a mineral heart and a grounded woody base, designed for everyday sophistication.",
    topNotes: "Sea Salt, Bergamot, Green Apple", middleNotes: "Lavender, Geranium, Ambergris", baseNotes: "Vetiver, Cedar, White Musk" },

  { id: 4, name: "Rose Empress", brand: "Magister Scents", category: "women", price: 7900, oldPrice: null, rating: 4.9,
    image: "images/perfumes/bottle-2.jpg",
    shortDescription: "A radiant floral bouquet with a soft powdery finish.",
    description: "Rose Empress is a love letter to classic femininity — Turkish rose and peony bloom over a soft, powdery base of iris and musk, for a scent that feels like silk.",
    topNotes: "Pink Pepper, Litchi, Bergamot", middleNotes: "Turkish Rose, Peony, Jasmine", baseNotes: "Iris, White Musk, Soft Vanilla" },

  { id: 5, name: "Velvet Orchid", brand: "Magister Scents", category: "women", price: 8300, oldPrice: 9200, rating: 4.7,
    image: "images/perfumes/bottle-2.jpg",
    shortDescription: "Deep, sensual florals wrapped in warm amber.",
    description: "Velvet Orchid drapes black orchid and honeyed florals over a warm amber-vanilla base, creating a sensual, evening-ready fragrance that lingers on skin.",
    topNotes: "Mandarin, Blackcurrant", middleNotes: "Black Orchid, Honey, Jasmine Sambac", baseNotes: "Amber, Vanilla, Sandalwood" },

  { id: 6, name: "Blush Diamond", brand: "Magister Scents", category: "women", price: 6900, oldPrice: null, rating: 4.4,
    image: "images/perfumes/bottle-1.jpg",
    shortDescription: "Sparkling fruity-floral for the day and night.",
    description: "Blush Diamond opens with juicy pear and closes with a soft musk — a playful, sparkling fragrance built for effortless confidence, day into night.",
    topNotes: "Pear, Raspberry, Pink Grapefruit", middleNotes: "Freesia, Magnolia, Rose Petals", baseNotes: "Musk, Cashmere Wood, Vanilla" },

  { id: 7, name: "Eclipse Unisex", brand: "Magister Scents", category: "unisex", price: 8100, oldPrice: null, rating: 4.7,
    image: "images/perfumes/bottle-3.jpg",
    shortDescription: "A balanced woody-spice scent for every identity.",
    description: "Eclipse is designed without boundaries — a warm balance of spice, wood and soft musk that adapts to whoever wears it, for those who define their own style.",
    topNotes: "Cardamom, Pink Pepper, Bergamot", middleNotes: "Violet, Cedarwood, Nutmeg", baseNotes: "Sandalwood, Musk, Ambergris" },

  { id: 8, name: "Amber Horizon", brand: "Magister Scents", category: "unisex", price: 7600, oldPrice: 8400, rating: 4.6,
    image: "images/perfumes/bottle-1.jpg",
    shortDescription: "Warm amber and soft musk, endlessly wearable.",
    description: "Amber Horizon blends golden amber with a soft, clean musk — an effortless everyday signature that works beautifully on any skin, any season.",
    topNotes: "Bergamot, Orange Blossom", middleNotes: "Amber, Lavender, Iris", baseNotes: "Musk, Sandalwood, Vanilla" },

  { id: 9, name: "Grey Cashmere", brand: "Magister Scents", category: "unisex", price: 7000, oldPrice: null, rating: 4.5,
    image: "images/perfumes/bottle-3.jpg",
    shortDescription: "Soft, cozy and understated woody musk.",
    description: "Grey Cashmere is soft-spoken luxury — cashmere wood and gentle musk wrapped in a whisper of citrus, made for quiet confidence.",
    topNotes: "Mandarin, Cardamom", middleNotes: "Cashmere Wood, Iris, Suede", baseNotes: "White Musk, Sandalwood, Tonka Bean" },

  { id: 10, name: "Sultan's Oud", brand: "Magister Scents", category: "arabic", price: 11500, oldPrice: 13000, rating: 4.9,
    image: "images/perfumes/bottle-4.jpg",
    shortDescription: "Rich, royal oud with saffron and rose.",
    description: "Sultan's Oud is a royal Arabic composition — deep Cambodian oud enriched with saffron and rose, finished with amber and musk for a fragrance that commands respect.",
    topNotes: "Saffron, Rose", middleNotes: "Oud, Bulgarian Rose, Cardamom", baseNotes: "Amber, Musk, Sandalwood" },

  { id: 11, name: "Bakhoor Nights", brand: "Magister Scents", category: "arabic", price: 9800, oldPrice: null, rating: 4.8,
    image: "images/perfumes/bottle-4.jpg",
    shortDescription: "Smoky bakhoor wrapped in sweet amber.",
    description: "Bakhoor Nights captures the ritual of incense-burning evenings — smoky bakhoor and oud wrapped in sweet amber and dates, warm and unforgettable.",
    topNotes: "Dates, Cinnamon", middleNotes: "Bakhoor, Oud, Rose", baseNotes: "Amber, Musk, Vanilla" },

  { id: 12, name: "Zafran Musk", brand: "Magister Scents", category: "arabic", price: 10200, oldPrice: 11000, rating: 4.7,
    image: "images/perfumes/bottle-4.jpg",
    shortDescription: "Saffron-laced musk with a honeyed amber trail.",
    description: "Zafran Musk opens with golden saffron and honey, deepening into a soft musk and oud base — an opulent Arabic fragrance built to last from dusk till dawn.",
    topNotes: "Saffron, Honey", middleNotes: "Rose, Oud, Cardamom", baseNotes: "Musk, Amber, Vanilla" }
];

/* ---------- Helpers ---------- */
function formatPKR(amount){
  return "Rs " + Number(amount).toLocaleString("en-PK");
}

function getProductById(id){
  return PRODUCTS.find(p => p.id === Number(id));
}

function renderStars(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = "★".repeat(full);
  if (half) out += "½";
  out += "☆".repeat(5 - full - (half ? 1 : 0));
  return out;
}

/* Builds a single product card element (used on Home + Shop) */
function buildProductCard(p){
  const discountPct = p.oldPrice ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0;
  const badge = p.oldPrice ? `<span class="product-badge">-${discountPct}%</span>` : "";
  const oldPriceHtml = p.oldPrice ? `<span class="price-old">${formatPKR(p.oldPrice)}</span>` : "";
  return `
    <div class="product-card" data-id="${p.id}">
      <div class="product-thumb">
        ${badge}
        <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name} by ${p.brand}" loading="lazy"></a>
        <button class="product-quick-add" data-add-id="${p.id}">Add to Cart</button>
      </div>
      <div class="product-info">
        <span class="product-brand">${p.brand}</span>
        <a href="product.html?id=${p.id}"><h3 class="product-name">${p.name}</h3></a>
        <p class="product-desc">${p.shortDescription}</p>
        <div class="product-rating"><span class="stars">${renderStars(p.rating)}</span><span>${p.rating}</span></div>
        <div class="product-price-row">
          <span class="price">${formatPKR(p.price)}</span>
          ${oldPriceHtml}
          ${p.oldPrice ? `<span class="price-discount">${discountPct}% OFF</span>` : ""}
        </div>
        <div class="product-actions">
          <a href="product.html?id=${p.id}" class="btn btn-outline-dark btn-small">View Details</a>
          <button class="btn btn-gold btn-small" data-add-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;
}

function renderProductGrid(container, products){
  if (!container) return;
  if (!products.length){
    container.innerHTML = `<div class="no-results"><h3>No perfumes found</h3><p>Try a different search term or category.</p></div>`;
    return;
  }
  container.innerHTML = products.map(buildProductCard).join("");
}
