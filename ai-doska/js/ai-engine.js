/* ==========================================================================
   ATT-25 AI DOSKA — AI BRAIN & GENERATOR (ai-engine.js)
   Prompt-to-Board Generator, Mindmap Builder, Doska Tahlilchisi va Gemini API
   ========================================================================== */

class AIBoardEngine {
  constructor(boardEngine) {
    this.board = boardEngine;
    this.defaultApiKey = '';
    this.apiKey = localStorage.getItem('att25_gemini_api_key') || '';
    this.mode = this.apiKey ? 'gemini' : 'smart-local';
    this.model = 'gemini-2.5-flash';

    this.loadSettings();
  }

  loadSettings() {
    const savedMode = localStorage.getItem('att25_ai_mode');
    const savedKey = localStorage.getItem('att25_gemini_api_key');
    this.apiKey = savedKey || '';
    this.mode = savedMode || (this.apiKey ? 'gemini' : 'smart-local');
  }

  saveApiKey(key) {
    this.apiKey = (key || '').trim();
    localStorage.setItem('att25_gemini_api_key', this.apiKey);
    if (this.apiKey) {
      this.mode = 'gemini';
      localStorage.setItem('att25_ai_mode', 'gemini');
    }
  }

  /* ==========================================================================
     PROMPT-TO-BOARD GENERATOR (MATNDAN DOSKAGA CHIZISH)
     ========================================================================== */
  async generateFromPrompt(prompt, genType = 'diagram') {
    prompt = prompt.trim();
    if (!prompt) throw new Error("Iltimos, AI ga buyruq (prompt) matnini kiriting!");

    // Markaziy dunyo koordinatalari
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const originX = Math.round(center.x);
    const originY = Math.round(center.y);

    // 1. Agar Gemini API yoqilgan va kalit bo'lsa
    if (this.mode === 'gemini' && this.apiKey) {
      try {
        const objects = await this.callGeminiForBoard(prompt, genType, originX, originY);
        if (objects && objects.length > 0) {
          this.board.saveState();
          objects.forEach(obj => this.board.addObject(obj, false));
          return { success: true, count: objects.length, mode: 'gemini' };
        }
      } catch (err) {
        console.warn('Gemini API xatosi, avtonom generatorga o‘tilmoqda:', err);
      }
    }

    // 2. Avtonom intellektual generator (Offline Mode)
    const objects = this.generateOffline(prompt, genType, originX, originY);
    if (objects && objects.length > 0) {
      this.board.saveState();
      objects.forEach(obj => this.board.addObject(obj, false));
      return { success: true, count: objects.length, mode: 'offline' };
    }

    throw new Error("Sxema generatsiya qilib bo‘lmadi.");
  }

  /* ==========================================================================
     OFFLINE AVTONOM INTELLEKTUAL GENERATOR
     ========================================================================== */
  generateOffline(prompt, genType, ox, oy) {
    const p = prompt.toLowerCase();

    // 1. Yangi kengaytirilgan IT & Muhandislik arxitekturalari
    if (p.includes('microservice') || p.includes('mikro') || p.includes('gateway')) {
      return this.buildMicroservicesDiagram(ox, oy);
    }
    if (p.includes('docker') || p.includes('k8s') || p.includes('kubernetes') || p.includes('konteyner')) {
      return this.buildDockerK8sDiagram(ox, oy);
    }
    if (p.includes('ci/cd') || p.includes('cicd') || p.includes('pipeline') || p.includes('devops')) {
      return this.buildCicdPipeline(ox, oy);
    }
    if (p.includes('git') || p.includes('branch') || p.includes('commit') || p.includes('git flow')) {
      return this.buildGitFlowDiagram(ox, oy);
    }
    if (p.includes('neyron') || p.includes('neural') || p.includes('deep learning') || p.includes('sun\'iy intellekt')) {
      return this.buildNeuralNetDiagram(ox, oy);
    }
    if (p.includes('sql') || p.includes('join') || p.includes('relyatsion')) {
      return this.buildSqlJoinsDiagram(ox, oy);
    }
    if (p.includes('load balancer') || p.includes('balans') || p.includes('nginx') || p.includes('proxy')) {
      return this.buildLoadBalancerDiagram(ox, oy);
    }
    if (p.includes('dns') || p.includes('domen') || p.includes('ip qidirish')) {
      return this.buildDnsResolutionDiagram(ox, oy);
    }

    // 2. Agar tayyor shablonlarga mos kelsa
    if (p.includes('osi') || p.includes('7 qatlam') || p.includes('qavat')) {
      return BoardTemplates.osi_model.generate(ox - 240, oy - 260);
    }
    if (p.includes('yulduz') || p.includes('star') || (p.includes('tarmoq') && p.includes('topologiya'))) {
      return BoardTemplates.star_topology.generate(ox, oy);
    }
    if (p.includes('client') || p.includes('server') || p.includes('mijoz')) {
      return BoardTemplates.client_server.generate(ox - 300, oy);
    }
    if (p.includes('handshake') || p.includes('tcp') || p.includes('syn')) {
      return BoardTemplates.tcp_handshake.generate(ox - 200, oy - 180);
    }
    if (p.includes('algoritm') || p.includes('flowchart') || p.includes('blok sxema')) {
      return BoardTemplates.flowchart.generate(ox, oy - 200);
    }
    if (p.includes('swot') || p.includes('kuchli') || p.includes('zaif')) {
      return BoardTemplates.swot.generate(ox - 240, oy - 160);
    }
    if (p.includes('formula') || p.includes('matematik') || p.includes('fizika') || p.includes('tenglama') || p.includes('pifagor') || p.includes('eynshteyn') || p.includes('integral')) {
      return BoardTemplates.math_formulas.generate(ox - 320, oy - 180);
    }

    // 3. Mindmap (Aqliy daraxt) generatsiyasi
    if (genType === 'mindmap' || p.includes('mindmap') || p.includes('aql') || p.includes('reja')) {
      return this.buildMindmapTree(prompt, ox, oy);
    }

    // 4. Stikerlar klasteri (Sticky Cluster)
    if (genType === 'sticky_cluster' || p.includes('stiker') || p.includes('g\'oya')) {
      return this.buildStickyCluster(prompt, ox, oy);
    }

    // 5. Standart umumiy Blok-Sxema (Process Diagram)
    return this.buildGeneralFlowDiagram(prompt, ox, oy);
  }

