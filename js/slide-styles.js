/* CSS của slide (10 layout + 4 theme). Đặt trong JS để có thể nhúng nguyên vẹn vào file HTML xuất ra. */
window.MXS = window.MXS || {};
window.MXS.SLIDE_CSS = String.raw`
.mx-slide{position:relative;width:1280px;height:720px;overflow:hidden;box-sizing:border-box;
  font-family:var(--font),'Be Vietnam Pro',system-ui,-apple-system,'Segoe UI',sans-serif;
  color:var(--tx);background:var(--bg);line-height:1.35;text-align:left;
  -webkit-print-color-adjust:exact;print-color-adjust:exact;
  --radius:22px;--card:#fff;--card-tx:var(--tx);--card-border:none;--shadow:none;--chip:rgba(var(--p-rgb),.12);--chip-tx:var(--p);
  --muted:rgba(0,0,0,.6);--img-bg:rgba(var(--p-rgb),.08);--title:var(--tx);--accent:var(--p)}
.mx-slide *,.mx-slide *::before,.mx-slide *::after{box-sizing:border-box}
.mx-slide .s-inner{position:absolute;inset:0;padding:60px 80px 76px;display:flex;flex-direction:column;z-index:2}
.mx-slide .deco{position:absolute;pointer-events:none;z-index:1}
.mx-slide .clamp{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}
.mx-slide .ph{opacity:.38;font-style:italic}
.mx-slide .s-title{font-size:52px;font-weight:800;line-height:1.15;color:var(--title);margin:0 0 30px;flex:none;overflow-wrap:anywhere;position:relative}
.mx-slide .s-sub{font-size:24px;color:var(--muted);margin:-14px 0 26px;flex:none}
.mx-slide .s-foot{position:absolute;left:80px;right:80px;bottom:26px;display:flex;justify-content:space-between;gap:20px;font-size:17px;font-weight:600;color:var(--muted);z-index:3;white-space:nowrap}
.mx-slide .s-foot span:first-child{overflow:hidden;text-overflow:ellipsis}
.mx-slide .card-box{background:var(--card);color:var(--card-tx);border:var(--card-border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.mx-slide .img-frame{border-radius:var(--radius);overflow:hidden;background:var(--img-bg);display:flex;align-items:center;justify-content:center;min-height:0;min-width:0}
.mx-slide .img-frame img{width:100%;height:100%;object-fit:contain;display:block}
.mx-slide .img-ph{border:3px dashed rgba(var(--p-rgb),.5);color:var(--p);font-size:24px;font-weight:700;text-align:center;opacity:.75}
.mx-slide .chip{display:inline-block;max-width:100%;padding:10px 22px;border-radius:999px;background:var(--chip);color:var(--chip-tx);font-size:22px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mx-slide div,.mx-slide span,.mx-slide li{overflow-wrap:anywhere}

/* ===== Cover ===== */
.layout-cover .s-inner{padding:70px 90px;justify-content:center}
.mx-slide .cv{display:flex;align-items:center;gap:56px;height:100%}
.mx-slide .cv-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:22px}
.mx-slide .cv.has-img .cv-text{flex:0 0 52%}
.mx-slide .cv.no-img{justify-content:center;text-align:center}
.mx-slide .cv.no-img .cv-text{align-items:center;max-width:1000px}
.mx-slide .cv-badge{align-self:flex-start;padding:8px 20px;border-radius:999px;background:var(--chip);color:var(--chip-tx);font-weight:800;font-size:20px;letter-spacing:3px}
.mx-slide .cv.no-img .cv-badge{align-self:center}
.mx-slide .cv-title{font-size:88px;font-weight:800;line-height:1.06;color:var(--title)}
.mx-slide .cv-sub{font-size:30px;color:var(--muted);font-weight:500}
.mx-slide .cv-meta{display:flex;gap:12px;flex-wrap:wrap;margin-top:10px}
.mx-slide .cv.no-img .cv-meta{justify-content:center}
.mx-slide .cv-img,.mx-slide .ty-img{flex:1;height:auto;max-height:540px;background:transparent;border:0!important;box-shadow:none!important;border-radius:0;overflow:visible}
.mx-slide .cv-img img,.mx-slide .ty-img img{width:auto;height:auto;max-width:100%;max-height:540px;border-radius:var(--radius);box-shadow:0 24px 50px rgba(0,0,0,.18)}
.mx-slide .ty-img img{max-height:440px}
.mx-slide .cv-img.img-ph,.mx-slide .ty-img.img-ph{height:420px;border:3px dashed rgba(var(--p-rgb),.5)!important;border-radius:var(--radius)}

/* ===== Introduction ===== */
.mx-slide .in-body{flex:1;min-height:0;display:flex;gap:44px}
.mx-slide .in-text{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:24px}
.mx-slide .in-block{background:var(--card);color:var(--card-tx);border:var(--card-border);border-radius:var(--radius);box-shadow:var(--shadow);padding:28px 34px;min-height:0;overflow:hidden;flex:0 1 auto}
.mx-slide .in-label{font-size:20px;font-weight:800;color:var(--accent);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px}
.mx-slide .in-idea{font-size:30px;font-weight:600;line-height:1.4}
.mx-slide .in-purpose{font-size:25px;line-height:1.4}
.mx-slide .in-img{flex:0 0 40%}

/* ===== Content ===== */
.mx-slide .ct-body{flex:1;min-height:0;display:flex;gap:48px}
.mx-slide .ct-text{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;gap:22px;overflow:hidden}
.mx-slide .ct-para{font-size:28px;line-height:1.45;flex:none}
.mx-slide .ct-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;min-height:0;overflow:hidden}
.mx-slide .ct-list li{display:flex;gap:18px;align-items:flex-start;line-height:1.35;font-weight:500}
.mx-slide .ct-list li::before{content:'';flex:none;width:16px;height:16px;margin-top:.42em;border-radius:5px;background:var(--accent)}
.mx-slide .ct-img{flex:0 0 38%}

/* ===== Image + Text ===== */
.mx-slide .it{flex:1;min-height:0;display:flex;gap:52px;align-items:stretch}
.mx-slide .it.right{flex-direction:row-reverse}
.mx-slide .it-img{flex:0 0 56%;min-width:0;display:flex;flex-direction:column;gap:12px}
.mx-slide .it-img .img-frame{flex:1}
.mx-slide .it-cap{font-size:19px;color:var(--muted);text-align:center;font-weight:600}
.mx-slide .it-text{flex:1;min-width:0;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.mx-slide .it-desc{font-size:28px;line-height:1.45}
.mx-slide .it.no-img .it-text{max-width:1000px}

/* ===== Two Columns ===== */
.mx-slide .tc{flex:1;min-height:0;display:grid;grid-template-columns:1fr 1fr;gap:36px}
.mx-slide .tc-col{padding:34px 38px;display:flex;flex-direction:column;gap:12px;min-height:0}
.mx-slide .tc-icon{font-size:54px;line-height:1}
.mx-slide .tc-h{font-size:34px;font-weight:800;color:var(--accent);line-height:1.2}
.mx-slide .tc-t{font-size:26px;line-height:1.45}

/* ===== Feature Cards ===== */
.mx-slide .fc{flex:1;min-height:0;display:grid;gap:26px;grid-template-columns:repeat(var(--cols),minmax(0,1fr));grid-auto-rows:minmax(0,1fr)}
.mx-slide .fc.rows-1{grid-auto-rows:minmax(300px,auto);align-content:center}
.mx-slide .fc.rows-1 .fc-card{padding:36px 30px}
.mx-slide .fc-card{padding:30px 28px;display:flex;flex-direction:column;gap:12px;min-height:0}
.mx-slide .fc-icon{width:78px;height:78px;flex:none;border-radius:22px;background:rgba(var(--p-rgb),.14);display:flex;align-items:center;justify-content:center;font-size:44px;line-height:1}
.mx-slide .fc-name{font-size:28px;font-weight:800;line-height:1.2}
.mx-slide .fc-desc{font-size:21px;line-height:1.4;opacity:.85}
.mx-slide .fc.rows-2{gap:20px}
.mx-slide .fc.rows-2 .fc-card{padding:20px 24px;gap:8px}
.mx-slide .fc.rows-2 .fc-icon{width:56px;height:56px;font-size:32px;border-radius:16px}

/* ===== Gallery ===== */
.mx-slide .gl{flex:1;min-height:0;display:grid;gap:22px;grid-template-columns:repeat(var(--cols),minmax(0,1fr));grid-template-rows:repeat(var(--rows),minmax(0,1fr))}
.mx-slide .gl-item{display:flex;flex-direction:column;gap:8px;min-height:0;min-width:0}
.mx-slide .gl-item .img-frame{flex:1}
.mx-slide .gl-cap{font-size:19px;font-weight:600;text-align:center;color:var(--muted);flex:none}

/* ===== Process ===== */
.mx-slide .pr{flex:1;min-height:0;display:flex;gap:22px;position:relative}
.mx-slide .pr::before{content:'';position:absolute;top:40px;left:7%;right:7%;height:6px;border-radius:3px;background:rgba(var(--p-rgb),.25)}
.mx-slide .pr-step{flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;position:relative;min-height:0}
.mx-slide .pr-num{width:86px;height:86px;flex:none;border-radius:50%;background:var(--accent);color:var(--on-p);font-size:38px;font-weight:800;display:flex;align-items:center;justify-content:center;z-index:2;box-shadow:0 8px 20px rgba(var(--p-rgb),.35)}
.mx-slide .pr-card{margin-top:22px;padding:24px 20px;flex:1;width:100%;min-height:0;display:flex;flex-direction:column;gap:10px}
.mx-slide .pr-name{font-size:26px;font-weight:800;line-height:1.2;color:var(--accent)}
.mx-slide .pr-desc{font-size:21px;line-height:1.4}
.mx-slide .pr.many .pr-num{width:70px;height:70px;font-size:30px}
.mx-slide .pr.many::before{top:32px}
.mx-slide .pr.many .pr-card{padding:18px 14px}

/* ===== Question ===== */
.mx-slide .qs{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:22px}
.mx-slide .qs-mark{width:118px;height:118px;flex:none;border-radius:50%;background:var(--chip);color:var(--chip-tx);font-size:72px;font-weight:800;display:flex;align-items:center;justify-content:center;line-height:1}
.mx-slide .qs-label{font-size:20px;font-weight:800;letter-spacing:3px;text-transform:uppercase;color:var(--muted)}
.mx-slide .qs-q{font-size:54px;font-weight:800;line-height:1.2;max-width:1060px;color:var(--title)}
.mx-slide .qs-opts{display:flex;gap:18px;justify-content:center;flex-wrap:wrap;max-width:1060px;width:100%}
.mx-slide .qs-opts.grid{display:grid;grid-template-columns:1fr 1fr}
.mx-slide .qs-opt{display:flex;align-items:center;gap:16px;padding:16px 24px;border-radius:18px;background:var(--chip);color:var(--tx);font-size:25px;font-weight:600;text-align:left;min-width:300px}
.mx-slide .qs-opt b{flex:none;width:44px;height:44px;border-radius:12px;background:var(--accent);color:var(--on-p);display:flex;align-items:center;justify-content:center}
.mx-slide .qs-note{font-size:22px;color:var(--muted);font-weight:600}

/* ===== Thank You ===== */
.mx-slide .ty{flex:1;min-height:0;display:flex;align-items:center;gap:60px;padding-bottom:10px}
.mx-slide .ty-text{flex:1;min-width:0;display:flex;flex-direction:column;gap:20px}
.mx-slide .ty.no-img{justify-content:center;text-align:center}
.mx-slide .ty.no-img .ty-text{align-items:center;max-width:1000px}
.mx-slide .ty-emoji{font-size:76px;line-height:1}
.mx-slide .ty-h{font-size:72px;font-weight:800;line-height:1.1;color:var(--title)}
.mx-slide .ty-m{font-size:28px;color:var(--muted)}
.mx-slide .ty-chips{display:flex;gap:12px;flex-wrap:wrap}
.mx-slide .ty.no-img .ty-chips{justify-content:center}
.mx-slide .ty-img{flex:0 0 36%}

/* =================== THEME: MODERN =================== */
.theme-modern{--bg:#f6f5ff;--tx:#272a44;--title:var(--p);--muted:#636783;--card:#fff;--shadow:0 14px 34px rgba(var(--p-rgb),.14);--radius:26px}
.theme-modern .d1{width:560px;height:560px;border-radius:50%;right:-200px;top:-230px;background:linear-gradient(135deg,var(--p),var(--p2));opacity:.14}
.theme-modern .d2{width:260px;height:260px;border-radius:50%;left:-110px;bottom:-120px;background:linear-gradient(135deg,var(--p2),var(--p));opacity:.12}
.theme-modern .s-title::after{content:'';display:block;width:84px;height:7px;border-radius:4px;margin-top:14px;background:linear-gradient(90deg,var(--p),var(--p2))}
.theme-modern .pr-num{background:linear-gradient(135deg,var(--p),var(--p2))}
.theme-modern .fc-icon{background:linear-gradient(135deg,rgba(var(--p-rgb),.16),rgba(var(--p2-rgb),.2))}
.theme-modern.layout-cover,.theme-modern.layout-thankyou,.theme-modern.layout-question{
  --bg:linear-gradient(135deg,var(--p) 0%,var(--p2) 100%);--tx:#fff;--title:#fff;--muted:rgba(255,255,255,.88);
  --chip:rgba(255,255,255,.2);--chip-tx:#fff;--img-bg:rgba(255,255,255,.16);--accent:#fff;--on-p:var(--p)}
.theme-modern.layout-cover .d1,.theme-modern.layout-thankyou .d1,.theme-modern.layout-question .d1{background:#fff;opacity:.1}
.theme-modern.layout-cover .d2,.theme-modern.layout-thankyou .d2,.theme-modern.layout-question .d2{background:#fff;opacity:.12}
.theme-modern .d3{width:120px;height:120px;border-radius:32px;right:120px;bottom:70px;border:10px solid #fff;opacity:0;transform:rotate(18deg)}
.theme-modern.layout-cover .d3,.theme-modern.layout-thankyou .d3{opacity:.14}
.theme-modern .cv-img img,.theme-modern .ty-img img{box-shadow:0 30px 60px rgba(0,0,0,.28)}
.theme-tech .cv-img img,.theme-tech .ty-img img{border:1px solid rgba(var(--p-rgb),.5);box-shadow:0 0 50px rgba(var(--p-rgb),.3)}
.theme-playful .cv-img img,.theme-playful .ty-img img{border:3px solid #2d2a32;box-shadow:8px 8px 0 #2d2a32}

/* =================== THEME: MINIMAL =================== */
.theme-minimal{--bg:#ffffff;--tx:#1f2937;--title:#111827;--muted:#6b7280;--card:#f8fafc;--card-border:1px solid #e5e7eb;--radius:14px;--img-bg:#f3f4f6;--chip:#f3f4f6;--chip-tx:#374151}
.theme-minimal .s-title::after{content:'';display:block;width:56px;height:5px;margin-top:16px;background:var(--p)}
.theme-minimal .d1{left:0;top:0;bottom:0;width:14px;background:var(--p)}
.theme-minimal.layout-cover .d1,.theme-minimal.layout-thankyou .d1{width:22px}
.theme-minimal .d2{right:80px;top:60px;width:70px;height:70px;border:5px solid rgba(var(--p-rgb),.18);border-radius:50%;display:none}
.theme-minimal.layout-cover .d2,.theme-minimal.layout-thankyou .d2{display:block}
.theme-minimal .cv-badge{background:transparent;color:var(--p);padding:0;letter-spacing:4px}
.theme-minimal .cv-title,.theme-minimal .ty-h{color:#111827}
.theme-minimal .cv-sub{color:#4b5563}
.theme-minimal .fc-icon{background:#fff;border:1px solid #e5e7eb}
.theme-minimal .pr::before{height:2px;top:42px;background:#d1d5db}
.theme-minimal .pr.many::before{top:34px}
.theme-minimal .pr-num{box-shadow:none}
.theme-minimal .qs-mark{background:var(--p);color:var(--on-p)}
.theme-minimal .qs-opt{background:#f8fafc;border:1px solid #e5e7eb}

/* =================== THEME: TECHNOLOGY =================== */
.theme-tech{--bg:radial-gradient(circle at 85% 8%,rgba(var(--p-rgb),.28),transparent 38%),radial-gradient(circle at 8% 95%,rgba(var(--p2-rgb),.30),transparent 42%),linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px) 0 0/44px 44px,#070b1a;
  --tx:#e6edff;--title:#ffffff;--muted:rgba(214,226,255,.72);--card:rgba(255,255,255,.05);--card-tx:#e6edff;--card-border:1px solid rgba(var(--p-rgb),.38);
  --shadow:0 0 30px rgba(var(--p-rgb),.12) inset;--radius:16px;--img-bg:rgba(255,255,255,.04);--chip:rgba(var(--p-rgb),.14);--chip-tx:var(--p)}
.theme-tech .s-title{text-shadow:0 0 26px rgba(var(--p-rgb),.55);padding-left:26px}
.theme-tech .s-title::before{content:'';position:absolute;left:0;top:.12em;bottom:.12em;width:7px;border-radius:4px;background:linear-gradient(var(--p),var(--p2));box-shadow:0 0 14px var(--p)}
.theme-tech .cv-title,.theme-tech .ty-h,.theme-tech .qs-q{text-shadow:0 0 34px rgba(var(--p-rgb),.6)}
.theme-tech .cv-badge,.theme-tech .chip{border:1px solid rgba(var(--p-rgb),.5)}
.theme-tech .d1{right:60px;top:50px;width:180px;height:180px;border:2px solid rgba(var(--p-rgb),.35);border-radius:50%;box-shadow:0 0 40px rgba(var(--p-rgb),.25)}
.theme-tech .d2{right:100px;top:90px;width:100px;height:100px;border:2px dashed rgba(var(--p2-rgb),.5);border-radius:50%}
.theme-tech:not(.layout-cover):not(.layout-thankyou):not(.layout-question) .d1,.theme-tech:not(.layout-cover):not(.layout-thankyou):not(.layout-question) .d2{display:none}
.theme-tech .d3{left:0;right:0;bottom:0;height:4px;background:linear-gradient(90deg,var(--p),var(--p2),transparent)}
.theme-tech .pr::before{background:linear-gradient(90deg,var(--p),var(--p2));opacity:.5;height:3px}
.theme-tech .pr-num{background:#070b1a;border:3px solid var(--p);color:var(--p);box-shadow:0 0 22px rgba(var(--p-rgb),.6)}
.theme-tech .fc-icon{background:rgba(var(--p-rgb),.1);border:1px solid rgba(var(--p-rgb),.4)}
.theme-tech .qs-mark{border:2px solid var(--p);box-shadow:0 0 30px rgba(var(--p-rgb),.45)}
.theme-tech .qs-opt{border:1px solid rgba(var(--p-rgb),.35);color:var(--tx)}
.theme-tech .qs-opt b{background:transparent;border:2px solid var(--p);color:var(--p)}
.theme-tech .ct-list li::before{border-radius:2px;transform:rotate(45deg);box-shadow:0 0 10px var(--p)}
.theme-tech .s-foot{font-family:Consolas,'Courier New',monospace}

/* =================== THEME: PLAYFUL =================== */
.theme-playful{--bg:#fff6e5;--tx:#2d2a32;--title:#2d2a32;--muted:#5c5566;--card:#fff;--card-border:3px solid #2d2a32;--shadow:6px 6px 0 #2d2a32;--radius:24px;--img-bg:#fff;--chip:#ffd93d;--chip-tx:#2d2a32}
.theme-playful .d1{width:430px;height:390px;right:-130px;top:-150px;background:var(--p);border-radius:58% 42% 55% 45%/52% 60% 40% 48%;opacity:.9}
.theme-playful .d2{width:210px;height:210px;left:-80px;bottom:-90px;background:#ffd93d;border-radius:50%}
.theme-playful .d3{width:120px;height:120px;right:150px;bottom:40px;background:radial-gradient(circle,var(--p2) 0 7px,transparent 8px) 0 0/30px 30px;opacity:.55}
.theme-playful:not(.layout-cover):not(.layout-thankyou):not(.layout-question) .d1{width:240px;height:220px;right:-90px;top:-110px}
.theme-playful .s-title{text-shadow:4px 4px 0 rgba(var(--p-rgb),.28)}
.theme-playful .cv-title,.theme-playful .ty-h,.theme-playful .qs-q{text-shadow:5px 5px 0 rgba(var(--p-rgb),.35)}
.theme-playful .cv-badge,.theme-playful .chip{border:3px solid #2d2a32;box-shadow:3px 3px 0 #2d2a32}
.theme-playful .img-frame:not(.img-ph){border:3px solid #2d2a32;box-shadow:6px 6px 0 #2d2a32}
.theme-playful .fc-card:nth-child(odd),.theme-playful .tc-col:first-child{transform:rotate(-1.2deg)}
.theme-playful .fc-card:nth-child(even),.theme-playful .tc-col:last-child{transform:rotate(1.2deg)}
.theme-playful .fc-icon{background:var(--p);border:3px solid #2d2a32}
.theme-playful .pr::before{background:repeating-linear-gradient(90deg,#2d2a32 0 14px,transparent 14px 26px);height:4px;top:41px}
.theme-playful .pr.many::before{top:33px}
.theme-playful .pr-num{border:3px solid #2d2a32;box-shadow:4px 4px 0 #2d2a32}
.theme-playful .pr-step:nth-child(even) .pr-num{background:var(--p2)}
.theme-playful .qs-mark{background:var(--p);color:var(--on-p);border:4px solid #2d2a32;box-shadow:5px 5px 0 #2d2a32}
.theme-playful .qs-opt{background:#fff;border:3px solid #2d2a32;box-shadow:4px 4px 0 #2d2a32}
.theme-playful .qs-opt b{border:2px solid #2d2a32}
.theme-playful .ct-list li::before{border-radius:50%;width:18px;height:18px;border:3px solid #2d2a32}
.theme-playful .tc-h,.theme-playful .pr-name,.theme-playful .in-label{color:#2d2a32}
.theme-playful .tc-h{text-decoration:underline;text-decoration-color:var(--p);text-decoration-thickness:6px;text-underline-offset:6px}
`;
(function () {
  const s = document.createElement('style');
  s.id = 'mx-slide-css';
  s.textContent = window.MXS.SLIDE_CSS;
  document.head.appendChild(s);
})();
