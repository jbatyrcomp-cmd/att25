/**
 * att25.uz — Mukammal Slayd-ba-Slayd Prezentatsiyalar Ko'ruvchisi
 * va Cheklanmagan Videolar Pleyeri Dvigateli
 */

(function () {
    const BOT_USERNAME = "att_upload_bot";
    let liveMaterialsCache = [];
    let allVideosPlaylist = [];
    let currentVideoIndex = 0;
    let autoPlayNextVideo = true;

    // PDF.js State
    let pdfDoc = null;
    let currentPdfPage = 1;
    let totalPdfPages = 0;
    let pdfPageRendering = false;
    let pdfPageNumPending = null;
    let pdfScale = 1.4;

    function formatBytes(bytes) {
        if (!bytes || bytes === 0) return '0 KB';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    // =========================================================================
    // 1. MUKAMMAL SLAYD-BA-SLAYD PREZENTATSIYA KO'RUVCHISI (PRESENTATION VIEWER)
    // =========================================================================

    function ensurePresentationModalExists() {
        if (document.getElementById('attMasterPresentationModal')) return;

        const modalHtml = `
            <div id="attMasterPresentationModal" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(2, 9, 5, 0.94); backdrop-filter:blur(14px); z-index:999999; display:none; align-items:center; justify-content:center; padding:12px; font-family:'Plus Jakarta Sans', sans-serif;">
                <div style="background:#07120B; border:1px solid rgba(0, 255, 135, 0.45); border-radius:14px; width:100%; max-width:1200px; height:94vh; display:flex; flex-direction:column; box-shadow:0 25px 80px rgba(0, 255, 135, 0.22); overflow:hidden;">
                    
                    <!-- Top Presentation Control Deck -->
                    <div style="padding:12px 20px; border-bottom:1px solid rgba(0,255,135,0.2); display:flex; align-items:center; justify-content:space-between; background:rgba(0,255,135,0.04); flex-wrap:wrap; gap:10px;">
                        
                        <!-- Left: Info -->
                        <div style="display:flex; align-items:center; gap:12px; min-width:220px;">
                            <span style="font-size:26px;">📊</span>
                            <div>
                                <h3 id="attPresTitle" style="color:#fff; font-size:15px; font-weight:800; margin:0; max-width:320px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Taqdimot Nomi</h3>
                                <div style="display:flex; gap:6px; align-items:center; margin-top:2px;">
                                    <span id="attPresTypeBadge" style="font-size:10px; color:#00FF87; font-weight:800; background:rgba(0,255,135,0.15); padding:1px 6px; border-radius:3px;">PPTX</span>
                                    <span id="attPresUploader" style="font-size:11px; color:#94a3b8;">Muallif</span>
                                </div>
                            </div>
                        </div>

                        <!-- Center: Slayd-ba-Slayd O'tkazish Boshqaruvi -->
                        <div id="attSlideNavControls" style="display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.5); padding:4px 10px; border-radius:30px; border:1px solid rgba(0,255,135,0.3);">
                            <button id="attFirstSlideBtn" title="Birinchi slayd (Home)" style="background:none; border:none; color:#94a3b8; font-size:14px; cursor:pointer; padding:4px 8px; border-radius:4px;">⏮️</button>
                            <button id="attPrevSlideBtn" title="Oldingi slayd (← Chapga)" style="background:rgba(0,255,135,0.15); border:1px solid rgba(0,255,135,0.4); color:#00FF87; font-size:13px; font-weight:800; cursor:pointer; padding:6px 14px; border-radius:6px; display:inline-flex; align-items:center; gap:4px;">
                                ◀ Oldingi
                            </button>
                            
                            <div style="display:flex; align-items:center; gap:4px; font-family:'JetBrains Mono', monospace; font-size:13px; color:#fff; padding:0 6px;">
                                <span>Slayd</span>
                                <input id="attSlideNumInput" type="number" min="1" value="1" style="width:44px; height:26px; text-align:center; background:#14221A; border:1px solid #00FF87; color:#00FF87; border-radius:4px; font-weight:800; font-size:13px;">
                                <span>/</span>
                                <span id="attTotalSlidesCount" style="color:#94a3b8; font-weight:700;">1</span>
                            </div>

                            <button id="attNextSlideBtn" title="Keyingi slayd (→ O'ngga / Probel)" style="background:linear-gradient(135deg, #00FF87, #00F0FF); border:none; color:#04150C; font-size:13px; font-weight:800; cursor:pointer; padding:6px 16px; border-radius:6px; display:inline-flex; align-items:center; gap:4px; box-shadow:0 2px 10px rgba(0,255,135,0.3);">
                                Keyingi ▶
                            </button>
                            <button id="attLastSlideBtn" title="Oxirgi slayd (End)" style="background:none; border:none; color:#94a3b8; font-size:14px; cursor:pointer; padding:4px 8px; border-radius:4px;">⏭️</button>
                        </div>

                        <!-- Right: Actions & Fullscreen -->
                        <div style="display:flex; align-items:center; gap:8px;">
                            <div id="attZoomControls" style="display:flex; gap:4px;">
                                <button id="attZoomOutBtn" title="Kichraytirish (-)" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:30px; height:30px; border-radius:6px; font-weight:bold; cursor:pointer;">-</button>
                                <button id="attZoomInBtn" title="Kattalashtirish (+)" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:30px; height:30px; border-radius:6px; font-weight:bold; cursor:pointer;">+</button>
                            </div>
                            
                            <button id="attFullscreenSlideBtn" title="Butun Ekran Rejimi (F11)" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                                ⛶ Butun Ekran
                            </button>

                            <a id="attDownloadPresBtn" href="#" target="_blank" style="text-decoration:none; background:rgba(0,255,135,0.1); border:1px solid rgba(0,255,135,0.4); color:#00FF87; padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; display:inline-flex; align-items:center; gap:4px;">
                                📥 Yuklab Olish
                            </a>

                            <button onclick="closePresentationModal()" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:34px; height:34px; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
                        </div>
                    </div>

                    <!-- PPTX Engine Switcher Toolbar (Faqat PPTX uchun chiqadi) -->
                    <div id="attPptxToolbar" style="padding:6px 20px; background:rgba(0,0,0,0.6); border-bottom:1px solid rgba(255,255,255,0.08); display:none; align-items:center; justify-content:space-between; font-size:12px;">
                        <span style="color:#94a3b8;">Slaydlarni ko'rish dvigateli:</span>
                        <div style="display:flex; gap:6px;">
                            <button id="enginePowerPointBtn" style="background:#00FF87; color:#04150C; border:none; padding:4px 10px; border-radius:4px; font-weight:800; font-size:11px; cursor:pointer;">PowerPoint Online 🏢</button>
                            <button id="engineGoogleSlidesBtn" style="background:rgba(255,255,255,0.08); color:#fff; border:1px solid rgba(255,255,255,0.2); padding:4px 10px; border-radius:4px; font-size:11px; cursor:pointer;">Google Slides 📑</button>
                        </div>
                    </div>

                    <!-- Slide Stage (Canvas yoki Embed Frame) -->
                    <div id="attSlideStage" style="flex:1; position:relative; overflow:auto; display:flex; align-items:center; justify-content:center; background:#040805; padding:16px;">
                        <!-- PDF.js Canvas -->
                        <div id="attPdfWrapper" style="display:none; text-align:center;">
                            <canvas id="attPdfCanvas" style="box-shadow:0 10px 40px rgba(0,0,0,0.85); border-radius:4px; max-width:100%; border:1px solid rgba(0,255,135,0.2);"></canvas>
                        </div>
                        
                        <!-- PPTX / Office Iframe -->
                        <iframe id="attPptxIframe" style="width:100%; height:100%; border:none; display:none; border-radius:6px;" allowfullscreen></iframe>
                        
                        <!-- Loading Spinner -->
                        <div id="attSlideLoading" style="display:flex; flex-direction:column; align-items:center; gap:12px; color:#00FF87;">
                            <div style="width:40px; height:40px; border:3px solid rgba(0,255,135,0.2); border-top-color:#00FF87; border-radius:50%; animation:attSpin 0.8s linear infinite;"></div>
                            <span style="font-size:13px; font-weight:700;">Slaydlar tayyorlanmoqda...</span>
                        </div>
                    </div>

                    <!-- Bottom Slide Thumbnails Strip (Slaydlar mini-lentasi) -->
                    <div id="attThumbnailsStrip" style="padding:10px 16px; background:rgba(0,0,0,0.6); border-top:1px solid rgba(0,255,135,0.15); display:flex; gap:8px; overflow-x:auto; scrollbar-width:thin;">
                        <!-- Slayd tugmalari dinamik qo'shiladi -->
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes attSpin {
                    to { transform: rotate(360deg); }
                }
                .att-thumb-pill {
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.15);
                    color: #94a3b8;
                    padding: 4px 10px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                    white-space: nowrap;
                    transition: all 0.2s;
                }
                .att-thumb-pill:hover {
                    background: rgba(0,255,135,0.15);
                    border-color: #00FF87;
                    color: #fff;
                }
                .att-thumb-pill.active {
                    background: #00FF87 !important;
                    color: #04150C !important;
                    border-color: #00FF87 !important;
                    font-weight: 800;
                    box-shadow: 0 0 10px rgba(0,255,135,0.4);
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        // Tugmalar tinglovchilari
        document.getElementById('attPrevSlideBtn').addEventListener('click', onPrevPage);
        document.getElementById('attNextSlideBtn').addEventListener('click', onNextPage);
        document.getElementById('attFirstSlideBtn').addEventListener('click', () => queueRenderPage(1));
        document.getElementById('attLastSlideBtn').addEventListener('click', () => queueRenderPage(totalPdfPages));
        
        document.getElementById('attSlideNumInput').addEventListener('change', (e) => {
            let num = parseInt(e.target.value, 10);
            if (!isNaN(num) && num >= 1 && num <= totalPdfPages) {
                queueRenderPage(num);
            }
        });

        document.getElementById('attZoomInBtn').addEventListener('click', () => {
            pdfScale = Math.min(3.0, pdfScale + 0.2);
            queueRenderPage(currentPdfPage);
        });

        document.getElementById('attZoomOutBtn').addEventListener('click', () => {
            pdfScale = Math.max(0.6, pdfScale - 0.2);
            queueRenderPage(currentPdfPage);
        });

        document.getElementById('attFullscreenSlideBtn').addEventListener('click', togglePresentationFullscreen);

        // Klaviatura navigatsiyasi (←, →, Probel)
        document.addEventListener('keydown', (e) => {
            const modal = document.getElementById('attMasterPresentationModal');
            if (modal && modal.style.display === 'flex') {
                if (e.key === 'ArrowRight' || e.key === ' ') {
                    e.preventDefault();
                    onNextPage();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    onPrevPage();
                } else if (e.key === 'Home') {
                    queueRenderPage(1);
                } else if (e.key === 'End') {
                    queueRenderPage(totalPdfPages);
                }
            }
        });
    }

    function togglePresentationFullscreen() {
        const stage = document.getElementById('attSlideStage');
        if (!document.fullscreenElement) {
            stage.requestFullscreen().catch(err => {
                alert(`Butun ekran rejimiga o'tishda xatolik: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
        }
    }

    window.closePresentationModal = function() {
        const modal = document.getElementById('attMasterPresentationModal');
        if (modal) modal.style.display = 'none';
        const iframe = document.getElementById('attPptxIframe');
        if (iframe) iframe.src = '';
    };

    function renderPdfPage(num) {
        if (!pdfDoc) return;
        pdfPageRendering = true;

        pdfDoc.getPage(num).then(page => {
            const canvas = document.getElementById('attPdfCanvas');
            const ctx = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: pdfScale });

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            const renderTask = page.render(renderContext);
            renderTask.promise.then(() => {
                pdfPageRendering = false;
                document.getElementById('attSlideLoading').style.display = 'none';
                document.getElementById('attPdfWrapper').style.display = 'block';

                if (pdfPageNumPending !== null) {
                    renderPdfPage(pdfPageNumPending);
                    pdfPageNumPending = null;
                }
            });
        });

        currentPdfPage = num;
        document.getElementById('attSlideNumInput').value = num;
        updateThumbnailsHighlight(num);
    }

    function queueRenderPage(num) {
        if (pdfPageRendering) {
            pdfPageNumPending = num;
        } else {
            renderPdfPage(num);
        }
    }

    function onPrevPage() {
        if (currentPdfPage <= 1) return;
        queueRenderPage(currentPdfPage - 1);
    }

    function onNextPage() {
        if (currentPdfPage >= totalPdfPages) return;
        queueRenderPage(currentPdfPage + 1);
    }

    function updateThumbnailsHighlight(num) {
        document.querySelectorAll('.att-thumb-pill').forEach(pill => {
            if (parseInt(pill.dataset.slideNum, 10) === num) {
                pill.classList.add('active');
                pill.scrollIntoView({ behavior: 'smooth', inline: 'center' });
            } else {
                pill.classList.remove('active');
            }
        });
    }

    window.openPresentationDeck = function(matId) {
        const m = liveMaterialsCache.find(x => x.id === matId);
        if (!m) return;

        ensurePresentationModalExists();
        const modal = document.getElementById('attMasterPresentationModal');
        
        document.getElementById('attPresTitle').textContent = m.name;
        document.getElementById('attPresUploader').textContent = `Muallif: ${m.uploader_name}`;
        
        const ext = (m.file_type || '').toLowerCase();
        document.getElementById('attPresTypeBadge').textContent = ext.replace('.', '').toUpperCase();

        const origin = window.location.origin;
        const fileViewUrl = `/api/file?id=${m.id}`;
        const absoluteFileUrl = `${origin}/api/file?id=${m.id}`;

        document.getElementById('attDownloadPresBtn').href = fileViewUrl;

        const loading = document.getElementById('attSlideLoading');
        const pdfWrapper = document.getElementById('attPdfWrapper');
        const pptxIframe = document.getElementById('attPptxIframe');
        const pptxToolbar = document.getElementById('attPptxToolbar');
        const slideNavControls = document.getElementById('attSlideNavControls');
        const zoomControls = document.getElementById('attZoomControls');
        const thumbnailsStrip = document.getElementById('attThumbnailsStrip');

        loading.style.display = 'flex';
        pdfWrapper.style.display = 'none';
        pptxIframe.style.display = 'none';
        pptxToolbar.style.display = 'none';
        thumbnailsStrip.innerHTML = '';

        modal.style.display = 'flex';

        // 1. AGAR PDF BO'LSA — PDF.JS orqali sahifama-sahifa render qilish
        if (ext === '.pdf') {
            slideNavControls.style.display = 'flex';
            zoomControls.style.display = 'flex';

            if (typeof pdfjsLib === 'undefined') {
                // Fallback oddiy iframe
                pptxIframe.src = fileViewUrl;
                pptxIframe.style.display = 'block';
                loading.style.display = 'none';
                return;
            }

            pdfjsLib.getDocument(fileViewUrl).promise.then(pdf => {
                pdfDoc = pdf;
                totalPdfPages = pdf.numPages;
                document.getElementById('attTotalSlidesCount').textContent = totalPdfPages;

                // Miniatyura tugmalarini yaratish
                for (let i = 1; i <= totalPdfPages; i++) {
                    const pill = document.createElement('button');
                    pill.className = 'att-thumb-pill' + (i === 1 ? ' active' : '');
                    pill.textContent = `Slayd ${i}`;
                    pill.dataset.slideNum = i;
                    pill.addEventListener('click', () => queueRenderPage(i));
                    thumbnailsStrip.appendChild(pill);
                }

                currentPdfPage = 1;
                renderPdfPage(1);
            }).catch(err => {
                console.error("PDF yuklashda xatolik:", err);
                pptxIframe.src = fileViewUrl;
                pptxIframe.style.display = 'block';
                loading.style.display = 'none';
            });
        }
        // 2. AGAR PPTX / PPT / DOCX BO'LSA — Microsoft PowerPoint Online & Google Slides
        else {
            slideNavControls.style.display = 'none';
            zoomControls.style.display = 'none';
            pptxToolbar.style.display = 'flex';

            const msViewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(absoluteFileUrl)}`;
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteFileUrl)}&embedded=true`;

            pptxIframe.src = msViewerUrl;
            pptxIframe.style.display = 'block';
            loading.style.display = 'none';

            // Dvigatelni o'zgartirish
            const msBtn = document.getElementById('enginePowerPointBtn');
            const googleBtn = document.getElementById('engineGoogleSlidesBtn');

            msBtn.onclick = function() {
                pptxIframe.src = msViewerUrl;
                msBtn.style.background = '#00FF87';
                msBtn.style.color = '#04150C';
                googleBtn.style.background = 'rgba(255,255,255,0.08)';
                googleBtn.style.color = '#fff';
            };

            googleBtn.onclick = function() {
                pptxIframe.src = googleViewerUrl;
                googleBtn.style.background = '#00FF87';
                googleBtn.style.color = '#04150C';
                msBtn.style.background = 'rgba(255,255,255,0.08)';
                msBtn.style.color = '#fff';
            };

            // Miniatyura stripida qulay havolalar
            thumbnailsStrip.innerHTML = `
                <div style="font-size:12px; color:#94a3b8; display:flex; align-items:center; gap:12px;">
                    <span style="color:#00FF87; font-weight:700;">💡 PowerPoint Ko'rsatmasi:</span>
                    <span>Slaydlarni pastdagi ko'rsatgichlar yoki klaviatura orqali birma-bir o'tkazishingiz mumkin.</span>
                </div>
            `;
        }
    };


    // =========================================================================
    // 2. CHEKLANMAGAN VIDEOLAR PLEYERI (UNLIMITED VIDEO CINEMA & PLAYLIST HUB)
    // =========================================================================

    function ensureMasterVideoModalExists() {
        if (document.getElementById('attMasterVideoCinemaModal')) return;

        const modalHtml = `
            <div id="attMasterVideoCinemaModal" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(2, 8, 4, 0.95); backdrop-filter:blur(16px); z-index:999999; display:none; align-items:center; justify-content:center; padding:12px; font-family:'Plus Jakarta Sans', sans-serif;">
                <div style="background:#060F09; border:1px solid rgba(0, 255, 135, 0.4); border-radius:14px; width:100%; max-width:1300px; height:92vh; display:flex; flex-direction:column; box-shadow:0 30px 90px rgba(0, 255, 135, 0.25); overflow:hidden;">
                    
                    <!-- Cinema Header -->
                    <div style="padding:12px 20px; border-bottom:1px solid rgba(0,255,135,0.2); display:flex; align-items:center; justify-content:space-between; background:rgba(0,255,135,0.04);">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span style="font-size:26px;">🎬</span>
                            <div>
                                <h3 style="color:#fff; font-size:16px; font-weight:800; margin:0;">ATT-25 Kiber-Media Pleyer</h3>
                                <span style="font-size:11px; color:#00FF87; font-weight:700;">Cheklanmagan Videolar & Masterklasslar Xabi</span>
                            </div>
                        </div>

                        <div style="display:flex; align-items:center; gap:12px;">
                            <a href="https://t.me/${BOT_USERNAME}" target="_blank" style="text-decoration:none; background:rgba(0,255,135,0.12); border:1px solid rgba(0,255,135,0.4); color:#00FF87; font-size:12px; font-weight:700; padding:6px 14px; border-radius:6px; display:inline-flex; align-items:center; gap:6px;">
                                ➕ Video Joylash (@${BOT_USERNAME})
                            </a>
                            <button onclick="closeMasterVideoModal()" style="background:rgba(255,255,255,0.08); border:none; color:#fff; width:34px; height:34px; border-radius:8px; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center;">✕</button>
                        </div>
                    </div>

                    <!-- Main Cinema 2-Column Body -->
                    <div style="flex:1; display:flex; overflow:hidden; flex-wrap:wrap;">
                        
                        <!-- Left: Screen & Player (70%) -->
                        <div style="flex:1; min-width:320px; display:flex; flex-direction:column; background:#000; overflow-y:auto; padding:16px;">
                            
                            <!-- Video Screen Box -->
                            <div id="attVideoScreenBox" style="position:relative; width:100%; aspect-ratio:16/9; max-height:58vh; background:#040605; border-radius:10px; overflow:hidden; border:1px solid rgba(0,255,135,0.3); box-shadow:0 10px 40px rgba(0,0,0,0.8); display:flex; align-items:center; justify-content:center;">
                                <!-- HTML5 Video -->
                                <video id="attHtml5Player" controls autoplay playsinline style="width:100%; height:100%; object-fit:contain; display:none; background:#000;">
                                    Brauzeringiz videoni qo'llab-quvvatlamaydi.
                                </video>
                                
                                <!-- YouTube Iframe -->
                                <iframe id="attYoutubePlayer" style="width:100%; height:100%; border:none; display:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

                                <!-- Telegram / Large Video Card -->
                                <div id="attTelegramCard" style="display:none; text-align:center; padding:24px; max-width:540px;">
                                    <div style="font-size:52px; margin-bottom:12px;">🎬</div>
                                    <h4 id="attTgCardTitle" style="color:#fff; font-size:18px; font-weight:800; margin:0 0 8px 0;">Video Nomi</h4>
                                    <span id="attTgCardSize" style="display:inline-block; background:rgba(0,255,135,0.15); color:#00FF87; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:800; margin-bottom:14px;">1080p Full HD</span>
                                    <p style="color:#94a3b8; font-size:13px; line-height:1.5; margin-bottom:18px;">
                                        Ushbu video yuqori sifatli Full HD formatda Telegram bulutida saqlanmoqda. 1-klikda to'liq sifatda oching:
                                    </p>
                                    <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                                        <a id="attTgWatchBtn" href="#" target="_blank" style="text-decoration:none; background:linear-gradient(135deg, #00FF87, #00F0FF); color:#04150C; padding:12px 22px; border-radius:8px; font-weight:800; font-size:13px; box-shadow:0 4px 20px rgba(0,255,135,0.4);">
                                            ▶️ Telegramda Tomosha Qilish (1080p) 🚀
                                        </a>
                                        <a id="attTgDirectBtn" href="#" target="_blank" style="text-decoration:none; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:12px 18px; border-radius:8px; font-weight:700; font-size:13px;">
                                            📥 To'g'ridan-to'g'ri Yuklash
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Video Meta & Controls -->
                            <div style="margin-top:14px; padding:16px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:10px;">
                                <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; flex-wrap:wrap;">
                                    <div>
                                        <h2 id="attCurrentVideoTitle" style="color:#fff; font-size:18px; font-weight:800; margin:0 0 6px 0;">Video Nomi</h2>
                                        <div style="display:flex; gap:10px; align-items:center; font-size:12px; color:#94a3b8;">
                                            <span id="attCurrentVideoUploader" style="color:#00FF87; font-weight:700;">Muallif</span>
                                            <span>•</span>
                                            <span id="attCurrentVideoDate">Sana</span>
                                            <span>•</span>
                                            <span id="attCurrentVideoSize" style="font-family:'JetBrains Mono', monospace;">Hajmi</span>
                                        </div>
                                    </div>

                                    <!-- Prev / Next Video Quick Buttons -->
                                    <div style="display:flex; gap:8px;">
                                        <button id="attPrevVideoBtn" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.2); color:#fff; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer;">
                                            ⏮️ Oldingi
                                        </button>
                                        <button id="attNextVideoBtn" style="background:linear-gradient(135deg, #00FF87, #00F0FF); border:none; color:#04150C; padding:8px 16px; border-radius:6px; font-size:12px; font-weight:800; cursor:pointer; box-shadow:0 2px 10px rgba(0,255,135,0.3);">
                                            Keyingi Video ⏭️
                                        </button>
                                    </div>
                                </div>

                                <p id="attCurrentVideoDesc" style="color:#cbd5e1; font-size:13px; line-height:1.6; margin:12px 0 0 0; border-top:1px solid rgba(255,255,255,0.06); padding-top:10px;">
                                    Tavsif
                                </p>
                            </div>
                        </div>

                        <!-- Right: Cheklanmagan Pleylist (Playlist Sidebar 30%) -->
                        <div style="width:360px; border-left:1px solid rgba(0,255,135,0.2); display:flex; flex-direction:column; background:#07140C;">
                            
                            <!-- Playlist Header -->
                            <div style="padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.08);">
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                                    <span style="font-weight:800; color:#fff; font-size:14px;">🎬 Pleylist (Barcha Videolar)</span>
                                    <span id="attPlaylistCountBadge" style="background:rgba(0,255,135,0.18); color:#00FF87; padding:2px 8px; border-radius:12px; font-size:11px; font-weight:800;">0 ta video</span>
                                </div>
                                <input id="attPlaylistSearchInput" type="text" placeholder="🔍 Videolarni qidirish..." style="width:100%; box-sizing:border-box; background:#0D2115; border:1px solid rgba(0,255,135,0.3); border-radius:6px; padding:8px 12px; color:#fff; font-size:12px; outline:none;">
                            </div>

                            <!-- Scrollable Videos List -->
                            <div id="attPlaylistItems" style="flex:1; overflow-y:auto; padding:10px; display:flex; flex-direction:column; gap:8px;">
                                <!-- Dinamik videolar joylashadi -->
                            </div>

                            <!-- Playlist Footer -->
                            <div style="padding:12px 16px; border-top:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.3); font-size:11px; color:#94a3b8; text-align:center;">
                                💡 Istalgan yangi videoni <a href="https://t.me/${BOT_USERNAME}" target="_blank" style="color:#00FF87; text-decoration:none; font-weight:700;">@${BOT_USERNAME}</a> orqali qo'shishingiz mumkin.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                .att-video-item {
                    display: flex;
                    gap: 10px;
                    padding: 8px 10px;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .att-video-item:hover {
                    background: rgba(0, 255, 135, 0.08);
                    border-color: rgba(0, 255, 135, 0.35);
                    transform: translateX(3px);
                }
                .att-video-item.active {
                    background: rgba(0, 255, 135, 0.15) !important;
                    border-color: #00FF87 !important;
                    box-shadow: 0 2px 12px rgba(0, 255, 135, 0.15);
                }
            </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);

        document.getElementById('attPrevVideoBtn').addEventListener('click', playPrevVideo);
        document.getElementById('attNextVideoBtn').addEventListener('click', playNextVideo);
        
        document.getElementById('attHtml5Player').addEventListener('ended', () => {
            if (autoPlayNextVideo) playNextVideo();
        });

        document.getElementById('attPlaylistSearchInput').addEventListener('input', (e) => {
            renderPlaylistSidebar(e.target.value.trim().toLowerCase());
        });
    }

    window.closeMasterVideoModal = function() {
        const modal = document.getElementById('attMasterVideoCinemaModal');
        if (modal) modal.style.display = 'none';
        
        const video = document.getElementById('attHtml5Player');
        if (video) {
            video.pause();
            video.src = '';
        }

        const yt = document.getElementById('attYoutubePlayer');
        if (yt) yt.src = '';
    };

    function collectAllVideos() {
        const list = [];

        // 1. Bot orqali yuklangan videolar
        liveMaterialsCache.forEach(m => {
            const ext = (m.file_type || '').toLowerCase();
            const cat = (m.category_name || '').toLowerCase();
            const isVideo = ['.mp4', '.mov', '.webm', '.mkv', '.youtube'].includes(ext) || cat.includes('video') || (m.public_url && m.public_url.includes('youtu'));
            
            if (isVideo) {
                list.push({
                    id: m.id,
                    title: m.name,
                    uploader: m.uploader_name || 'Talaba',
                    size: formatBytes(m.file_size),
                    fileSize: m.file_size,
                    desc: m.description || '',
                    date: m.created_at ? m.created_at.split(' ')[0] : '',
                    fileUrl: `/api/file?id=${m.id}`,
                    publicUrl: m.public_url || '',
                    isBot: true
                });
            }
        });

        // 2. Saytdagi mavjud masterklass videolar
        const existingCurated = [
            {
                id: 'curated-1',
                title: 'Optik Tolali Liniyalarni Fusion Splicer bilan Payvandlash',
                uploader: 'ATT-25 Kafedrasi',
                size: 'Full HD • 45:20',
                desc: 'Optik tolani tozalash, kesish, payvandlash apparatida birlashtirish va so‘nish ko‘rsatkichlarini (dB) o‘lchash amaliyoti.',
                date: 'Kuzgi 2026',
                publicUrl: 'https://www.youtube.com/embed/1EwtSnTnXJ4?autoplay=1',
                isBot: false
            },
            {
                id: 'curated-2',
                title: 'Cisco IOS: Router va Switchlarni Dastlabki Sozlash',
                uploader: 'Cisco CCNA Lab',
                size: '1080p • 28:15',
                desc: 'Cisco uskunalarida CLI interfeysi, IP manzillar biriktirish, parollarni shifrlash va SSH xavfsiz ulanishini sozlash.',
                date: 'Kuzgi 2026',
                publicUrl: 'https://www.youtube.com/embed/1EwtSnTnXJ4?autoplay=1',
                isBot: false
            },
            {
                id: 'curated-3',
                title: 'Wireshark Bilan Tarmoq Paketlarini Tahlil Qilish',
                uploader: 'Kiber-Xavfsizlik Lab',
                size: '1080p • 34:40',
                desc: 'TCP 3-way handshake, DNS so‘rovlari va HTTP/HTTPS trafigini paket darajasida chuqur tekshirish.',
                date: 'Kuzgi 2026',
                publicUrl: 'https://www.youtube.com/embed/1EwtSnTnXJ4?autoplay=1',
                isBot: false
            },
            {
                id: 'curated-4',
                title: 'MikroTik RouterOS v7: VLAN va DHCP Server',
                uploader: 'MikroTik Academy',
                size: '1080p • 22:10',
                desc: 'RouterOS v7 da Bridge VLAN filtering texnologiyasi orqali korporativ tarmoqni segmentlash.',
                date: 'Kuzgi 2026',
                publicUrl: 'https://www.youtube.com/embed/1EwtSnTnXJ4?autoplay=1',
                isBot: false
            },
            {
                id: 'curated-5',
                title: 'Server Rack & Data Center Kabel Standartlari',
                uploader: 'Data Center Lab',
                size: '1080p • 19:50',
                desc: 'TIA/EIA-568 standartlari bo‘yicha patch-panel krossirovka qilish va kabel boshqaruvi.',
                date: 'Kuzgi 2026',
                publicUrl: 'https://www.youtube.com/embed/1EwtSnTnXJ4?autoplay=1',
                isBot: false
            }
        ];

        existingCurated.forEach(c => list.push(c));
        allVideosPlaylist = list;
    }

    function renderPlaylistSidebar(query = '') {
        const container = document.getElementById('attPlaylistItems');
        if (!container) return;
        container.innerHTML = '';

        const filtered = allVideosPlaylist.filter(v => 
            v.title.toLowerCase().includes(query) || 
            v.uploader.toLowerCase().includes(query)
        );

        document.getElementById('attPlaylistCountBadge').textContent = `${allVideosPlaylist.length} ta video`;

        if (filtered.length === 0) {
            container.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Hech qanday video topilmadi</div>`;
            return;
        }

        filtered.forEach((v, index) => {
            const actualIndex = allVideosPlaylist.findIndex(x => x.id === v.id);
            const isActive = actualIndex === currentVideoIndex;

            const item = document.createElement('div');
            item.className = 'att-video-item' + (isActive ? ' active' : '');
            item.innerHTML = `
                <div style="width:36px; height:36px; border-radius:6px; background:${isActive ? '#00FF87' : 'rgba(0,255,135,0.15)'}; color:${isActive ? '#04150C' : '#00FF87'}; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;">
                    ${isActive ? '▶' : '🎬'}
                </div>
                <div style="flex:1; overflow:hidden;">
                    <div style="color:#fff; font-size:12px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${v.title}">${v.title}</div>
                    <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:2px;">
                        <span>${v.uploader}</span>
                        <span style="color:#00FF87; font-family:'JetBrains Mono', monospace;">${v.size}</span>
                    </div>
                </div>
            `;
            item.addEventListener('click', () => {
                playVideoByIndex(actualIndex);
            });
            container.appendChild(item);
        });
    }

    function playVideoByIndex(index) {
        if (index < 0 || index >= allVideosPlaylist.length) return;
        currentVideoIndex = index;
        const v = allVideosPlaylist[index];

        document.getElementById('attCurrentVideoTitle').textContent = v.title;
        document.getElementById('attCurrentVideoUploader').textContent = `Joylovchi: ${v.uploader}`;
        document.getElementById('attCurrentVideoDate').textContent = v.date || 'ATT-25';
        document.getElementById('attCurrentVideoSize').textContent = v.size || '';
        document.getElementById('attCurrentVideoDesc').textContent = v.desc || 'Ushbu video ATT-25 o\'quv portali foydalanuvchisi tomonidan taqdim etildi.';

        const html5Player = document.getElementById('attHtml5Player');
        const ytPlayer = document.getElementById('attYoutubePlayer');
        const tgCard = document.getElementById('attTelegramCard');

        html5Player.style.display = 'none';
        html5Player.pause();
        ytPlayer.style.display = 'none';
        ytPlayer.src = '';
        tgCard.style.display = 'none';

        // 1. YouTube video
        if (v.publicUrl && (v.publicUrl.includes('youtube') || v.publicUrl.includes('youtu.be'))) {
            let embedUrl = v.publicUrl;
            if (!embedUrl.includes('embed')) {
                const match = v.publicUrl.match(/(?:watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i);
                if (match) embedUrl = `https://www.youtube.com/embed/${match[1]}?autoplay=1`;
            }
            ytPlayer.src = embedUrl;
            ytPlayer.style.display = 'block';
        }
        // 2. Katta Telegram video (> 20MB)
        else if (v.isBot && v.fileSize && v.fileSize > 20 * 1024 * 1024) {
            document.getElementById('attTgCardTitle').textContent = v.title;
            document.getElementById('attTgCardSize').textContent = `Full HD 1080p • ${v.size}`;
            document.getElementById('attTgWatchBtn').href = `https://t.me/${BOT_USERNAME}?start=get_${v.id}`;
            document.getElementById('attTgDirectBtn').href = v.fileUrl;
            tgCard.style.display = 'block';
        }
        // 3. Standart HTML5 MP4 / WebM
        else if (v.fileUrl) {
            html5Player.src = v.fileUrl;
            html5Player.style.display = 'block';
            html5Player.play().catch(e => console.log("Autoplay blocked:", e));
        }

        renderPlaylistSidebar();
    }

    function playPrevVideo() {
        if (currentVideoIndex > 0) {
            playVideoByIndex(currentVideoIndex - 1);
        } else {
            playVideoByIndex(allVideosPlaylist.length - 1);
        }
    }

    function playNextVideo() {
        if (currentVideoIndex < allVideosPlaylist.length - 1) {
            playVideoByIndex(currentVideoIndex + 1);
        } else {
            playVideoByIndex(0);
        }
    }

    window.openMasterVideoPlayer = function(targetId) {
        ensureMasterVideoModalExists();
        collectAllVideos();

        let targetIndex = 0;
        if (targetId) {
            const found = allVideosPlaylist.findIndex(x => x.id === targetId || x.id == targetId);
            if (found !== -1) targetIndex = found;
        }

        const modal = document.getElementById('attMasterVideoCinemaModal');
        modal.style.display = 'flex';

        renderPlaylistSidebar();
        playVideoByIndex(targetIndex);
    };


    // =========================================================================
    // 3. MATERIALLARNI YUKLASH VA BO'LIMLARGA INTEGRATSIYA QILISH
    // =========================================================================

    async function loadLiveMaterials() {
        try {
            const res = await fetch('/api/admin?action=materials&limit=150');
            if (!res.ok) return;
            const materials = await res.json();
            if (!Array.isArray(materials) || materials.length === 0) return;

            liveMaterialsCache = materials;
            collectAllVideos();
            renderMaterialsToSections(materials);
        } catch (e) {
            console.warn("Materiallar integratsiyasi:", e);
        }
    }

    function renderMaterialsToSections(materials) {
        const docsGrid = document.getElementById('docsGrid');
        const pubGrid = document.getElementById('pubCardsGrid');
        const resourcesGrid = document.querySelector('#manbalar .resources-grid');
        const videoGrid = document.getElementById('videoMaterialsGrid');

        // Mavjud bot kartochkalarini tozalash (takrorlanmasligi uchun)
        document.querySelectorAll('.live-bot-card').forEach(el => el.remove());

        materials.forEach(m => {
            const catName = (m.category_name || "").toLowerCase();
            const sizeStr = formatBytes(m.file_size);
            const ext = (m.file_type || "").replace('.', '').toUpperCase() || 'FAYL';
            const isVideo = ['.mp4', '.mov', '.webm', '.mkv', '.youtube'].includes((m.file_type || '').toLowerCase()) || catName.includes('video');

            // 1. TAQDIMOTLAR & SLAYDLAR (#taqdimotlar -> #docsGrid)
            if (catName.includes('taqdimot') || catName.includes('slayd') || ['.pptx', '.ppt', '.pdf'].includes((m.file_type || '').toLowerCase())) {
                if (docsGrid) {
                    const card = document.createElement('div');
                    card.className = 'doc-card live-bot-card';
                    card.setAttribute('data-doc-type', 'presentation');
                    card.style.borderColor = 'rgba(0, 255, 135, 0.55)';
                    card.style.boxShadow = '0 6px 26px rgba(0, 255, 135, 0.15)';

                    card.innerHTML = `
                        <div class="doc-preview-header" onclick="openPresentationDeck(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, rgba(0,255,135,0.15), rgba(0,0,0,0.5));">
                            <span class="doc-badge-type" style="background:rgba(0,255,135,0.22); color:#00FF87; border:1px solid rgba(0,255,135,0.6); font-weight:800;">⚡ SLAYD-BA-SLAYD KO‘RISH</span>
                            <div class="doc-icon-watermark">📊</div>
                        </div>
                        <div class="doc-body">
                            <h3 class="doc-title" onclick="openPresentationDeck(${m.id})" style="cursor:pointer;" title="${m.name}">${m.name}</h3>
                            <span class="doc-author">Yuklovchi: <b>${m.uploader_name}</b></span>
                            <div class="doc-footer">
                                <span class="doc-pages">${ext} • ${sizeStr}</span>
                                <button onclick="openPresentationDeck(${m.id})" class="doc-btn" style="cursor:pointer; display:inline-flex; align-items:center; gap:6px; background:linear-gradient(135deg, #00FF87, #00F0FF); color:#04150C; font-weight:800; border:none; padding:8px 16px; border-radius:6px; box-shadow:0 2px 10px rgba(0,255,135,0.3);">
                                    Slaydlarni Ko‘rish 👁️
                                </button>
                            </div>
                        </div>
                    `;
                    docsGrid.prepend(card);
                }
            }

            // 2. MEDIA HUB — CHEKLANMAGAN VIDEOLAR (#videoMaterialsGrid)
            else if (isVideo) {
                if (videoGrid) {
                    const videoCard = document.createElement('div');
                    videoCard.className = 'video-card-item live-bot-card';
                    videoCard.style.borderColor = 'rgba(0, 255, 135, 0.55)';
                    videoCard.style.boxShadow = '0 6px 26px rgba(0, 255, 135, 0.15)';

                    videoCard.innerHTML = `
                        <div class="video-card-thumb" onclick="openMasterVideoPlayer(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, #071910, #0E2E1E); display:flex; align-items:center; justify-content:center; min-height:160px; position:relative;">
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
                                <h4 class="video-card-title" onclick="openMasterVideoPlayer(${m.id})" style="cursor:pointer;">${m.name}</h4>
                                <p class="video-desc">${m.description || 'Sayt foydalanuvchisi tomonidan joylangan video material.'}</p>
                            </div>
                            <button class="btn-arsenal-secondary video-card-btn" onclick="openMasterVideoPlayer(${m.id})" style="cursor:pointer; background:linear-gradient(135deg, rgba(0,255,135,0.18), rgba(0,240,255,0.12)); border-color:#00FF87; color:#00FF87; font-weight:800;">
                                ▶ Pleyerda Ko‘rish 🎬
                            </button>
                        </div>
                    `;
                    videoGrid.prepend(videoCard);
                }
            }

            // 3. ILMIY MAQOLALAR (#maqolalar -> #pubCardsGrid)
            else if (catName.includes('maqola') || catName.includes('ilmiy')) {
                if (pubGrid) {
                    const card = document.createElement('div');
                    card.className = 'pub-card live-bot-card';
                    card.setAttribute('data-pub-cat', 'all');
                    card.style.borderColor = 'rgba(0, 240, 255, 0.45)';

                    card.innerHTML = `
                        <div class="pub-header">
                            <span class="pub-badge" style="background:rgba(0,240,255,0.2); color:#00F0FF; border:1px solid rgba(0,240,255,0.5); font-weight:800;">⚡ BOTDAN MAQOLA</span>
                            <span class="pub-doi">${ext} • ${sizeStr}</span>
                        </div>
                        <h3 class="pub-title" onclick="openPresentationDeck(${m.id})" style="cursor:pointer;">${m.name}</h3>
                        <p class="pub-snippet">${m.description || 'Talabalar va o‘qituvchilar tomonidan joylangan ilmiy maqola.'}</p>
                        <div class="pub-footer">
                            <span class="pub-author">Muallif: <b>${m.uploader_name}</b></span>
                            <button onclick="openPresentationDeck(${m.id})" class="pub-read-btn" style="background:none; border:none; cursor:pointer; font-weight:800; color:#00F0FF;">
                                Mutolaa Qilish 👁️ →
                            </button>
                        </div>
                    `;
                    pubGrid.prepend(card);
                }
            }

            // 4. DARSLIKLAR & MANBALAR (#manbalar -> .resources-grid)
            else if (catName.includes('manba') || catName.includes('kitob') || catName.includes('darslik')) {
                if (resourcesGrid) {
                    const card = document.createElement('div');
                    card.className = 'resource-card live-bot-card';
                    card.style.borderColor = 'rgba(0, 255, 135, 0.45)';
                    card.style.cursor = 'pointer';
                    card.onclick = function() { openPresentationDeck(m.id); };

                    card.innerHTML = `
                        <div class="resource-icon" style="color:#00FF87;">📚</div>
                        <h3 class="resource-title">${m.name}</h3>
                        <p class="resource-desc">${m.description || 'Yuklovchi: ' + m.uploader_name}</p>
                        <span class="resource-link" style="color:#00FF87; font-weight:700;">Saytda O‘qish & Yuklash (${sizeStr}) 👁️</span>
                    `;
                    resourcesGrid.prepend(card);
                }
            }
        });

        // Saytdagi barcha mavjud video tugmalarini ham Master Video Playerga ulash
        const mainVideoSpotlight = document.getElementById('videoPlayTrigger');
        if (mainVideoSpotlight) {
            mainVideoSpotlight.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                openMasterVideoPlayer('curated-1');
            };
        }
    }

    // Modalni tayyorlash
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ensurePresentationModalExists();
            ensureMasterVideoModalExists();
            loadLiveMaterials();
        });
    } else {
        ensurePresentationModalExists();
        ensureMasterVideoModalExists();
        loadLiveMaterials();
    }
})();
