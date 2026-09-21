/* ==========================================================================
   CIRCUIT TEMPLATES MODAL CONTROLLER
   ATT-25 Circuit Lab - 200 Ready-Made Circuit Templates UI & Loader
   ========================================================================== */

class CircuitTemplatesModal {
  constructor(app) {
    this.app = app;
    this.modal = document.getElementById('templatesModal');
    this.templates = window.CIRCUIT_TEMPLATES || [];
    this.categories = window.CIRCUIT_CATEGORIES || [];
    this.activeCategory = 'all';
    this.activeDifficulty = 'all';
    this.searchQuery = '';
    this.selectedTemplate = null;

    this.initElements();
    this.bindEvents();
  }

  initElements() {
    this.searchInput = document.getElementById('tmplSearchInput');
    this.categoryBar = document.getElementById('tmplCategoryBar');
    this.diffFilter = document.getElementById('tmplDiffFilter');
    this.gridContainer = document.getElementById('tmplGridContainer');
    this.countBadge = document.getElementById('tmplCountBadge');
    this.btnClose = document.getElementById('btnTmplClose');
    this.btnOpen = document.getElementById('btnTemplatesModal');
    this.detailModal = document.getElementById('tmplDetailModal');
    this.detailClose = document.getElementById('btnDetailClose');
  }

