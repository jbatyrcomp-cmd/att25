/* ==========================================================================
   DIRECT MESSAGING & 3D FLOATING SPEECH BUBBLES
   ========================================================================== */

const msgModal = document.getElementById('messageModal');
const msgSrcSelect = document.getElementById('msgSrcSelect');
const msgDstSelect = document.getElementById('msgDstSelect');
const msgTextInput = document.getElementById('msgTextInput');
const msgQuickTemplates = document.getElementById('msgQuickTemplates');
const msgRoutePreview = document.getElementById('msgRoutePreview');
const msgClose = document.getElementById('msgClose');
const msgCancelBtn = document.getElementById('msgCancelBtn');
const msgSendBtn = document.getElementById('msgSendBtn');

function updateMsgRoutePreview(){
  if(!msgSrcSelect || !msgDstSelect || !msgRoutePreview) return;
  const s = msgSrcSelect.value;
  const d = msgDstSelect.value;
  if(!s || !d || s === d){
    msgRoutePreview.innerHTML = `<span style="color:#EF4444;">Marshrut: Jo‘natuvchi va qabul qiluvchi turli qurilma bo‘lishi shart.</span>`;
    return;
  }
  const sDev = devices.get(s);
  const dDev = devices.get(d);
  if(!sDev || !dDev) return;

  const path = findNetworkPath(s, d);
  if(!path){
    msgRoutePreview.innerHTML = `<span style="color:#EF4444;">⚠️ Topologiyada bu qurilmalar o‘rtasida ulanish mavjud emas (Tarmoq uzilgan)!</span>`;
    return;
  }

  const names = path.map(id => devices.get(id).name);
  const sameSubnet = areInSameSubnet(sDev.ip, sDev.mask, dDev.ip, dDev.mask);
  const hasRouter = path.some(id => { const dev = devices.get(id); return dev && dev.type === 'router'; });

  let subnetBadge = '';
  if(sameSubnet){
    subnetBadge = `<div style="font-size:10.5px; color:#6FE3C4; margin-top:3px;">🟢 Lokal podtarmoq (Bir xil subnet): ${sDev.ip} ↔ ${dDev.ip} (To‘g‘ridan-to‘g‘ri L2/Switch orqali uzatiladi)</div>`;
  } else if(hasRouter){
    subnetBadge = `<div style="font-size:10.5px; color:#A78BFA; margin-top:3px;">🟣 Turli xil subnetlar: Trafik Default Gateway (Router) orqali L3 marshrutlanadi.</div>`;
  } else {
    subnetBadge = `<div style="font-size:10.5px; color:#FBBF24; margin-top:3px;">⚠️ Ogohlantirish: Qurilmalar turli subnetda (${sDev.ip} vs ${dDev.ip}) va yo‘lda Router (Gateway) yo‘q! Paket yetib bormasligi mumkin.</div>`;
  }

  msgRoutePreview.innerHTML = `
    <div><b>Marshrut (${path.length - 1} sakrash):</b> ${names.join(" ➔ ")}</div>
    ${subnetBadge}
  `;
}

function openMessageModal(preSrcId, preDstId){
  if(devices.size < 2){
    toast("Xabar yuborish uchun sahnada kamida 2 ta qurilma bo‘lishi kerak!");
    return;
  }

  msgSrcSelect.innerHTML = '';
  msgDstSelect.innerHTML = '';

  devices.forEach(d => {
    const optS = document.createElement('option');
    optS.value = d.id; optS.textContent = `${d.name} (${d.ip})`;
    msgSrcSelect.appendChild(optS);

    const optD = document.createElement('option');
    optD.value = d.id; optD.textContent = `${d.name} (${d.ip})`;
    msgDstSelect.appendChild(optD);
  });

  const devKeys = [...devices.keys()];
  msgSrcSelect.value = preSrcId || selectedDeviceId || devKeys[0];
  msgDstSelect.value = preDstId || (devKeys.find(k => k !== msgSrcSelect.value) || devKeys[1]);

  updateMsgRoutePreview();
  msgModal.classList.add('show');
  setTimeout(()=>{ if(msgTextInput) msgTextInput.focus(); }, 100);
}

function closeMessageModal(){
  if(msgModal) msgModal.classList.remove('show');
}

if(msgClose) msgClose.addEventListener('click', closeMessageModal);
if(msgCancelBtn) msgCancelBtn.addEventListener('click', closeMessageModal);
if(msgSrcSelect) msgSrcSelect.addEventListener('change', updateMsgRoutePreview);
if(msgDstSelect) msgDstSelect.addEventListener('change', updateMsgRoutePreview);

if(msgQuickTemplates){
  msgQuickTemplates.querySelectorAll('.proto-btn').forEach(btn => {
    btn.addEventListener('click', ()=>{
      if(msgTextInput) msgTextInput.value = btn.dataset.txt;
    });
  });
}

function show3DSpeechBubble(dev, text){
  if(!dev || !dev.group) return;
  const bubble = document.createElement('div');
  bubble.className = 'speech-bubble';
  bubble.innerHTML = `<span>💬 <b>${dev.name}:</b> ${escapeHtml(text)}</span>`;
  labelsEl.appendChild(bubble);
  activeSpeechBubbles.push({ devId: dev.id, el: bubble, expiresAt: Date.now() + 6500 });
}

function sendDirectMessage(srcId, dstId, text){
  const sDev = devices.get(srcId);
  const dDev = devices.get(dstId);
  if(!sDev || !dDev) return;

  const sameSubnet = areInSameSubnet(sDev.ip, sDev.mask, dDev.ip, dDev.mask);
  const path = findNetworkPath(srcId, dstId);
  const hasRouter = path && path.some(id => { const dev = devices.get(id); return dev && dev.type === 'router'; });

  if(!sameSubnet && !hasRouter){
    toast(`⚠️ Xatolik: ${sDev.name} (${sDev.ip}) va ${dDev.name} (${dDev.ip}) turli subnetda va tarmoqda Router yo‘q!`);
    logSimEvent(sDev.name, dDev.name, 'HTTP', '—', 'Xatolik: Subnet nomutanosib', 'Host Unreachable without Router');
    toggleSimDock(true);
    return;
  }

  startPacketTransfer({
    srcId, dstId,
    type: 'http',
    fileName: `Xabar: "${text.length > 22 ? text.substring(0,22)+'...' : text}"`,
    fileSize: `${text.length * 2} B`,
    onComplete: (success)=>{
      if(success){
        if(!dDev.inbox) dDev.inbox = [];
        dDev.inbox.unshift({ from: sDev.name, text, time: new Date().toLocaleTimeString() });
        if(selectedDeviceId === dstId && typeof refreshPanel === 'function') refreshPanel();
        show3DSpeechBubble(dDev, text);
        toast(`💬 ${dDev.name} ga xabar yetkazildi: "${text}"`);
      }
    }
  });

  toggleSimDock(true);
}

if(msgSendBtn){
  msgSendBtn.addEventListener('click', ()=>{
    const srcId = msgSrcSelect.value;
    const dstId = msgDstSelect.value;
    if(srcId === dstId){
      toast("Jo‘natuvchi va qabul qiluvchi bir xil bo‘lishi mumkin emas!");
      return;
    }
    const text = (msgTextInput ? msgTextInput.value.trim() : '') || 'Salom, tarmoq aloqasi tekshirildi!';
    closeMessageModal();
    sendDirectMessage(srcId, dstId, text);
  });
}
