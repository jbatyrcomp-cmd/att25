/**
 * att25.uz — Jonli O'quv Materiallari Integratsiyasi va Saytda Ko'rish Tizimi
 * Telegram Bot (@att_upload_bot) orqali yuklangan barcha materiallarni
 * saytning tegishli bo'limlariga joylash va to'g'ridan-to'g'ri brauzerda ko'rish imkoniyati.
 */

(function () {
    const BOT_USERNAME = "att_upload_bot";
    let liveMaterialsCache = [];

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // Universal Ko'rish Modali (Saytda to'g'ridan-to'g'ri ko'rish)
    function ensureModalExists() {
        if (document.getElementById('attLiveMaterialModal')) return;

        const modalHtml = `
            <div id="attLiveMaterialModal" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(2, 9, 5, 0.88); backdrop-filter:blur(12px); z-index:999999; display:none; align-items:center; justify-content:center; padding:16px;">
                <div style="background:#07120B; border:1px solid rgba(0, 255, 135, 0.4); border-radius:14px; width:100%; max-width:860px; max-height:92vh; display:flex; flex-direction:column; box-shadow:0 20px 60px rgba(0, 255, 135, 0.2); overflow:hidden; font-family:'Plus Jakarta Sans', sans-serif;">
                    
                    <!-- Modal Header -->
                    <div style="padding:16px 22px; border-bottom:1px solid rgba(0,255,135,0.18); display:flex; align-items:center; justify-content:space-between; background:rgba(0,255,135,0.04);">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span id="attModalIcon" style="font-size:26px;">📄</span>
                            <div>
                                <h3 id="attModalTitle" style="color:#fff; font-size:17px; font-weight:700; margin:0; line-height:1.3;">Material Nomi</h3>
                                <div style="display:flex; gap:8px; align-items:center; margin-top:4px;">
                                    <span id="attModalBadge" style="font-size:11px; color:#00FF87; font-weight:700; background:rgba(0,255,135,0.12); padding:2px 8px; border-radius:4px; border:1px solid rgba(0,255,135,0.3);">Bo'lim</span>
                                    <span id="attModalMeta" style="font-size:12px; color:#94a3b8;">Muallif</span>
                                </div>
                            </div>
                        </div>
                        <button onclick="closeLiveModal()" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:34px; height:34px; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.18)'" onmouseout="this.style.background='rgba(255,255,255,0.08)'">✕</button>
                    </div>

                    <!-- Modal Body / In-Browser Interactive Viewer -->
                    <div id="attModalBody" style="padding:20px; overflow-y:auto; flex:1; background:rgba(0,0,0,0.25);">
                        <!-- Dinamik viewer -->
                    </div>

                    <!-- Modal Footer -->
                    <div style="padding:14px 22px; border-top:1px solid rgba(0,255,135,0.15); display:flex; gap:12px; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.4); flex-wrap:wrap;">
                        <div id="attModalFileBadge" style="font-size:12px; color:#94a3b8; font-family:'JetBrains Mono', monospace;">
                            Fayl hajmi: -
                        </div>
                        <div style="display:flex; gap:10px; flex-wrap:wrap;">
                            <a id="attDirectViewBtn" href="#" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:700; background:linear-gradient(135deg, #00FF87, #00F0FF); color:#04150C; box-shadow:0 4px 15px rgba(0,255,135,0.3);">
                                Yangi Oynada Ochish ↗
                            </a>
                            <a id="attTgBotBtn" href="#" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:6px; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:700; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff;">
                                Telegramdan Yuklash 📥
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Escape tugmasi orqali yopish
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLiveModal();
        });
    }

    window.closeLiveModal = function() {
        const modal = document.getElementById('attLiveMaterialModal');
        if (modal) modal.style.display = 'none';
        const body = document.getElementById('attModalBody');
        if (body) body.innerHTML = '';
    };

    window.openLiveModal = function(matId) {
        const m = liveMaterialsCache.find(x => x.id === matId);
        if (!m) return;

        ensureModalExists();
        const modal = document.getElementById('attLiveMaterialModal');
        document.getElementById('attModalTitle').textContent = m.name;
        document.getElementById('attModalBadge').textContent = `${m.category_emoji || '📁'} ${m.category_name}`;
        document.getElementById('attModalMeta').textContent = `Joylovchi: ${m.uploader_name} • ${m.created_at ? m.created_at.split(' ')[0] : ''}`;
        document.getElementById('attModalIcon').textContent = m.category_emoji || '📄';
        document.getElementById('attModalFileBadge').textContent = `Fayl: ${m.file_name} (${formatBytes(m.file_size)})`;

        const origin = window.location.origin;
        const fileViewUrl = `/api/file?id=${m.id}`;
        const absoluteFileUrl = `${origin}/api/file?id=${m.id}`;
        const botLink = `https://t.me/${BOT_USERNAME}?start=get_${m.id}`;

        document.getElementById('attDirectViewBtn').href = fileViewUrl;
        document.getElementById('attTgBotBtn').href = botLink;

        const body = document.getElementById('attModalBody');
        const ext = (m.file_type || '').toLowerCase();
        let viewerHtml = '';

        // 1. RASMLAR (.jpg, .png, .webp, .gif)
        if (['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext)) {
            viewerHtml = `
                <div style="text-align:center; margin-bottom:16px;">
                    <img src="${fileViewUrl}" alt="${m.name}" style="max-width:100%; max-height:480px; border-radius:8px; border:1px solid rgba(0,255,135,0.25); box-shadow:0 10px 30px rgba(0,0,0,0.5);">
                </div>
            `;
        }
        // 2. VIDEOLAR (.mp4, .mov, .webm, .mkv)
        else if (['.mp4', '.mov', '.webm', '.mkv'].includes(ext)) {
            // Telegram Bot API limiti: 20MB gacha bo'lgan videolarni saytda to'g'ridan-to'g'ri o'ynatish
            if (m.file_size <= 20 * 1024 * 1024) {
                viewerHtml = `
                    <div style="text-align:center; margin-bottom:16px;">
                        <video controls autoplay playsinline style="width:100%; max-height:460px; border-radius:8px; background:#000; border:1px solid rgba(0,255,135,0.3); box-shadow:0 10px 30px rgba(0,0,0,0.6);">
                            <source src="${fileViewUrl}" type="video/mp4">
                            Brauzeringiz videoni qo'llab-quvvatlamaydi.
                        </video>
                    </div>
                `;
            } else {
                // 20MB dan katta video (Masalan 1080p 51MB video)
                viewerHtml = `
                    <div style="background:linear-gradient(135deg, rgba(0,255,135,0.06), rgba(0,240,255,0.04)); border:1px solid rgba(0,255,135,0.3); border-radius:10px; padding:28px 20px; text-align:center; margin-bottom:18px;">
                        <div style="font-size:54px; margin-bottom:12px;">🎬</div>
                        <h4 style="color:#fff; font-size:18px; font-weight:800; margin:0 0 8px 0;">${m.name}</h4>
                        <div style="display:inline-block; background:rgba(0,255,135,0.15); color:#00FF87; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:700; margin-bottom:16px;">
                            Full HD 1080p Video • ${formatBytes(m.file_size)}
                        </div>
                        <p style="color:#94a3b8; font-size:13px; max-width:540px; margin:0 auto 20px auto; line-height:1.5;">
                            Ushbu video yuqori sifatli (${formatBytes(m.file_size)}) bo'lganligi sababli, uni Telegram orqali 1-bosishda eng yuqori tezlikda (1080p) tomosha qilishingiz mumkin!
                        </p>
                        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
                            <a href="${botLink}" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; padding:12px 24px; border-radius:8px; background:linear-gradient(135deg, #00FF87, #00F0FF); color:#04150C; font-weight:800; font-size:14px; box-shadow:0 4px 20px rgba(0,255,135,0.35);">
                                ▶️ Telegramda Tomosha Qilish (1080p) 🚀
                            </a>
                            <a href="${fileViewUrl}" target="_blank" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; padding:12px 20px; border-radius:8px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; font-weight:700; font-size:14px;">
                                📥 To'g'ridan-to'g'ri Yuklash
                            </a>
                        </div>
                    </div>
                `;
            }
        }
        // 3. TAQDIMOTLAR (PPTX, PPT) VA HUJJATLAR (DOCX, XLSX)
        else if (['.pptx', '.ppt', '.docx', '.doc', '.xlsx'].includes(ext)) {
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteFileUrl)}&embedded=true`;
            const officeViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteFileUrl)}`;

            viewerHtml = `
                <div style="margin-bottom:16px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; padding:0 4px;">
                        <span style="font-size:12px; color:#00FF87; font-weight:700;">📊 Slaydlarni Saytda Ko'rish (Interactive Viewer):</span>
                        <div style="display:flex; gap:8px;">
                            <button onclick="document.getElementById('docViewerIframe').src='${googleViewerUrl}'" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Google Viewer</button>
                            <button onclick="document.getElementById('docViewerIframe').src='${officeViewerUrl}'" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:4px 8px; border-radius:4px; font-size:11px; cursor:pointer;">Office Viewer</button>
                        </div>
                    </div>
                    <iframe id="docViewerIframe" src="${googleViewerUrl}" style="width:100%; height:480px; border:1px solid rgba(0,255,135,0.3); border-radius:8px; background:#111;" allowfullscreen></iframe>
                </div>
            `;
        }
        // 4. PDF HUJJATLAR
        else if (ext === '.pdf') {
            viewerHtml = `
                <div style="margin-bottom:16px;">
                    <iframe src="${fileViewUrl}" style="width:100%; height:500px; border:1px solid rgba(0,255,135,0.3); border-radius:8px; background:#111;"></iframe>
                </div>
            `;
        }
        // 5. AUDIO FAYLLAR (.mp3, .wav, .ogg, .m4a)
        else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
            viewerHtml = `
                <div style="background:rgba(0,255,135,0.05); border:1px solid rgba(0,255,135,0.25); border-radius:10px; padding:24px; text-align:center; margin-bottom:16px;">
                    <div style="font-size:42px; margin-bottom:12px;">🎵</div>
                    <h4 style="color:#fff; font-size:16px; margin:0 0 16px 0;">${m.name}</h4>
                    <audio controls autoplay style="width:100%; max-width:540px;">
                        <source src="${fileViewUrl}">
                        Brauzeringiz audio pleerni qo'llab-quvvatlamaydi.
                    </audio>
                </div>
            `;
        }

        body.innerHTML = `
            ${viewerHtml}
            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.07); padding:16px 18px; border-radius:10px;">
                <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; font-size:13px; color:#94a3b8; margin-bottom:8px;">
                    <div><strong>Fayl:</strong> <code>${m.file_name}</code></div>
                    <div><strong>Hajmi:</strong> ${formatBytes(m.file_size)}</div>
                    <div><strong>Joylagan:</strong> ${m.uploader_name}</div>
                </div>
                <div style="font-size:14px; color:#e2e8f0; line-height:1.6; margin-top:10px; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px;">
                    <strong>Tavsif:</strong><br>
                    ${m.description || 'Tavsif berilmagan.'}
                    ${m.comment ? `<div style="margin-top:8px; color:#00FF87;">💬 <b>Izoh:</b> ${m.comment}</div>` : ''}
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    };

    async function loadLiveMaterials() {
        try {
            const res = await fetch('/api/admin?action=materials&limit=100');
            if (!res.ok) return;
            const materials = await res.json();
            if (!Array.isArray(materials) || materials.length === 0) return;

            liveMaterialsCache = materials;
            renderMaterialsToSections(materials);
        } catch (e) {
            console.warn("Materiallarni yuklashda ogohlantirish:", e);
        }
    }

    function renderMaterialsToSections(materials) {
        const docsGrid = document.getElementById('docsGrid');
        const pubGrid = document.getElementById('pubCardsGrid');
        const resourcesGrid = document.querySelector('#manbalar .resources-grid');
        const mediaMainGrid = document.getElementById('mediaMainGrid');
        const videoGrid = document.getElementById('videoMaterialsGrid');

        materials.forEach(m => {
            const catName = (m.category_name || "").toLowerCase();
            const sizeStr = formatBytes(m.file_size);
            const ext = (m.file_type || "").replace('.', '').toUpperCase() || 'FAYL';
            const isVideo = ['.mp4', '.mov', '.webm', '.mkv'].includes((m.file_type || '').toLowerCase());

            // 1. TAQDIMOTLAR & SLAYDLAR (#taqdimotlar -> #docsGrid)
            if (catName.includes('taqdimot') || catName.includes('slayd')) {
                if (docsGrid) {
                    const card = document.createElement('div');
                    card.className = 'doc-card live-bot-card';
                    card.setAttribute('data-doc-type', 'presentation');
                    card.style.borderColor = 'rgba(0, 255, 135, 0.5)';
                    card.style.boxShadow = '0 6px 24px rgba(0, 255, 135, 0.12)';

                    card.innerHTML = `
                        <div class="doc-preview-header" onclick="openLiveModal(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, rgba(0,255,135,0.12), rgba(0,0,0,0.4));">
                            <span class="doc-badge-type" style="background:rgba(0,255,135,0.22); color:#00FF87; border:1px solid rgba(0,255,135,0.6); font-weight:800;">⚡ SAYTDA KO‘RISH</span>
                            <div class="doc-icon-watermark">📊</div>
                        </div>
                        <div class="doc-body">
                            <h3 class="doc-title" onclick="openLiveModal(${m.id})" style="cursor:pointer;" title="${m.name}">${m.name}</h3>
                            <span class="doc-author">Yuklovchi: <b>${m.uploader_name}</b></span>
                            <div class="doc-footer">
                                <span class="doc-pages">${ext} • ${sizeStr}</span>
                                <button onclick="openLiveModal(${m.id})" class="doc-btn" style="cursor:pointer; display:inline-flex; align-items:center; gap:5px; background:linear-gradient(135deg, #00FF87, #00F0FF); color:#04150C; font-weight:800; border:none; padding:8px 14px; border-radius:4px;">
                                    Ko‘rish 👁️
                                </button>
                            </div>
                        </div>
                    `;
                    docsGrid.prepend(card);
                }
            }

            // 2. MEDIA HUB — VIDEOLAR (#videoMaterialsGrid)
            else if (isVideo || catName.includes('video') || (catName.includes('media') && isVideo)) {
                if (videoGrid) {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card-item live-bot-card';
                    videoCard.style.borderColor = 'rgba(0, 255, 135, 0.5)';
                    videoCard.style.boxShadow = '0 6px 24px rgba(0, 255, 135, 0.12)';

                    videoCard.innerHTML = `
                        <div class="video-card-thumb" onclick="openLiveModal(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, #071910, #0E2E1E); display:flex; align-items:center; justify-content:center; min-height:160px; position:relative;">
                            <span style="font-size:48px;">🎬</span>
                            <div class="video-card-play-btn" style="background:#00FF87; color:#04150C;">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                            <span class="video-duration-pill" style="background:rgba(0,0,0,0.85); border:1px solid #00FF87; color:#00FF87; font-weight:800;">
                                ⚡ BOT • ${sizeStr}
                            </span>
                        </div>
                        <div class="video-card-body">
                            <div>
                                <div class="video-card-meta">
                                    <span class="video-card-tag" style="background:rgba(0,255,135,0.2); color:#00FF87; border:1px solid rgba(0,255,135,0.4);">MEDIA HUB</span>
                                    <span style="font-size:11px; color:var(--text-dim);">${m.uploader_name}</span>
                                </div>
                                <h4 class="video-card-title" onclick="openLiveModal(${m.id})" style="cursor:pointer;">${m.name}</h4>
                                <p class="video-desc">${m.description || 'Sayt foydalanuvchisi tomonidan joylangan video material.'}</p>
                            </div>
                            <button class="btn-arsenal-secondary video-card-btn" onclick="openLiveModal(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, rgba(0,255,135,0.15), rgba(0,240,255,0.1)); border-color:#00FF87; color:#00FF87; font-weight:800;">
                                ▶ Saytda Ko‘rish 👁️
                            </button>
                        </div>
                    `;
                    videoGrid.prepend(videoCard);
                }
            }

            // 3. MEDIA HUB — FOTOLAR (.photo-gallery-side)
            else if (catName.includes('media') || catName.includes('foto') || ['.jpg', '.jpeg', '.png', '.webp'].includes(ext.toLowerCase())) {
                if (mediaMainGrid) {
                    const sideGallery = mediaMainGrid.querySelector('.photo-gallery-side');
                    if (sideGallery) {
                        const item = document.createElement('div');
                        item.className = 'gallery-card live-bot-card';
                        item.style.border = '1px solid rgba(0, 255, 135, 0.45)';
                        item.style.cursor = 'pointer';
                        item.onclick = function() { openLiveModal(m.id); };

                        item.innerHTML = `
                            <div style="height:100%; min-height:120px; background:linear-gradient(135deg, rgba(0,255,135,0.1), rgba(0,0,0,0.5)); display:flex; flex-direction:column; justify-content:center; align-items:center; padding:12px; text-align:center;">
                                <span style="font-size:32px;">📸</span>
                                <strong style="font-size:12px; color:#fff; margin-top:6px;">${m.name}</strong>
                                <span style="font-size:11px; color:#00FF87; margin-top:4px; font-weight:700;">Saytda Ko‘rish 👁️</span>
                            </div>
                            <div class="gallery-caption-overlay">${m.name} (${sizeStr}) 🔍</div>
                        `;
                        sideGallery.prepend(item);
                    }
                }
            }

            // 4. ILMIY MAQOLALAR (#maqolalar -> #pubCardsGrid)
            else if (catName.includes('maqola') || catName.includes('ilmiy')) {
                if (pubGrid) {
                    const card = document.createElement('div');
                    card.className = 'pub-card live-bot-card';
                    card.setAttribute('data-pub-cat', 'all');
                    card.style.borderColor = 'rgba(0, 240, 255, 0.45)';
                    card.style.boxShadow = '0 6px 24px rgba(0, 240, 255, 0.12)';

                    card.innerHTML = `
                        <div class="pub-header">
                            <span class="pub-badge" style="background:rgba(0,240,255,0.2); color:#00F0FF; border:1px solid rgba(0,240,255,0.5); font-weight:800;">⚡ SAYTDA O‘QISH</span>
                            <span class="pub-doi">${ext} • ${sizeStr}</span>
                        </div>
                        <h3 class="pub-title" onclick="openLiveModal(${m.id})" style="cursor:pointer;">${m.name}</h3>
                        <p class="pub-snippet">${m.description || 'Talabalar va o‘qituvchilar tomonidan joylangan ilmiy maqola.'}</p>
                        <div class="pub-footer">
                            <span class="pub-author">Muallif: <b>${m.uploader_name}</b></span>
                            <button onclick="openLiveModal(${m.id})" class="pub-read-btn" style="background:none; border:none; cursor:pointer; font-weight:800; color:#00F0FF;">
                                Saytda Ko‘rish 👁️ →
                            </button>
                        </div>
                    `;
                    pubGrid.prepend(card);
                }
            }

            // 5. DARSLIKLAR & MANBALAR (#manbalar -> .resources-grid)
            else if (catName.includes('manba') || catName.includes('kitob') || catName.includes('darslik') || catName.includes('adabiyot')) {
                if (resourcesGrid) {
                    const card = document.createElement('div');
                    card.className = 'resource-card live-bot-card';
                    card.style.borderColor = 'rgba(0, 255, 135, 0.45)';
                    card.style.cursor = 'pointer';
                    card.onclick = function() { openLiveModal(m.id); };

                    card.innerHTML = `
                        <div class="resource-icon" style="color:#00FF87;">📚</div>
                        <h3 class="resource-title">${m.name}</h3>
                        <p class="resource-desc">${m.description || 'Yuklovchi: ' + m.uploader_name}</p>
                        <span class="resource-link" style="color:#00FF87; font-weight:700;">Saytda Ko‘rish & Yuklash (${sizeStr}) 👁️</span>
                    `;
                    resourcesGrid.prepend(card);
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