  bindEvents() {
    if (this.btnOpen) {
      this.btnOpen.addEventListener('click', () => this.open());
    }

    if (this.btnClose) {
      this.btnClose.addEventListener('click', () => this.close());
    }

    // Backdrop click
    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Detail modal close
    if (this.detailClose) {
      this.detailClose.addEventListener('click', () => {
        if (this.detailModal) this.detailModal.classList.remove('active');
      });
    }

    // Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.detailModal && this.detailModal.classList.contains('active')) {
          this.detailModal.classList.remove('active');
        } else if (this.modal && this.modal.classList.contains('active')) {
          this.close();
        }
      }
    });

    // Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderGrid();
      });
    }

    // Difficulty filter buttons
    if (this.diffFilter) {
      this.diffFilter.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.diffFilter.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.activeDifficulty = btn.dataset.diff;
          this.renderGrid();
        });
      });
    }

    // Render category buttons
    this.renderCategoryBar();
  }

  open() {
    if (!this.modal) return;
    this.modal.classList.add('active');
    if (this.searchInput) {
      this.searchInput.focus();
    }
    this.renderGrid();
  }

  close() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
  }

  renderCategoryBar() {
    if (!this.categoryBar) return;
    this.categoryBar.innerHTML = '';

    this.categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.className = `cat-tab-btn ${this.activeCategory === cat.id ? 'active' : ''}`;
      btn.innerHTML = `<span>${cat.icon}</span> <span>${cat.name}</span> <span class="cat-badge">${cat.count}</span>`;
      btn.addEventListener('click', () => {
        this.categoryBar.querySelectorAll('.cat-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.activeCategory = cat.id;
        this.renderGrid();
      });
      this.categoryBar.appendChild(btn);
    });
  }

  getFilteredTemplates() {
    return this.templates.filter(t => {
      // Category filter
      if (this.activeCategory !== 'all' && t.category !== this.activeCategory) {
        return false;
      }
      // Difficulty filter
      if (this.activeDifficulty !== 'all' && t.difficulty !== this.activeDifficulty) {
        return false;
      }
      // Search query
      if (this.searchQuery) {
        const query = this.searchQuery;
        const inTitle = t.title.toLowerCase().includes(query);
        const inDesc = t.desc.toLowerCase().includes(query);
        const inTheory = t.theory.toLowerCase().includes(query);
        const inCategory = t.categoryName.toLowerCase().includes(query);
        const inTags = t.tags && t.tags.some(tag => tag.toLowerCase().includes(query));
        const inNumber = t.num.toString() === query || ('#' + t.num) === query;
        if (!inTitle && !inDesc && !inTheory && !inCategory && !inTags && !inNumber) {
          return false;
        }
      }
      return true;
    });
  }

  renderGrid() {
    if (!this.gridContainer) return;
    const filtered = this.getFilteredTemplates();

    if (this.countBadge) {
      this.countBadge.textContent = `${this.templates.length} ta shablondan ${filtered.length} tasi ko'rsatilmoqda`;
    }

    if (filtered.length === 0) {
      this.gridContainer.innerHTML = `
        <div class="tmpl-empty-state">
          <div class="empty-icon">🔍</div>
          <h3>Mos sxema topilmadi</h3>
          <p>Qidiruv so'zini o'zgartiring yoki filtrlarni tozalang.</p>
        </div>
      `;
      return;
    }

    this.gridContainer.innerHTML = '';

    filtered.forEach(t => {
      const card = document.createElement('div');
      card.className = 'tmpl-card';

      const diffClass = t.difficulty === 'beginner' ? 'diff-easy' : (t.difficulty === 'intermediate' ? 'diff-med' : 'diff-hard');

      // Extract unique component types
      const compTypes = [...new Set(t.components.map(c => c.type))];
      const compSummary = compTypes.map(type => this.formatComponentType(type)).join(', ');

      card.innerHTML = `
        <div class="card-header">
          <span class="card-num">#${t.num}</span>
          <span class="card-category">${t.categoryName}</span>
          <span class="card-diff ${diffClass}">${t.difficultyName}</span>
        </div>
        <h4 class="card-title">${t.title}</h4>
        <p class="card-desc">${t.desc}</p>
        <div class="card-meta">
          <span class="meta-item" title="Ishlatilgan elementlar">📦 ${compSummary}</span>
        </div>
        <div class="card-actions">
          <button class="btn-card-load" data-id="${t.id}">
            <svg viewBox="0 0 24 24" width="16" height="16"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>Yuklash</span>
          </button>
          <button class="btn-card-detail" data-id="${t.id}" title="Nazariya va ko'rsatmalar">
            <svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            <span>Nazariya</span>
          </button>
        </div>
      `;

      // Load click
      const loadBtn = card.querySelector('.btn-card-load');
      loadBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.loadTemplate(t);
      });

      // Detail click
      const detailBtn = card.querySelector('.btn-card-detail');
      detailBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.showDetails(t);
      });

      // Clicking the card opens details or loads
      card.addEventListener('click', () => {
        this.showDetails(t);
      });

      this.gridContainer.appendChild(card);
    });
  }

  formatComponentType(type) {
    const map = {
      'battery': 'Batareya',
      'battery_9v': '9V Batareya',
      'battery_1v5': '1.5V Batareya',
      'resistor': 'Rezistor',
      'resistor_1k': '1kΩ Rezistor',
      'bulb': 'Lampochka',
      'led': 'Qizil LED',
      'led_green': 'Yashil LED',
      'switch': 'Kalit',
      'buzzer': 'Buzzer',
      'ground': 'GND',
      'potentiometer': 'Potensiometr',
      'ldr': 'LDR',
      'capacitor': 'Kondensator',
      'transistor_npn': 'NPN Tranzistor',
      'motor': 'DC Motor',
      'gate_and': 'AND Gate',
      'gate_or': 'OR Gate',
      'gate_not': 'NOT Gate',
      'gate_nand': 'NAND Gate',
      'gate_nor': 'NOR Gate',
      'gate_xor': 'XOR Gate',
      'seven_segment': '7-Segment',
      'timer_555': 'NE555 IC',
      'arduino_uno': 'Arduino Uno'
    };
    return map[type] || type;
  }

  showDetails(template) {
    this.selectedTemplate = template;
    if (!this.detailModal) return;

    const titleEl = document.getElementById('detailTitle');
    const badgeEl = document.getElementById('detailBadge');
    const theoryEl = document.getElementById('detailTheory');
    const descEl = document.getElementById('detailDesc');
    const instrEl = document.getElementById('detailInstructions');
    const loadBtn = document.getElementById('btnDetailLoad');

    if (titleEl) titleEl.textContent = `#${template.num}: ${template.title}`;
    if (badgeEl) {
      badgeEl.textContent = `${template.categoryName} • ${template.difficultyName}`;
      badgeEl.className = `detail-badge ${template.difficulty === 'beginner' ? 'diff-easy' : (template.difficulty === 'intermediate' ? 'diff-med' : 'diff-hard')}`;
    }
    if (descEl) descEl.textContent = template.desc;
    if (theoryEl) theoryEl.textContent = template.theory;

    if (instrEl) {
      instrEl.innerHTML = '';
      if (template.instructions && template.instructions.length > 0) {
        template.instructions.forEach(ins => {
          const li = document.createElement('li');
          li.textContent = ins;
          instrEl.appendChild(li);
        });
      }
    }

    if (loadBtn) {
      loadBtn.onclick = () => {
        this.loadTemplate(template);
        this.detailModal.classList.remove('active');
      };
    }

    this.detailModal.classList.add('active');
  }

  loadTemplate(template) {
    if (!template) return;

    try {
      if (this.app && this.app.storage) {
        this.app.storage.deserialize(template, {
          clearCircuit: () => {
            if (this.app.clearCircuit) this.app.clearCircuit();
          }
        });

        // Sync 3D Breadboard if available
        if (this.app.breadboard3d && (this.app.mode === 'breadboard' || this.app.mode === 'split')) {
          this.app.breadboard3d.syncFromEngine();
        }

        // Update Live Controls HUD
        if (window.liveControls) {
          window.liveControls.renderHud();
        }

        if (this.app.toast) {
          this.app.toast(`⚡ #${template.num}: "${template.title}" yuklandi!`);
        }

        this.close();
      } else {
        console.error("CircuitStorage mavjud emas!");
      }
    } catch (err) {
      console.error("Shablonni yuklashda xatolik:", err);
      if (this.app && this.app.toast) {
        this.app.toast(`❌ Xatolik: ${err.message}`, 4000);
      }
    }
  }
}

window.CircuitTemplatesModal = CircuitTemplatesModal;
