// scripts/catalog.js
document.addEventListener("DOMContentLoaded", function () {
  const { $, $$, formatCurrency } = Shop; // from scripts/app.js
  const products = window.PRODUCTS || [];
  const state = { q: "", cat: "All", stock: false, sort: "popular" };

  // Build categories in the toolbar
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];
  const catSel = document.getElementById("cat");
  if (catSel) {
    catSel.innerHTML = "";
    categories.forEach(c => {
      const opt = document.createElement("option");
      opt.value = c;
      opt.textContent = c;
      catSel.appendChild(opt);
    });
  }

  // Wire up filters
  const qEl = document.getElementById("q");
  const stockEl = document.getElementById("stock");
  const sortEl = document.getElementById("sort");

  qEl?.addEventListener("input", (e) => { state.q = e.target.value; apply(); });
  catSel?.addEventListener("change", (e) => { state.cat = e.target.value; apply(); });
  stockEl?.addEventListener("change", (e) => { state.stock = e.target.checked; apply(); });
  sortEl?.addEventListener("change", (e) => { state.sort = e.target.value; apply(); });

  function apply() {
    let list = products.slice();

    if (state.cat !== "All") list = list.filter(p => p.category === state.cat);
    if (state.stock) list = list.filter(p => p.inStock);
    if (state.q) list = list.filter(p => p.name.toLowerCase().includes(state.q.toLowerCase()));

    switch (state.sort) {
      case "price-asc":  list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "rating":     list.sort((a, b) => b.rating - a.rating); break;
      default:           list.sort((a, b) => (b.tags.length + b.rating) - (a.tags.length + a.rating));
    }

    render(list);
  }

  // Render cards like your old home page did (PNG in .thumb, transparent bg)
  function render(list) {
    const grid = document.getElementById("grid");
    grid.innerHTML = "";

    if (!list.length) {
      grid.innerHTML = `<div class="muted" style="text-align:center;padding:40px 0;">No products match your filters.</div>`;
      return;
    }

    list.forEach((p) => {
      const a = document.createElement("a");
      a.href = `product.html?id=${encodeURIComponent(p.id)}`;
      a.className = "card";

      const firstImg = (p.images && p.images[0]) ? p.images[0] : "";

      a.innerHTML = `
        <div class="thumb">
          ${firstImg ? `<img src="${firstImg}" alt="${p.name}" loading="lazy">` : ""}
        </div>
        <div class="pad">
          <div class="title">${p.name}</div>
          <div class="row" style="justify-content:space-between;margin-top:6px">
            <div class="muted" style="font-size:12px">${p.inStock ? "In stock" : "Sold out"}</div>
            <div class="price">${formatCurrency(p.price)}</div>
          </div>
        </div>
      `;
      grid.appendChild(a);
    });
  }

  apply();
});
