/* ==========================================================================
   CONFIG & GLOBAL CONSTANTS / STATE
   ========================================================================== */

/* Device Icons (SVG) */
const ICONS = {
  router: `<svg viewBox="0 0 24 24"><rect x="3" y="12" width="18" height="7" rx="1.5"/><path d="M8 12V8a2 2 0 0 1 2-2M16 12V8a2 2 0 0 0-2-2"/><circle cx="7" cy="15.5" r="0.6" fill="var(--ink)"/><circle cx="10" cy="15.5" r="0.6" fill="var(--ink)"/><circle cx="13" cy="15.5" r="0.6" fill="var(--ink)"/></svg>`,
  switch: `<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="10" rx="2"/><path d="M5 11h14M7 9l-2 2 2 2M17 13l2-2-2-2"/><circle cx="7" cy="14.5" r="0.7" fill="var(--ink)"/><circle cx="10.5" cy="14.5" r="0.7" fill="var(--ink)"/><circle cx="14" cy="14.5" r="0.7" fill="var(--ink)"/><circle cx="17.5" cy="14.5" r="0.7" fill="var(--ink)"/></svg>`,
  modem: `<svg viewBox="0 0 24 24"><rect x="3" y="10" width="18" height="8" rx="1.5"/><path d="M12 10V6"/><circle cx="12" cy="5" r="1"/><circle cx="8" cy="14" r="0.6" fill="var(--ink)"/><circle cx="11" cy="14" r="0.6" fill="var(--ink)"/></svg>`,
  server: `<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="7" rx="1"/><rect x="5" y="14" width="14" height="7" rx="1"/><circle cx="8" cy="6.5" r="0.6" fill="var(--ink)"/><circle cx="8" cy="17.5" r="0.6" fill="var(--ink)"/></svg>`,
  desktop: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="14" height="10" rx="1"/><path d="M8 20h6M10 14v6"/><rect x="18" y="6" width="3" height="12" rx="0.5"/></svg>`,
  laptop: `<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="9" rx="1"/><path d="M2 19h20l-2-3H4l-2 3Z"/></svg>`,
  printer: `<svg viewBox="0 0 24 24"><rect x="5" y="8" width="14" height="8" rx="1"/><path d="M7 8V4h10v4M7 16v4h10v-4"/></svg>`,
  tablet: `<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="0.8" fill="var(--ink)"/></svg>`,
  phone: `<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 19h2"/></svg>`
};

/* Device Type Definitions */
const TYPES = {
  router:  {label:"Router",     color:0x3E6FA8, port:0.36, forcesWireless:false},
  switch:  {label:"Switch",     color:0x0891B2, port:0.20, forcesWireless:false},
  modem:   {label:"Modem",      color:0x6C5B8C, port:0.30, forcesWireless:false},
  server:  {label:"Server",     color:0x2F8558, port:0.90, forcesWireless:false},
  desktop: {label:"Kompyuter",  color:0x55606E, port:0.55, forcesWireless:false},
  laptop:  {label:"Noutbuk",    color:0x7A8697, port:0.16, forcesWireless:true},
  tablet:  {label:"Planshet",   color:0x38BDF8, port:0.18, forcesWireless:true},
  printer: {label:"Printer",    color:0xB07A2E, port:0.34, forcesWireless:false},
  phone:   {label:"Telefon",    color:0x3E6FA8, port:0.36, forcesWireless:true},
};
const ORDER = ["router","switch","modem","server","desktop","laptop","tablet","printer","phone"];

/* Cable Descriptions */
const CABLE_DESCRIPTIONS = {
  auto: "⚡ Tavsiya etiladi: Avtomatik aniqlash (MDI/MDIX orqali to‘g‘ri yoki krossover kabel tanlanadi).",
  straight: "🔌 To‘g‘ri kabel (Straight-Through): Har xil qurilmalar uchun (PC ↔ Switch, Switch ↔ Router).",
  crossover: "🔀 Krossover kabel (Crossover): Bir xil turdagi qurilmalar uchun (PC ↔ PC, Switch ↔ Switch, Router ↔ Router).",
  fiber: "💡 Optik tola (Fiber 10G SFP+): Yuqori o‘tkazuvchanlikka ega yuqori tezlikdagi optik magistral."
};

/* Global Application State */
const devices = new Map();     // id -> {id,type,group,name,ip,mac,port,pickMeshes:[],...}
const connections = new Map(); // id -> {id,a,b,wireless,wan,mesh,hitMesh,packets,curveFn,...}

let idCounter = 1;
let connCounter = 1;
let lanCounter = 2;

let selectedDeviceId = null;
let connectFirstId = null;
let connectMode = false;

/* 3D Transfers & Sim State */
const active3DTransfers = [];
let simEventIdCounter = 1;
let simPaused = false;
let simSpeed = 1.0;
const simEventsLog = [];

/* Speech Bubbles & Wi-Fi Pulses */
const activeSpeechBubbles = [];
const wifiPulses = [];

/* ==========================================================================
   HELPER UTILITIES
   ========================================================================== */
function mat(color, opts){
  return new THREE.MeshStandardMaterial(Object.assign({color, roughness:0.45, metalness:0.35}, opts||{}));
}

function emissiveMat(color, intensity){
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity === undefined ? 1.4 : intensity,
    roughness: 0.4,
    metalness: 0.1
  });
}

function box(w, h, d, material){
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

function nextId(){
  return "d" + (idCounter++);
}

function randHex(n){
  let s = "";
  for(let i = 0; i < n; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

function macAddr(){
  const parts = [];
  for(let i = 0; i < 6; i++) parts.push(randHex(2));
  return parts.join(":").toUpperCase();
}

function nextIP(){
  return "192.168.1." + (lanCounter++);
}

function wanIP(){
  return "91." + (20 + Math.floor(Math.random() * 90)) + "." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255);
}

function escapeHtml(str){
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ipToLong(ip){
  if(!ip || typeof ip !== 'string') return 0;
  return ip.split('.').reduce((acc, oct) => ((acc << 8) + parseInt(oct || 0, 10)) >>> 0, 0) >>> 0;
}

function areInSameSubnet(ipA, maskA, ipB, maskB){
  try{
    const a = ipToLong(ipA);
    const b = ipToLong(ipB);
    const mA = ipToLong(maskA || '255.255.255.0');
    const mB = ipToLong(maskB || '255.255.255.0');
    return (a & mA) === (b & mB);
  }catch(e){
    return true;
  }
}

/* Toast Notifications */
const toastEl = document.getElementById('toast');
let toastTimer = null;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

const hintEl = document.getElementById('hint');
let hinted = false;
function hideHint(){
  if(!hinted && hintEl){
    hinted = true;
    hintEl.classList.add('hide');
  }
}