  // Aqliy Hujum (Mindmap) daraxtini qurish
  buildMindmapTree(topic, ox, oy) {
    const objects = [];
    // Markaziy mavzu tuguni
    const mainTitle = topic.length > 30 ? topic.substring(0, 28) + '...' : topic;
    objects.push({
      type: 'rect',
      x: ox - 110,
      y: oy - 35,
      width: 220,
      height: 70,
      color: '#00FF87',
      strokeWidth: 3,
      filled: true,
      fillColor: 'rgba(0, 255, 135, 0.2)'
    });
    objects.push({
      type: 'text',
      x: ox - 90,
      y: oy - 14,
      text: mainTitle,
      color: '#F8FAFC',
      fontSize: 16,
      fontWeight: 700
    });

    // Shoxlangan 4 ta asosiy yo'nalish
    const branches = [
      { title: 'Asosiy Tushunchalar', color: '#38BDF8', dx: -280, dy: -140 },
      { title: 'Amaliy Tatbiqi', color: '#10B981', dx: 240, dy: -140 },
      { title: 'Xavflar & Muammolar', color: '#F43F5E', dx: -280, dy: 140 },
      { title: 'Kelajak Rivoji', color: '#A855F7', dx: 240, dy: 140 }
    ];

    branches.forEach(b => {
      const bx = ox + b.dx;
      const by = oy + b.dy;

      // Bog'lovchi chiziq
      objects.push({
        type: 'arrow',
        x1: ox + (b.dx > 0 ? 110 : -110),
        y1: oy,
        x2: bx + (b.dx > 0 ? 0 : 180),
        y2: by + 30,
        color: b.color,
        strokeWidth: 2
      });

      // Shox stikeri
      objects.push({
        type: 'sticky',
        x: bx,
        y: by,
        width: 180,
        height: 100,
        bgColor: b.color === '#F43F5E' ? '#FECDD3' : (b.color === '#10B981' ? '#BBF7D0' : '#BAE6FD'),
        textColor: '#0F172A',
        text: `📌 ${b.title}\n• Muhim omil 1\n• Texnik xususiyat\n• Tahliliy natija`
      });
    });

    return objects;
  }

  // Stikerlar klasteri
  buildStickyCluster(topic, ox, oy) {
    const objects = [];
    const colors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FBCFE8', '#DDD6FE', '#FED7AA'];
    const titles = [
      'G‘oya 1: Dastlabki rejalashtirish',
      'G‘oya 2: Talablar tahlili',
      'G‘oya 3: Texnik arxitektura',
      'G‘oya 4: Ishlab chiqish va test',
      'G‘oya 5: Xavfsizlik auditi',
      'G‘oya 6: Foydalanuvchi sinovi'
    ];

    const cols = 3;
    const w = 170;
    const h = 130;
    const gap = 20;
    const startX = ox - ((cols * (w + gap)) / 2) + w / 2;
    const startY = oy - 140;

    titles.forEach((t, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (w + gap);
      const y = startY + row * (h + gap);

      objects.push({
        type: 'sticky',
        x: x,
        y: y,
        width: w,
        height: h,
        bgColor: colors[i % colors.length],
        textColor: '#1E293B',
        text: `💡 ${t}\n• Mas'ul shaxs tayinlash\n• Muddat va natijalar`
      });
    });

    return objects;
  }

  // Umumiy jarayon / Algoritm diagrammasi
  buildGeneralFlowDiagram(topic, ox, oy) {
    const objects = [];
    const steps = [
      { title: '1. Boshlanish va Kiruvchi Ma’lumotlar', color: '#38BDF8' },
      { title: '2. Ma’lumotlarni Qayta Ishlash va Filtrlash', color: '#10B981' },
      { title: '3. Tarmoq/Mantiqiy Qoidalar Tekshiruvi', color: '#F59E0B' },
      { title: '4. Natijani Saqlash va Chiqarish', color: '#8B5CF6' }
    ];

    const w = 260;
    const h = 54;
    const gap = 36;
    const startY = oy - ((steps.length * (h + gap)) / 2);

    steps.forEach((s, i) => {
      const y = startY + i * (h + gap);
      objects.push({
        type: 'rect',
        x: ox - w / 2,
        y: y,
        width: w,
        height: h,
        color: s.color,
        strokeWidth: 2,
        filled: true,
        fillColor: s.color + '25'
      });
      objects.push({
        type: 'text',
        x: ox - w / 2 + 16,
        y: y + 18,
        text: s.title,
        color: '#F8FAFC',
        fontSize: 13,
        fontWeight: 600
      });

      if (i < steps.length - 1) {
        objects.push({
          type: 'arrow',
          x1: ox,
          y1: y + h,
          x2: ox,
          y2: y + h + gap,
          color: '#64748B',
          strokeWidth: 2
        });
      }
    });

    return objects;
  }

