
document.addEventListener("DOMContentLoaded", function(){
  const { $, $$, formatCurrency, addToCart } = Shop;
  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const product = window.PRODUCTS.find(p=>p.id===id);

  const notFound = $("#not-found");
  const content = $("#content");

  if(!product){
    notFound.style.display="block";
    return;
  }

  content.style.display="block";
  $("#name").textContent = product.name;
  $("#price").textContent = formatCurrency(product.price);
  $("#rating").textContent = product.rating.toFixed(1);
  $("#desc").textContent = product.description;

  const main = document.querySelector(".gallery .main");
  const thumbs = document.querySelector(".gallery .thumbs");
  thumbs.innerHTML = "";
  
  // start with first image as main
  if (product.images && product.images.length > 0) {
    main.innerHTML = `<img src="${product.images[0]}" alt="${product.name}">`;
  }
  
  // make thumbnails clickable
  (product.images || []).forEach((img, i) => {
    const t = document.createElement("div");
    t.className = "t";
    t.innerHTML = `<img src="${img}" alt="${product.name}">`;
    t.addEventListener("click", () => {
      main.innerHTML = `<img src="${img}" alt="${product.name}">`;
    });
    thumbs.appendChild(t);
  });
  

  // options
  const colorWrap = $("#colors"); const sizeWrap = $("#sizes");
  let selectedColor = product.colors?.[0] || null;
  let selectedSize = product.sizes?.[0] || null;

  function renderOptions(){
    colorWrap.innerHTML = "";
    (product.colors||[]).forEach(c=>{
      const btn=document.createElement("button");
      btn.className = "pill" + (c===selectedColor?" active":"");
      btn.textContent=c;
      btn.addEventListener("click", ()=>{ selectedColor=c; renderOptions(); });
      colorWrap.appendChild(btn);
    });
    sizeWrap.innerHTML = "";
    (product.sizes||[]).forEach(s=>{
      const btn=document.createElement("button");
      btn.className = "pill" + (s===selectedSize?" active":"");
      btn.textContent=s;
      btn.addEventListener("click", ()=>{ selectedSize=s; renderOptions(); });
      sizeWrap.appendChild(btn);
    });
    if((product.sizes||[]).length<=1){ document.getElementById("size-section").style.display="none"; }
    if((product.colors||[]).length===0){ document.getElementById("color-section").style.display="none"; }
  }
  renderOptions();

  document.getElementById("add").addEventListener("click", ()=>{
    addToCart(product.id, { color: selectedColor, size: selectedSize });
    document.getElementById("added").textContent = "Added to cart ✓";
    setTimeout(()=>document.getElementById("added").textContent="", 1500);
  });

  // recommendations
  const more = window.PRODUCTS.filter(p=>p.id!==product.id).slice(0,4);
  const grid = document.getElementById("reco"); grid.innerHTML="";
  more.forEach(p=>{
    const a=document.createElement("a"); a.href=`product.html?id=${encodeURIComponent(p.id)}`; a.className="card";
    a.innerHTML = `<div class="thumb"></div><div class="pad"><div class="title">${p.name}</div><div class="row" style="justify-content:space-between;margin-top:6px"><div class="muted" style="font-size:12px">${p.inStock ? "In stock" : "Sold out"}</div><div class="price">${formatCurrency(p.price)}</div></div></div>`;
    grid.appendChild(a);
  });
});
