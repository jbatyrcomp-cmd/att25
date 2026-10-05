/* ==========================================================================
   ATT-25 AI DOSKA — AI BRAIN v3.0 (ai-engine.js)
   Kengaytirilgan Offline AI, 20+ Yangi Diagrammalar, Smart Chat, Gemini Streaming
   ========================================================================== */

class AIBoardEngine {
  constructor(boardEngine) {
    this.board = boardEngine;
    this.apiKey = localStorage.getItem('att25_gemini_api_key') || '';
    this.mode = this.apiKey ? 'gemini' : 'offline';
    this.model = 'gemini-2.5-flash';

    // Suhbat tarixi (dialog memory)
    this.chatHistory = [];
    this.MAX_HISTORY = 20;

    // AI tavsiya holati
    this.suggestionEnabled = true;
    this.lastSuggestionTime = 0;

    this.loadSettings();
  }

  loadSettings() {
    const savedKey = localStorage.getItem('att25_gemini_api_key');
    const savedMode = localStorage.getItem('att25_ai_mode');
    this.apiKey = savedKey || '';
    this.mode = savedMode || (this.apiKey ? 'gemini' : 'offline');
  }

  saveApiKey(key) {
    this.apiKey = (key || '').trim();
    localStorage.setItem('att25_gemini_api_key', this.apiKey);
    if (this.apiKey) {
      this.mode = 'gemini';
      localStorage.setItem('att25_ai_mode', 'gemini');
    }
  }

  clearHistory() {
    this.chatHistory = [];
  }

  /* ==========================================================================
     PROMPT-TO-BOARD GENERATOR
     ========================================================================== */
  async generateFromPrompt(prompt, genType = 'diagram') {
    prompt = prompt.trim();
    if (!prompt) throw new Error("Iltimos, AI ga buyruq (prompt) matnini kiriting!");

    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const originX = Math.round(center.x);
    const originY = Math.round(center.y);

    if (this.mode === 'gemini' && this.apiKey) {
      try {
        const objects = await this.callGeminiForBoard(prompt, genType, originX, originY);
        if (objects && objects.length > 0) {
          this.board.saveState();
          objects.forEach(obj => this.board.addObject(obj, false));
          return { success: true, count: objects.length, mode: 'gemini' };
        }
      } catch (err) {
        console.warn('Gemini API xatosi, avtonom generatorga o\'tilmoqda:', err);
      }
    }

    const objects = this.generateOffline(prompt, genType, originX, originY);
    if (objects && objects.length > 0) {
      this.board.saveState();
      objects.forEach(obj => this.board.addObject(obj, false));
      return { success: true, count: objects.length, mode: 'offline' };
    }

    throw new Error("Sxema generatsiya qilib bo'lmadi.");
  }

