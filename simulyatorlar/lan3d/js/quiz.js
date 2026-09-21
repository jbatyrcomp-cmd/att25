/* ==========================================================================
   QUIZ MODE — Bilim Sinash Rejimi
   Topologiya vazifalari, savol-javob, ball tizimi, vaqt hisoblagich
   ========================================================================== */

/* ---------- Quiz vazifalari ---------- */
const QUIZ_TASKS = [
  {
    id: 'q1',
    title: '⭐ Yulduz (Star) Topologiyasi',
    category: 'Topologiya',
    description: `Yulduz topologiyasini qurib chiqing:
• 1 ta Kommutator (Switch)
• Kamida 4 ta Kompyuter (Desktop/Laptop)
• Har bir kompyuter faqat switchga ulangan bo'lishi kerak`,
    hint: 'Avval Switch qo\'shing, keyin 4 ta PC qo\'shing va har birini Switchga ulang.',
    maxScore: 20,
    validate() {
      const sw = [...devices.values()].filter(d => d.type === 'switch');
      const pc = [...devices.values()].filter(d => d.type === 'desktop' || d.type === 'laptop');
      if (sw.length < 1) return { ok: false, msg: '❌ Kamida 1 ta Switch kerak' };
      if (pc.length < 4) return { ok: false, msg: `❌ Kamida 4 ta PC kerak (hozir ${pc.length} ta)` };
      // Har bir PC faqat switchga ulangan
      const allPcToSwitch = pc.every(p => {
        const pConns = [...connections.values()].filter(c => c.a === p.id || c.b === p.id);
        return pConns.length > 0 && pConns.every(c => {
          const other = c.a === p.id ? c.b : c.a;
          const od = devices.get(other);
          return od && od.type === 'switch';
        });
      });
      if (!allPcToSwitch) return { ok: false, msg: '❌ Har bir PC faqat Switchga ulangan bo\'lishi kerak' };
      return { ok: true, msg: '✅ Yulduz topologiyasi to\'g\'ri qurildi!' };
    }
  },
  {
    id: 'q2',
    title: '⭕ Halqa (Ring) Topologiyasi',
    category: 'Topologiya',
    description: `Halqa topologiyasini qurib chiqing:
• Kamida 4 ta qurilma halqa shaklida ulangan
• Har bir qurilma aniq 2 ta qo'shni bilan ulangan
• Halqa yopiq bo'lishi kerak`,
    hint: 'Qurilmalarni aylana bo\'ylab joylashtiring va ketma-ket ulang. Oxirgi qurilma birinchisiga ham ulanishi kerak.',
    maxScore: 25,
    validate() {
      const devList = [...devices.values()];
      if (devList.length < 4) return { ok: false, msg: `❌ Kamida 4 ta qurilma kerak (hozir ${devList.length} ta)` };
      // Har bir qurilmaning ulanishlar soni tekshirish
      const notTwo = devList.filter(d => {
        const cnt = [...connections.values()].filter(c => c.a === d.id || c.b === d.id).length;
        return cnt !== 2;
      });
      if (notTwo.length > 0) return { ok: false, msg: `❌ ${notTwo.map(d=>d.name).join(', ')} qurilmalari aniq 2 ta ulanishga ega bo'lishi kerak` };
      return { ok: true, msg: '✅ Halqa topologiyasi to\'g\'ri qurildi!' };
    }
  },
  {
    id: 'q3',
    title: '🌐 Marshrutlash (Routing) Sozlamalari',
    category: 'Tarmoq',
    description: `Turli subnetlarni Router orqali ulang:
• Kamida 1 ta Router
• 2 ta turli subnetda (masalan 192.168.1.x va 192.168.2.x) qurilmalar bo'lsin
• Router har ikkala subnetga ulangan bo'lsin`,
    hint: 'Router qo\'shing. Bir gruppada 192.168.1.x IP li PC lar, boshqasida 192.168.2.x IP li PC lar qo\'shing.',
    maxScore: 30,
    validate() {
      const routers = [...devices.values()].filter(d => d.type === 'router');
      if (routers.length < 1) return { ok: false, msg: '❌ Kamida 1 ta Router kerak' };

      const subnets = new Set();
      devices.forEach(d => {
        if (d.type !== 'router' && d.ip) {
          const subnet = d.ip.split('.').slice(0, 3).join('.');
          subnets.add(subnet);
        }
      });
      if (subnets.size < 2) return { ok: false, msg: `❌ Kamida 2 ta turli subnet kerak (hozir ${subnets.size} ta)` };

      // Routerga ulanganlarni tekshirish
      const routerConnected = routers.some(r => {
        const rConns = [...connections.values()].filter(c => c.a === r.id || c.b === r.id);
        return rConns.length >= 2;
      });
      if (!routerConnected) return { ok: false, msg: '❌ Router kamida 2 ta qurilmaga ulangan bo\'lishi kerak' };

      return { ok: true, msg: '✅ Routing topologiyasi to\'g\'ri qurildi!' };
    }
  },
  {
    id: 'q4',
    title: '📶 Wi-Fi Tarmoqi',
    category: 'Wireless',
    description: `Simsiz tarmoq qurib chiqing:
• 1 ta Router yoki AP (Wi-Fi yoqilgan)
• Kamida 2 ta simsiz ulangan qurilma (Laptop/Phone/Tablet)
• Barcha qurilmalar bir xil subnetda bo'lsin`,
    hint: 'Router qo\'shing va uning Wi-Fi panelidan SSID ni sozlang. Keyin Laptop/Phone larni Wi-Fi scanner orqali uling.',
    maxScore: 25,
    validate() {
      const wifiConns = [...connections.values()].filter(c => c.wireless);
      if (wifiConns.length < 2) return { ok: false, msg: `❌ Kamida 2 ta Wi-Fi ulanish kerak (hozir ${wifiConns.length} ta)` };

      const aps = [...devices.values()].filter(d => d.wifi && d.wifi.isAp && d.wifi.enabled);
      if (aps.length < 1) return { ok: false, msg: '❌ Kamida 1 ta yoqilgan Wi-Fi AP kerak' };

      return { ok: true, msg: '✅ Wi-Fi tarmoq to\'g\'ri sozlandi!' };
    }
  },
  {
    id: 'q5',
    title: '🏢 Korporativ Tarmoq',
    category: 'Murakkab',
    description: `To'liq korporativ ofis tarmog'ini qurib chiqing:
• 1 ta Router (Internet gateway)
• 1 ta yoki ko'proq Switch
• Kamida 3 ta Desktop PC
• 1 ta Server
• 1 ta Printer
• Barcha qurilmalar bir-biriga paket uzata olsin`,
    hint: 'Avval tuzilmani rejalashtiring: Router → Switch → Server, PC lar, Printer.',
    maxScore: 40,
    validate() {
      const types = {};
      devices.forEach(d => { types[d.type] = (types[d.type] || 0) + 1; });
      if (!types.router || types.router < 1) return { ok: false, msg: '❌ Router kerak' };
      if (!types.switch || types.switch < 1) return { ok: false, msg: '❌ Kamida 1 ta Switch kerak' };
      if (!types.server || types.server < 1) return { ok: false, msg: '❌ Server kerak' };
      if (!types.printer || types.printer < 1) return { ok: false, msg: '❌ Printer kerak' };
      const pcs = (types.desktop || 0) + (types.laptop || 0);
      if (pcs < 3) return { ok: false, msg: `❌ Kamida 3 ta Desktop/Laptop kerak (hozir ${pcs} ta)` };

      // Aloqa tekshirish
      const devList = [...devices.values()];
      let disconnected = 0;
      devList.forEach(d => {
        const cnt = [...connections.values()].filter(c => c.a === d.id || c.b === d.id).length;
        if (cnt === 0) disconnected++;
      });
      if (disconnected > 0) return { ok: false, msg: `❌ ${disconnected} ta qurilma hech narsaga ulanmagan` };

      return { ok: true, msg: '✅ Korporativ tarmoq to\'g\'ri qurildi!' };
    }
  },
  {
    id: 'q6',
    title: '🔢 Subnet Masala',
    category: 'Hisoblash',
    description: `Subnet kalkulyator masalasi:\n\nBerilgan: IP: <b id="quizSubnetIp">192.168.10.50</b>, Mask: <b id="quizSubnetMask">255.255.255.192</b>\n\nTopish kerak: Usable hostlar soni?`,
    hint: 'Subnet Kalkulyator (🔢) tugmasini bosib, berilgan IP va maskni kiriting.',
    maxScore: 15,
    _answer: 62,
    validate() {
      const answer = parseInt(document.getElementById('quizAnswerInput')?.value || 0);
      if (answer === this._answer) return { ok: true, msg: `✅ To'g'ri! ${this._answer} ta host` };
      return { ok: false, msg: `❌ Noto'g'ri: ${answer}. Hint: /26 subnet = 64 - 2 = 62 host` };
    },
    hasInput: true
  },
  {
    id: 'q7',
    title: '🏷️ VLAN Segmentatsiyasi',
    category: 'VLAN',
    description: `Switchda VLAN segmentatsiyasini amalga oshiring:
• 1 ta Switch
• Switchda VLAN 10 va VLAN 20 yaratilgan bo'lsin
• Kamida 2 ta PC VLAN 10 portlariga, 2 ta PC VLAN 20 portlariga ulansin`,
    hint: 'Switch qo\'shing, "VLAN" tugmasi orqali VLAN 10 va 20 ni yarating va portlarga biriktiring.',
    maxScore: 30,
    validate() {
      const switches = [...devices.values()].filter(d => d.type === 'switch');
      if (switches.length < 1) return { ok: false, msg: '❌ Kamida 1 ta Switch kerak' };

      const sw = switches[0];
      if (!sw.vlans || !sw.vlans.some(v => v.id === 10) || !sw.vlans.some(v => v.id === 20)) {
        return { ok: false, msg: '❌ Switchda VLAN 10 va VLAN 20 yaratilgan bo\'lishi kerak' };
      }

      const vlan10Ports = (sw.ports || []).filter(p => p.vlan === 10 && p.connectedTo);
      const vlan20Ports = (sw.ports || []).filter(p => p.vlan === 20 && p.connectedTo);

      if (vlan10Ports.length < 2) return { ok: false, msg: `❌ VLAN 10 ga kamida 2 ta qurilma ulangan bo'lishi kerak (hozir ${vlan10Ports.length} ta)` };
      if (vlan20Ports.length < 2) return { ok: false, msg: `❌ VLAN 20 ga kamida 2 ta qurilma ulangan bo'lishi kerak (hozir ${vlan20Ports.length} ta)` };

      return { ok: true, msg: '✅ VLAN segmentatsiyasi muvaffaqiyatli bajarildi!' };
    }
  },
  {
    id: 'q8',
    title: '🔄 Router-on-a-Stick (Inter-VLAN)',
    category: 'VLAN',
    description: `Router-on-a-Stick sozlamalarini quring:
• 1 ta Switch va 1 ta Router o'zaro Trunk kabeli orqali ulansin
• Routerda kamida 2 ta sub-interfeys (masalan Gi0/0.10 va Gi0/0.20) sozlang`,
    hint: 'Switch va Router o\'rtasidagi portni Trunk qiling (Shift+Klik). Routerda sub-interfeyslar qo\'shing.',
    maxScore: 35,
    validate() {
      const switches = [...devices.values()].filter(d => d.type === 'switch');
      const routers = [...devices.values()].filter(d => d.type === 'router');
      if (switches.length < 1 || routers.length < 1) return { ok: false, msg: '❌ Kamida 1 ta Switch va 1 ta Router kerak' };

      const sw = switches[0];
      const router = routers[0];

      // Switchda trunk port mavjudligi va routerga ulanganligi
      const trunkConn = [...connections.values()].find(c => {
        if ((c.a === sw.id && c.b === router.id) || (c.b === sw.id && c.a === router.id)) {
          const swPortId = (c.a === sw.id) ? c.portA : c.portB;
          const p = sw.ports ? sw.ports.find(x => x.id === swPortId) : null;
          return p && p.mode === 'trunk';
        }
        return false;
      });

      if (!trunkConn) return { ok: false, msg: '❌ Switch va Router o\'rtasidagi port Trunk rejimida bo\'lishi shart' };

      // Router sub-interfeyslari tekshiruvi
      const subKeys = router.subinterfaces ? Object.keys(router.subinterfaces) : [];
      if (subKeys.length < 2) return { ok: false, msg: `❌ Routerda kamida 2 ta sub-interfeys bo'lishi kerak (hozir ${subKeys.length} ta)` };

      return { ok: true, msg: '✅ Router-on-a-Stick konfiguratsiyasi a\'lo darajada bajarildi!' };
    }
  }
];

