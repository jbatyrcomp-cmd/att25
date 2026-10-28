/**
 * att25.uz — Jonli O'quv Materiallari Integratsiyasi
 * Telegram bot orqali yuklangan materiallarni saytning tegishli bo'limlariga avtomatik joylaydi.
 */

(function () {
    const BOT_USERNAME = "att_upload_bot";

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    async function loadLiveMaterials() {
        try {
            const res = await fetch('/api/admin?action=materials&limit=100');
            if (!res.ok) return;
            const materials = await res.json();
            if (!Array.isArray(materials) || materials.length === 0) return;

            renderMaterialsToSections(materials);
        } catch (e) {
            console.warn("Materiallarni yuklashda xatolik:", e);
        }
    }

    function renderMaterialsToSections(materials) {
        // 1. Taqdimotlar & Slaydlar (#taqdimotlar -> #docsGrid)
        const docsGrid = document.getElementById('docsGrid');
        // 2. Ilmiy Maqolalar (#maqolalar -> #pubCardsGrid)
        const pubGrid = document.getElementById('pubCardsGrid');
        // 3. Manbalar & Kitoblar (#manbalar -> .resources-grid)
        const resourcesGrid = document.querySelector('#manbalar .resources-grid');
        // 4. Media Hub (#media-hub)
        const mediaMainGrid = document.getElementById('mediaMainGrid');

        materials.forEach(m => {
            const catName = (m.category_name || "").toLowerCase();
            const botLink = `https://t.me/${BOT_USERNAME}?start=get_${m.id}`;
            const sizeStr = formatBytes(m.file_size);
            const ext = (m.file_type || "").replace('.', '').toUpperCase() || 'FAYL';

            // 1. TAQDIMOTLAR BO'LIMIGA JOYLANISHI
            if (catName.includes('taqdimot') || catName.includes('slayd')) {
                if (docsGrid) {
                    const card = document.createElement('div');
                    card.className = 'doc-card live-bot-card';
                    card.setAttribute('data-doc-type', 'presentation');
                    card.style.borderColor = 'rgba(0, 255, 135, 0.4)';
                    card.style.boxShadow = '0 4px 20px rgba(0, 255, 135, 0.08)';

                    card.innerHTML = `
                        <div class="doc-preview-header">
                            <span class="doc-badge-type" style="background:rgba(0,255,135,0.18); color:#00FF87; border: 1px solid rgba(0,255,135,0.4);">⚡ BOTDAN • YANGI</span>
                            <div class="doc-icon-watermark">📊</div>
                        </div>
                        <div class="doc-body">
                            <h3 class="doc-title">${m.name}</h3>
                            <span class="doc-author">Yuklovchi: <b>${m.uploader_name}</b></span>
                            <div class="doc-footer">
                                <span class="doc-pages">${ext} • ${sizeStr}</span>
                                <a href="${botLink}" target="_blank" class="doc-btn" style="text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                                    Yuklab Olish 📥
                                </a>
                            </div>
                        </div>
                    `;
                    docsGrid.prepend(card);
                }
            }

            // 2. ILMIY MAQOLALAR BO'LIMIGA JOYLANISHI
            else if (catName.includes('maqola') || catName.includes('ilmiy')) {
                if (pubGrid) {
                    const card = document.createElement('div');
                    card.className = 'pub-card live-bot-card';
                    card.setAttribute('data-pub-cat', 'all');
                    card.style.borderColor = 'rgba(0, 240, 255, 0.4)';
                    card.style.boxShadow = '0 4px 20px rgba(0, 240, 255, 0.08)';

                    card.innerHTML = `
                        <div class="pub-header">
                            <span class="pub-badge" style="background:rgba(0,240,255,0.15); color:#00F0FF; border:1px solid rgba(0,240,255,0.4);">⚡ BOTDAN ILMIY MAQOLA</span>
                            <span class="pub-doi">${ext} • ${sizeStr}</span>
                        </div>
                        <h3 class="pub-title">${m.name}</h3>
                        <p class="pub-snippet">${m.description || 'Talabalar va o‘qituvchilar tomonidan joylangan ilmiy maqola.'}</p>
                        <div class="pub-footer">
                            <span class="pub-author">Muallif: ${m.uploader_name}</span>
                            <a href="${botLink}" target="_blank" class="pub-read-btn" style="text-decoration:none;">To‘liq O‘qish (Botdan) 📥</a>
                        </div>
                    `;
                    pubGrid.prepend(card);
                }
            }

            // 3. DARSLIKLAR & MANBALAR BO'LIMIGA JOYLANISHI
            else if (catName.includes('manba') || catName.includes('kitob') || catName.includes('darslik')) {
                if (resourcesGrid) {
                    const card = document.createElement('a');
                    card.href = botLink;
                    card.target = '_blank';
                    card.rel = 'noopener';
                    card.className = 'resource-card live-bot-card';
                    card.style.borderColor = 'rgba(0, 255, 135, 0.4)';

                    card.innerHTML = `
                        <div class="resource-icon" style="color:#00FF87;">📚</div>
                        <h3 class="resource-title">${m.name}</h3>
                        <p class="resource-desc">${m.description || 'Yuklovchi: ' + m.uploader_name}</p>
                        <span class="resource-link" style="color:#00FF87;">Botdan Yuklab Olish (${ext} • ${sizeStr}) 📥</span>
                    `;
                    resourcesGrid.prepend(card);
                }
            }

            // 4. MEDIA HUB BO'LIMIGA JOYLANISHI
            else if (catName.includes('media') || catName.includes('video') || catName.includes('foto')) {
                if (mediaMainGrid) {
                    // Agar photo gallery bo'lsa yoki video
                    const sideGallery = mediaMainGrid.querySelector('.photo-gallery-side');
                    if (sideGallery) {
                        const item = document.createElement('div');
                        item.className = 'gallery-card live-bot-card';
                        item.style.border = '1px solid rgba(0, 255, 135, 0.4)';
                        item.onclick = function() { window.open(botLink, '_blank'); };
                        item.innerHTML = `
                            <div style="height:100%; min-height:110px; background:rgba(0,255,135,0.06); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:12px; text-align:center;">
                                <span style="font-size:24px;">📹</span>
                                <strong style="font-size:12px; color:#fff; margin-top:4px;">${m.name}</strong>
                                <span style="font-size:10px; color:#00FF87; margin-top:2px;">Olish 📥</span>
                            </div>
                            <div class="gallery-caption-overlay">${m.name} (${sizeStr}) 🔍</div>
                        `;
                        sideGallery.prepend(item);
                    }
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadLiveMaterials);
    } else {
        loadLiveMaterials();
    }
})();
