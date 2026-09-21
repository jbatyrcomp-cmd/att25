/* ==========================================================================
   ATT-25 AI DOSKA — AI BRAIN & GENERATOR (ai-engine.js)
   Prompt-to-Board Generator, Mindmap Builder, Doska Tahlilchisi va Gemini API
   ========================================================================== */

class AIBoardEngine {
  constructor(boardEngine) {
    this.board = boardEngine;
    this.mode = 'offline'; // 'offline' yoki 'gemini'
    this.apiKey = localStorage.getItem('att25_gemini_api_key') || '';
    this.model = 'gemini-1.5-flash';

    this.loadSettings();
  }

  loadSettings() {
    const savedMode = localStorage.getItem('att25_ai_mode');
    if (savedMode) this.mode = savedMode;

    const savedKey = localStorage.getItem('att25_gemini_api_key');
    if (savedKey) this.apiKey = savedKey;
  }

  saveApiKey(key) {
    this.apiKey = key.trim();
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

    // 1. Agar tayyor shablonlarga mos kelsa
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

    // 2. Mindmap (Aqliy daraxt) generatsiyasi
    if (genType === 'mindmap' || p.includes('mindmap') || p.includes('aql') || p.includes('reja')) {
      return this.buildMindmapTree(prompt, ox, oy);
    }

    // 3. Stikerlar klasteri (Sticky Cluster)
    if (genType === 'sticky_cluster' || p.includes('stiker') || p.includes('g\'oya')) {
      return this.buildStickyCluster(prompt, ox, oy);
    }

    // 4. Standart umumiy Blok-Sxema (Process Diagram)
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
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tahlil natijasi bo'sh.";
  }
}

window.AIBoardEngine = AIBoardEngine;