  /* ==========================================================================
     ONLINE GEMINI API INTEGRATSIYASI
     ========================================================================== */
  async callGeminiForBoard(prompt, genType, ox, oy) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const systemPrompt = `Siz ATT-25 akademik portali uchun maxsus AI Doska diagramma generatorisiz.
Foydalanuvchi prompti bo'yicha doskada aks ettirish uchun JSON formatidagi ob'ektlar massivini yarating.
Faqat va faqat to'g'ri JSON qaytaring (markdown belgisiz yoki json so'zisiz).
Qo'llab-quvvatlanadigan ob'ekt tiplari:
- {"type": "rect", "x": raqam, "y": raqam, "width": raqam, "height": raqam, "color": hex, "strokeWidth": 2, "filled": true, "fillColor": "rgba(...)"}
- {"type": "circle", "x": raqam, "y": raqam, "radiusX": raqam, "radiusY": raqam, "color": hex, "strokeWidth": 2, "filled": true, "fillColor": "rgba(...)"}
- {"type": "arrow", "x1": raqam, "y1": raqam, "x2": raqam, "y2": raqam, "color": hex, "strokeWidth": 3}
- {"type": "line", "x1": raqam, "y1": raqam, "x2": raqam, "y2": raqam, "color": hex, "strokeWidth": 2}
- {"type": "sticky", "x": raqam, "y": raqam, "width": 180, "height": 130, "bgColor": "#FEF08A"|"#BAE6FD"|"#BBF7D0", "textColor": "#1E293B", "text": "matn"}
- {"type": "text", "x": raqam, "y": raqam, "text": "matn", "color": "#F8FAFC", "fontSize": 14, "fontWeight": 700}
- {"type": "formula", "x": raqam, "y": raqam, "latex": "a^2 + b^2 = c^2", "color": "#38BDF8", "fontSize": 26}
- {"type": "net_node", "x": raqam, "y": raqam, "nodeType": "router"|"switch"|"server"|"cloud"|"pc", "label": "nomi", "ip": "192.168.1.x"}

Markaz koordinatasi: (${ox}, ${oy}). Ob'ektlar bir-birini yopib qo'ymasligi, chiroyli tartibda joylashishi kerak.`;

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nFoydalanuvchi buyrug'i: "${prompt}" (Turi: ${genType})` }] }
      ]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API server xatosi: ${response.status}`);
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.objects && Array.isArray(parsed.objects)) return parsed.objects;

    throw new Error("Gemini kutilgan ob'ektlar massivini qaytarmadi.");
  }

  /* ==========================================================================
     DOSKANI TAHLIL QILISH VA KONSPEKT TUZISH
     ========================================================================== */
  async analyzeBoard(action = 'summarize') {
    const objects = this.board.objects;
    if (!objects || objects.length === 0) {
      return "⚠️ Doskada hali hech qanday element mavjud emas. Avval biror chizma, stiker yoki sxema joylashtiring.";
    }

    // Doskadagi matnli ma'lumotlarni to'plash
    const textPieces = [];
    objects.forEach(obj => {
      if (obj.type === 'text' && obj.text) textPieces.push(`[Matn]: ${obj.text}`);
      else if (obj.type === 'formula' && obj.latex) textPieces.push(`[Matematik Formula]: ${obj.latex}`);
      else if (obj.type === 'sticky' && obj.text) textPieces.push(`[Stiker]: ${obj.text}`);
      else if (obj.type === 'net_node') textPieces.push(`[Tarmoq Qurilmasi]: ${obj.label} (${obj.nodeType.toUpperCase()}) - ${obj.ip || ''}`);
      else if (['rect', 'circle', 'diamond'].includes(obj.type)) textPieces.push(`[Shakl]: ${obj.type}`);
    });

    // 1. Agar Gemini API mavjud bo'lsa
    if (this.mode === 'gemini' && this.apiKey) {
      try {
        return await this.callGeminiForAnalysis(textPieces.join('\n'), action);
      } catch (e) {
        console.warn('Gemini tahlil xatosi, offline tahlilga o‘tildi:', e);
      }
    }

    // 2. Offline Avtonom tahlilchi
    return this.analyzeOffline(objects, textPieces, action);
  }

  analyzeOffline(objects, textPieces, action) {
    const stCount = objects.filter(o => o.type === 'sticky').length;
    const netCount = objects.filter(o => o.type === 'net_node').length;
    const shapeCount = objects.filter(o => ['rect', 'circle', 'diamond', 'triangle'].includes(o.type)).length;
    const strokeCount = objects.filter(o => o.type === 'stroke').length;

    let res = '';
    if (action === 'summarize') {
      res = `📋 **DOSKA AKADEMIK KONSPEKTI**\n\n`;
      res += `• **Jami ob'ektlar:** ${objects.length} ta (Stikerlar: ${stCount}, Tarmoq tugunlari: ${netCount}, Shakllar: ${shapeCount}, Chizmalar: ${strokeCount})\n\n`;
      res += `**Asosiy mazmun va qaydlar:**\n`;
      if (textPieces.length > 0) {
        textPieces.slice(0, 8).forEach(tp => {
          res += `• ${tp}\n`;
        });
      } else {
        res += `• Doskada asosan grafik chizmalar va geometrik shakllar mavjud.\n`;
      }
      res += `\n**Xulosa:** Doskadagi tuzilma dars materiallari yoki tizim arxitekturasini tushuntirish uchun yetarli asosga ega.`;
    } else {
      res = `💡 **DOSKANI TUSHUNTIRISH VA ILMIY TAHLIL**\n\n`;
      res += `Doskada tuzilgan model quyidagi yo'nalishlarni qamrab olgan:\n`;
      if (netCount > 0) {
        res += `• **Tarmoq Infratuzilmasi:** ${netCount} ta qurilma o'rtasida ma'lumotlar almashinuvi topologiyasi ko'rsatilgan.\n`;
      }
      if (stCount > 0) {
        res += `• **Aqliy Hujum / Reja:** ${stCount} ta rangli stiker orqali asosiy vazifalar va bosqichlar klasterlangan.\n`;
      }
      res += `• **Tavsiya:** Bog'lovchi yo'naltiruvchi strelkalar orqali ma'lumotlar oqimini yanada oydinlashtirish mumkin.`;
    }
    return res;
  }

  async callGeminiForAnalysis(boardContent, action) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const prompt = action === 'summarize'
      ? `Quyida doskada yozilgan elementlar va matnlar keltirilgan. Ulardan ixcham, professional o'zbek tilida akademik konspekt va asosiy xulosalarni tayyorlab bering:\n\n${boardContent}`
      : `Quyidagi doska elementlarini ko'rib chiqib, ularning mazmunini talabaga dars o'tayotgan o'qituvchi kabi batafsil va tushunarli tushuntirib bering:\n\n${boardContent}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      })
    });

    if (!res.ok) throw new Error("Gemini javob bermadi: " + res.status);
    const data = await res.json();
  /* ==========================================================================
     YANGI IT VA MUHANDISLIK DIAGRAMMALARI GENERATORLARI
     ========================================================================== */
  buildMicroservicesDiagram(ox, oy) {
    const objects = [];
    // Client
    objects.push({ type: 'rect', x: ox - 320, y: oy - 25, width: 120, height: 50, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: ox - 305, y: oy + 6, text: 'Mijoz (Client)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });

    // Arrow to Gateway
    objects.push({ type: 'arrow', x1: ox - 200, y1: oy, x2: ox - 130, y2: oy, color: '#64748B', strokeWidth: 2 });

    // API Gateway
    objects.push({ type: 'rect', x: ox - 130, y: oy - 70, width: 100, height: 140, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
    objects.push({ type: 'text', x: ox - 120, y: oy - 20, text: 'API Gateway\n(Auth & Proxy)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    // 3 Services
    const services = [
      { name: 'Auth Service', y: oy - 90, color: '#10B981' },
      { name: 'Order Service', y: oy, color: '#8B5CF6' },
      { name: 'Payment Service', y: oy + 90, color: '#EC4899' }
    ];

    services.forEach(s => {
      objects.push({ type: 'arrow', x1: ox - 30, y1: oy, x2: ox + 40, y2: s.y, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'rect', x: ox + 40, y: s.y - 25, width: 140, height: 50, color: s.color, strokeWidth: 2, filled: true, fillColor: s.color + '25' });
      objects.push({ type: 'text', x: ox + 55, y: s.y + 6, text: s.name, color: '#F8FAFC', fontSize: 12, fontWeight: 700 });
      // DB
      objects.push({ type: 'arrow', x1: ox + 180, y1: s.y, x2: ox + 230, y2: s.y, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'circle', x: ox + 245, y: s.y, radiusX: 25, radiusY: 20, color: '#00FF87', strokeWidth: 2, filled: true, fillColor: 'rgba(0,255,135,0.2)' });
      objects.push({ type: 'text', x: ox + 237, y: s.y + 5, text: 'DB', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
    });

    return objects;
  }

  buildDockerK8sDiagram(ox, oy) {
    const objects = [];
    // Cluster Frame
    objects.push({ type: 'rect', x: ox - 280, y: oy - 140, width: 560, height: 280, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.05)' });
    objects.push({ type: 'text', x: ox - 260, y: oy - 110, text: '☸️ KUBERNETES KLASTER (K8s Cluster)', color: '#38BDF8', fontSize: 15, fontWeight: 700 });

    // Master Node
    objects.push({ type: 'rect', x: ox - 250, y: oy - 80, width: 220, height: 190, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.15)' });
    objects.push({ type: 'text', x: ox - 230, y: oy - 50, text: 'Control Plane (Master)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'text', x: ox - 230, y: oy - 20, text: '• API Server (kube-api)\n• etcd (Key-Value Store)\n• Scheduler\n• Controller Manager', color: '#94A3B8', fontSize: 11, fontWeight: 500 });

    // Worker Node
    objects.push({ type: 'rect', x: ox + 30, y: oy - 80, width: 220, height: 190, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.15)' });
    objects.push({ type: 'text', x: ox + 50, y: oy - 50, text: 'Worker Node (Compute)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'text', x: ox + 50, y: oy - 20, text: '• Kubelet & Kube-proxy\n• Container Runtime (Docker)\n• Pod 1: Nginx Frontend\n• Pod 2: Backend API', color: '#94A3B8', fontSize: 11, fontWeight: 500 });

    // Connection
    objects.push({ type: 'arrow', x1: ox - 30, y1: oy + 20, x2: ox + 30, y2: oy + 20, color: '#38BDF8', strokeWidth: 2 });

    return objects;
  }

  buildCicdPipeline(ox, oy) {
    const objects = [];
    const stages = [
      { name: '1. Git Code', icon: '💻', color: '#38BDF8' },
      { name: '2. Build', icon: '⚙️', color: '#F59E0B' },
      { name: '3. Test', icon: '🧪', color: '#10B981' },
      { name: '4. Release', icon: '📦', color: '#8B5CF6' },
      { name: '5. Deploy', icon: '🚀', color: '#EC4899' }
    ];

    const w = 100;
    const h = 70;
    const gap = 24;
    const totalW = stages.length * w + (stages.length - 1) * gap;
    const startX = ox - totalW / 2;

    stages.forEach((st, i) => {
      const x = startX + i * (w + gap);
      objects.push({ type: 'rect', x: x, y: oy - h / 2, width: w, height: h, color: st.color, strokeWidth: 2, filled: true, fillColor: st.color + '20' });
      objects.push({ type: 'text', x: x + 10, y: oy - 10, text: `${st.icon}\n${st.name}`, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

      if (i < stages.length - 1) {
        objects.push({ type: 'arrow', x1: x + w, y1: oy, x2: x + w + gap, y2: oy, color: '#64748B', strokeWidth: 2 });
      }
    });

    objects.push({
      type: 'sticky',
      x: ox - 180,
      y: oy + 60,
      width: 360,
      height: 70,
      bgColor: '#BAE6FD',
      textColor: '#0C4A6E',
      text: '📌 CI/CD Qoidasi: Har bir git push avtomatik testlanadi va muvaffaqiyatli o‘tsa ishlab chiqarishga (Production) yuklanadi.'
    });

    return objects;
  }

  buildGitFlowDiagram(ox, oy) {
    const objects = [];
    // Main branch
    objects.push({ type: 'line', x1: ox - 260, y1: oy - 60, x2: ox + 260, y2: oy - 60, color: '#38BDF8', strokeWidth: 3 });
    objects.push({ type: 'text', x: ox - 310, y: oy - 55, text: 'main', color: '#38BDF8', fontSize: 13, fontWeight: 700 });

    // Develop branch
    objects.push({ type: 'line', x1: ox - 260, y1: oy + 40, x2: ox + 260, y2: oy + 40, color: '#10B981', strokeWidth: 3 });
    objects.push({ type: 'text', x: ox - 325, y: oy + 45, text: 'develop', color: '#10B981', fontSize: 13, fontWeight: 700 });

    // Feature branch
    objects.push({ type: 'arrow', x1: ox - 180, y1: oy + 40, x2: ox - 100, y2: oy + 110, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'line', x1: ox - 100, y1: oy + 110, x2: ox + 60, y2: oy + 110, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 60, y1: oy + 110, x2: ox + 140, y2: oy + 40, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'text', x: ox - 50, y: oy + 130, text: 'feature/auth-login', color: '#F59E0B', fontSize: 12, fontWeight: 600 });

    // Commits (Circles)
    [-200, -80, 40, 160].forEach(cx => {
      objects.push({ type: 'circle', x: ox + cx, y: oy - 60, radiusX: 6, radiusY: 6, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: '#0F172A' });
      objects.push({ type: 'circle', x: ox + cx, y: oy + 40, radiusX: 6, radiusY: 6, color: '#10B981', strokeWidth: 2, filled: true, fillColor: '#0F172A' });
    });

    return objects;
  }

  buildNeuralNetDiagram(ox, oy) {
    const objects = [];
    const layers = [
      { name: 'Kirish (X)', count: 3, x: ox - 180, color: '#38BDF8' },
      { name: 'Yashirin (H)', count: 4, x: ox, color: '#10B981' },
      { name: 'Chiqish (Y)', count: 2, x: ox + 180, color: '#EC4899' }
    ];

    // Sarlavha
    objects.push({ type: 'text', x: ox - 130, y: oy - 130, text: '🧠 NEYRON TARMOQ ARXITEKTURASI (Perceptron)', color: '#00FF87', fontSize: 14, fontWeight: 700 });

    // Tugunlar
    const nodeCoords = [];
    layers.forEach((l, lIdx) => {
      nodeCoords[lIdx] = [];
      const startY = oy - ((l.count - 1) * 45) / 2;
      for (let i = 0; i < l.count; i++) {
        const y = startY + i * 45;
        nodeCoords[lIdx].push({ x: l.x, y });
        objects.push({ type: 'circle', x: l.x, y: y, radiusX: 16, radiusY: 16, color: l.color, strokeWidth: 2, filled: true, fillColor: l.color + '30' });
      }
      objects.push({ type: 'text', x: l.x - 30, y: oy + 100, text: l.name, color: l.color, fontSize: 11, fontWeight: 600 });
    });

    // Bog'lovchi vaznlar (Synaptic Weights)
    for (let l = 0; l < nodeCoords.length - 1; l++) {
      nodeCoords[l].forEach(p1 => {
        nodeCoords[l + 1].forEach(p2 => {
          objects.push({ type: 'line', x1: p1.x + 16, y1: p1.y, x2: p2.x - 16, y2: p2.y, color: 'rgba(255,255,255,0.15)', strokeWidth: 1 });
        });
      });
    }

    return objects;
  }

  buildSqlJoinsDiagram(ox, oy) {
    const objects = [];
    const joins = [
      { title: 'INNER JOIN', desc: 'A va B kesishmasi', x: ox - 200, y: oy - 90, color: '#10B981' },
      { title: 'LEFT JOIN', desc: 'A ning hammasi + B mos', x: ox + 60, y: oy - 90, color: '#38BDF8' },
      { title: 'RIGHT JOIN', desc: 'B ning hammasi + A mos', x: ox - 200, y: oy + 80, color: '#F59E0B' },
      { title: 'FULL OUTER', desc: 'A va B ning to\'liq birlashmasi', x: ox + 60, y: oy + 80, color: '#A855F7' }
    ];

    joins.forEach(j => {
      objects.push({ type: 'rect', x: j.x, y: j.y, width: 220, height: 110, color: j.color, strokeWidth: 2, filled: true, fillColor: j.color + '15' });
      objects.push({ type: 'text', x: j.x + 16, y: j.y + 24, text: j.title, color: j.color, fontSize: 14, fontWeight: 700 });
      objects.push({ type: 'text', x: j.x + 16, y: j.y + 50, text: `• ${j.desc}\n• SELECT * FROM A\n  JOIN B ON A.id = B.a_id;`, color: '#CBD5E1', fontSize: 10, fontWeight: 500 });
    });

    return objects;
  }

  buildLoadBalancerDiagram(ox, oy) {
    const objects = [];
    // Clients
    objects.push({ type: 'rect', x: ox - 300, y: oy - 20, width: 100, height: 40, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: ox - 285, y: oy + 5, text: 'Mijozlar (Traffic)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    // Arrow to LB
    objects.push({ type: 'arrow', x1: ox - 200, y1: oy, x2: ox - 120, y2: oy, color: '#64748B', strokeWidth: 2 });

    // Load Balancer (Nginx)
    objects.push({ type: 'rect', x: ox - 120, y: oy - 60, width: 110, height: 120, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
    objects.push({ type: 'text', x: ox - 110, y: oy - 20, text: '⚖️ Load Balancer\n(NGINX / HAProxy)\nRound Robin', color: '#F8FAFC', fontSize: 10, fontWeight: 700 });

    // Servers
    [-60, 0, 60].forEach((dy, idx) => {
      objects.push({ type: 'arrow', x1: ox - 10, y1: oy, x2: ox + 60, y2: oy + dy, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'rect', x: ox + 60, y: oy + dy - 20, width: 140, height: 40, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
      objects.push({ type: 'text', x: ox + 75, y: oy + dy + 5, text: `Web Server #${idx + 1}`, color: '#F8FAFC', fontSize: 11, fontWeight: 600 });
    });

    return objects;
  }

  buildDnsResolutionDiagram(ox, oy) {
    const objects = [];
    const steps = [
      { name: '1. Brauzer (URL so‘rovi)', role: 'Mijoz', x: ox - 260, y: oy - 40, color: '#38BDF8' },
      { name: '2. DNS Resolver (ISP)', role: 'Kesh & Qidiruv', x: ox - 80, y: oy - 40, color: '#10B981' },
      { name: '3. Root Server (.)', role: 'Bosh ildiz', x: ox + 120, y: oy - 100, color: '#F59E0B' },
      { name: '4. TLD Server (.uz)', role: 'Yuqori domen', x: ox + 120, y: oy - 20, color: '#8B5CF6' },
      { name: '5. Avtoritativ DNS', role: 'IP manzil qaytarish', x: ox + 120, y: oy + 60, color: '#00FF87' }
    ];

    steps.forEach(s => {
      objects.push({ type: 'rect', x: s.x, y: s.y, width: 140, height: 50, color: s.color, strokeWidth: 2, filled: true, fillColor: s.color + '20' });
      objects.push({ type: 'text', x: s.x + 10, y: s.y + 20, text: s.name, color: '#F8FAFC', fontSize: 10, fontWeight: 700 });
    });

    objects.push({ type: 'arrow', x1: ox - 120, y1: oy - 15, x2: ox - 80, y2: oy - 15, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 60, y1: oy - 15, x2: ox + 120, y2: oy - 75, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 60, y1: oy - 15, x2: ox + 120, y2: oy + 5, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 60, y1: oy - 15, x2: ox + 120, y2: oy + 85, color: '#64748B', strokeWidth: 2 });

    return objects;
  }

  /* ==========================================================================
     INTERAKTIV AI REPETITOR & CO-PILOT (CHAT ENGINE)
     ========================================================================== */
  async chatWithAssistant(userMessage, chatHistory = []) {
    const objects = this.board.objects || [];
    const boardSummary = objects.map(o => {
      if (o.type === 'text') return o.text;
      if (o.type === 'sticky') return o.text;
      if (o.type === 'net_node') return `${o.label} (${o.nodeType}, IP: ${o.ip || 'none'})`;
      if (o.type === 'formula') return o.latex;
      return o.type;
    }).slice(0, 15).join('; ');

    // 1. Agar Gemini yoqilgan bo'lsa
    if (this.mode === 'gemini' && this.apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const sysPrompt = `Siz universitet talabalari va o'qituvchilari uchun ATT-25 AI Doskasi ichidagi do'stona, ilmiy jihatdan kuchli AI Repetitorsiz (Co-pilot).
Hozirda doskada quyidagi elementlar mavjud: [${boardSummary || 'Doska toza'}].
Foydalanuvchining savoliga o'zbek tilida, tushunarli, dalillar bilan, kerak bo'lsa LaTeX formula yoki qisqa kod namunalari bilan javob bering.`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${sysPrompt}\n\nFoydalanuvchi: ${userMessage}` }] }
            ]
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) return { reply: replyText, mode: 'gemini' };
        }
      } catch (e) {
        console.warn('Gemini chat xatosi, avtonom repetitorga o‘tildi:', e);
      }
    }

    // 2. Offline Avtonom AI Repetitor
    const q = userMessage.toLowerCase();
    let reply = '';

    if (q.includes('salom') || q.includes('assalomu')) {
      reply = "Assalomu alaykum! Men AI Doska repetitoringizman. Doskadagi chizmalar, tarmoq arxitekturasi, matematika yoki dasturlash bo'yicha savollaringiz bo'lsa, bajonidil yordam beraman.";
    } else if (q.includes('osi') || q.includes('tarmoq')) {
      reply = "🌐 **Tarmoq va OSI Modeli:**\nOSI modeli 7 qatlamdan iborat: Fizik, Kanal, Tarmoq (IP), Transport (TCP/UDP), Seans, Taqdimot va Ilova (HTTP/DNS). Har bir qatlam o‘z protokoliga ega bo‘lib, ma'lumotlar inkapsulyatsiya qilinadi.";
    } else if (q.includes('tenglama') || q.includes('matematik') || q.includes('hosila')) {
      reply = "🧮 **Matematik Yordam:**\nDoskada matematik tenglamalarni yechish uchun pastki menyudan 'Formulalar' vositasini tanlashingiz yoki menga formulani yuborishingiz mumkin. Kvadrat tenglamalar diskriminant orqali ($D = b^2 - 4ac$) oson yechiladi.";
    } else if (q.includes('xavfsizlik') || q.includes('dmz') || q.includes('firewall')) {
      reply = "🛡️ **Tarmoq Xavfsizligi:**\nDMZ (Demilitarized Zone) tashqi dunyo bilan bevosita aloqa qiluvchi serverlarni (Web, Mail) ichki maxfiy LAN tarmog'idan xavfsizlik devori (Firewall) orqali ajratib turadi. Bu ichki ma'lumotlar bazasini xakerlik xurujlaridan himoyalaydi.";
    } else {
      reply = `💡 **AI Repetitor Maslahati:**\n"${userMessage}" mavzusi bo'yicha doskada tuzilgan tuzilma: [${boardSummary ? boardSummary.substring(0, 80) + '...' : 'yangi doska'}].\nQo'shimcha tafsilotlarni doskaga yangi stiker yoki diagramma sifatida joylashtirishingiz mumkin.`;
    }

    return { reply, mode: 'offline' };
  }

  // Chatdagi xabarni doskaga stiker yoki matn qilib joylash
  insertChatResponseToBoard(text) {
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '');
    const stickyObj = {
      type: 'sticky',
      x: Math.round(center.x - 140),
      y: Math.round(center.y - 80),
      width: 280,
      height: 160,
      bgColor: '#FEF08A',
      textColor: '#1E293B',
      text: `🤖 AI KONSPEKTI:\n${cleanText.substring(0, 220)}${cleanText.length > 220 ? '...' : ''}`
    };

    this.board.saveState();
    this.board.addObject(stickyObj);
    this.board.selectedObject = stickyObj;
    return stickyObj;
  }

  /* ==========================================================================
     DOSKADAN AVTOMATIK TEST / QUIZ GENERATORI
     ========================================================================== */
  async generateQuizFromBoard() {
    const objects = this.board.objects || [];
    let topic = 'UMUMIY ILMIY BILIM';
    let question = 'Doskadagi elementlar asosida asosiy xususiyat qaysi?';
    let options = ['To‘g‘ri arxitektura', 'Tizim xatoligi', 'Protokol yetishmovchiligi', 'Standart model'];
    let correctIndex = 0;
    let explanation = 'Doskadagi tuzilma asosiy standart talablarga to‘liq mos keladi.';

    const objTypes = objects.map(o => o.type);
    const texts = objects.filter(o => o.text).map(o => o.text.toLowerCase()).join(' ');

    if (texts.includes('osi') || texts.includes('router') || objTypes.includes('net_node')) {
      topic = 'TARMOQ VA PROTOKOLLAR';
      question = 'OSI modelida ma’lumotlarni marshrutlash (routing) qaysi qatlamda amalga oshiriladi?';
      options = ['1-Qatlam (Fizik)', '2-Qatlam (Kanal)', '3-Qatlam (Tarmoq)', '4-Qatlam (Transport)'];
      correctIndex = 2;
      explanation = 'Marshrutlash (Routing) va IP manzillash faqat 3-qatlamda (Tarmoq qatlamida) ishlaydi.';
    } else if (texts.includes('microservice') || texts.includes('gateway')) {
      topic = 'MIKROXIZMATLAR ARXITEKTURASI';
      question = 'Mikroxizmatlar arxitekturasida API Gateway qanday asosiy vazifani bajaradi?';
      options = ['Faqat ma\'lumot saqlash', 'Trafikni yo\'naltirish va autentifikatsiya', 'Dasturni kompilyatsiya qilish', 'Operatsion tizimni boshqarish'];
      correctIndex = 1;
      explanation = 'API Gateway barcha kiruvchi so‘rovlarni markazlashtirilgan tarzda qabul qiladi va tegishli mikroxizmatlarga taqsimlaydi.';
    } else if (objTypes.includes('formula') || texts.includes('x^2') || texts.includes('tenglama')) {
      topic = 'MATEMATIKA VA TENGLAMALAR';
      question = 'Kvadrat tenglamada diskriminant musbat (D > 0) bo‘lsa, ildizlar soni nechta?';
      options = ['0 ta haqiqiy ildiz', '1 ta karrali ildiz', '2 ta turli haqiqiy ildiz', 'Cheksiz ko‘p'];
      correctIndex = 2;
      explanation = 'D > 0 da tenglama har doim ikkita haqiqiy x1 va x2 ildizga ega bo‘ladi.';
    }

    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const quizCard = {
      type: 'quiz_card',
      x: Math.round(center.x - 180),
      y: Math.round(center.y - 120),
      width: 360,
      topic,
      question,
      options,
      correctIndex,
      selectedIndex: null,
      revealed: false,
      explanation
    };

    this.board.saveState();
    this.board.addObject(quizCard);
    this.board.selectedObject = quizCard;
    return { success: true, topic, question };
  }

  /* ==========================================================================
     DOSKA MANTIQINI TEKSHIRISH (VALIDATOR & SANITY CHECK)
     ========================================================================== */
  validateBoardLogic() {
    const objects = this.board.objects || [];
    const findings = [];

    const netNodes = objects.filter(o => o.type === 'net_node');
    const arrows = objects.filter(o => o.type === 'arrow');
    const shapes = objects.filter(o => ['rect', 'circle', 'diamond'].includes(o.type));

    // 1. IP manzillar to'qnashuvi (IP Conflict)
    const ips = {};
    netNodes.forEach(node => {
      if (node.ip) {
        if (ips[node.ip]) {
          findings.push({
            type: 'warning',
            title: 'IP Manzillar To‘qnashuvi (Conflict)!',
            message: `"${node.label}" va "${ips[node.ip]}" bir xil IP manzilga ega (${node.ip}). Tarmoqda bu jiddiy xatolik keltirib chiqaradi.`
          });
        } else {
          ips[node.ip] = node.label;
        }
      }
    });

    // 2. Tarmoq ulanishlari yo'qligi
    if (netNodes.length > 1 && arrows.length === 0) {
      findings.push({
        type: 'warning',
        title: 'Ulanmagan Qurilmalar',
        message: `Doskada ${netNodes.length} ta tarmoq qurilmasi mavjud, ammo ular o‘rtasida aloqa kanallari (chiziq/strelkalar) chizilmagan.`
      });
    }

    // 3. Algoritm blok-sxemasi tekshiruvi
    const diamonds = shapes.filter(s => s.type === 'diamond');
    if (diamonds.length > 0 && arrows.length < diamonds.length) {
      findings.push({
        type: 'info',
        title: 'Tugallanmagan Shartli Tarmoqlanish',
        message: 'Blok-sxemadagi shart romblaridan (diamond) "Ha" va "Yo‘q" yo‘nalishlari to‘liq chiqarilmagan bo‘lishi mumkin.'
      });
    }

    if (findings.length === 0) {
      findings.push({
        type: 'success',
        title: 'Mantiqiy Xatoliklar Topilmadi',
        message: 'Barcha tarmoq qurilmalari va bloklar to‘g‘ri joylashtirilgan, IP manzillar to‘qnashuvi yo‘q.'
      });
    }

    return findings;
  }

  /* ==========================================================================
     CHIZMALARNI TEKISLASH VA GO'ZALLASHTIRISH (SMART BEAUTIFIER & AUTO-ALIGN)
     ========================================================================== */
  beautifyAndAlign() {
    const objects = this.board.objects || [];
    if (objects.length < 2) return 0;

    this.board.saveState();
    let count = 0;

    // Faqat pozitsiyaga ega asosiy ob'ektlarni tekislash (rect, sticky, net_node, quiz_card)
    const alignables = objects.filter(o => ['rect', 'sticky', 'net_node', 'quiz_card', 'circle'].includes(o.type));
    if (alignables.length === 0) return 0;

    // Gridga (20px qadam) magnitlash
    alignables.forEach(obj => {
      if (typeof obj.x === 'number') {
        obj.x = Math.round(obj.x / 20) * 20;
        count++;
      }
      if (typeof obj.y === 'number') {
        obj.y = Math.round(obj.y / 20) * 20;
      }
    });

    // Strelkalarni to'g'rilash (agar deyarli gorizontal yoki vertikal bo'lsa)
    objects.filter(o => o.type === 'arrow' || o.type === 'line').forEach(arrow => {
      const dx = Math.abs(arrow.x2 - arrow.x1);
      const dy = Math.abs(arrow.y2 - arrow.y1);
      if (dx < 15) {
        arrow.x2 = arrow.x1; // Mukammal vertikal
        count++;
      } else if (dy < 15) {
        arrow.y2 = arrow.y1; // Mukammal gorizontal
        count++;
      }
    });

    this.board.render();
    return count;
  }
}

window.AIBoardEngine = AIBoardEngine;