/* ---------- Quiz holati ---------- */
let quizActive       = false;
let quizCurrentTask  = null;
let quizScore        = 0;
let quizStartTime    = 0;
let quizTimerHandle  = null;
let quizCompletedIds = new Set();

/* ---------- Modal ochish/yopish ---------- */
function openQuizModal() {
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.add('show');
  renderQuizTaskList();
}

function closeQuizModal() {
  const modal = document.getElementById('quizModal');
  if (modal) modal.classList.remove('show');
  if (!quizActive) stopQuizTimer();
}

/* ---------- Vazifalar ro'yxati ---------- */
function renderQuizTaskList() {
  const container = document.getElementById('quizTaskList');
  if (!container) return;

  const total = QUIZ_TASKS.reduce((s, t) => s + t.maxScore, 0);
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <span style="font-size:12px;color:var(--ink-dim);">Ball: <b style="color:#00FF87;">${quizScore}</b> / ${total}</span>
      <span style="font-size:12px;color:var(--ink-dim);">Bajarilgan: ${quizCompletedIds.size}/${QUIZ_TASKS.length}</span>
    </div>
    ${QUIZ_TASKS.map(task => `
      <div class="quiz-task-card ${quizCompletedIds.has(task.id) ? 'completed' : ''}" onclick="startQuizTask('${task.id}')">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <div style="font-weight:700;font-size:13px;">${task.title}</div>
            <div style="font-size:10.5px;color:var(--ink-dim);margin-top:2px;">${task.category}</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:13px;font-weight:800;color:${quizCompletedIds.has(task.id) ? '#00FF87' : '#FFB454'};">
              ${quizCompletedIds.has(task.id) ? '✅' : task.maxScore + ' ball'}
            </div>
          </div>
        </div>
      </div>
    `).join('')}
  `;
}

/* ---------- Vazifani boshlash ---------- */
function startQuizTask(taskId) {
  const task = QUIZ_TASKS.find(t => t.id === taskId);
  if (!task) return;
  quizCurrentTask = task;
  quizActive      = true;
  quizStartTime   = Date.now();

  const detailEl = document.getElementById('quizTaskDetail');
  if (!detailEl) return;

  detailEl.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
      <button class="actbtn" style="font-size:10.5px;padding:4px 10px;" onclick="backToQuizList()">← Orqaga</button>
      <span id="quizTimer" style="font-family:'JetBrains Mono',monospace;font-size:13px;color:#FFB454;">00:00</span>
    </div>
    <div style="font-weight:800;font-size:15px;margin-bottom:8px;">${task.title}</div>
    <div class="quiz-description">${task.description}</div>
    ${task.hasInput ? `
      <div style="margin-top:10px;">
        <input type="number" id="quizAnswerInput" class="ip-field-input" placeholder="Javobingizni kiriting..." style="width:100%;box-sizing:border-box;">
      </div>
    ` : ''}
    <div style="margin-top:12px;display:flex;gap:8px;">
      <button class="actbtn" style="flex:1;font-size:11px;padding:6px;" onclick="showQuizHint('${task.id}')">💡 Ko'rsatma</button>
      <button class="actbtn on" style="flex:2;font-size:12px;padding:6px;font-weight:700;" onclick="checkQuizTask('${task.id}')">✓ Tekshirish</button>
    </div>
    <div id="quizFeedback" style="margin-top:10px;"></div>
  `;

  document.getElementById('quizTaskList').style.display = 'none';
  detailEl.style.display = 'block';

  startQuizTimer();
  toast(`🎓 Vazifa boshlandi: ${task.title}`);
}

