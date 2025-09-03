
document.addEventListener("DOMContentLoaded", function(){
  const { $, $$, formatCurrency } = Shop;
  const products = window.PRODUCTS;
  const state = { q:"", cat:"All", stock:false, sort:"popular" };

  const categories = ["All", ...Array.from(new Set(products.map(p=>p.category)))];
  const catSel = $("#cat");
  categories.forEach(c=>{ const opt=document.createElement("option"); opt.value=c; opt.textContent=c; catSel.appendChild(opt); });

  function apply(){
    let list = products.slice();
    if(state.cat!=="All") list = list.filter(p=>p.category===state.cat);
    if(state.stock) list = list.filter(p=>p.inStock);
    if(state.q) list = list.filter(p=>p.name.toLowerCase().includes(state.q.toLowerCase()));
    switch(state.sort){
      case "price-asc": list.sort((a,b)=>a.price-b.price); break;
      case "price-desc": list.sort((a,b)=>b.price-a.price); break;
      case "rating": list.sort((a,b)=>b.rating-a.rating); break;
      default: list.sort((a,b)=>(b.tags.length+b.rating)-(a.tags.length+a.rating));
    }
    render(list);
  }

  function render(list){
    const grid = $("#grid"); grid.innerHTML="";
    if(list.length===0){ grid.innerHTML = `<div class="muted" style="text-align:center;padding:40px 0;">No products match your filters.</div>`; return; }
    list.forEach(p=>{
      const el=document.createElement("a");
      el.href=`product.html?id=${encodeURIComponent(p.id)}`;
      el.className="card";
      el.innerHTML = `
        <div class="thumb"></div>
        <img src="${p.images[0]}" alt="${p.name}
        <div class="pad">
          <div class="title">${p.name}</div>
          <div class="row" style="justify-content:space-between;margin-top:6px">
            <div class="muted" style="font-size:12px">${p.inStock ? "In stock" : "Sold out"}</div>
            <div class="price">${formatCurrency(p.price)}</div>
          </div>
        </div>`;
      grid.appendChild(el);
    });
  }

  $("#q").addEventListener("input", e=>{ state.q=e.target.value; apply(); });
  $("#cat").addEventListener("change", e=>{ state.cat=e.target.value; apply(); });
  $("#stock").addEventListener("change", e=>{ state.stock=e.target.checked; apply(); });
  $("#sort").addEventListener("change", e=>{ state.sort=e.target.value; apply(); });

  apply();
});