  /* ==========================================================================
     KENGAYTIRILGAN OFFLINE GENERATOR — 30+ PATTERN
     ========================================================================== */
  generateOffline(prompt, genType, ox, oy) {
    const p = prompt.toLowerCase();

    // ── 0. Subnetting & VLSM Kalkulyator (ATT-25) ─────────────────────────────
    if (p.includes('subnet') || p.includes('cidr') || p.includes('vlsm') || p.includes('ip hisob') || p.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2}\b/)) {
      if (typeof window !== 'undefined' && window.SubnetCalculator) {
        const m = p.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*[\/ ]\s*(\d{1,2})/);
        const ip = m ? m[1] : '192.168.1.0';
        const cidr = m ? parseInt(m[2], 10) : 26;
        const calc = window.SubnetCalculator.calculate(ip, cidr);
        if (p.includes('topolog') || p.includes('sxema') || p.includes('tarmoq')) {
          return window.SubnetCalculator.generateNetworkTopology(calc, ox, oy);
        }
        return window.SubnetCalculator.generateBoardTable(calc, ox - 270, oy - 165);
      }
    }

    // ── 0b. Texnik Taqqoslash Jadvallari (Comparison Tables) ──────────────────
    if (p.includes('vs') || p.includes('solishtir') || p.includes('taqqos') || p.includes('farq') || p.includes('jadval')) {
      if (typeof window !== 'undefined' && window.ComparisonTablesEngine) {
        if (p.includes('tcp') || p.includes('udp')) return window.ComparisonTablesEngine.generateBoardTable('tcp_vs_udp', ox - 360, oy - 180);
        if (p.includes('osi') || p.includes('tcp/ip') || p.includes('tcpip')) return window.ComparisonTablesEngine.generateBoardTable('osi_vs_tcpip', ox - 360, oy - 180);
        if (p.includes('ipv4') || p.includes('ipv6')) return window.ComparisonTablesEngine.generateBoardTable('ipv4_vs_ipv6', ox - 360, oy - 180);
        if (p.includes('sql') || p.includes('nosql')) return window.ComparisonTablesEngine.generateBoardTable('sql_vs_nosql', ox - 360, oy - 180);
        if (p.includes('simmetrik') || p.includes('asimmetrik') || p.includes('kripto') || p.includes('shifr')) return window.ComparisonTablesEngine.generateBoardTable('crypto_sym_asym', ox - 360, oy - 180);
        if (p.includes('http1') || p.includes('http2') || p.includes('http3') || p.includes('http/')) return window.ComparisonTablesEngine.generateBoardTable('http1_vs_http2_vs_http3', ox - 360, oy - 180);
        if (p.includes('rest') || p.includes('graphql') || p.includes('grpc')) return window.ComparisonTablesEngine.generateBoardTable('rest_vs_graphql_vs_grpc', ox - 360, oy - 180);
      }
    }

    // ── 0c. Yangi Qo'shilgan Shablonlar ────────────────────────────────────────
    if (p.includes('multi-area') || p.includes('area 0') || p.includes('abr') || (p.includes('ospf') && p.includes('arxitektura')))
      return BoardTemplates.ospf_architecture ? BoardTemplates.ospf_architecture.generate(ox, oy) : this.buildOspfBgpDiagram(ox, oy);
    if (p.includes('pki') || p.includes('raqamli imzo') || p.includes('digital signature') || (p.includes('imzo') && p.includes('kripto')))
      return BoardTemplates.pki_cryptography ? BoardTemplates.pki_cryptography.generate(ox, oy) : this.buildOAuthJwtDiagram(ox, oy);
    if (p.includes('webrtc') || p.includes('video call') || p.includes('p2p video') || p.includes('stun') || p.includes('turn'))
      return BoardTemplates.webrtc_call ? BoardTemplates.webrtc_call.generate(ox, oy) : this.buildMessageQueueDiagram(ox, oy);
    if (p.includes('gitops') || p.includes('argocd') || (p.includes('devops') && p.includes('k8s')))
      return BoardTemplates.cicd_gitops ? BoardTemplates.cicd_gitops.generate(ox, oy) : this.buildCicdPipeline(ox, oy);
    if (p.includes('zero trust') || p.includes('zero-trust') || p.includes('ztna') || p.includes('sifr ishonch'))
      return BoardTemplates.zero_trust_security ? BoardTemplates.zero_trust_security.generate(ox, oy) : this.buildZeroTrustDiagram(ox, oy);

    // ── IT Arxitekturalar ─────────────────────────────────────────────────────
    if (p.includes('microservice') || p.includes('mikro') || p.includes('gateway'))
      return this.buildMicroservicesDiagram(ox, oy);
    if (p.includes('docker') || p.includes('k8s') || p.includes('kubernetes') || p.includes('konteyner'))
      return this.buildDockerK8sDiagram(ox, oy);
    if (p.includes('ci/cd') || p.includes('cicd') || p.includes('pipeline') || p.includes('devops'))
      return this.buildCicdPipeline(ox, oy);
    if (p.includes('git') || p.includes('branch') || p.includes('commit') || p.includes('git flow'))
      return this.buildGitFlowDiagram(ox, oy);

    // ── Yangi IT ──────────────────────────────────────────────────────────────
    if (p.includes('ospf') || p.includes('rip') || p.includes('bgp') || p.includes('marshrutlash protokol'))
      return this.buildOspfBgpDiagram(ox, oy);
    if (p.includes('rest api') || p.includes('api dizayn') || p.includes('http metod') || p.includes('endpoint'))
      return this.buildRestApiDiagram(ox, oy);
    if (p.includes('oauth') || p.includes('jwt') || p.includes('autentifikatsiya') || p.includes('token'))
      return this.buildOAuthJwtDiagram(ox, oy);
    if (p.includes('cloud') || p.includes('aws') || p.includes('azure') || p.includes('bulut'))
      return this.buildCloudArchDiagram(ox, oy);
    if (p.includes('cache') || p.includes('redis') || p.includes('memcached') || p.includes('kesh'))
      return this.buildCachingDiagram(ox, oy);
    if (p.includes('kafka') || p.includes('message queue') || p.includes('rabbitmq') || p.includes('navbat'))
      return this.buildMessageQueueDiagram(ox, oy);
    if (p.includes('vlan') || p.includes('kommutatsiya') || p.includes('switch') || p.includes('trunk'))
      return this.buildVlanDiagram(ox, oy);
    if (p.includes('dhcp') || p.includes('ip berish') || p.includes('ip discovery'))
      return this.buildDhcpDiagram(ox, oy);
    if (p.includes('ssl') || p.includes('tls') || p.includes('https') || p.includes('shifrlash'))
      return this.buildTlsHandshakeDiagram(ox, oy);
    if (p.includes('erd') || p.includes('entity') || p.includes('ma\'lumotlar bazasi diagramma') || p.includes('mb'))
      return this.buildErdDiagram(ox, oy);

    // ── Ilmiy / Matematik ─────────────────────────────────────────────────────
    if (p.includes('neyron') || p.includes('neural') || p.includes('deep learning') || p.includes('sun\'iy intellekt'))
      return this.buildNeuralNetDiagram(ox, oy);
    if (p.includes('sql') || p.includes('join') || p.includes('relyatsion'))
      return this.buildSqlJoinsDiagram(ox, oy);
    if (p.includes('big o') || p.includes('o(n') || p.includes('murakkablik') || p.includes('algoritmlar tahlil'))
      return this.buildBigODiagram(ox, oy);
    if (p.includes('sorting') || p.includes('saralash') || p.includes('quicksort') || p.includes('mergesort'))
      return this.buildSortingAlgosDiagram(ox, oy);

    // ── Mavjud kengaytirilgan ─────────────────────────────────────────────────
    if (p.includes('load balancer') || p.includes('balans') || p.includes('nginx') || p.includes('proxy'))
      return this.buildLoadBalancerDiagram(ox, oy);
    if (p.includes('dns') || p.includes('domen') || p.includes('ip qidirish'))
      return this.buildDnsResolutionDiagram(ox, oy);

    // ── Shablon asosida ───────────────────────────────────────────────────────
    if (p.includes('osi') || p.includes('7 qatlam') || p.includes('qavat'))
      return BoardTemplates.osi_model.generate(ox - 240, oy - 260);
    if (p.includes('yulduz') || p.includes('star') || (p.includes('tarmoq') && p.includes('topologiya')))
      return BoardTemplates.star_topology.generate(ox, oy);
    if (p.includes('client') || p.includes('server') || p.includes('mijoz'))
      return BoardTemplates.client_server.generate(ox - 300, oy);
    if (p.includes('handshake') || p.includes('tcp') || p.includes('syn'))
      return BoardTemplates.tcp_handshake.generate(ox - 200, oy - 180);
    if (p.includes('algoritm') || p.includes('flowchart') || p.includes('blok sxema'))
      return BoardTemplates.flowchart.generate(ox, oy - 200);
    if (p.includes('swot') || p.includes('kuchli') || p.includes('zaif'))
      return BoardTemplates.swot.generate(ox - 240, oy - 160);
    if (p.includes('formula') || p.includes('matematik') || p.includes('fizika') || p.includes('tenglama'))
      return BoardTemplates.math_formulas.generate(ox - 320, oy - 180);


    // ── Mindmap / Stiker ──────────────────────────────────────────────────────
    if (genType === 'mindmap' || p.includes('mindmap') || p.includes('aql') || p.includes('reja'))
      return this.buildMindmapTree(prompt, ox, oy);
    if (genType === 'sticky_cluster' || p.includes('stiker') || p.includes('g\'oya'))
      return this.buildStickyCluster(prompt, ox, oy);

    // ── Umumiy ────────────────────────────────────────────────────────────────
    return this.buildGeneralFlowDiagram(prompt, ox, oy);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // YANGI DIAGRAMMALAR
  // ──────────────────────────────────────────────────────────────────────────

  buildOspfBgpDiagram(ox, oy) {
    const objects = [];
    const routers = [
      { label: 'R1\nAS 65001', x: ox - 240, y: oy - 60, color: '#38BDF8', ip: '10.1.1.1' },
      { label: 'R2\nABR', x: ox, y: oy - 100, color: '#10B981', ip: '10.1.1.2' },
      { label: 'R3\nAS 65002', x: ox + 240, y: oy - 60, color: '#F59E0B', ip: '10.2.1.1' },
      { label: 'R4\nArea 0\nBackbone', x: ox, y: oy + 80, color: '#EC4899', ip: '10.0.0.1' },
    ];
    objects.push({ type: 'text', x: ox - 200, y: oy - 170, text: '🌐 OSPF Multi-Area + eBGP Marshrutlash Arxitekturasi', color: '#00FF87', fontSize: 14, fontWeight: 700 });
    // Area 0 frame
    objects.push({ type: 'rect', x: ox - 80, y: oy - 140, width: 160, height: 60, color: '#38BDF8', strokeWidth: 1, filled: true, fillColor: 'rgba(56,189,248,0.06)' });
    objects.push({ type: 'text', x: ox - 60, y: oy - 120, text: 'OSPF Area 0 (Backbone)', color: '#38BDF8', fontSize: 10, fontWeight: 600 });

    routers.forEach(r => {
      objects.push({ type: 'net_node', x: r.x, y: r.y, nodeType: 'router', label: r.label, ip: r.ip });
    });
    // Links
    [[0,1],[1,2],[0,3],[1,3],[2,3]].forEach(([a,b]) => {
      objects.push({ type: 'line', x1: routers[a].x, y1: routers[a].y, x2: routers[b].x, y2: routers[b].y, color: '#334155', strokeWidth: 2 });
    });
    // BGP label
    objects.push({ type: 'sticky', x: ox + 100, y: oy + 80, width: 200, height: 90, bgColor: '#BBF7D0', textColor: '#064E3B', text: '📌 eBGP:\n• AS 65001 ↔ AS 65002\n• Tashqi marshrutlash\n• Route Policy' });
    return objects;
  }

  buildZeroTrustDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 220, y: oy - 190, text: '🛡️ Zero-Trust Network Architecture (ZTNA)', color: '#F43F5E', fontSize: 14, fontWeight: 700 });

    const zones = [
      { name: 'Foydalanuvchi\n(Identity Verified)', x: ox - 300, y: oy - 30, color: '#38BDF8' },
      { name: 'Identity Provider\n(IdP / SSO)', x: ox - 140, y: oy - 80, color: '#A855F7' },
      { name: 'Policy Engine\n(PDP)', x: ox, y: oy - 30, color: '#F59E0B' },
      { name: 'Himoyalangan\nResurslar', x: ox + 200, y: oy - 30, color: '#10B981' },
      { name: 'SIEM &\nMonitoring', x: ox, y: oy + 110, color: '#EC4899' },
    ];

    zones.forEach(z => {
      objects.push({ type: 'rect', x: z.x, y: z.y, width: 130, height: 60, color: z.color, strokeWidth: 2, filled: true, fillColor: z.color + '20' });
      objects.push({ type: 'text', x: z.x + 10, y: z.y + 12, text: z.name, color: '#F8FAFC', fontSize: 10, fontWeight: 700 });
    });

    objects.push({ type: 'arrow', x1: ox - 170, y1: oy, x2: ox - 140, y2: oy - 60, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox - 10, y1: oy - 50, x2: ox, y2: oy - 20, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 130, y1: oy, x2: ox + 200, y2: oy, color: '#10B981', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 65, y1: oy + 30, x2: ox + 65, y2: oy + 110, color: '#64748B', strokeWidth: 2 });

    objects.push({ type: 'sticky', x: ox - 300, y: oy + 100, width: 240, height: 80, bgColor: '#FECDD3', textColor: '#9F1239', text: '🔑 Qoidalar:\n• Hech kimga ishonma, doim tekshir\n• mTLS + MFA majburiy\n• Mikrosegmentatsiya' });
    return objects;
  }

  buildRestApiDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 200, y: oy - 180, text: '🔌 REST API Dizayn: HTTP Metodlar va Endpoint\'lar', color: '#38BDF8', fontSize: 14, fontWeight: 700 });

    const client = { x: ox - 280, y: oy - 20 };
    objects.push({ type: 'rect', x: client.x, y: client.y, width: 100, height: 40, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: client.x + 12, y: client.y + 14, text: 'Mijoz (Client)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    const server = { x: ox + 160, y: oy - 20 };
    objects.push({ type: 'rect', x: server.x, y: server.y, width: 110, height: 40, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
    objects.push({ type: 'text', x: server.x + 10, y: server.y + 14, text: 'API Server', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    const methods = [
      { method: 'GET /users', color: '#10B981', desc: 'Ma\'lumot olish (200 OK)', dy: -90 },
      { method: 'POST /users', color: '#38BDF8', desc: 'Yangi yaratish (201 Created)', dy: -40 },
      { method: 'PUT /users/:id', color: '#F59E0B', desc: 'To\'liq yangilash (200 OK)', dy: 10 },
      { method: 'PATCH /users/:id', color: '#A855F7', desc: 'Qisman yangilash (200 OK)', dy: 60 },
      { method: 'DELETE /users/:id', color: '#F43F5E', desc: 'O\'chirish (204 No Content)', dy: 110 },
    ];

    methods.forEach(m => {
      const y = oy + m.dy;
      objects.push({ type: 'arrow', x1: ox - 180, y1: y, x2: ox + 160, y2: y, color: m.color, strokeWidth: 2 });
      objects.push({ type: 'text', x: ox - 170, y: y - 14, text: m.method, color: m.color, fontSize: 11, fontWeight: 700 });
      objects.push({ type: 'text', x: ox - 170, y: y + 4, text: m.desc, color: '#94A3B8', fontSize: 10, fontWeight: 500 });
    });

    return objects;
  }

  buildOAuthJwtDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 250, y: oy - 200, text: '🔐 OAuth 2.0 + JWT Token Autentifikatsiya Oqimi', color: '#A855F7', fontSize: 14, fontWeight: 700 });

    const nodes = [
      { name: 'Foydalanuvchi', x: ox - 280, y: oy - 20, color: '#38BDF8' },
      { name: 'Ilova (Client)', x: ox - 60, y: oy - 90, color: '#F59E0B' },
      { name: 'Auth Server\n(IdP)', x: ox + 160, y: oy - 20, color: '#A855F7' },
      { name: 'Resource Server\n(API)', x: ox - 60, y: oy + 100, color: '#10B981' },
    ];

    nodes.forEach(n => {
      objects.push({ type: 'rect', x: n.x, y: n.y, width: 130, height: 55, color: n.color, strokeWidth: 2, filled: true, fillColor: n.color + '20' });
      objects.push({ type: 'text', x: n.x + 10, y: n.y + 14, text: n.name, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
    });

    const steps = [
      { label: '①Login so\'rovi', x1: ox - 150, y1: oy, x2: ox - 60, y2: oy - 70, color: '#38BDF8' },
      { label: '②Auth Code', x1: ox + 60, y1: oy - 60, x2: ox + 160, y2: oy, color: '#A855F7' },
      { label: '③Access Token (JWT)', x1: ox + 160, y1: oy + 35, x2: ox + 70, y2: oy - 60, color: '#10B981' },
      { label: '④API so\'rovi + Bearer', x1: ox + 50, y1: oy - 35, x2: ox + 50, y2: oy + 100, color: '#F59E0B' },
    ];

    steps.forEach(s => {
      objects.push({ type: 'arrow', x1: s.x1, y1: s.y1, x2: s.x2, y2: s.y2, color: s.color, strokeWidth: 2 });
      objects.push({ type: 'text', x: Math.min(s.x1, s.x2) - 10, y: (s.y1 + s.y2) / 2 - 6, text: s.label, color: s.color, fontSize: 10, fontWeight: 600 });
    });

    objects.push({ type: 'sticky', x: ox - 280, y: oy + 110, width: 220, height: 80, bgColor: '#DDD6FE', textColor: '#4C1D95', text: '🔑 JWT Tuzilmasi:\nHeader.Payload.Signature\nExpiry: iat + exp claim\nHS256 / RS256 algoritm' });
    return objects;
  }

  buildCloudArchDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 230, y: oy - 210, text: '☁️ Bulut Arxitekturasi (AWS / Azure / GCP)', color: '#38BDF8', fontSize: 14, fontWeight: 700 });

    // CDN
    objects.push({ type: 'rect', x: ox - 300, y: oy - 140, width: 100, height: 45, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
    objects.push({ type: 'text', x: ox - 295, y: oy - 124, text: '🌐 CDN', color: '#F8FAFC', fontSize: 12, fontWeight: 700 });

    // Load Balancer
    objects.push({ type: 'rect', x: ox - 100, y: oy - 140, width: 100, height: 45, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: ox - 95, y: oy - 124, text: '⚖️ ALB', color: '#F8FAFC', fontSize: 12, fontWeight: 700 });

    // App instances
    [oy - 50, oy + 20, oy + 90].forEach((y, i) => {
      objects.push({ type: 'rect', x: ox + 60, y: y, width: 130, height: 40, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
      objects.push({ type: 'text', x: ox + 72, y: y + 14, text: `🖥️ App Server #${i+1}`, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
      objects.push({ type: 'arrow', x1: ox, y1: oy - 117, x2: ox + 60, y2: y + 20, color: '#64748B', strokeWidth: 2 });
    });

    // DB
    objects.push({ type: 'net_node', x: ox + 240, y: oy + 20, nodeType: 'server', label: '🗄️ RDS (DB)', ip: '10.0.3.5' });

    // S3 / Storage
    objects.push({ type: 'rect', x: ox - 300, y: oy + 60, width: 110, height: 45, color: '#A855F7', strokeWidth: 2, filled: true, fillColor: 'rgba(168,85,247,0.2)' });
    objects.push({ type: 'text', x: ox - 295, y: oy + 74, text: '🗃️ Object Storage\n(S3/Blob)', color: '#F8FAFC', fontSize: 10, fontWeight: 700 });

    objects.push({ type: 'arrow', x1: ox - 200, y1: oy - 117, x2: ox - 100, y2: oy - 117, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 200, y1: oy + 40, x2: ox + 240, y2: oy + 40, color: '#64748B', strokeWidth: 2 });

    return objects;
  }

  buildCachingDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 200, y: oy - 170, text: '⚡ Kesh Arxitekturasi: Redis + CDN + DB', color: '#F59E0B', fontSize: 14, fontWeight: 700 });

    const client = [ox - 260, oy];
    const cache = [ox, oy - 60];
    const db = [ox, oy + 70];
    const cdn = [ox + 200, oy - 60];

    [
      { x: client[0], y: client[1], w: 100, h: 40, label: 'Mijoz', color: '#38BDF8' },
      { x: cache[0], y: cache[1], w: 140, h: 40, label: '⚡ Redis Cache\n(In-Memory)', color: '#F59E0B' },
      { x: db[0], y: db[1], w: 140, h: 40, label: '🗄️ PostgreSQL DB\n(Disk)', color: '#10B981' },
      { x: cdn[0], y: cdn[1], w: 140, h: 40, label: '🌐 CDN Edge\n(Cloudflare)', color: '#A855F7' },
    ].forEach(b => {
      objects.push({ type: 'rect', x: b.x, y: b.y, width: b.w, height: b.h, color: b.color, strokeWidth: 2, filled: true, fillColor: b.color + '20' });
      objects.push({ type: 'text', x: b.x + 8, y: b.y + 10, text: b.label, color: '#F8FAFC', fontSize: 10, fontWeight: 700 });
    });

    objects.push({ type: 'arrow', x1: ox - 160, y1: oy, x2: ox, y2: oy - 40, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 70, y1: oy - 40, x2: ox + 200, y2: oy - 40, color: '#A855F7', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 70, y1: oy - 20, x2: ox + 70, y2: oy + 70, color: '#64748B', strokeWidth: 2 });

    objects.push({ type: 'sticky', x: ox - 260, y: oy + 80, width: 240, height: 80, bgColor: '#FEF08A', textColor: '#713F12', text: '📌 Kesh Strategiyasi:\n• Cache-Aside (Lazy loading)\n• Write-Through / Write-Back\n• TTL: 60–3600 sekund' });
    return objects;
  }

  buildMessageQueueDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 220, y: oy - 170, text: '📨 Message Queue: Kafka / RabbitMQ Arxitekturasi', color: '#EC4899', fontSize: 14, fontWeight: 700 });

    const prod = [ox - 280, oy - 30];
    const broker = [ox - 60, oy - 70];
    const consumers = [[ox + 160, oy - 90], [ox + 160, oy], [ox + 160, oy + 90]];

    objects.push({ type: 'rect', x: prod[0], y: prod[1], width: 120, height: 40, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: prod[0] + 10, y: prod[1] + 14, text: '📤 Producer', color: '#F8FAFC', fontSize: 12, fontWeight: 700 });

    objects.push({ type: 'rect', x: broker[0], y: broker[1], width: 160, height: 110, color: '#EC4899', strokeWidth: 2, filled: true, fillColor: 'rgba(236,72,153,0.15)' });
    objects.push({ type: 'text', x: broker[0] + 10, y: broker[1] + 20, text: '⚡ Kafka Broker\nTopic: events\nPartitions: 3', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    consumers.forEach((c, i) => {
      objects.push({ type: 'rect', x: c[0], y: c[1], width: 140, height: 40, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
      objects.push({ type: 'text', x: c[0] + 10, y: c[1] + 14, text: `📥 Consumer #${i+1}`, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
      objects.push({ type: 'arrow', x1: broker[0] + 160, y1: oy - 20, x2: c[0], y2: c[1] + 20, color: '#64748B', strokeWidth: 2 });
    });

    objects.push({ type: 'arrow', x1: prod[0] + 120, y1: prod[1] + 20, x2: broker[0], y2: broker[1] + 55, color: '#38BDF8', strokeWidth: 2 });
    return objects;
  }

  buildVlanDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 200, y: oy - 200, text: '🔀 VLAN Segmentatsiya va Trunk Arxitekturasi', color: '#38BDF8', fontSize: 14, fontWeight: 700 });

    // Core switch
    objects.push({ type: 'net_node', x: ox, y: oy - 80, nodeType: 'switch', label: 'Core Switch\n(L3)', ip: '10.0.0.254' });

    // VLANs
    const vlans = [
      { id: 10, name: 'VLAN 10\nManagement', color: '#38BDF8', x: ox - 220, ip: '192.168.10.0/24' },
      { id: 20, name: 'VLAN 20\nUsers', color: '#10B981', x: ox, ip: '192.168.20.0/24' },
      { id: 30, name: 'VLAN 30\nServers', color: '#F59E0B', x: ox + 220, ip: '192.168.30.0/24' },
    ];

    vlans.forEach(v => {
      objects.push({ type: 'rect', x: v.x - 70, y: oy + 40, width: 140, height: 60, color: v.color, strokeWidth: 2, filled: true, fillColor: v.color + '20' });
      objects.push({ type: 'text', x: v.x - 55, y: oy + 55, text: v.name, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
      objects.push({ type: 'text', x: v.x - 60, y: oy + 80, text: v.ip, color: '#94A3B8', fontSize: 9, fontWeight: 500 });
      objects.push({ type: 'line', x1: ox, y1: oy - 40, x2: v.x, y2: oy + 40, color: '#334155', strokeWidth: 2 });
    });

    objects.push({ type: 'sticky', x: ox - 280, y: oy + 130, width: 200, height: 70, bgColor: '#BAE6FD', textColor: '#0C4A6E', text: '📌 802.1Q Trunk:\n• Tagged paketlar\n• STP BPDU\n• Inter-VLAN Routing' });
    return objects;
  }

  buildDhcpDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 210, y: oy - 190, text: '📋 DHCP Discovery Jarayoni (4 Bosqich)', color: '#10B981', fontSize: 14, fontWeight: 700 });

    const client = { x: ox - 240, y: oy };
    const server = { x: ox + 180, y: oy };

    objects.push({ type: 'net_node', x: client.x, y: client.y, nodeType: 'pc', label: 'DHCP Mijoz', ip: '0.0.0.0' });
    objects.push({ type: 'net_node', x: server.x, y: server.y, nodeType: 'server', label: 'DHCP Server', ip: '192.168.1.1' });

    const steps = [
      { label: '① DISCOVER (Broadcast 255.255.255.255)', dy: -100, color: '#38BDF8', dir: 1 },
      { label: '② OFFER (192.168.1.100 taklif)', dy: -60, color: '#10B981', dir: -1 },
      { label: '③ REQUEST (IP manzilni so\'rash)', dy: -20, color: '#F59E0B', dir: 1 },
      { label: '④ ACK (Tasdiqlash + DNS/Gateway)', dy: 20, color: '#EC4899', dir: -1 },
    ];

    steps.forEach(s => {
      const fromX = s.dir === 1 ? client.x + 50 : server.x;
      const toX = s.dir === 1 ? server.x : client.x + 50;
      objects.push({ type: 'arrow', x1: fromX, y1: oy + s.dy, x2: toX, y2: oy + s.dy, color: s.color, strokeWidth: 2 });
      objects.push({ type: 'text', x: ox - 160, y: oy + s.dy - 14, text: s.label, color: s.color, fontSize: 10, fontWeight: 600 });
    });

    return objects;
  }

  buildTlsHandshakeDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 240, y: oy - 200, text: '🔒 TLS 1.3 Handshake Jarayoni (HTTPS)', color: '#10B981', fontSize: 14, fontWeight: 700 });

    const client = { x: ox - 240, y: oy - 140 };
    const server = { x: ox + 180, y: oy - 140 };

    objects.push({ type: 'rect', x: client.x, y: client.y, width: 110, height: 40, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: client.x + 12, y: client.y + 14, text: 'Brauzer (Client)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    objects.push({ type: 'rect', x: server.x, y: server.y, width: 110, height: 40, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.2)' });
    objects.push({ type: 'text', x: server.x + 12, y: server.y + 14, text: 'HTTPS Server', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    const steps = [
      { label: '① ClientHello (TLS 1.3 + Cipher Suites)', dy: -60, dir: 1, color: '#38BDF8' },
      { label: '② ServerHello + Certificate + Finished', dy: -10, dir: -1, color: '#10B981' },
      { label: '③ Client Finished (Key Confirmed)', dy: 40, dir: 1, color: '#F59E0B' },
      { label: '④ Shifrlangan HTTP so\'rov (AES-256-GCM)', dy: 90, dir: 1, color: '#A855F7' },
    ];

    steps.forEach(s => {
      const fromX = s.dir === 1 ? client.x + 110 : server.x;
      const toX = s.dir === 1 ? server.x : client.x + 110;
      objects.push({ type: 'arrow', x1: fromX, y1: oy + s.dy, x2: toX, y2: oy + s.dy, color: s.color, strokeWidth: 2 });
      objects.push({ type: 'text', x: ox - 150, y: oy + s.dy - 14, text: s.label, color: s.color, fontSize: 10, fontWeight: 600 });
    });

    objects.push({ type: 'formula', x: ox - 210, y: oy + 150, latex: '\\text{ECDHE} \\Rightarrow K_{session} = g^{ab} \\mod p', color: '#00FF87', fontSize: 18 });
    return objects;
  }

  buildErdDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 200, y: oy - 200, text: '🗄️ Entity-Relationship Diagram (ERD)', color: '#F59E0B', fontSize: 14, fontWeight: 700 });

    const entities = [
      { name: 'TALABALAR\n─────────\n🔑 id (PK)\n📧 email\n👤 ism\n📅 sana', x: ox - 240, y: oy - 100, color: '#38BDF8' },
      { name: 'FANLAR\n─────────\n🔑 id (PK)\n📚 nomi\n🔢 kredit', x: ox + 80, y: oy - 100, color: '#10B981' },
      { name: 'BAHOLAR\n─────────\n🔑 id (PK)\n🔗 talaba_id (FK)\n🔗 fan_id (FK)\n⭐ baho', x: ox - 70, y: oy + 80, color: '#F59E0B' },
    ];

    entities.forEach(e => {
      objects.push({ type: 'rect', x: e.x, y: e.y, width: 150, height: 120, color: e.color, strokeWidth: 2, filled: true, fillColor: e.color + '15' });
      objects.push({ type: 'text', x: e.x + 10, y: e.y + 16, text: e.name, color: '#F8FAFC', fontSize: 10, fontWeight: 600 });
    });

    // Relations
    objects.push({ type: 'line', x1: ox - 90, y1: oy + 20, x2: ox - 90, y2: oy + 80, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'text', x: ox - 140, y: oy + 50, text: '1:N', color: '#F59E0B', fontSize: 12, fontWeight: 700 });
    objects.push({ type: 'line', x1: ox + 80, y1: oy + 20, x2: ox + 5, y2: oy + 80, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'text', x: ox + 50, y: oy + 50, text: '1:N', color: '#10B981', fontSize: 12, fontWeight: 700 });

    return objects;
  }

  buildBigODiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 220, y: oy - 180, text: '📊 Big-O Notatsiyasi: Algoritmlar Murakkabligi', color: '#10B981', fontSize: 14, fontWeight: 700 });

    const complexities = [
      { name: 'O(1)', desc: 'O\'zgarmas vaqt\nMassiv indeks kirish', color: '#10B981', y: oy - 100 },
      { name: 'O(log n)', desc: 'Logarifmik\nIkkili qidiruv (BST)', color: '#38BDF8', y: oy - 40 },
      { name: 'O(n)', desc: 'Chiziqli\nChiziqli qidiruv', color: '#F59E0B', y: oy + 20 },
      { name: 'O(n log n)', desc: 'Kvazi-chiziqli\nMergeSort, HeapSort', color: '#A855F7', y: oy + 80 },
      { name: 'O(n²)', desc: 'Kvadratik\nBubble, Selection Sort', color: '#EC4899', y: oy + 140 },
      { name: 'O(2ⁿ)', desc: 'Eksponensial\nRecursive Fibonacci', color: '#F43F5E', y: oy + 200 },
    ];

    complexities.forEach((c, i) => {
      const barWidth = Math.min(20 + i * 60, 380);
      objects.push({ type: 'rect', x: ox - 200, y: c.y, width: barWidth, height: 32, color: c.color, strokeWidth: 1, filled: true, fillColor: c.color + '30' });
      objects.push({ type: 'text', x: ox - 195, y: c.y + 10, text: c.name, color: c.color, fontSize: 13, fontWeight: 700 });
      objects.push({ type: 'text', x: ox - 200 + barWidth + 10, y: c.y + 10, text: c.desc, color: '#94A3B8', fontSize: 10, fontWeight: 500 });
    });

    objects.push({ type: 'sticky', x: ox + 200, y: oy - 80, width: 200, height: 100, bgColor: '#BBF7D0', textColor: '#064E3B', text: '✅ Yaxshi algoritmlar:\nO(1) ≤ O(log n) ≤ O(n)\n\n❌ Qochish kerak:\nO(n²), O(2ⁿ)' });
    return objects;
  }

  buildSortingAlgosDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'text', x: ox - 200, y: oy - 180, text: '🔢 Saralash Algoritmlari Taqqoslama Jadval', color: '#38BDF8', fontSize: 14, fontWeight: 700 });

    const algos = [
      { name: 'Bubble Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: '#F43F5E' },
      { name: 'Selection Sort', best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: '#F59E0B' },
      { name: 'Insertion Sort', best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', color: '#A855F7' },
      { name: 'Merge Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', color: '#10B981' },
      { name: 'Quick Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', color: '#38BDF8' },
      { name: 'Heap Sort', best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', color: '#00FF87' },
    ];

    // Header
    ['Algoritm', 'Yaxshi', "O'rtacha", 'Yomon', 'Xotira'].forEach((h, i) => {
      objects.push({ type: 'rect', x: ox - 220 + i * 120, y: oy - 140, width: 120, height: 28, color: '#334155', strokeWidth: 1, filled: true, fillColor: 'rgba(51,65,85,0.8)' });
      objects.push({ type: 'text', x: ox - 215 + i * 120, y: oy - 128, text: h, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
    });

    algos.forEach((a, i) => {
      const y = oy - 112 + i * 34;
      const bg = i % 2 === 0 ? 'rgba(30,41,59,0.6)' : 'rgba(15,23,42,0.6)';
      [a.name, a.best, a.avg, a.worst, a.space].forEach((val, j) => {
        objects.push({ type: 'rect', x: ox - 220 + j * 120, y: y, width: 120, height: 30, color: j === 0 ? a.color : '#334155', strokeWidth: 1, filled: true, fillColor: j === 0 ? a.color + '20' : bg });
        objects.push({ type: 'text', x: ox - 215 + j * 120, y: y + 10, text: val, color: j === 0 ? a.color : '#E2E8F0', fontSize: 10, fontWeight: j === 0 ? 700 : 500 });
      });
    });

    return objects;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // MAVJUD DIAGRAMMALAR (o'zgarishsiz)
  // ──────────────────────────────────────────────────────────────────────────

  buildMindmapTree(topic, ox, oy) {
    const objects = [];
    const mainTitle = topic.length > 30 ? topic.substring(0, 28) + '...' : topic;
    objects.push({ type: 'rect', x: ox - 110, y: oy - 35, width: 220, height: 70, color: '#00FF87', strokeWidth: 3, filled: true, fillColor: 'rgba(0, 255, 135, 0.2)' });
    objects.push({ type: 'text', x: ox - 90, y: oy - 14, text: mainTitle, color: '#F8FAFC', fontSize: 16, fontWeight: 700 });

    const branches = [
      { title: 'Asosiy Tushunchalar', color: '#38BDF8', dx: -280, dy: -140 },
      { title: 'Amaliy Tatbiqi', color: '#10B981', dx: 240, dy: -140 },
      { title: 'Xavflar & Muammolar', color: '#F43F5E', dx: -280, dy: 140 },
      { title: 'Kelajak Rivoji', color: '#A855F7', dx: 240, dy: 140 }
    ];

    branches.forEach(b => {
      const bx = ox + b.dx;
      const by = oy + b.dy;
      objects.push({ type: 'arrow', x1: ox + (b.dx > 0 ? 110 : -110), y1: oy, x2: bx + (b.dx > 0 ? 0 : 180), y2: by + 30, color: b.color, strokeWidth: 2 });
      objects.push({ type: 'sticky', x: bx, y: by, width: 180, height: 100, bgColor: b.color === '#F43F5E' ? '#FECDD3' : (b.color === '#10B981' ? '#BBF7D0' : '#BAE6FD'), textColor: '#0F172A', text: `📌 ${b.title}\n• Muhim omil 1\n• Texnik xususiyat\n• Tahliliy natija` });
    });

    return objects;
  }

  buildStickyCluster(topic, ox, oy) {
    const objects = [];
    const colors = ['#FEF08A', '#BAE6FD', '#BBF7D0', '#FBCFE8', '#DDD6FE', '#FED7AA'];
    const titles = [
      "G'oya 1: Dastlabki rejalashtirish",
      "G'oya 2: Talabalar tahlili",
      "G'oya 3: Texnik arxitektura",
      "G'oya 4: Ishlab chiqish va test",
      "G'oya 5: Xavfsizlik auditi",
      "G'oya 6: Foydalanuvchi sinovi"
    ];

    const cols = 3, w = 170, h = 130, gap = 20;
    const startX = ox - ((cols * (w + gap)) / 2) + w / 2;
    const startY = oy - 140;

    titles.forEach((t, i) => {
      objects.push({ type: 'sticky', x: startX + (i % cols) * (w + gap), y: startY + Math.floor(i / cols) * (h + gap), width: w, height: h, bgColor: colors[i % colors.length], textColor: '#1E293B', text: `💡 ${t}\n• Mas'ul shaxs tayinlash\n• Muddat va natijalar` });
    });

    return objects;
  }

  buildGeneralFlowDiagram(topic, ox, oy) {
    const objects = [];
    const steps = [
      { title: '1. Boshlanish va Kiruvchi Ma\'lumotlar', color: '#38BDF8' },
      { title: '2. Ma\'lumotlarni Qayta Ishlash va Filtrlash', color: '#10B981' },
      { title: '3. Tarmoq/Mantiqiy Qoidalar Tekshiruvi', color: '#F59E0B' },
      { title: '4. Natijani Saqlash va Chiqarish', color: '#8B5CF6' }
    ];
    const w = 260, h = 54, gap = 36;
    const startY = oy - ((steps.length * (h + gap)) / 2);

    steps.forEach((s, i) => {
      const y = startY + i * (h + gap);
      objects.push({ type: 'rect', x: ox - w / 2, y: y, width: w, height: h, color: s.color, strokeWidth: 2, filled: true, fillColor: s.color + '25' });
      objects.push({ type: 'text', x: ox - w / 2 + 16, y: y + 18, text: s.title, color: '#F8FAFC', fontSize: 13, fontWeight: 600 });
      if (i < steps.length - 1)
        objects.push({ type: 'arrow', x1: ox, y1: y + h, x2: ox, y2: y + h + gap, color: '#64748B', strokeWidth: 2 });
    });

    return objects;
  }

  buildMicroservicesDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'rect', x: ox - 320, y: oy - 25, width: 120, height: 50, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: ox - 305, y: oy + 6, text: 'Mijoz (Client)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'arrow', x1: ox - 200, y1: oy, x2: ox - 130, y2: oy, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'rect', x: ox - 130, y: oy - 70, width: 100, height: 140, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
    objects.push({ type: 'text', x: ox - 120, y: oy - 20, text: 'API Gateway\n(Auth & Proxy)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });

    const services = [
      { name: 'Auth Service', y: oy - 90, color: '#10B981' },
      { name: 'Order Service', y: oy, color: '#8B5CF6' },
      { name: 'Payment Service', y: oy + 90, color: '#EC4899' }
    ];

    services.forEach(s => {
      objects.push({ type: 'arrow', x1: ox - 30, y1: oy, x2: ox + 40, y2: s.y, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'rect', x: ox + 40, y: s.y - 25, width: 140, height: 50, color: s.color, strokeWidth: 2, filled: true, fillColor: s.color + '25' });
      objects.push({ type: 'text', x: ox + 55, y: s.y + 6, text: s.name, color: '#F8FAFC', fontSize: 12, fontWeight: 700 });
      objects.push({ type: 'arrow', x1: ox + 180, y1: s.y, x2: ox + 230, y2: s.y, color: '#64748B', strokeWidth: 2 });
      objects.push({ type: 'circle', x: ox + 245, y: s.y, radiusX: 25, radiusY: 20, color: '#00FF87', strokeWidth: 2, filled: true, fillColor: 'rgba(0,255,135,0.2)' });
      objects.push({ type: 'text', x: ox + 237, y: s.y + 5, text: 'DB', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
    });

    return objects;
  }

  buildDockerK8sDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'rect', x: ox - 280, y: oy - 140, width: 560, height: 280, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.05)' });
    objects.push({ type: 'text', x: ox - 260, y: oy - 110, text: '☸️ KUBERNETES KLASTER (K8s Cluster)', color: '#38BDF8', fontSize: 15, fontWeight: 700 });
    objects.push({ type: 'rect', x: ox - 250, y: oy - 80, width: 220, height: 190, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.15)' });
    objects.push({ type: 'text', x: ox - 230, y: oy - 50, text: 'Control Plane (Master)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'text', x: ox - 230, y: oy - 20, text: '• API Server (kube-api)\n• etcd (Key-Value Store)\n• Scheduler\n• Controller Manager', color: '#94A3B8', fontSize: 11, fontWeight: 500 });
    objects.push({ type: 'rect', x: ox + 30, y: oy - 80, width: 220, height: 190, color: '#10B981', strokeWidth: 2, filled: true, fillColor: 'rgba(16,185,129,0.15)' });
    objects.push({ type: 'text', x: ox + 50, y: oy - 50, text: 'Worker Node (Compute)', color: '#F8FAFC', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'text', x: ox + 50, y: oy - 20, text: '• Kubelet & Kube-proxy\n• Container Runtime (Docker)\n• Pod 1: Nginx Frontend\n• Pod 2: Backend API', color: '#94A3B8', fontSize: 11, fontWeight: 500 });
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
    const w = 100, h = 70, gap = 24;
    const totalW = stages.length * w + (stages.length - 1) * gap;
    const startX = ox - totalW / 2;

    stages.forEach((st, i) => {
      const x = startX + i * (w + gap);
      objects.push({ type: 'rect', x, y: oy - h / 2, width: w, height: h, color: st.color, strokeWidth: 2, filled: true, fillColor: st.color + '20' });
      objects.push({ type: 'text', x: x + 10, y: oy - 10, text: `${st.icon}\n${st.name}`, color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
      if (i < stages.length - 1)
        objects.push({ type: 'arrow', x1: x + w, y1: oy, x2: x + w + gap, y2: oy, color: '#64748B', strokeWidth: 2 });
    });

    objects.push({ type: 'sticky', x: ox - 180, y: oy + 60, width: 360, height: 70, bgColor: '#BAE6FD', textColor: '#0C4A6E', text: "📌 CI/CD Qoidasi: Har bir git push avtomatik testlanadi va muvaffaqiyatli o'tsa Production'ga yuklanadi." });
    return objects;
  }

  buildGitFlowDiagram(ox, oy) {
    const objects = [];
    objects.push({ type: 'line', x1: ox - 260, y1: oy - 60, x2: ox + 260, y2: oy - 60, color: '#38BDF8', strokeWidth: 3 });
    objects.push({ type: 'text', x: ox - 310, y: oy - 55, text: 'main', color: '#38BDF8', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'line', x1: ox - 260, y1: oy + 40, x2: ox + 260, y2: oy + 40, color: '#10B981', strokeWidth: 3 });
    objects.push({ type: 'text', x: ox - 325, y: oy + 45, text: 'develop', color: '#10B981', fontSize: 13, fontWeight: 700 });
    objects.push({ type: 'arrow', x1: ox - 180, y1: oy + 40, x2: ox - 100, y2: oy + 110, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'line', x1: ox - 100, y1: oy + 110, x2: ox + 60, y2: oy + 110, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'arrow', x1: ox + 60, y1: oy + 110, x2: ox + 140, y2: oy + 40, color: '#F59E0B', strokeWidth: 2 });
    objects.push({ type: 'text', x: ox - 50, y: oy + 130, text: 'feature/auth-login', color: '#F59E0B', fontSize: 12, fontWeight: 600 });
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
    objects.push({ type: 'text', x: ox - 130, y: oy - 130, text: '🧠 NEYRON TARMOQ ARXITEKTURASI (Perceptron)', color: '#00FF87', fontSize: 14, fontWeight: 700 });

    const nodeCoords = [];
    layers.forEach((l, lIdx) => {
      nodeCoords[lIdx] = [];
      const startY = oy - ((l.count - 1) * 45) / 2;
      for (let i = 0; i < l.count; i++) {
        const y = startY + i * 45;
        nodeCoords[lIdx].push({ x: l.x, y });
        objects.push({ type: 'circle', x: l.x, y, radiusX: 16, radiusY: 16, color: l.color, strokeWidth: 2, filled: true, fillColor: l.color + '30' });
      }
      objects.push({ type: 'text', x: l.x - 30, y: oy + 100, text: l.name, color: l.color, fontSize: 11, fontWeight: 600 });
    });

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
      { title: 'FULL OUTER', desc: "A va B ning to'liq birlashmasi", x: ox + 60, y: oy + 80, color: '#A855F7' }
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
    objects.push({ type: 'rect', x: ox - 300, y: oy - 20, width: 100, height: 40, color: '#38BDF8', strokeWidth: 2, filled: true, fillColor: 'rgba(56,189,248,0.2)' });
    objects.push({ type: 'text', x: ox - 285, y: oy + 5, text: 'Mijozlar (Traffic)', color: '#F8FAFC', fontSize: 11, fontWeight: 700 });
    objects.push({ type: 'arrow', x1: ox - 200, y1: oy, x2: ox - 120, y2: oy, color: '#64748B', strokeWidth: 2 });
    objects.push({ type: 'rect', x: ox - 120, y: oy - 60, width: 110, height: 120, color: '#F59E0B', strokeWidth: 2, filled: true, fillColor: 'rgba(245,158,11,0.2)' });
    objects.push({ type: 'text', x: ox - 110, y: oy - 20, text: '⚖️ Load Balancer\n(NGINX / HAProxy)\nRound Robin', color: '#F8FAFC', fontSize: 10, fontWeight: 700 });

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
      { name: "1. Brauzer (URL so'rovi)", x: ox - 260, y: oy - 40, color: '#38BDF8' },
      { name: '2. DNS Resolver (ISP)', x: ox - 80, y: oy - 40, color: '#10B981' },
      { name: '3. Root Server (.)', x: ox + 120, y: oy - 100, color: '#F59E0B' },
      { name: '4. TLD Server (.uz)', x: ox + 120, y: oy - 20, color: '#8B5CF6' },
      { name: '5. Avtoritativ DNS', x: ox + 120, y: oy + 60, color: '#00FF87' }
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
     ONLINE GEMINI API — KENGAYTIRILGAN INTEGRATSIYA
     ========================================================================== */
  async callGeminiForBoard(prompt, genType, ox, oy) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const systemPrompt = `Siz ATT-25 akademik portali uchun maxsus AI Doska diagramma generatorisiz.
Foydalanuvchi prompti bo'yicha doskada aks ettirish uchun JSON formatidagi ob'ektlar massivini yarating.
Faqat va faqat to'g'ri JSON qaytaring (markdown belgisiz).
Qo'llab-quvvatlanadigan ob'ekt tiplari:
- {"type": "rect", "x": raqam, "y": raqam, "width": raqam, "height": raqam, "color": hex, "strokeWidth": 2, "filled": true, "fillColor": "rgba(...)"}
- {"type": "circle", "x": raqam, "y": raqam, "radiusX": raqam, "radiusY": raqam, "color": hex, "strokeWidth": 2, "filled": true, "fillColor": "rgba(...)"}
- {"type": "arrow", "x1": raqam, "y1": raqam, "x2": raqam, "y2": raqam, "color": hex, "strokeWidth": 3}
- {"type": "line", "x1": raqam, "y1": raqam, "x2": raqam, "y2": raqam, "color": hex, "strokeWidth": 2}
- {"type": "sticky", "x": raqam, "y": raqam, "width": 180, "height": 130, "bgColor": "#FEF08A", "textColor": "#1E293B", "text": "matn"}
- {"type": "text", "x": raqam, "y": raqam, "text": "matn", "color": "#F8FAFC", "fontSize": 14, "fontWeight": 700}
- {"type": "formula", "x": raqam, "y": raqam, "latex": "a^2 + b^2 = c^2", "color": "#38BDF8", "fontSize": 26}
- {"type": "net_node", "x": raqam, "y": raqam, "nodeType": "router"|"switch"|"server"|"cloud"|"pc", "label": "nomi", "ip": "192.168.1.x"}
Markaz koordinatasi: (${ox}, ${oy}). Ob'ektlar tartibli va chiroyli joylashsin. Iloji boricha ko'p elementlar bilan boy sxema yarating.`;

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nFoydalanuvchi buyrug'i: "${prompt}" (Turi: ${genType})` }] }
      ],
      generationConfig: { temperature: 0.7, maxOutputTokens: 4096 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error(`Gemini API server xatosi: ${response.status}`);

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleanJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(cleanJson);
    if (Array.isArray(parsed)) return parsed;
    if (parsed.objects && Array.isArray(parsed.objects)) return parsed.objects;

    throw new Error("Gemini kutilgan ob'ektlar massivini qaytarmadi.");
  }

  /* ==========================================================================
     KENGAYTIRILGAN OFFLINE AI CHAT — 80+ SAVOL-JAVOB PATTERN
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

    // Gemini API bilan ishlash (suhbat tarixi bilan)
    if (this.mode === 'gemini' && this.apiKey) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
        const sysPrompt = `Siz ATT-25 akademik portali AI Doskasi ichidagi do'stona, ilmiy jihatdan kuchli AI Repetitorsiz.
Foydalanuvchi IT talabasi yoki o'qituvchisi.
Hozirda doskada quyidagi elementlar mavjud: [${boardSummary || 'Doska toza'}].
Javobni o'zbek tilida, professional va dalillar bilan bering. Kerak bo'lsa LaTeX formula va kod namunasi keltiring.
Javob hajmi: qisqa va lo'nda (200-400 belgi), lekin muhim bo'lsa kengaytiring.`;

        // Suhbat tarixini tuzish
        const contents = [];
        const recentHistory = this.chatHistory.slice(-this.MAX_HISTORY);
        recentHistory.forEach(h => {
          contents.push({ role: 'user', parts: [{ text: h.user }] });
          contents.push({ role: 'model', parts: [{ text: h.assistant }] });
        });
        contents.push({ role: 'user', parts: [{ text: `${sysPrompt}\n\nFoydalanuvchi: ${userMessage}` }] });

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
          })
        });

        if (res.ok) {
          const data = await res.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (replyText) {
            // Tarixga qo'shish
            this.chatHistory.push({ user: userMessage, assistant: replyText });
            if (this.chatHistory.length > this.MAX_HISTORY) this.chatHistory.shift();
            return { reply: replyText, mode: 'gemini' };
          }
        }
      } catch (e) {
        console.warn('Gemini chat xatosi, avtonom repetitorga o\'tildi:', e);
      }
    }

    // Kengaytirilgan offline AI chat
    const reply = this._offlineChat(userMessage, boardSummary);
    return { reply, mode: 'offline' };
  }

  _offlineChat(userMessage, boardSummary) {
    const q = userMessage.toLowerCase();

    // ── Salomlashish ──────────────────────────────────────────────────────────
    if (q.match(/salom|assalom|hello|hi\b|yaxshimisiz/))
      return "Assalomu alaykum! 🤖 Men ATT-25 AI Doskasi repetitoringizman. Tarmoq, dasturlash, matematik, fizika va AI sohalari bo'yicha yordam beraman. Nima haqida gaplashamiz?";

    if (q.match(/nima qila olasiz|imkoniyatlar|funksiyalar|help/))
      return `🛠️ **Men qila olaman:**\n• Diagrammalar: OSPF, K8s, Zero-Trust, OAuth, REST API, ERD va 30+ sxema\n• Matematika: Tenglama, formula, grafik chizish\n• Tarmoq: OSI, TCP/IP, VLAN, DHCP tahlil\n• Doskani tahlil qilish va konspekt tuzish\n• Savol-javob: IT, AI, Kiberxavfsizlik\n\n📝 Yozing yoki diagramma so'rang!`;

    // ── OSI modeli ────────────────────────────────────────────────────────────
    if (q.match(/osi.*nima|osi.*qatlam|7 qatlam|layer model/))
      return "🌐 **OSI 7 Qatlamli Model:**\n7-Ilova (HTTP, DNS, FTP) → 6-Taqdimot (TLS, JPEG) → 5-Seans (RPC, NetBIOS) → 4-Transport (TCP, UDP) → 3-Tarmoq (IP, OSPF) → 2-Kanal (Ethernet, VLAN) → 1-Fizik (Kabel, Optika)\n\n💡 **Eslab qolish qoidasi:** 'Barcha Odamlar Tinch, Tarmoqlarda Kamroq Farq' (Birinchi harflar: B-O-T-T-T-K-F)";

    if (q.match(/tcp.*udp|udp.*tcp|farqi/))
      return "🔀 **TCP vs UDP Farqi:**\n\n**TCP** (Transport Control Protocol):\n• Ishonchli, tartibli yetkazish\n• 3-Way Handshake (SYN → SYN-ACK → ACK)\n• Foydalanish: HTTP, SSH, FTP, email\n\n**UDP** (User Datagram Protocol):\n• Ishonchsiz, tartibsiz, tez\n• Handshake yo'q, minimal overhead\n• Foydalanish: Video, DNS, VoIP, Gaming\n\n**Qoida:** Tezlik → UDP, Ishonchlilik → TCP";

    // ── Dinamik Subnet & CIDR Kalkulyatori (Avtomatik Hisoblash) ─────────────
    const subnetMatch = q.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\s*[\/ ]\s*(\d{1,2})/);
    if (subnetMatch && typeof window !== 'undefined' && window.SubnetCalculator) {
      const ip = subnetMatch[1];
      const cidr = parseInt(subnetMatch[2], 10);
      const res = window.SubnetCalculator.calculate(ip, cidr);
      if (res && res.success) {
        this.lastContextTopic = 'subnet';
        return `🔢 **IP / SUBNET TAHLILI: ${res.inputIp}/${res.cidr}**\n\n` +
          `• **Tarmoq ID (Network):** ${res.networkIp}\n` +
          `• **Subnet Mask:** ${res.maskIp}\n` +
          `• **Wildcard Mask:** ${res.wildcardIp}\n` +
          `• **Foydalanuvchi IP lar:** ${res.firstUsableIp} ⟶ ${res.lastUsableIp}\n` +
          `• **Broadcast IP:** ${res.broadcastIp}\n` +
          `• **Xostlar soni:** ${res.usableHosts.toLocaleString()} ta foydalanuvchi (${res.totalHosts.toLocaleString()} jami)\n` +
          `• **Sinfi:** Class ${res.ipClass} (${res.scope})\n` +
          `• **Ikkilik Niqob:** \`${res.binaryMask}\`\n\n` +
          `💡 **Tavsiya:** Ushbu jadval yoki tarmoq topologiyasini doskaga chizish uchun AI Generatordan foydalaning!`;
      }
    }

    // ── Texnik Taqqoslashlar (Comparison Tables) ──────────────────────────────
    if (q.includes('vs') || q.includes('solishtir') || q.includes('taqqos') || q.includes('farqi')) {
      if (q.includes('tcp') && q.includes('udp')) {
        this.lastContextTopic = 'tcp_udp';
        return "🌐 **TCP vs UDP Taqqoslanishi:**\n\n• **TCP:** Ulanishli (3-way handshake), kafolatlangan yetkazish, oqim nazorati, 20-60 bayt sarlavha. Ishlatiladi: HTTP, SSH, FTP, Email.\n• **UDP:** Ulanishsiz, eng kam kechikish, 8 bayt yengil sarlavha, tasdiqsiz. Ishlatiladi: DNS, VoIP, Video stream, Gaming.\n\n📊 *Doskaga to'liq vizual taqqoslash jadvalini chizish uchun: Ctrl+I bosing va 'TCP vs UDP' deb generatsiya qiling!*";
      }
      if (q.includes('osi') && (q.includes('tcp') || q.includes('model'))) {
        this.lastContextTopic = 'osi_tcp';
        return "🏛️ **OSI vs TCP/IP Solishtirmasi:**\n\n• **OSI:** 7 ta qatlamli nazariy etalon model (Ilova, Taqdimot, Seans, Transport, Tarmoq, Kanal, Fizik).\n• **TCP/IP:** 4 ta qatlamli amaliy ishchi standart (Ilova, Transport, Internet, Tarmoqqa kirish).\n\n💡 *OSI dagi 7, 6, 5-qatlamlar TCP/IP da bitta 'Amaliy' qatlamga birlashtirilgan.*";
      }
      if (q.includes('ipv4') || q.includes('ipv6')) {
        this.lastContextTopic = 'ipv6';
        return "🔢 **IPv4 vs IPv6:**\n\n• **IPv4:** 32-bit (4.3 mlrd IP), nuqtali o'nlik format, NAT talab qiladi, manzillar tugagan.\n• **IPv6:** 128-bit (3.4 × 10³⁸ IP), o'n oltilik format, SLAAC avtomatik sozlash, o'rnatilgan IPSec xavfsizlik, broadcast yo'q.\n\n📊 *Doskaga solishtirma jadvalini chiqarish uchun 'IPv4 vs IPv6' generatsiya buyrug'ini bering!*";
      }
      if (q.includes('sql') && q.includes('nosql')) {
        this.lastContextTopic = 'sql_nosql';
        return "🗄️ **SQL vs NoSQL:**\n\n• **SQL (PostgreSQL, MySQL):** Jadvallar, ACID kafolatlari, qat\'iy sxema, vertikal masshtablash. Moliya va bank tizimlarida muhim.\n• **NoSQL (MongoDB, Redis, Neo4j):** Hujjatlar (JSON), gorizontal klasterlash, moslashuvchan sxema, BASE modeli. Big Data va real-vaqt kesh uchun.";
      }
      if (q.includes('http1') || q.includes('http2') || q.includes('http3') || q.includes('http')) {
        this.lastContextTopic = 'http';
        return "🚀 **HTTP/1.1 vs HTTP/2 vs HTTP/3:**\n\n• **HTTP/1.1:** Oddiy matn, Head-of-Line bloklanish, har so'rovga yangi TCP ulanish.\n• **HTTP/2:** Binar freymlar, bitta TCP da to'liq Multiplexing, HPACK sarlavha siqish.\n• **HTTP/3:** QUIC protokoli (UDP asosida), paket yo'qolishida boshqa oqimlar to'xtamaydi, nol kechikishli TLS 1.3 ulanish.";
      }
      if (q.includes('rest') || q.includes('graphql') || q.includes('grpc')) {
        this.lastContextTopic = 'api_arch';
        return "⚡ **REST vs GraphQL vs gRPC:**\n\n• **REST:** Standart HTTP metodlar (GET, POST), JSON format, kesh bilan oson ishlaydi.\n• **GraphQL:** Yagona endpoint, faqat kerakli maydonlarni so'rash, over-fetching yo'q.\n• **gRPC:** HTTP/2 va Protocol Buffers, ultra yuqori tezlik, ikki tomonlama streaming, mikroxizmatlar uchun ideal.";
      }
    }

    // ── IPv6 va SLAAC ─────────────────────────────────────────────────────────
    if (q.match(/ipv6|slaac|link-local|fe80|dual-stack/)) {
      this.lastContextTopic = 'ipv6';
      return "🌐 **IPv6 Protokoli Asoslari:**\n\n• **Uzunligi:** 128 bit (masalan: `2001:0db8:85a3::8a2e:0370:7334`)\n• **Link-Local:** `fe80::/10` — bitta lokal tarmoq ichidagi aloqa uchun avtomatik hosil bo'ladi\n• **SLAAC:** DHCP siz Router Advertisement (RA) orqali avtomatik IP olish\n• **Dual-Stack:** Qurilmada bir vaqtning o'zida IPv4 va IPv6 ishlashi";
    }

    // ── Wireshark va TCP Bayroqlari ───────────────────────────────────────────
    if (q.match(/wireshark|tcp.*bayroq|syn.*ack|pcap|paket.*tahlil/)) {
      this.lastContextTopic = 'wireshark';
      return "🦈 **Wireshark va TCP Boshqaruv Bayroqlari:**\n\n• **SYN (Synchronize):** Aloqa o'rnatish so'rovi (1-qadam)\n• **ACK (Acknowledgment):** Qabul qilingan paketni tasdiqlash\n• **FIN (Finish):** Aloqani to'g'ri yopish (Graceful shutdown)\n• **RST (Reset):** Aloqani keskin uzish yoki rad etish\n• **PSH (Push):** Buferda kutmasdan zudlik bilan ilovaga uzatish\n• **URG (Urgent):** Shoshilinch ma'lumot ko'rsatkichi";
    }

    // ── VPN va IPsec ──────────────────────────────────────────────────────────
    if (q.match(/vpn|ipsec|ikev2|tunnel|wireguard|openvpn/)) {
      this.lastContextTopic = 'vpn';
      return "🔒 **VPN va IPsec Arxitekturasi:**\n\n• **IPsec 2 Rejimi:**\n  1. *Transport rejimi:* Faqat payload shifrlanadi (LAN ichida)\n  2. *Tunnel rejimi:* Butun original IP paket shifrlanadi (Site-to-Site)\n• **Protokollar:**\n  • **ESP (Protocol 50):** Shifrlash va butunlik\n  • **AH (Protocol 51):** Faqat butunlik va autentifikatsiya\n• **Zamonaviy yechimlar:** WireGuard (eng yengil va tez), OpenVPN, IKEv2";
    }

    // ── HTTP Status Kodlari ───────────────────────────────────────────────────
    if (q.match(/http.*kod|status.*kod|404.*nima|500.*nima|200.*nima/)) {
      this.lastContextTopic = 'http';
      return "🌐 **HTTP Status Kodlari:**\n\n• **1xx (Axborot):** 100 Continue, 101 Switching Protocols\n• **2xx (Muvaffaqiyat):** 200 OK, 201 Created, 204 No Content\n• **3xx (Yo'naltirish):** 301 Moved Permanently, 304 Not Modified\n• **4xx (Mijoz Xatosi):** 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found\n• **5xx (Server Xatosi):** 500 Internal Error, 502 Bad Gateway, 503 Service Unavailable";
    }

    // ── IoT va Mikrokontrollerlar ─────────────────────────────────────────────
    if (q.match(/iot|esp32|arduino|mqtt|sensor|gpio|pwm/)) {
      this.lastContextTopic = 'iot';
      return "📟 **IoT va Mikrokontrollerlar:**\n\n• **ESP32:** Wi-Fi + Bluetooth BLE o'rnatilgan 32-bit ikki yadroli mikrokontroller\n• **GPIO:** Raqamli kirish/chiqish pinlari (Digital Read/Write)\n• **PWM:** Dvigatel tezligi yoki LED yorug'ligini boshqarish\n• **Protokollar:** MQTT (yengil Publish/Subscribe), I2C (2 simli sensorlar), SPI (tezkor displeylar)";
    }

    // ── Kontekstli Davom Ettirish (Follow-up Memory) ──────────────────────────
    if (q.match(/batafsil|ko'proq.*tushuntir|yana.*gapir|davom.*et|misol.*ber|qanday.*ishlaydi/)) {
      if (this.lastContextTopic === 'subnet') {
        return "🔢 **Subnetting haqida qo'shimcha:**\nSubnetting tarmoq xavfsizligini oshiradi va broadcast bo'ronlarini kamaytiradi. Masalan, /24 tarmoqni 4 ta /26 ga bo'lsangiz, har bir bo'lim (buxgalteriya, IT, mehmonlar) mustaqil izolyatsiyalangan bo'ladi.";
      } else if (this.lastContextTopic === 'ospf') {
        return "🗺️ **OSPF SPF Algoritmi haqida:**\nHar bir OSPF routeri o'zining Link-State Database (LSDB) siga ega. Dijkstra algoritmi orqali o'zini markaz deb hisoblab, eng arzon narxli (Cost = 100 Mbps / Bandwidth) marshrutni Routing Table ga kiritadi.";
      } else if (this.lastContextTopic === 'tcp_udp') {
        return "🔀 **TCP Oqim Boshqaruvi haqida:**\nTCP 'Sliding Window' mexanizmidan foydalanadi: agar tarmoq band bo'lsa, qabul qiluvchi oynani kichraytiradi (Congestion Avoidance: Reno, Cubic algoritmlari).";
      }
    }

    // ── Subnetting umumiy savol ───────────────────────────────────────────────
    if (q.match(/ip.*manzil|subnet|cidr|vlsm|mask/)) {
      this.lastContextTopic = 'subnet';
      return "🔢 **IP Manzillash va Subnetting:**\n\n**Misol:** 192.168.10.0/24\n• Network: 192.168.10.0\n• Subnet Mask: 255.255.255.0\n• Broadcast: 192.168.10.255\n• Foydalanuvchi: 192.168.10.1 – 192.168.10.254 (254 ta)\n\n**VLSM Formula:** Hosts = 2^(32-CIDR) - 2\n/25 → 126 host, /26 → 62, /27 → 30, /28 → 14, /29 → 6, /30 → 2\n\n💡 *Aniq IP hisobini bilish uchun: '10.0.0.0/22' kabi IP va CIDR ni yozing!*";
    }

    // ── OSPF ──────────────────────────────────────────────────────────────────
    if (q.match(/ospf|rip|bgp|marshrutlash/)) {
      this.lastContextTopic = 'ospf';
      return "🗺️ **Marshrutlash Protokollari:**\n\n**RIP v2:** Distansiya-vektor, maks 15 sakrama, kichik tarmoqlar uchun\n**OSPF:** Holat-havola (Link-State), cheksiz tarmoq, SPF algoritmi, Area tizimi (Area 0 Backbone)\n**BGP:** Global Internet protokoli, AS raqamlar, policy-based, eng ishonchli\n\n**Solishtiruv:** RIP (oddiy) < OSPF (korporativ) < BGP (global internet)";
    }


    if (q.match(/vlan.*nima|vlan.*ishlaydi|802.1q/))
      return "🔀 **VLAN (Virtual Local Area Network):**\nFizik tarmoqni mantiqiy segmentlarga ajratadi.\n\n• **VLAN 10:** Boshqaruv (Management)\n• **VLAN 20:** Foydalanuvchilar (Users)\n• **VLAN 30:** Serverlar (Servers)\n\n**802.1Q Trunk:** Switchlar o'rtasida bir nechta VLAN trafikini Tagged paketlar bilan uzatadi.\n\n**Buyruq:** `switch(config)# vlan 10` → `switchport access vlan 10`";

    if (q.match(/dhcp.*nima|ip.*avtomatik|dhcp jarayon/))
      return "📋 **DHCP 4 Bosqich (DORA):**\n1. **Discover** → Mijoz broadcast yuboradi\n2. **Offer** → Server IP taklif qiladi\n3. **Request** → Mijoz IP qabul qiladi\n4. **ACK** → Server tasdiqlaydi + DNS, Gateway beradi\n\n**DHCP Lease:** IP manzil vaqtinchalik beriladi (1-24 soat)\n**Static Binding:** MAC-IP bog'lanishi doimiy qilinadi";

    if (q.match(/firewall|xavfsizlik devori|acl/))
      return "🛡️ **Firewall Turlari:**\n\n• **Stateless Firewall:** ACL qoidalari, har paket alohida tekshiriladi\n• **Stateful Firewall:** Ulanish holati saqlanadi, sesiyani kuzatadi\n• **Next-Gen (NGFW):** DPI, IPS/IDS, SSL inspection, App-level\n\n**ACL Misol (Cisco):** `access-list 100 permit tcp 10.0.0.0 0.0.0.255 any eq 80`\n\nDMZ — Tashqi serverlarni ichki LAN dan ajratadi";

    // ── Dasturlash ────────────────────────────────────────────────────────────
    if (q.match(/python.*nima|python.*o'rganish|python.*boshlash/))
      return "🐍 **Python dasturlash tilini o'rganish yo'li:**\n\n1. **Asoslar** (1-2 hafta): O'zgaruvchi, list, dict, loop, funksiya\n2. **OOP** (2-3 hafta): Class, inheritance, polymorphism\n3. **Kutubxonalar**: NumPy, Pandas (Data Science), Flask/FastAPI (Web)\n4. **Loyiha**: GitHub'da real loyiha yarating\n\n**Resurs:** docs.python.org, cs50.harvard.edu (bepul)";

    if (q.match(/oop|ob'yektga|sinf|klass|class.*nima/))
      return "🏗️ **OOP 4 Tamoyili:**\n\n1. **Inkapsulyatsiya:** Ma'lumot va metodlarni sinfga yashirish\n2. **Meros (Inheritance):** Parent → Child sinf\n3. **Polimorfizm:** Bir xil metod, turli xatti-harakat\n4. **Abstraksiya:** Murakkablikni yashirish\n\n```python\nclass Router:\n    def __init__(self, ip):\n        self.ip = ip\n    def ping(self):\n        return f'ICMP → {self.ip}'\n```";

    if (q.match(/git.*nima|git.*qanday|version control/))
      return "📦 **Git Asosiy Buyruqlar:**\n\n```bash\ngit init          # Repo yaratish\ngit add .         # Barcha o'zgarishlarni staging\ngit commit -m ''  # Commit\ngit push origin main  # Push\ngit pull          # Yangilash\ngit branch feature  # Yangi branch\ngit merge feature   # Birlashtirish\n```\n\n**Git Flow:** main → develop → feature → PR → merge";

    if (q.match(/docker.*nima|konteyner.*nima|dockerfile/))
      return "🐳 **Docker va Konteynerlashtirish:**\n\n**Docker nima?** Ilovani barcha bog'liqliklar bilan 'qadoqlash' texnologiyasi.\n\n```dockerfile\nFROM python:3.11\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\nCMD ['python', 'app.py']\n```\n\n**Asosiy buyruqlar:**\n• `docker build -t myapp .`\n• `docker run -p 8080:80 myapp`\n• `docker-compose up -d`";

    if (q.match(/sql.*nima|select|join.*nima|ma'lumotlar bazasi/))
      return "🗄️ **SQL Asosiy So'rovlar:**\n\n```sql\n-- Ma'lumot olish\nSELECT * FROM students WHERE gpa > 3.5;\n\n-- Join\nSELECT s.name, g.grade\nFROM students s\nINNER JOIN grades g ON s.id = g.student_id;\n\n-- Guruhlashtirish\nSELECT department, AVG(salary)\nFROM employees\nGROUP BY department\nHAVING AVG(salary) > 5000;\n```\n\nNormalizatsiya: 1NF → 2NF → 3NF → BCNF";

    // ── AI va ML ──────────────────────────────────────────────────────────────
    if (q.match(/sun'iy intellekt.*nima|ai.*nima|ml.*nima|machine learning/))
      return "🤖 **Sun'iy Intellekt Turlari:**\n\n• **ML (Mashinali o'rganish):** Ma'lumotlardan o'rganadi\n• **DL (Chuqur o'rganish):** Neyron tarmoqlar asosida\n• **NLP:** Matn tushunish (ChatGPT)\n• **CV (Computer Vision):** Rasm tahlil\n\n**ML Turlari:**\n1. Supervised (Nazoratli): SVM, Linear Regression, Random Forest\n2. Unsupervised: K-Means, PCA\n3. Reinforcement: Q-Learning, PPO";

    if (q.match(/neyron tarmoq|neural network|chuqur o'rganish|deep learning/))
      return "🧠 **Neyron Tarmoq Qanday Ishlaydi?**\n\n```\nKirish → [W1] → Yashirin 1 → [W2] → Yashirin 2 → Chiqish\n```\n**Aktivatsiya funksiyalari:**\n• ReLU(x) = max(0, x) — eng ko'p ishlatiladigan\n• Sigmoid: σ(x) = 1/(1+e^-x) — klassifikatsiya\n• Softmax — ko'p sinfli chiqish\n\n**O'rganish:** Backpropagation + Gradient Descent\n\n**Formula:** $L = -\\sum y \\log(\\hat{y})$ (Cross-Entropy)";

    if (q.match(/transformer.*nima|chatgpt.*nima|gpt.*nima|llm/))
      return "🔤 **Transformer va LLM Arxitekturasi:**\n\nTransformer (2017, Vaswani et al.) — barcha zamonaviy AI asosi.\n\n**Asosiy mexanizm:** Self-Attention\n```\nAttention(Q, K, V) = softmax(QK^T/√d_k)V\n```\n\n**GPT:** Generative Pre-trained Transformer\n• Milyardlab parametrli model\n• In-context learning\n\n**Foydalanish:** ChatGPT, Gemini, Claude, LLaMA";

    // ── Kiberxavfsizlik ───────────────────────────────────────────────────────
    if (q.match(/kriptografiya|shifrlash|aes|rsa|ecc/))
      return "🔐 **Kriptografiya Asoslari:**\n\n**Simmetrik (1 kalit):**\n• AES-256 — standart, tez, xavfsiz\n• Muammo: Kalitni qanday uzatish?\n\n**Asimmetrik (2 kalit: ochiq + yashirin):**\n• RSA-2048/4096 — internet HTTPS\n• ECC — mobil, samaradorligi yuqori\n• $E = M^e \\mod n$, $D = C^d \\mod n$\n\n**Hashing (Bir tomonlama):**\n• SHA-256, SHA-3 — parol, imzo\n• MD5 — eskirgan, xavfli!";

    if (q.match(/sql injection|xss|csrf|hujum|penetrasion|pentest/))
      return "⚠️ **OWASP Top 10 Hujumlar:**\n\n1. **SQL Injection:** `' OR 1=1 --`\n   Himoya: Prepared statements, ORM\n\n2. **XSS (Cross-Site Scripting):** `<script>alert(1)</script>`\n   Himoya: Output encoding, CSP header\n\n3. **CSRF:** Fake form so'rovlari\n   Himoya: CSRF token, SameSite cookie\n\n4. **IDOR:** URL'da boshqa foydalanuvchi ID\n   Himoya: AuthZ tekshiruv\n\n**Pentesting:** Kali Linux, Burp Suite, Nmap";

    // ── Matematik ─────────────────────────────────────────────────────────────
    if (q.match(/integral.*nima|integral.*hisoblash/))
      return "∫ **Integral Hisob:**\n\n**Aniq integral:** $\\int_a^b f(x)dx = F(b) - F(a)$\n\n**Asosiy formulalar:**\n• $\\int x^n dx = \\frac{x^{n+1}}{n+1} + C$\n• $\\int e^x dx = e^x + C$\n• $\\int \\sin x dx = -\\cos x + C$\n• $\\int \\frac{1}{x} dx = \\ln|x| + C$\n\n**Geometrik ma'no:** Grafik ostidagi maydon";

    if (q.match(/matritsa.*nima|determinant|chiziqli algebra/))
      return "📐 **Matritsa va Chiziqli Algebra:**\n\n$A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}$\n\n**Determinant:** $\\det(A) = ad - bc$\n\n**Teskari matritsa:** $A^{-1} = \\frac{1}{\\det(A)} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}$\n\n**Xos qiymatlar:** $Av = \\lambda v$\n\n**Qo'llanish:** Grafika (3D transformatsiya), ML (PCA), Tarmoq tahlili";

    if (q.match(/ehtimollik|bayes|statistics|taqsimot/))
      return "🎲 **Ehtimollik Nazariyasi:**\n\n**Bayes teoremasi:**\n$P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}$\n\n**Normal taqsimot (Gauss):**\n$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}$\n\n**68-95-99.7 qoidasi:**\n• 1σ → 68%, 2σ → 95%, 3σ → 99.7%\n\n**Tarmoqda qo'llanish:** Trafik modellash, SLA hisoblash";

    // ── Fizika ────────────────────────────────────────────────────────────────
    if (q.match(/ohm|volt|amper|rezistor|elektr zanjir/))
      return "⚡ **Elektr Zanjir Qonunlari:**\n\n**Ohm qonuni:** $I = \\frac{U}{R}$, $P = UI = I^2R = \\frac{U^2}{R}$\n\n**Kirxgof qoidalari:**\n• KVL (Kuchlanish): $\\sum U = 0$ (kontur)\n• KCL (Tok): $\\sum I = 0$ (tugun)\n\n**Ketma-ket:** $R_{eq} = R_1 + R_2 + R_3$\n**Parallel:** $\\frac{1}{R_{eq}} = \\frac{1}{R_1} + \\frac{1}{R_2}$\n\n**1 Vt = 1 Joule/sekund**";

    if (q.match(/optik.*tola|fiber|optik aloqa/))
      return "💡 **Optik Tolali Aloqa:**\n\n**Ishlash prinsipi:** To'liq ichki aks etish (Total Internal Reflection)\n\n**Tur:** \n• **Single-Mode (SMF):** 9μm yadro, uzun masofa (100km+)\n• **Multi-Mode (MMF):** 50/62.5μm, qisqa masofa (<2km)\n\n**So'nish:** 0.2 dB/km (SMF), 3 dB/km (MMF)\n\n**Ulanish:** Fusion Splicing (0.02 dB yo'qotish)\n\n**Tezlik:** 40 Gbps – 800 Gbps (DWDM)";

    // ── Doska bilan bog'liq ───────────────────────────────────────────────────
    if (q.match(/doska.*nima bor|doska.*ko'rsat|doska.*tahlil/))
      return boardSummary
        ? `📋 **Doskada mavjud elementlar:**\n${boardSummary}\n\nKo'proq tafsilot uchun AI tahlil (Ctrl+Shift+A) dan foydalaning.`
        : "📋 Doska hali bo'sh. AI Generator (Ctrl+I) orqali diagramma yarating!";

    if (q.match(/diagramma.*yarat|sxema.*chiz|generat/))
      return "🎨 **Diagramma Generatsiyasi:**\nCtrl+I bosing va prompt kiriting. Masalan:\n• 'OSPF multi-area tarmoq'\n• 'OAuth 2.0 autentifikatsiya'\n• 'Redis cache arxitektura'\n• 'K8s kubernetes klaster'\n• 'ERD ma'lumotlar bazasi'\n\n20+ shablon offline ishlaydi!";

    if (q.match(/eksport|pdf|png.*yuklab|saqlash/))
      return "💾 **Doska Eksport Imkoniyatlari:**\n• **PNG** — Yuqori sifatli rasm (taqdimot uchun)\n• **SVG** — Vektorli format (cheksiz o'lcham)\n• **JSON** — Loyihani saqlash va yuklash\n• **PDF** — Ko'p sahifali hujjat\n\n📂 Menyu → Eksport yoki Ctrl+E";

    // ── ATT-25 kursi ──────────────────────────────────────────────────────────
    if (q.match(/att.*25|kurs.*nima|fan.*nima|semestr/))
      return "📚 **ATT-25 3-Semestr Fanlari (Kuzgi 2026):**\n\n1. **Chiziqli Algebra** — Matritsalar, determinantlar, xos qiymatlar\n2. **Ma'lumotlar Bazasi** — PostgreSQL, SQL, ERD, ACID\n3. **Elektronika** — Tranzistorlar, mantiqiy darvozalar, mikrosxemalar\n4. **Diskret Tuzilmalar** — Graf nazariyasi, kombinatorika, avtomat\n5. **Kompyuter Tarmoqlari** — OSI, IPv4/6, VLAN, OSPF\n6. **Kelajak Soati** — CV, sertifikat, loyiha boshqaruvi";

    if (q.match(/ccna|cisco|sertifikat|ccnp/))
      return "🏅 **Cisco Sertifikatlash Yo'li:**\n\n**CCNA (Junior):**\n• Tarmoq asoslari, Switching, Routing, OSPF\n• 1 imtihon: 200-301 CCNA\n• Tayyorgarlik: 3-6 oy, NetAcad kurslari\n\n**CCNP (Professional):**\n• Enterprise, Security, Service Provider\n• 2 imtihon: Core + Concentration\n\n**Tayyorgarlik:** Packet Tracer → GNS3 → Real uskunalar";

    // ── Umumiy javob ──────────────────────────────────────────────────────────
    const topicKeywords = this._extractTopic(q);
    return `💡 **AI Repetitor:** "${topicKeywords || userMessage.substring(0, 40)}" mavzusi bo'yicha...\n\n${boardSummary ? `Doskada: ${boardSummary.substring(0, 100)}\n\n` : ''}📌 **Tavsiya:** Ctrl+I bilan mavzu bo'yicha diagramma chizib, keyin meni so'roq qiling — kontekstli javob beraman!\n\nYoki aniqroq savol yozing: "OSI nima?", "TCP vs UDP", "OSPF qanday ishlaydi?"`;
  }

  _extractTopic(q) {
    const topics = ['tarmoq', 'dasturlash', 'matematik', 'fizika', 'kiberxavfsizlik', 'AI', 'SQL', 'TCP', 'IP', 'VLAN', 'Docker'];
    return topics.find(t => q.includes(t.toLowerCase())) || '';
  }

  /* ==========================================================================
     DOSKA ELEMENTLARINI AI ORQALI TAHRIRLASH
     ========================================================================== */
  async editSelectedWithAI(instruction) {
    const selected = this.board.selectedObjects;
    if (!selected || selected.length === 0) {
      return { success: false, message: "Avval tahrirlash uchun elementlarni tanlang!" };
    }

    const obj = selected[0];

    // Rang o'zgartirish
    const colorMatch = instruction.match(/rang.*?(#[0-9a-fA-F]{6}|qizil|yashil|ko'k|sariq|binafsha|moviy|oq|qora)/i);
    if (colorMatch) {
      this.board.saveState();
      const colorMap = { 'qizil': '#F43F5E', 'yashil': '#10B981', "ko'k": '#38BDF8', 'sariq': '#F59E0B', 'binafsha': '#A855F7', 'moviy': '#38BDF8', 'oq': '#F8FAFC', 'qora': '#0F172A' };
      const newColor = colorMatch[1].startsWith('#') ? colorMatch[1] : (colorMap[colorMatch[1]] || '#00FF87');
      selected.forEach(o => { o.color = newColor; if (o.fillColor) o.fillColor = newColor + '20'; });
      this.board.render();
      return { success: true, message: `✅ ${selected.length} ta element rangi o'zgartirildi → ${newColor}` };
    }

    // Matn o'zgartirish
    const textMatch = instruction.match(/matn.*?["«»](.+?)["«»]|yoz[^ ]* ["«»](.+?)["«»]/i);
    if (textMatch) {
      this.board.saveState();
      const newText = textMatch[1] || textMatch[2];
      selected.forEach(o => { if (o.text !== undefined) o.text = newText; });
      this.board.render();
      return { success: true, message: `✅ Matn yangilandi: "${newText}"` };
    }

    // O'lcham o'zgartirish
    if (instruction.match(/kattalashtir|kattaroq|big/i)) {
      this.board.saveState();
      selected.forEach(o => {
        if (o.width) o.width = Math.round(o.width * 1.3);
        if (o.height) o.height = Math.round(o.height * 1.3);
        if (o.radiusX) { o.radiusX = Math.round(o.radiusX * 1.3); o.radiusY = Math.round(o.radiusY * 1.3); }
        if (o.fontSize) o.fontSize = Math.min(48, Math.round(o.fontSize * 1.3));
      });
      this.board.render();
      return { success: true, message: "✅ Element(lar) kattalashtirildi" };
    }

    if (instruction.match(/kichiklashtir|kichik|small/i)) {
      this.board.saveState();
      selected.forEach(o => {
        if (o.width) o.width = Math.round(o.width * 0.75);
        if (o.height) o.height = Math.round(o.height * 0.75);
        if (o.radiusX) { o.radiusX = Math.round(o.radiusX * 0.75); o.radiusY = Math.round(o.radiusY * 0.75); }
        if (o.fontSize) o.fontSize = Math.max(8, Math.round(o.fontSize * 0.75));
      });
      this.board.render();
      return { success: true, message: "✅ Element(lar) kichiklashtirildi" };
    }

    // O'chirish
    if (instruction.match(/o'chir|delete|remove/i)) {
      this.board.saveState();
      selected.forEach(o => {
        const idx = this.board.objects.indexOf(o);
        if (idx !== -1) this.board.objects.splice(idx, 1);
      });
      this.board.selectedObjects = [];
      this.board.render();
      return { success: true, message: `✅ ${selected.length} ta element o'chirildi` };
    }

    return { success: false, message: `⚠️ Tushunilmadi: "${instruction}"\n\nMisol buyruqlar:\n• "rang #FF0000"\n• "matn «Yangi nom»"\n• "kattalashtir"\n• "o'chir"` };
  }

  /* ==========================================================================
     AI RANG TAVSIYACHI
     ========================================================================== */
  suggestColorPalette(theme = 'tech') {
    const palettes = {
      tech: { name: 'Kiber Tech', colors: ['#00FF87', '#38BDF8', '#A855F7', '#F59E0B', '#F43F5E'], bg: '#0F172A' },
      network: { name: 'Tarmoq', colors: ['#10B981', '#38BDF8', '#F59E0B', '#EC4899', '#64748B'], bg: '#070C09' },
      academic: { name: 'Akademik', colors: ['#3B82F6', '#8B5CF6', '#06B6D4', '#F59E0B', '#10B981'], bg: '#1E293B' },
      security: { name: 'Xavfsizlik', colors: ['#F43F5E', '#F59E0B', '#10B981', '#38BDF8', '#A855F7'], bg: '#0F172A' },
      minimal: { name: 'Minimal', colors: ['#E2E8F0', '#94A3B8', '#475569', '#1E293B', '#0F172A'], bg: '#FFFFFF' },
    };
    return palettes[theme] || palettes.tech;
  }

  /* ==========================================================================
     KENGAYTIRILGAN DOSKANI TAHLIL QILISH
     ========================================================================== */
  async analyzeBoard(action = 'summarize') {
    const objects = this.board.objects;
    if (!objects || objects.length === 0) {
      return "⚠️ Doskada hali hech qanday element mavjud emas. Avval biror chizma, stiker yoki sxema joylashtiring.";
    }

    const textPieces = [];
    objects.forEach(obj => {
      if (obj.type === 'text' && obj.text) textPieces.push(`[Matn]: ${obj.text}`);
      else if (obj.type === 'formula' && obj.latex) textPieces.push(`[Formula]: ${obj.latex}`);
      else if (obj.type === 'sticky' && obj.text) textPieces.push(`[Stiker]: ${obj.text}`);
      else if (obj.type === 'net_node') textPieces.push(`[Tarmoq]: ${obj.label} (${obj.nodeType}, IP: ${obj.ip || 'N/A'})`);
      else if (['rect', 'circle', 'diamond'].includes(obj.type)) textPieces.push(`[Shakl]: ${obj.type}`);
      else if (obj.type === 'graph') textPieces.push(`[Grafik]: y = ${obj.funcStr || '?'}`);
      else if (obj.type === 'quiz_card') textPieces.push(`[Test]: ${obj.question || ''}`);
    });

    if (this.mode === 'gemini' && this.apiKey) {
      try {
        return await this.callGeminiForAnalysis(textPieces.join('\n'), action);
      } catch (e) {
        console.warn('Gemini tahlil xatosi, offline tahlilga o\'tildi:', e);
      }
    }

    return this.analyzeOffline(objects, textPieces, action);
  }

  analyzeOffline(objects, textPieces, action) {
    const stCount = objects.filter(o => o.type === 'sticky').length;
    const netCount = objects.filter(o => o.type === 'net_node').length;
    const shapeCount = objects.filter(o => ['rect', 'circle', 'diamond', 'triangle'].includes(o.type)).length;
    const strokeCount = objects.filter(o => o.type === 'stroke').length;
    const formulaCount = objects.filter(o => o.type === 'formula').length;
    const graphCount = objects.filter(o => o.type === 'graph').length;
    const quizCount = objects.filter(o => o.type === 'quiz_card').length;

    let res = '';
    if (action === 'summarize') {
      res = `📋 **DOSKA AKADEMIK KONSPEKTI (AI v3.0)**\n\n`;
      res += `📊 **Statistika:** ${objects.length} ta jami ob'ekt\n`;
      res += `• Stikerlar: ${stCount} | Tarmoq tugunlari: ${netCount} | Shakllar: ${shapeCount}\n`;
      res += `• Formulalar: ${formulaCount} | Grafiklar: ${graphCount} | Testlar: ${quizCount} | Chizmalar: ${strokeCount}\n\n`;

      if (textPieces.length > 0) {
        res += `**📝 Mazmun (asosiy elementlar):**\n`;
        textPieces.slice(0, 10).forEach(tp => { res += `• ${tp}\n`; });
        if (textPieces.length > 10) res += `• ... va yana ${textPieces.length - 10} ta element\n`;
      } else {
        res += `• Doskada asosan grafik chizmalar va geometrik shakllar mavjud.\n`;
      }

      res += `\n**🎯 Xulosa:** `;
      if (netCount > 2) res += `Tarmoq arxitekturasi sxemasi — ${netCount} ta qurilma o'zaro ulangan. `;
      if (stCount > 3) res += `Aqliy hujum (Brainstorm) sessiyasi — ${stCount} ta g'oya klasterlangan. `;
      if (formulaCount > 0) res += `Matematik-ilmiy tahlil — ${formulaCount} ta formula mavjud. `;
      if (quizCount > 0) res += `${quizCount} ta bilim testi yaratilgan. `;
      if (!netCount && !stCount && !formulaCount) res += `Umumiy diagramma yoki blok-sxema.`;

    } else if (action === 'explain') {
      res = `💡 **DOSKANI ILMIY TUSHUNTIRISH**\n\n`;
      if (netCount > 0) res += `🌐 **Tarmoq Infratuzilmasi:** ${netCount} ta qurilma o'rtasida ma'lumotlar almashinuvi topologiyasi.\n`;
      if (stCount > 0) res += `📌 **Aqliy Hujum:** ${stCount} ta rangli stiker asosiy vazifalar va bosqichlarni klasterlaydi.\n`;
      if (formulaCount > 0) res += `🔢 **Formulalar:** ${formulaCount} ta matematik ifoda — ularni LaTeX formatida tahrirlash mumkin.\n`;
      if (graphCount > 0) res += `📈 **Grafiklar:** ${graphCount} ta 2D funksiya grafigi chizilgan.\n`;
      res += `\n📌 **Tavsiya:** Bog'lovchi strelkalar orqali ma'lumotlar oqimini oydinlashtiring.`;

    } else if (action === 'quiz') {
      res = `❓ **DOSKA MAVZUSI BO'YICHA TEST SAVOLLARI:**\n\n`;
      if (netCount > 0) {
        res += `1. Doskadagi tarmoqda qaysi qurilma L3 marshrutlashni boshqaradi?\n   ✅ Router (Yo'riqnoma)\n\n`;
        res += `2. IP manzillar to'qnashuvi (Conflict) qanday xatolik keltirib chiqaradi?\n   ✅ ARP jadvali buzilishi va paketlar yo'qolishi\n\n`;
      }
      if (stCount > 0) {
        res += `3. Doska stikerlaridagi g'oyalarni amalga oshirish uchun qaysi metodologiya qo'llaniladi?\n   ✅ Agile/Scrum sprint rejalashtirishi\n\n`;
      }
      res += `4. Doskani PDF ga eksport qilish uchun qaysi tugma ishlatiladi?\n   ✅ Menyu → Eksport → PDF`;
    }

    return res;
  }

  async callGeminiForAnalysis(boardContent, action) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;
    const prompts = {
      summarize: `Doskadagi elementlar: ${boardContent}\n\nO'zbek tilida professional akademik konspekt va asosiy xulosalarni tayyorlab bering. Statistika, asosiy mavzular va xulosa qismlari bilan.`,
      explain: `Doskadagi elementlar: ${boardContent}\n\nBularni talabaga dars o'tayotgan o'qituvchi kabi batafsil va tushunarli tushuntirib bering.`,
      quiz: `Doskadagi elementlar: ${boardContent}\n\nBu mavzu bo'yicha 3-5 ta interaktiv test savoli va javoblari tuzib bering.`
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompts[action] || prompts.summarize }] }] })
    });

    if (!res.ok) throw new Error("Gemini javob bermadi: " + res.status);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini javob matnini olib bo'lmadi.";
  }

  /* ==========================================================================
     DOSKA MANTIQINI TEKSHIRISH
     ========================================================================== */
  validateBoardLogic() {
    const objects = this.board.objects || [];
    const findings = [];
    const netNodes = objects.filter(o => o.type === 'net_node');
    const arrows = objects.filter(o => o.type === 'arrow');
    const shapes = objects.filter(o => ['rect', 'circle', 'diamond'].includes(o.type));

    const ips = {};
    netNodes.forEach(node => {
      if (node.ip) {
        if (ips[node.ip]) {
          findings.push({ type: 'warning', title: 'IP Manzillar To\'qnashuvi!', message: `"${node.label}" va "${ips[node.ip]}" bir xil IP: ${node.ip}` });
        } else {
          ips[node.ip] = node.label;
        }
      }
    });

    if (netNodes.length > 1 && arrows.length === 0) {
      findings.push({ type: 'warning', title: 'Ulanmagan Qurilmalar', message: `${netNodes.length} ta tarmoq qurilmasi mavjud, lekin ular o'rtasida ulanish yo'q.` });
    }

    const diamonds = shapes.filter(s => s.type === 'diamond');
    if (diamonds.length > 0 && arrows.length < diamonds.length) {
      findings.push({ type: 'info', title: 'Tugallanmagan Shartli Tarmoqlanish', message: 'Shart romblaridan "Ha" va "Yo\'q" yo\'nalishlari to\'liq chiqarilmagan.' });
    }

    // Yangi tekshiruvlar
    const floatingNodes = netNodes.filter(n => !arrows.some(a => {
      const nx = n.x, ny = n.y;
      return (Math.abs(a.x1 - nx) < 100 && Math.abs(a.y1 - ny) < 100) || (Math.abs(a.x2 - nx) < 100 && Math.abs(a.y2 - ny) < 100);
    }));
    if (floatingNodes.length > 0 && netNodes.length > 1) {
      findings.push({ type: 'info', title: 'Izolyatsiyalangan Qurilma', message: `"${floatingNodes[0].label}" tarmoqqa ulanmagan.` });
    }

    if (findings.length === 0) {
      findings.push({ type: 'success', title: 'Mantiqiy Xatoliklar Topilmadi', message: 'Barcha qurilmalar va bloklar to\'g\'ri joylashtirilgan.' });
    }

    return findings;
  }

  /* ==========================================================================
     CHIZMALARNI GO'ZALLASHTIRISH
     ========================================================================== */
  beautifyAndAlign() {
    const objects = this.board.objects || [];
    if (objects.length < 2) return 0;

    this.board.saveState();
    let count = 0;

    const alignables = objects.filter(o => ['rect', 'sticky', 'net_node', 'quiz_card', 'circle'].includes(o.type));
    alignables.forEach(obj => {
      if (typeof obj.x === 'number') { obj.x = Math.round(obj.x / 20) * 20; count++; }
      if (typeof obj.y === 'number') { obj.y = Math.round(obj.y / 20) * 20; }
    });

    objects.filter(o => o.type === 'arrow' || o.type === 'line').forEach(arrow => {
      const dx = Math.abs(arrow.x2 - arrow.x1);
      const dy = Math.abs(arrow.y2 - arrow.y1);
      if (dx < 15) { arrow.x2 = arrow.x1; count++; }
      else if (dy < 15) { arrow.y2 = arrow.y1; count++; }
    });

    this.board.render();
    return count;
  }

  /* ==========================================================================
     QUIZ GENERATORI
     ========================================================================== */
  async generateQuizFromBoard() {
    const objects = this.board.objects || [];
    let topic = 'UMUMIY ILMIY BILIM';
    let question = 'Doskadagi elementlar asosida asosiy xususiyat qaysi?';
    let options = ["To'g'ri arxitektura", 'Tizim xatoligi', 'Protokol yetishmovchiligi', 'Standart model'];
    let correctIndex = 0;
    let explanation = "Doskadagi tuzilma asosiy standart talablarga to'liq mos keladi.";

    const texts = objects.filter(o => o.text).map(o => o.text.toLowerCase()).join(' ');
    const types = objects.map(o => o.type);

    if (texts.includes('ospf') || texts.includes('bgp')) {
      topic = 'MARSHRUTLASH PROTOKOLLARI';
      question = 'OSPF protokolida qaysi algoritm qisqa yo\'lni hisoblaydi?';
      options = ["Bellman-Ford (RIP)", "Dijkstra (SPF)", "Floyd-Warshall", "A* algoritm"];
      correctIndex = 1;
      explanation = "OSPF Shortest Path First (SPF) algoritmidan foydalanadi — bu Dijkstra algoritmidir.";
    } else if (texts.includes('osi') || types.includes('net_node')) {
      topic = 'TARMOQ VA PROTOKOLLAR';
      question = "OSI modelida ma'lumotlarni marshrutlash qaysi qatlamda amalga oshiriladi?";
      options = ['1-Qatlam (Fizik)', '2-Qatlam (Kanal)', '3-Qatlam (Tarmoq)', '4-Qatlam (Transport)'];
      correctIndex = 2;
      explanation = "Marshrutlash (Routing) va IP manzillash faqat 3-qatlamda (Tarmoq qatlamida) ishlaydi.";
    } else if (texts.includes('microservice') || texts.includes('gateway')) {
      topic = 'MIKROXIZMATLAR ARXITEKTURASI';
      question = 'Mikroxizmatlar arxitekturasida API Gateway qanday asosiy vazifani bajaradi?';
      options = ["Faqat ma'lumot saqlash", 'Trafikni yo\'naltirish va autentifikatsiya', 'Dasturni kompilyatsiya qilish', 'Operatsion tizimni boshqarish'];
      correctIndex = 1;
      explanation = "API Gateway barcha kiruvchi so'rovlarni markazlashtirilgan tarzda qabul qilib, tegishli mikroxizmatlarga taqsimlaydi.";
    } else if (types.includes('formula') || texts.includes('tenglama')) {
      topic = 'MATEMATIKA VA TENGLAMALAR';
      question = 'Kvadrat tenglamada diskriminant musbat (D > 0) bo\'lsa, ildizlar soni nechta?';
      options = ["0 ta haqiqiy ildiz", "1 ta karrali ildiz", "2 ta turli haqiqiy ildiz", "Cheksiz ko'p"];
      correctIndex = 2;
      explanation = "D > 0 da tenglama har doim ikkita haqiqiy x1 va x2 ildizga ega bo'ladi.";
    } else if (texts.includes('docker') || texts.includes('k8s')) {
      topic = 'KONTEYNERLASHTIRISH';
      question = 'Kubernetes\'da Pod nima?';
      options = ['Bitta konteyner', "Eng kichik deploy birligi (1+ konteyner)", "Node hisoblanadi", "Service hisoblanadi"];
      correctIndex = 1;
      explanation = "Pod — Kubernetes'dagi eng kichik deploy birligi bo'lib, bir yoki bir nechta konteynerni o'z ichiga olishi mumkin.";
    }

    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const quizCard = {
      type: 'quiz_card',
      x: Math.round(center.x - 180),
      y: Math.round(center.y - 120),
      width: 360,
      topic, question, options, correctIndex,
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
     CHAT JAVOBINI DOSKAGA JOYLASH
     ========================================================================== */
  insertChatResponseToBoard(text) {
    const center = this.board.screenToWorld(this.board.width / 2, this.board.height / 2);
    const cleanText = text.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '').replace(/```[\s\S]*?```/g, '').trim();
    const stickyObj = {
      type: 'sticky',
      x: Math.round(center.x - 160),
      y: Math.round(center.y - 90),
      width: 320,
      height: 180,
      bgColor: '#FEF08A',
      textColor: '#1E293B',
      text: `🤖 AI KONSPEKTI:\n${cleanText.substring(0, 300)}${cleanText.length > 300 ? '...' : ''}`
    };

    this.board.saveState();
    this.board.addObject(stickyObj);
    this.board.selectedObject = stickyObj;
    return stickyObj;
  }
}

window.AIBoardEngine = AIBoardEngine;