function backToQuizList() {
  const detailEl = document.getElementById('quizTaskDetail');
  const listEl   = document.getElementById('quizTaskList');
  if (detailEl) detailEl.style.display = 'none';
  if (listEl)   listEl.style.display   = 'block';
  quizActive = false;
  stopQuizTimer();
  renderQuizTaskList();
}

/* ---------- Timer ---------- */
function startQuizTimer() {
  stopQuizTimer();
  quizTimerHandle = setInterval(() => {
    const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
    const m = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const s = String(elapsed % 60).padStart(2, '0');
    const el = document.getElementById('quizTimer');
    if (el) el.textContent = `${m}:${s}`;
  }, 1000);
}

function stopQuizTimer() {
  if (quizTimerHandle) { clearInterval(quizTimerHandle); quizTimerHandle = null; }
}

/* ---------- Tekshirish ---------- */
function checkQuizTask(taskId) {
  const task = QUIZ_TASKS.find(t => t.id === taskId);
  if (!task) return;

  const result  = task.validate();
  const feedEl  = document.getElementById('quizFeedback');
  const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);

  if (result.ok) {
    // Vaqt bonusi
    const timeBonus = elapsed < 60 ? 5 : elapsed < 120 ? 2 : 0;
    const earned    = quizCompletedIds.has(task.id) ? 0 : task.maxScore + timeBonus;
    quizScore      += earned;
    quizCompletedIds.add(task.id);
    stopQuizTimer();

    if (feedEl) feedEl.innerHTML = `
      <div style="background:rgba(0,255,135,0.1);border:1px solid rgba(0,255,135,0.4);border-radius:8px;padding:10px;text-align:center;">
        <div style="font-size:16px;margin-bottom:4px;">${result.msg}</div>
        <div style="color:#FFB454;font-size:12px;">+${earned} ball · ${Math.floor(elapsed/60)}:${String(elapsed%60).padStart(2,'0')}</div>
        ${timeBonus > 0 ? `<div style="color:#38BDF8;font-size:11px;">⚡ Tez bajarganingiz uchun +${timeBonus} bonus ball!</div>` : ''}
      </div>
    `;
    toast(`🎉 +${earned} ball! ${task.title} bajarildi!`);

    // Konfetti effekti
    setTimeout(() => {
      if (quizCompletedIds.size === QUIZ_TASKS.length) showQuizFinalResult();
    }, 1500);
  } else {
    if (feedEl) feedEl.innerHTML = `
      <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:10px;">
        <div>${result.msg}</div>
      </div>
    `;
  }
}

