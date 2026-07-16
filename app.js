/* ==========================================================================
   DormCRU — ฟังก์ชันส่วนกลาง (ใช้ร่วมทุกหน้า)
   ========================================================================== */

function toast(msg, type=''){
  let wrap = document.querySelector('.toast-wrap');
  if(!wrap){
    wrap = document.createElement('div');
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const el = document.createElement('div');
  el.className = 'toast ' + type;
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(()=> el.remove(), 3200);
}

function renderNav(active){
  const user = currentUser();
  const links = [
    { href:'index.html', label:'ค้นหาหอพัก', key:'search' },
    { href:'wishlist.html', label:'รายการที่ถูกใจ', key:'wishlist' },
  ];
  const nav = document.getElementById('site-nav');
  if(!nav) return;
  let html = `<a href="index.html" class="brand"><span class="dot"></span>DormCRU เชียงราย</a>
  <button class="hamburger" id="hamburgerBtn" aria-label="เมนู">☰</button>
  <div class="nav-links" id="navLinks">`;
  links.forEach(l=>{
    html += `<a href="${l.href}" ${active===l.key?'style="background:rgba(255,255,255,.14)"':''}>${l.label}</a>`;
  });
  if(user){
    html += `<a href="#" id="logoutBtn">ออกจากระบบ (${user.name})</a>`;
  }else{
    html += `<a href="login.html">เข้าสู่ระบบ</a><a href="register.html" class="cta">สมัครสมาชิก</a>`;
  }
  html += `<a href="admin-login.html" title="สำหรับเจ้าของหอพัก" style="opacity:.7;font-size:.85rem">เจ้าของหอพัก</a></div>`;
  nav.innerHTML = html;

  const logoutBtn = document.getElementById('logoutBtn');
  if(logoutBtn){
    logoutBtn.addEventListener('click', (e)=>{
      e.preventDefault();
      localStorage.removeItem(DB_KEYS.SESSION);
      toast('ออกจากระบบแล้ว','success');
      setTimeout(()=> location.href='index.html', 600);
    });
  }
  const hb = document.getElementById('hamburgerBtn');
  if(hb){
    hb.addEventListener('click', ()=>{
      const nl = document.getElementById('navLinks');
      nl.style.display = nl.style.display === 'flex' ? 'none' : 'flex';
      nl.style.cssText += 'position:absolute;top:68px;left:0;right:0;background:var(--forest);flex-direction:column;padding:10px 20px;';
    });
  }
}

function requireLogin(redirectMsg){
  if(!currentUser()){
    sessionStorage.setItem('dormcru_redirect', location.pathname.split('/').pop() + location.search);
    toast(redirectMsg || 'กรุณาเข้าสู่ระบบก่อนใช้งานส่วนนี้','error');
    setTimeout(()=> location.href = 'login.html', 900);
    return false;
  }
  return true;
}

function getWishlist(){
  const user = currentUser();
  if(!user) return [];
  const all = dbGet(DB_KEYS.WISHLIST, {});
  return all[user.email] || [];
}
function toggleWishlist(dormId){
  if(!currentUser()){
    toast('เข้าสู่ระบบก่อนเพื่อบันทึกหอพักที่ถูกใจ','error');
    return false;
  }
  const user = currentUser();
  const all = dbGet(DB_KEYS.WISHLIST, {});
  const list = all[user.email] || [];
  const idx = list.indexOf(dormId);
  if(idx >= 0){ list.splice(idx,1); }
  else{ list.push(dormId); }
  all[user.email] = list;
  dbSet(DB_KEYS.WISHLIST, all);
  return idx < 0;
}

function facilityIcons(codes){
  return codes.map(c => FACILITY_META[c] ? `<span title="${FACILITY_META[c].label}">${FACILITY_META[c].icon}</span>` : '').join(' ');
}

function amenityGridHtml(codes){
  return codes.map(c=>{
    const m = FACILITY_META[c];
    if(!m) return '';
    return `<div class="amenity"><span class="ic">${m.icon}</span><span>${m.label}</span></div>`;
  }).join('');
}

function mapEmbedUrl(lat, lng){
  return `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;
}

function statusPill(status){
  const map = {
    pending: ['status-pending','รอตรวจสอบยอดเงิน'],
    confirmed: ['status-confirmed','จองสำเร็จ'],
    cancelled: ['status-cancelled','ยกเลิกการจอง']
  };
  const [cls,label] = map[status] || ['status-pending', status];
  return `<span class="status-pill ${cls}">${label}</span>`;
}
