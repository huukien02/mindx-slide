/* Xuất HTML độc lập, PDF (qua hộp thoại in) và JSON */
window.MXS = window.MXS || {};
(function (M) {
  const PLAYER_CSS = `
html,body{margin:0;height:100%;background:#0b0d17;overflow:hidden;font-family:system-ui,'Segoe UI',sans-serif}
.pg{position:absolute;left:50%;top:50%;width:1280px;height:720px;transform-origin:center;display:none;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.pg.on{display:block;animation:pgIn .35s ease}
@keyframes pgIn{from{opacity:0}to{opacity:1}}
.ctl{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);display:flex;gap:8px;align-items:center;background:rgba(15,18,35,.82);color:#fff;padding:8px 12px;border-radius:999px;z-index:10;opacity:0;transition:opacity .3s}
body.ui .ctl,.ctl:hover{opacity:1}
.ctl button{background:rgba(255,255,255,.12);border:0;color:#fff;width:40px;height:40px;border-radius:50%;font-size:20px;cursor:pointer}
.ctl button:hover{background:rgba(255,255,255,.25)}
.ctl button:disabled{opacity:.35;cursor:default}
.ctl span{min-width:70px;text-align:center;font-weight:700}
@media print{
  @page{size:1280px 720px;margin:0}
  html,body{height:auto;overflow:visible;background:#fff}
  .pg{display:block!important;position:relative;left:0;top:0;transform:none!important;box-shadow:none;animation:none;break-after:page;page-break-after:always}
  .pg:last-child{break-after:auto;page-break-after:auto}
  .ctl{display:none}
}`;
  const PLAYER_JS = `(function(){
var pages=[].slice.call(document.querySelectorAll('.pg')),i=0,ct=document.getElementById('ct'),t;
function fit(){var s=Math.min(innerWidth/1280,innerHeight/720);pages.forEach(function(p){p.style.transform='translate(-50%,-50%) scale('+s+')';});}
function go(n){i=Math.max(0,Math.min(pages.length-1,n));pages.forEach(function(p,k){p.classList.toggle('on',k===i);});
ct.textContent=(i+1)+' / '+pages.length;document.getElementById('pv').disabled=i===0;document.getElementById('nx').disabled=i===pages.length-1;
try{history.replaceState(null,'','#'+(i+1));}catch(e){}}
function fs(){var d=document;if(d.fullscreenElement){d.exitFullscreen();}else if(d.documentElement.requestFullscreen){d.documentElement.requestFullscreen();}}
function ui(){document.body.classList.add('ui');clearTimeout(t);t=setTimeout(function(){document.body.classList.remove('ui');},2500);}
document.addEventListener('keydown',function(e){var k=e.key;
if(k==='ArrowRight'||k===' '||k==='PageDown'||k==='Enter'){e.preventDefault();go(i+1);}
else if(k==='ArrowLeft'||k==='PageUp'||k==='Backspace'){e.preventDefault();go(i-1);}
else if(k==='Home'){go(0);}else if(k==='End'){go(pages.length-1);}
else if(k==='f'||k==='F'){fs();}
else if(k==='Escape'&&document.fullscreenElement){document.exitFullscreen();}});
document.getElementById('pv').onclick=function(e){e.stopPropagation();go(i-1);};
document.getElementById('nx').onclick=function(e){e.stopPropagation();go(i+1);};
document.getElementById('fs').onclick=function(e){e.stopPropagation();fs();};
document.getElementById('stage').onclick=function(){go(i+1);};
document.addEventListener('mousemove',ui);addEventListener('resize',fit);
var h=parseInt(location.hash.slice(1),10);fit();go(h?h-1:0);ui();
})();`;

  M.exportHTML = function (deck) {
    const total = deck.slides.length;
    const pages = deck.slides.map((s, i) => `<section class="pg">${M.renderSlide(s, deck, { index: i, total })}</section>`).join('\n');
    const html = `<!doctype html>
<html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${M.esc(deck.title)}</title>
<meta name="generator" content="Mindx Slide">
<link rel="stylesheet" href="${M.esc(M.fontLink([deck.font]))}">
<style>${M.SLIDE_CSS}${PLAYER_CSS}</style></head>
<body><div id="stage">
${pages}
</div>
<div class="ctl"><button id="pv" title="Slide trước (←)">‹</button><span id="ct"></span><button id="nx" title="Slide sau (→ / Space)">›</button><button id="fs" title="Toàn màn hình (F)">⛶</button></div>
<script>${PLAYER_JS}<\/script></body></html>`;
    M.download(M.slug(deck.title) + '.html', html, 'text/html;charset=utf-8');
  };

})(window.MXS);