function showQuizHint(taskId) {
  const task = QUIZ_TASKS.find(t => t.id === taskId);
  if (task) toast(`💡 Ko'rsatma: ${task.hint}`);
}

/* ---------- Yakuniy natija ---------- */
function showQuizFinalResult() {
  const total   = QUIZ_TASKS.reduce((s, t) => s + t.maxScore, 0);
  const pct     = Math.round((quizScore / total) * 100);
  const grade   = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D';
  const gradeColor = pct >= 80 ? '#00FF87' : pct >= 60 ? '#FFB454' : '#EF4444';

  const modal = document.getElementById('quizModal');
  if (!modal) return;
  modal.querySelector('.modal-body').innerHTML = `
    <div style="text-align:center;padding:20px;">
      <div style="font-size:60px;margin-bottom:8px;">${pct >= 80 ? '🏆' : pct >= 60 ? '🎓' : '📚'}</div>
      <div style="font-size:28px;font-weight:800;color:${gradeColor};">${grade}</div>
      <div style="font-size:48px;font-weight:900;color:#00FF87;margin:8px 0;">${quizScore}</div>
      <div style="color:var(--ink-dim);font-size:14px;">/ ${total} ball (${pct}%)</div>
      <div style="margin-top:16px;font-size:14px;">
        ${pct >= 90 ? 'Ajoyib! Siz tarmoq mutaxassisisiz!' :
          pct >= 70 ? 'Yaxshi natija! Biroz mashq kerak.' :
          'Davom eting! Har bir urinish tajriba beradi.'}
      </div>
      <button class="actbtn on" style="margin-top:20px;padding:10px 24px;" onclick="resetQuiz()">🔄 Qayta boshlash</button>
    </div>
  `;
}

function resetQuiz() {
  quizScore        = 0;
  quizCompletedIds = new Set();
  quizCurrentTask  = null;
  quizActive       = false;
  stopQuizTimer();
  const modal = document.getElementById('quizModal');
  if (modal) {
    const body = modal.querySelector('.modal-body');
    if (body) body.innerHTML = `
      <div id="quizTaskList"></div>
      <div id="quizTaskDetail" style="display:none;"></div>
    `;
  }
  renderQuizTaskList();
}
