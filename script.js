// ใส่ URL หลัง Deploy Apps Script / Publish CSV (ถ้ายังเป็น PASTE... ระบบจะเก็บใน localStorage เพื่อทดสอบ)
const APPS_SCRIPT_URL='PASTE_APPS_SCRIPT_URL_HERE';
const CSV_URL='PASTE_CSV_URL_HERE';
const LOCAL=u=>u.startsWith('PASTE');
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let PRODUCTS=[];
const loadProducts=()=>fetch('products.json').then(r=>r.json()).then(d=>(PRODUCTS=d));

function card(p){return `<div class="card"><img src="${esc(p.image)}" alt="${esc(p.name)}"><h3>${esc(p.name)}</h3><p>${esc(p.size)} · ${esc(p.description)}</p><div class="price">${p.price} บาท</div><a class="btn" href="order.html?sku=${p.sku}">สั่งซื้อ</a></div>`}
function initProducts(){loadProducts().then(()=>{$('#product-list').innerHTML=PRODUCTS.map(card).join('')}).catch(()=>{$('#product-list').innerHTML='<p>โหลดสินค้าไม่สำเร็จ (ต้องเปิดผ่านเว็บ เช่น Vercel)</p>'})}

function initOrder(){
  loadProducts().then(()=>{
    const sel=$('#sku');sel.innerHTML=PRODUCTS.map(p=>`<option value="${p.sku}">${esc(p.name)} (${p.price} บาท)</option>`).join('');
    const q=new URLSearchParams(location.search).get('sku');if(q)sel.value=q;
    const calc=()=>{const p=PRODUCTS.find(x=>x.sku===sel.value),n=Math.max(1,parseInt($('#qty').value)||1);$('#items').value=p.name+' '+p.size;$('#total').value=p.price*n};
    sel.onchange=calc;$('#qty').oninput=calc;calc();
  });
  $('#orderForm').addEventListener('submit',e=>{
    e.preventDefault();
    const id='LH'+Date.now().toString().slice(-8);
    const payload={orderId:id,customerName:$('#customerName').value.trim(),phone:$('#phone').value.trim(),address:$('#address').value.trim(),postcode:$('#postcode').value.trim(),sku:$('#sku').value,items:$('#items').value,qty:$('#qty').value,total:$('#total').value,note:$('#note').value.trim(),status:'รอแพ็ก',timestamp:new Date().toISOString()};
    const done=()=>{window.location.href='thankyou.html?id='+id};
    if(LOCAL(APPS_SCRIPT_URL)){try{const a=JSON.parse(localStorage.getItem('leafHairOrders')||'[]');a.push(payload);localStorage.setItem('leafHairOrders',JSON.stringify(a));done()}catch(err){alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')}return}
    fetch(APPS_SCRIPT_URL,{method:'POST',body:JSON.stringify(payload)}).then(done).catch(err=>{console.error(err);alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')});
  });
}
function initThanks(){const id=new URLSearchParams(location.search).get('id');if(id)$('#orderId').textContent='เลขที่ออเดอร์: '+id}

function parseCSV(t){const rows=[];let r=[],c='',q=false;for(let i=0;i<t.length;i++){const ch=t[i];if(q){if(ch=='"'){if(t[i+1]=='"'){c+='"';i++}else q=false}else c+=ch}else if(ch=='"')q=true;else if(ch==','){r.push(c);c=''}else if(ch=='\n'){r.push(c);rows.push(r);r=[];c=''}else if(ch!='\r')c+=ch}if(c||r.length){r.push(c);rows.push(r)}return rows}
const COLS=['timestamp','orderId','customerName','phone','address','postcode','sku','items','qty','total','note','status'];
function renderAdmin(list){
  window.__orders=list;
  $('#ordersTable tbody').innerHTML=list.length?list.map((o,i)=>`<tr><td>${esc(new Date(o.timestamp).toString()==='Invalid Date'?o.timestamp:new Date(o.timestamp).toLocaleString('th-TH'))}</td><td>${esc(o.orderId)}</td><td>${esc(o.customerName)}<br>${esc(o.phone)}</td><td>${esc(o.address)} ${esc(o.postcode)}</td><td>${esc(o.sku)} × ${esc(o.qty)}<br>${esc(o.items)}</td><td>${esc(o.total)}</td><td>${esc(o.note||'-')}</td><td>${esc(o.status)}</td><td><button class="btn line" onclick="printLabel(${i})">พิมพ์ใบปะหน้า</button></td></tr>`).join(''):'<tr><td colspan="9">ยังไม่มีคำสั่งซื้อ</td></tr>';
}
function initAdmin(){
  if(LOCAL(CSV_URL)){let a=[];try{a=JSON.parse(localStorage.getItem('leafHairOrders')||'[]')}catch(e){}renderAdmin(a.reverse());return}
  fetch(CSV_URL).then(r=>r.text()).then(t=>{const rows=parseCSV(t).slice(1).filter(r=>r.length>1);renderAdmin(rows.map(r=>Object.fromEntries(COLS.map((k,i)=>[k,r[i]]))).reverse())}).catch(()=>{$('#ordersTable tbody').innerHTML='<tr><td colspan="9">โหลดข้อมูลไม่สำเร็จ</td></tr>'});
}
function printLabel(i){const o=window.__orders[i];const w=window.open('','_blank');
  w.document.write(`<html lang="th"><body style="font-family:sans-serif;padding:20px"><div style="border:2px solid #000;padding:18px;width:380px;line-height:1.6"><b>ผู้ส่ง:</b> Leaf Hair<hr><b>ผู้รับ:</b> ${esc(o.customerName)}<br><b>โทร:</b> ${esc(o.phone)}<br><b>ที่อยู่:</b> ${esc(o.address)} ${esc(o.postcode)}<hr><b>สินค้า:</b> ${esc(o.sku)} ${esc(o.items)} × ${esc(o.qty)}<br><b>ยอดรวม:</b> ${esc(o.total)} บาท<br><b>ออเดอร์:</b> ${esc(o.orderId)}</div><script>print()<\/script></body></html>`);w.document.close()}
document.addEventListener('DOMContentLoaded',()=>{if($('#product-list'))initProducts();if($('#orderForm'))initOrder();if($('#orderId'))initThanks();if($('#ordersTable'))initAdmin()});
