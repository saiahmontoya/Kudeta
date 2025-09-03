
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const formatCurrency = (n) => new Intl.NumberFormat(undefined,{style:"currency",currency:"USD"}).format(n);

  const CART_KEY = "brand_cart";
  function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] } catch(e){ return [] } }
  function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); renderCartCount(); }
  function addToCart(productId, variant){ const items=readCart(); const key=productId+JSON.stringify(variant||{}); const existing=items.find(i=>i.key===key); if(existing){existing.qty+=1}else{items.push({key, productId, qty:1, variant})} writeCart(items); }
  function updateQty(key, qty){ const items=readCart(); const it=items.find(i=>i.key===key); if(it){ it.qty=Math.max(1, qty|0); writeCart(items);} }
  function removeFromCart(key){ writeCart(readCart().filter(i=>i.key!==key)); }
  function clearCart(){ writeCart([]); }
  function cartTotal(){ const items=readCart(); return items.reduce((sum,i)=>{ const p=window.PRODUCTS.find(p=>p.id===i.productId); return sum + (p?p.price:0)*i.qty; },0); }

  function renderCartCount(){ const el=$('[data-cart-count]'); if(!el) return; const count=readCart().reduce((s,i)=>s+i.qty,0); el.textContent=count; }

  window.Shop = { $, $$, formatCurrency, addToCart, readCart, writeCart, updateQty, removeFromCart, clearCart, cartTotal };
  document.addEventListener("DOMContentLoaded", renderCartCount);
})();
