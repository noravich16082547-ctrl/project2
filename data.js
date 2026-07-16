/* ==========================================================================
   DormCRU — ชั้นข้อมูล (Data Layer)
   หมายเหตุสำคัญ: นี่คือ "โปรโตไทป์ฝั่งหน้าบ้านล้วนๆ" ข้อมูลทั้งหมดเก็บใน
   localStorage ของเบราว์เซอร์ผู้ใช้เท่านั้น ยังไม่มีฐานข้อมูล/เซิร์ฟเวอร์จริง
   เมื่อจะใช้งานจริงต้องต่อ backend (เช่น Node/PHP + MySQL) เพื่อเก็บข้อมูล
   ส่วนกลางให้ทุกคนเห็นตรงกัน — ดูคำอธิบายท้ายไฟล์ README.md ที่แนบมาด้วย
   ========================================================================== */

const DB_KEYS = {
  DORMS: 'dormcru_dorms',
  USERS: 'dormcru_users',
  OWNERS: 'dormcru_owners',
  BOOKINGS: 'dormcru_bookings',
  WISHLIST: 'dormcru_wishlist',
  SESSION: 'dormcru_session',
  ADMIN_SESSION: 'dormcru_admin_session'
};

const CRRU_GATE = { front: { lat: 19.9074, lng: 99.8230 }, back: { lat: 19.9110, lng: 99.8195 } };

const SEED_DORMS = [
  {
    id: 'd001', name: 'บ้านสวนดอย เรสซิเดนซ์', hallType: 'หอหญิงล้วน',
    distFront: 0.4, distBack: 1.1,
    lat: 19.9081, lng: 99.8245,
    facilities: ['wifi','parking','laundry','keycard','cctv','guard'],
    rooms: [
      { code:'fan', label:'พัดลม', price: 2200, total: 10, vacant: 3 },
      { code:'air', label:'แอร์', price: 3300, total: 8, vacant: 1 }
    ],
    images: ['https://picsum.photos/seed/dorm1a/900/700','https://picsum.photos/seed/dorm1b/900/700','https://picsum.photos/seed/dorm1c/900/700'],
    desc: 'หอพักหญิงล้วน บรรยากาศเงียบสงบ ใกล้ประตูหน้ามอ เดินเข้าเรียนได้สบายๆ มีรปภ.ดูแล 24 ชม.'
  },
  {
    id: 'd002', name: 'ริมกก อพาร์ตเมนต์', hallType: 'หอรวม',
    distFront: 0.9, distBack: 0.6,
    lat: 19.9095, lng: 99.8205,
    facilities: ['wifi','parking','laundry','cctv'],
    rooms: [
      { code:'fan', label:'พัดลม', price: 1900, total: 12, vacant: 6 },
      { code:'air', label:'แอร์', price: 2900, total: 10, vacant: 4 }
    ],
    images: ['https://picsum.photos/seed/dorm2a/900/700','https://picsum.photos/seed/dorm2b/900/700','https://picsum.photos/seed/dorm2c/900/700'],
    desc: 'หอรวมชาย-หญิง ราคาเป็นมิตร ใกล้ประตูหลังมอ เหมาะกับสายชิลริมน้ำกก'
  },
  {
    id: 'd003', name: 'สิงห์ทอง เพลส', hallType: 'หอชายล้วน',
    distFront: 1.3, distBack: 0.3,
    lat: 19.9118, lng: 99.8188,
    facilities: ['wifi','parking','keycard','guard'],
    rooms: [
      { code:'air', label:'แอร์', price: 3500, total: 14, vacant: 0 }
    ],
    images: ['https://picsum.photos/seed/dorm3a/900/700','https://picsum.photos/seed/dorm3b/900/700','https://picsum.photos/seed/dorm3c/900/700'],
    desc: 'หอชายล้วน ห้องแอร์ล้วน ใกล้ประตูหลังมอที่สุดในย่านนี้ เดิน 3 นาทีถึงคณะ'
  },
  {
    id: 'd004', name: 'ดอยตุง เรสซิเดนซ์', hallType: 'หอหญิงล้วน',
    distFront: 0.6, distBack: 1.4,
    lat: 19.9070, lng: 99.8260,
    facilities: ['wifi','parking','laundry','keycard','cctv','guard'],
    rooms: [
      { code:'fan', label:'พัดลม', price: 2400, total: 8, vacant: 2 },
      { code:'air', label:'แอร์', price: 3600, total: 8, vacant: 3 }
    ],
    images: ['https://picsum.photos/seed/dorm4a/900/700','https://picsum.photos/seed/dorm4b/900/700','https://picsum.photos/seed/dorm4c/900/700'],
    desc: 'หอพักพรีเมียมสำหรับนักศึกษาหญิง มีคีย์การ์ดทุกชั้น กล้องวงจรปิดครบทุกมุม'
  },
  {
    id: 'd005', name: 'เวียงพาน อพาร์ตเมนต์', hallType: 'หอรวม',
    distFront: 1.6, distBack: 0.8,
    lat: 19.9060, lng: 99.8175,
    facilities: ['wifi','parking','laundry'],
    rooms: [
      { code:'fan', label:'พัดลม', price: 1700, total: 16, vacant: 9 }
    ],
    images: ['https://picsum.photos/seed/dorm5a/900/700','https://picsum.photos/seed/dorm5b/900/700','https://picsum.photos/seed/dorm5c/900/700'],
    desc: 'หอพักราคาประหยัดที่สุดในย่านนี้ เหมาะกับน้องปี 1 งบจำกัด ห้องกว้างลมโกรก'
  },
  {
    id: 'd006', name: 'ภูชี้ฟ้า เพลส', hallType: 'หอชายล้วน',
    distFront: 0.3, distBack: 1.2,
    lat: 19.9078, lng: 99.8222,
    facilities: ['wifi','parking','laundry','cctv','guard'],
    rooms: [
      { code:'fan', label:'พัดลม', price: 2000, total: 10, vacant: 4 },
      { code:'air', label:'แอร์', price: 3100, total: 6, vacant: 2 }
    ],
    images: ['https://picsum.photos/seed/dorm6a/900/700','https://picsum.photos/seed/dorm6b/900/700','https://picsum.photos/seed/dorm6c/900/700'],
    desc: 'ใกล้ประตูหน้ามอที่สุด เดินถึงคณะครุศาสตร์ใน 5 นาที มีร้านสะดวกซื้อติดหอ'
  }
];

