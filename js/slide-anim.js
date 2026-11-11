/* Hiệu ứng khi trình chiếu: slide chuyển cảnh + nội dung xuất hiện lần lượt, kiểu riêng theo từng theme.
   Chỉ chạy khi slide có class .mx-in (do mxAnimate gắn) – trình soạn thảo và thumbnail không bị ảnh hưởng.
   CSS và hàm mxAnimate được nhúng nguyên vẹn vào file HTML xuất ra. */
window.MXS = window.MXS || {};
window.MXS.ANIM_CSS = String.raw`
@media (prefers-reduced-motion: no-preference) {
/* ---- chung (Modern) : phóng nhẹ + nội dung trồi lên ---- */
.mx-slide.mx-in{animation:mxZoomIn .7s cubic-bezier(.2,.8,.2,1) both}
.mx-slide.mx-in .mx-a{animation:mxUp .75s cubic-bezier(.2,.8,.2,1) var(--d) both}
.mx-slide.mx-in .pr::before{transform-origin:left center;animation:mxGrow 1.1s cubic-bezier(.6,0,.2,1) .35s both}
@keyframes mxZoomIn{from{opacity:0;transform:scale(1.06)}}
@keyframes mxUp{from{opacity:0;transform:translateY(34px)}}
@keyframes mxGrow{from{transform:scaleX(0)}}
.theme-modern.mx-in .d1{animation:mxFloat 9s ease-in-out infinite alternate}
.theme-modern.mx-in .d2{animation:mxFloat 7s ease-in-out -3s infinite alternate-reverse}
@keyframes mxFloat{to{transform:translate(-46px,34px) scale(1.1)}}

/* ---- Minimal : mờ dần, trượt nhẹ từ trái ---- */
.theme-minimal.mx-in{animation:mxFade .6s ease both}
.theme-minimal.mx-in .mx-a{animation:mxLeft .8s cubic-bezier(.2,.8,.2,1) var(--d) both}
.theme-minimal.mx-in .d1{transform-origin:top;animation:mxGrowY .9s cubic-bezier(.6,0,.2,1) both}
@keyframes mxFade{from{opacity:0}}
@keyframes mxLeft{from{opacity:0;transform:translateX(-28px)}}
@keyframes mxGrowY{from{transform:scaleY(0)}}

/* ---- Technology : trượt + nhòe, quét tia sáng, chữ lộ dần như màn hình máy tính ---- */
.theme-tech.mx-in{animation:mxTechIn .6s cubic-bezier(.2,.8,.2,1) both}
.theme-tech.mx-in.mx-back{animation-name:mxTechBack}
.theme-tech.mx-in .mx-a{animation:mxScan .7s cubic-bezier(.6,0,.2,1) var(--d) both}
.theme-tech.mx-in .s-title.mx-a,.theme-tech.mx-in .cv-title.mx-a,.theme-tech.mx-in .ty-h.mx-a,.theme-tech.mx-in .qs-q.mx-a{
  animation:mxScan .7s cubic-bezier(.6,0,.2,1) var(--d) both,mxGlitch .45s steps(3) calc(var(--d) + .6s)}
.theme-tech.mx-in::after{content:'';position:absolute;top:0;bottom:0;left:0;width:28%;z-index:6;pointer-events:none;
  background:linear-gradient(90deg,transparent,rgba(var(--p-rgb),.45),rgba(255,255,255,.25),transparent);animation:mxSweep 1s ease-out .15s both}
.theme-tech.mx-in .d2{animation:mxSpin 16s linear infinite}
.theme-tech.mx-in .d1{animation:mxPulse 3s ease-in-out infinite}
@keyframes mxTechIn{from{opacity:0;transform:translateX(70px);filter:blur(10px)}}
@keyframes mxTechBack{from{opacity:0;transform:translateX(-70px);filter:blur(10px)}}
@keyframes mxScan{from{opacity:.15;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0 -20% 0 0)}}
@keyframes mxGlitch{0%{transform:translateX(-4px);text-shadow:4px 0 #ff2bd6,-4px 0 #00f0ff}50%{transform:translateX(3px);text-shadow:-3px 0 #ff2bd6,3px 0 #00f0ff}}
@keyframes mxSweep{from{transform:translateX(-110%);opacity:1}to{transform:translateX(420%);opacity:0}}
@keyframes mxSpin{to{transform:rotate(360deg)}}
@keyframes mxPulse{50%{box-shadow:0 0 70px rgba(var(--p-rgb),.55)}}

/* ---- Playful : rơi xuống nảy, nội dung bật ra vui nhộn ---- */
.theme-playful.mx-in{animation:mxDrop .75s cubic-bezier(.34,1.56,.64,1) both}
.theme-playful.mx-in .mx-a{animation:mxPop .65s cubic-bezier(.34,1.56,.64,1) var(--d) both}
.theme-playful.mx-in .d1{animation:mxWobble 6s ease-in-out infinite alternate}
.theme-playful.mx-in .d2{animation:mxBounce 2.4s ease-in-out infinite}
@keyframes mxDrop{from{opacity:0;transform:translateY(-80px) rotate(-2deg)}}
@keyframes mxPop{from{opacity:0;transform:scale(.35) rotate(-10deg)}}
@keyframes mxWobble{to{transform:rotate(12deg) scale(1.06);border-radius:45% 55% 40% 60%/60% 40% 60% 40%}}
@keyframes mxBounce{50%{transform:translateY(-22px)}}
}`;

/* Gắn hiệu ứng cho slide nằm trong root. dir = -1 khi lùi lại. Viết kiểu ES5 để nhúng vào file HTML xuất ra. */
function mxAnimate(root, dir) {
  var slide = root.querySelector('.mx-slide');
  if (!slide) return;
  var sel = '.s-title,.s-sub,.cv-badge,.cv-title,.cv-sub,.cv-meta .chip,.cv-img,.in-block,.in-img,.ct-para,.ct-list li,.ct-img,' +
    '.it-img,.it-desc,.tc-col,.fc-card,.gl-item,.pr-step,.qs-mark,.qs-label,.qs-q,.qs-opt,.qs-note,.ty-emoji,.ty-h,.ty-m,.ty-chips .chip,.ty-img';
  var els = slide.querySelectorAll(sel);
  for (var i = 0; i < els.length; i++) {
    els[i].classList.add('mx-a');
    els[i].style.setProperty('--d', (0.2 + Math.min(i, 12) * 0.11).toFixed(2) + 's');
  }
  slide.classList.remove('mx-in', 'mx-back');
  void slide.offsetWidth; // khởi động lại animation
  slide.classList.add('mx-in');
  if (dir < 0) slide.classList.add('mx-back');
}
window.MXS.animateSlide = mxAnimate;

(function () {
  var s = document.createElement('style');
  s.id = 'mx-anim-css';
  s.textContent = window.MXS.ANIM_CSS;
  document.head.appendChild(s);
})();
