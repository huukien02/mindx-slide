/* Chế độ trình chiếu toàn màn hình */
window.MXS = window.MXS || {};
(function (M) {
  let deck = null, idx = 0, idleTimer = null;
  const $ = s => document.querySelector(s);

  function fit() {
    const stage = $('#presStage'), box = $('#presFit');
    const s = Math.min(stage.clientWidth / 1280, stage.clientHeight / 720);
    box.style.width = 1280 * s + 'px';
    box.style.height = 720 * s + 'px';
    box.style.setProperty('--s', s);
  }
  function show(i) {
    idx = Math.max(0, Math.min(deck.slides.length - 1, i));
    const box = $('#presFit');
    box.innerHTML = M.renderSlide(deck.slides[idx], deck, { index: idx, total: deck.slides.length });
    box.classList.remove('pres-anim'); void box.offsetWidth; box.classList.add('pres-anim');
    $('#presCounter').textContent = `${idx + 1} / ${deck.slides.length}`;
    $('#presPrev').disabled = idx === 0;
    $('#presNext').disabled = idx === deck.slides.length - 1;
    fit();
  }
  function wake() {
    const p = $('#presenter');
    p.classList.add('show-ui');
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => p.classList.remove('show-ui'), 2500);
  }
  function onKey(e) {
    if (!deck) return;
    const k = e.key;
    if (k === 'ArrowRight' || k === ' ' || k === 'PageDown' || k === 'Enter') { e.preventDefault(); show(idx + 1); }
    else if (k === 'ArrowLeft' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); show(idx - 1); }
    else if (k === 'Home') show(0);
    else if (k === 'End') show(deck.slides.length - 1);
    else if (k === 'Escape') { e.preventDefault(); close(); }
  }
  function onFsChange() { if (deck && !document.fullscreenElement && M.Present._fs) close(); }

  function open(d, start) {
    deck = d;
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); // tránh Space kích hoạt nút đang focus
    const p = $('#presenter');
    p.classList.remove('d-none');
    document.body.classList.add('presenting');
    M.Present._fs = false;
    if (p.requestFullscreen) p.requestFullscreen().then(() => { M.Present._fs = true; fit(); }).catch(() => {});
    show(start || 0);
    wake();
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', fit);
  }
  function close() {
    if (!deck) return;
    const last = idx;
    deck = null;
    $('#presenter').classList.add('d-none');
    document.body.classList.remove('presenting');
    document.removeEventListener('keydown', onKey);
    window.removeEventListener('resize', fit);
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
    if (M.Present.onClose) M.Present.onClose(last);
  }

  document.addEventListener('DOMContentLoaded', () => {
    $('#presPrev').addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
    $('#presNext').addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
    $('#presExit').addEventListener('click', e => { e.stopPropagation(); close(); });
    $('#presStage').addEventListener('click', () => show(idx + 1));
    $('#presenter').addEventListener('mousemove', wake);
    document.addEventListener('fullscreenchange', onFsChange);
  });

  M.Present = { open, close, isOpen: () => !!deck };
})(window.MXS);