const FACILITY_META = {
  wifi: { icon:'📶', label:'Wi-Fi ฟรี' },
  parking: { icon:'🛵', label:'ที่จอดรถ' },
  laundry: { icon:'🧺', label:'ซักผ้าหยอดเหรียญ' },
  keycard: { icon:'🔑', label:'คีย์การ์ด' },
  cctv: { icon:'📷', label:'กล้องวงจรปิด' },
  guard: { icon:'🛡️', label:'รปภ. 24 ชม.' }
};

function dbGet(key, fallback){
  try{
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  }catch(e){ return fallback; }
}
function dbSet(key, value){
  localStorage.setItem(key, JSON.stringify(value));
}
function ensureSeed(){
  if(!localStorage.getItem(DB_KEYS.DORMS)){
    dbSet(DB_KEYS.DORMS, SEED_DORMS);
  }
  if(!localStorage.getItem(DB_KEYS.USERS)){ dbSet(DB_KEYS.USERS, []); }
  if(!localStorage.getItem(DB_KEYS.OWNERS)){
    dbSet(DB_KEYS.OWNERS, [{ username:'admin', password:'admin1234', name:'ผู้ดูแลระบบ DormCRU' }]);
  }
  if(!localStorage.getItem(DB_KEYS.BOOKINGS)){ dbSet(DB_KEYS.BOOKINGS, []); }
  if(!localStorage.getItem(DB_KEYS.WISHLIST)){ dbSet(DB_KEYS.WISHLIST, {}); }
}
ensureSeed();

function getDorms(){ return dbGet(DB_KEYS.DORMS, []); }
function saveDorms(list){ dbSet(DB_KEYS.DORMS, list); }
function getDormById(id){ return getDorms().find(d => d.id === id); }

function haversineKm(lat1, lng1, lat2, lng2){
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function totalVacancy(dorm){ return dorm.rooms.reduce((s,r)=>s+r.vacant,0); }
function minPrice(dorm){ return Math.min(...dorm.rooms.map(r=>r.price)); }

function currentUser(){ return dbGet(DB_KEYS.SESSION, null); }
function currentAdmin(){ return dbGet(DB_KEYS.ADMIN_SESSION, null); }

function fmtBaht(n){ return Number(n).toLocaleString('th-TH'); }
