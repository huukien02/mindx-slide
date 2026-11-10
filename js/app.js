/* Điều khiển ứng dụng: điều hướng, trang chủ (chọn mẫu), trình soạn thảo */
(function (M) {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = M.esc;
  const clone = o => JSON.parse(JSON.stringify(o));
  const MAX_SLIDES = 20;

  let deck = null, cur = 0, saveTimer = null, dirty = false, raf = 0;

  /* ================= Tiện ích giao diện ================= */
  M.toast = function (msg, type = 'dark') {
    const colors = { dark: 'text-bg-dark', danger: 'text-bg-danger', warning: 'text-bg-warning', success: 'text-bg-success', info: 'text-bg-primary' };
    const t = document.createElement('div');
    t.className = `toast align-items-center border-0 ${colors[type] || colors.dark}`;
    t.setAttribute('role', 'status');
    t.innerHTML = `<div class="d-flex"><div class="toast-body">${esc(msg)}</div><button type="button" class="btn-close ${type === 'warning' ? '' : 'btn-close-white'} me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    $('#toasts').appendChild(t);
    const bt = new bootstrap.Toast(t, { delay: type === 'danger' ? 6000 : 3500 });
    t.addEventListener('hidden.bs.toast', () => t.remove());
    bt.show();
  };

  M.confirm = function (title, body, okText = 'Xóa', okClass = 'btn-danger', cancelText = 'Hủy') {
    return new Promise(resolve => {
      const m = $('#confirmModal'), ok = $('#confirmOk');
      $('#confirmTitle').textContent = title;
      $('#confirmBody').innerHTML = body;
      ok.textContent = okText;
      ok.className = 'btn ' + okClass;
      $('#confirmCancel').textContent = cancelText;
      let result = false;
      const onOk = () => { result = true; bootstrap.Modal.getInstance(m).hide(); };
      ok.addEventListener('click', onOk, { once: true });
      m.addEventListener('hidden.bs.modal', () => { ok.removeEventListener('click', onOk); resolve(result); }, { once: true });
      bootstrap.Modal.getOrCreateInstance(m).show();
    });
  };

  const timeStr = t => new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  const dateStr = t => {
    const d = new Date(t), now = new Date();
    return d.toDateString() === now.toDateString() ? 'hôm nay, ' + timeStr(t) : d.toLocaleDateString('vi-VN') + ' ' + timeStr(t);
  };

  function showScreen(name) {
    $$('.screen').forEach(s => s.classList.toggle('d-none', s.id !== 'screen-' + name));
    window.scrollTo(0, 0);
  }

  /* ================= Điều hướng ================= */
  function route() {
    if (M.Present.isOpen()) M.Present.close();
    flushSave();
    const h = location.hash || '#/';
    if (h.indexOf('#/edit/') === 0) {
      const d = M.store.load(decodeURIComponent(h.slice(7)));
      if (d) return openEditor(d);
      M.toast('Không tìm thấy bài thuyết trình này.', 'warning');
      location.hash = '#/';
      return;
    }
    deck = null;
    if (h === '#demos') { showHome(); $('#demos').scrollIntoView(); return; }
    showHome();
  }

  /* ================= Trang chủ ================= */
  function coverThumb(d) {
    return d.slides[0] ? M.renderSlide(d.slides[0], d, { index: 0, total: d.slides.length }) : '';
  }
  function showHome() {
    showScreen('home');
    document.title = 'Mindx Slide';

    const demoBox = $('#demoList');
    demoBox.innerHTML = '';
    M.DEMOS.forEach((d, i) => {
      const pt = M.PRODUCT_TYPES[d.productType];
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `<div class="card deck-card tpl-card tpl-${d.productType}" role="button" title="Dùng mẫu này">
        <div class="tpl-head"><span class="tpl-ico">${pt.icon}</span><div><div class="tpl-name">Làm ${pt.label}</div>
        <div class="tpl-desc">${esc(pt.desc)}</div></div></div>
        <div class="slide-fit"></div>
        <div class="card-body d-flex align-items-center">
          <span class="small text-secondary">Ví dụ: ${esc(d.productName)} · ${d.slides.length} slide</span>
          <span class="btn btn-sm tpl-btn ms-auto">Dùng mẫu này <i class="bi bi-arrow-right"></i></span></div></div>`;
      demoBox.appendChild(col);
      M.mount($('.slide-fit', col), coverThumb(d));
      $('.deck-card', col).addEventListener('click', () => openDemo(i));
    });

    const list = M.store.list(), box = $('#deckList');
    $('#deckCount').textContent = list.length ? `(${list.length})` : '';
    box.innerHTML = '';
    if (!list.length) {
      box.innerHTML = `<div class="col-12"><div class="empty-box">Chưa có bài nào – hãy chọn một mẫu ở trên để bắt đầu.</div></div>`;
    }
    list.forEach(meta => {
      const d = M.store.load(meta.id);
      if (!d) return;
      const pt = M.PRODUCT_TYPES[d.productType];
      const col = document.createElement('div');
      col.className = 'col-sm-6 col-lg-4 col-xl-3';
      col.innerHTML = `<div class="card deck-card" role="button" title="Mở lại"><div class="slide-fit"></div><div class="card-body d-flex align-items-start gap-2">
        <div class="flex-grow-1 min-w-0"><div class="card-title text-truncate">${esc(d.title || 'Chưa đặt tên')}</div>
        <div class="small text-secondary">${pt.icon} ${d.slides.length} slide · ${dateStr(d.updatedAt)}</div></div>
        <button class="btn btn-sm btn-link text-secondary del" title="Xóa bài"><i class="bi bi-trash"></i></button></div></div>`;
      box.appendChild(col);
      M.mount($('.slide-fit', col), coverThumb(d));
      $('.deck-card', col).addEventListener('click', () => { location.hash = '#/edit/' + encodeURIComponent(d.id); });
      $('.del', col).addEventListener('click', async e => {
        e.stopPropagation();
        if (await M.confirm('Xóa bài thuyết trình?', `Bài <b>${esc(d.title)}</b> sẽ bị xóa khỏi máy này và không thể khôi phục.<br><small class="text-secondary">Mẹo: hãy Xuất JSON trước nếu muốn giữ bản sao lưu.</small>`)) {
          M.store.remove(d.id);
          M.toast('Đã xóa bài thuyết trình.');
          showHome();
        }
      });
    });
  }

  function openDemo(i) {
    const d = M.newDeck(clone(M.DEMOS[i]));
    d.slides = d.slides.map(s => Object.assign(s, { id: M.uid() }));
    const r = M.store.save(d);
    if (!r.ok) return M.toast('Bộ nhớ trình duyệt đã đầy. Hãy xóa bớt bài cũ.', 'danger');
    M.toast('Đã tạo bài từ mẫu – em hãy sửa nội dung thành sản phẩm của mình nhé!', 'success');
    location.hash = '#/edit/' + d.id;
  }

  /* ================= Trình soạn thảo ================= */
  function openEditor(d) {
    const sameDeck = deck && deck.id === d.id;
    deck = d;
    if (!sameDeck) cur = 0;
    cur = Math.min(cur, deck.slides.length - 1);
    showScreen('editor');
    M.store.setLast(deck.id);
    document.title = deck.title + ' – Mindx Slide';
    $('#deckTitle').value = deck.title;
    setStatus('saved', deck.updatedAt);
    renderDesign();
    renderSidebar();
    selectSlide(cur);
    requestAnimationFrame(sizePreview);
  }

  /* ----- Lưu ----- */
  function setStatus(st, t) {
    const el = $('#saveStatus');
    el.className = 'save-status ' + st;
    el.innerHTML = st === 'saving' ? '<i class="bi bi-arrow-repeat"></i> Đang lưu...'
      : st === 'error' ? '<i class="bi bi-exclamation-triangle-fill"></i> Chưa lưu được – bộ nhớ đầy!'
        : `<i class="bi bi-check-circle-fill"></i> Đã lưu lúc ${timeStr(t || Date.now())}`;
  }
  function markDirty() {
    dirty = true;
    setStatus('saving');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNow, 700);
  }
  function saveNow(manual) {
    clearTimeout(saveTimer);
    if (!deck) return;
    const r = M.store.save(deck);
    if (r.ok) {
      dirty = false;
      setStatus('saved', deck.updatedAt);
      if (manual) M.toast('Đã lưu bài thuyết trình.', 'success');
    } else {
      setStatus('error');
      M.toast(r.quota
        ? 'Bộ nhớ trình duyệt đã đầy (thường do quá nhiều ảnh). Hãy Xuất JSON để sao lưu, rồi xóa bớt ảnh hoặc bài cũ.'
        : 'Không lưu được bài thuyết trình.', 'danger');
    }
  }
  function flushSave() { if (deck && dirty) saveNow(); }

  /* ----- Sidebar ----- */
  function thumbHTML(i) {
    return M.renderSlide(deck.slides[i], deck, { index: i, total: deck.slides.length });
  }
  function warnIcon(slide) {
    const w = M.Editor.warnings(slide).filter(x => x.lv !== 'info');
    if (!w.length) return '';
    const danger = w.some(x => x.lv === 'danger');
    return `<i class="bi bi-exclamation-triangle-fill w ${danger ? 'danger' : ''}" title="${esc(w.map(x => x.t).join('\n'))}"></i>`;
  }
  function renderSidebar() {
    const list = $('#slideList'), n = deck.slides.length;
    $('#slideCount').textContent = `(${n}/${MAX_SLIDES})`;
    list.innerHTML = '';
    deck.slides.forEach((s, i) => {
      const ct = M.CONTENT_TYPES[s.contentType] || M.CONTENT_TYPES.custom;
      const item = document.createElement('div');
      item.className = 'thumb' + (i === cur ? ' active' : '');
      item.dataset.i = i;
      item.innerHTML = `<div class="thumb-num">${i + 1}</div><div class="thumb-main">
        <div class="slide-fit"></div>
        <div class="thumb-meta"><span class="lay" title="${esc(ct.label)}"><i class="bi ${M.LAYOUTS[s.layout].icon}"></i> ${esc(ct.label)}</span><span class="wi">${warnIcon(s)}</span></div>
        <div class="thumb-actions">
          <button data-act="up" title="Chuyển lên" ${i === 0 ? 'disabled' : ''}><i class="bi bi-arrow-up"></i></button>
          <button data-act="down" title="Chuyển xuống" ${i === n - 1 ? 'disabled' : ''}><i class="bi bi-arrow-down"></i></button>
          <button data-act="dup" title="Nhân bản"><i class="bi bi-copy"></i></button>
          <button data-act="del" class="rm" title="Xóa slide" ${n <= 1 ? 'disabled' : ''}><i class="bi bi-trash"></i></button>
        </div></div>`;
      list.appendChild(item);
      M.mount($('.slide-fit', item), thumbHTML(i));
    });
    $('#btnAdd').disabled = n >= MAX_SLIDES;
  }
  function updateThumb(i) {
    const item = $(`#slideList .thumb[data-i="${i}"]`);
    if (!item) return;
    M.mount($('.slide-fit', item), thumbHTML(i));
    $('.wi', item).innerHTML = warnIcon(deck.slides[i]);
  }
  function refreshAllThumbs() { deck.slides.forEach((_, i) => updateThumb(i)); }

  async function slideAction(act, i) {
    const s = deck.slides;
    if (act === 'up' && i > 0) { [s[i - 1], s[i]] = [s[i], s[i - 1]]; cur = i - 1; }
    else if (act === 'down' && i < s.length - 1) { [s[i + 1], s[i]] = [s[i], s[i + 1]]; cur = i + 1; }
    else if (act === 'dup') {
      if (s.length >= MAX_SLIDES) return M.toast(`Bài thuyết trình có tối đa ${MAX_SLIDES} slide.`, 'warning');
      const c = clone(s[i]); c.id = M.uid(); delete c.stash;
      s.splice(i + 1, 0, c); cur = i + 1;
      M.toast(`Đã nhân bản slide ${i + 1}.`);
    } else if (act === 'del') {
      if (s.length <= 1) return;
      if (!await M.confirm('Xóa slide?', `Slide <b>${i + 1}</b> và toàn bộ nội dung của nó sẽ bị xóa.`)) return;
      s.splice(i, 1);
      cur = Math.min(cur > i ? cur - 1 : cur, s.length - 1);
    } else return;
    renderSidebar();
    selectSlide(cur);
    markDirty();
  }

  function addSlide(ctId, layout) {
    if (deck.slides.length >= MAX_SLIDES) return M.toast(`Bài thuyết trình có tối đa ${MAX_SLIDES} slide.`, 'warning');
    const s = M.makeSlide(ctId, deck, layout);
    deck.slides.splice(cur + 1, 0, s);
    cur = cur + 1;
    bootstrap.Modal.getInstance($('#addModal'))?.hide();
    renderSidebar();
    selectSlide(cur);
    markDirty();
  }
  function openAddModal() {
    if (deck.slides.length >= MAX_SLIDES) return M.toast(`Bài thuyết trình có tối đa ${MAX_SLIDES} slide.`, 'warning');
    const pt = M.PRODUCT_TYPES[deck.productType];
    $('#addTypeLabel').textContent = pt.icon + ' ' + pt.label;
    $('#addCtGrid').innerHTML = M.contentTypesFor(deck.productType).filter(k => k !== 'custom').map(k => {
      const c = M.CONTENT_TYPES[k], L = M.LAYOUTS[c.layout];
      return `<button type="button" class="add-opt" data-ct="${k}"><i class="bi ${L.icon}"></i><b>${esc(c.label)}</b><small>${esc(c.guide || L.desc)}</small></button>`;
    }).join('');
    bootstrap.Modal.getOrCreateInstance($('#addModal')).show();
  }

  /* ----- Chọn slide & form ----- */
  function selectSlide(i) {
    cur = Math.max(0, Math.min(deck.slides.length - 1, i));
    $$('#slideList .thumb').forEach(t => t.classList.toggle('active', +t.dataset.i === cur));
    const act = $(`#slideList .thumb[data-i="${cur}"]`);
    if (act) act.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    buildPanel();
    renderPreview();
  }

  function buildPanel() {
    const s = deck.slides[cur], ct = M.CONTENT_TYPES[s.contentType] || M.CONTENT_TYPES.custom;
    $('#edSlideHead').innerHTML = `Sửa slide ${cur + 1}: <b>${esc(ct.label)}</b>`;
    M.Editor.build($('#fieldForm'), s, deck, onFieldChange);
    renderWarnings();
  }

  function renderWarnings() {
    const w = M.Editor.warnings(deck.slides[cur]);
    const icon = { danger: 'bi-x-octagon-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-lightbulb-fill' };
    $('#warnBox').innerHTML = w.length ? `<ul class="warn-list">${w.map(x => `<li class="${x.lv}"><i class="bi ${icon[x.lv]}"></i><span>${esc(x.t)}</span></li>`).join('')}</ul>` : '';
  }

  function onFieldChange() {
    if (!raf) raf = requestAnimationFrame(() => {
      raf = 0;
      renderPreview();
      updateThumb(cur);
      renderWarnings();
    });
    markDirty();
  }

  /* ----- Preview ----- */
  function renderPreview() {
    if (!deck) return;
    M.mount($('#previewBox'), M.renderSlide(deck.slides[cur], deck, { index: cur, total: deck.slides.length, ph: true }));
    $('#pvCounter').textContent = `${cur + 1} / ${deck.slides.length}`;
    $('#pvPrev').disabled = cur === 0;
    $('#pvNext').disabled = cur === deck.slides.length - 1;
  }
  function sizePreview() {
    const wrap = $('#previewWrap'), box = $('#previewBox');
    if (!wrap || !wrap.clientWidth) return;
    const cs = getComputedStyle(wrap);
    const w = wrap.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = wrap.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const stacked = window.matchMedia('(max-width: 991.98px)').matches;
    box.style.width = (stacked ? w : Math.max(200, Math.min(w, h * 16 / 9))) + 'px';
  }

  /* ----- Thiết kế ----- */
  function renderDesign() {
    const sample = deck.slides[0];
    const tg = $('#themeGrid');
    tg.innerHTML = '';
    M.THEME_ORDER.forEach(k => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'theme-opt' + (deck.theme === k ? ' active' : '');
      b.innerHTML = `<div class="slide-fit"></div><span>${M.THEMES[k].name}</span>`;
      tg.appendChild(b);
      const fake = Object.assign({}, deck, { theme: k, primaryColor: M.THEMES[k].primary, font: M.THEMES[k].font });
      M.mount($('.slide-fit', b), M.renderSlide(sample, fake, { index: 0, total: 1 }));
      b.addEventListener('click', () => {
        deck.theme = k;
        deck.primaryColor = M.THEMES[k].primary;
        deck.font = M.THEMES[k].font;
        designChanged();
      });
    });
    $('#colorInput').value = deck.primaryColor;
    $('#swatches').innerHTML = M.SWATCHES.map(c => `<button type="button" class="swatch ${c.toLowerCase() === deck.primaryColor.toLowerCase() ? 'active' : ''}" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('');
    $('#fontList').innerHTML = M.FONTS.map(f => `<button type="button" class="font-opt ${f === deck.font ? 'active' : ''}" data-f="${esc(f)}" style="font-family:'${f}'">${esc(f)}</button>`).join('');
  }
  function designChanged() {
    renderDesign();
    renderPreview();
    refreshAllThumbs();
    markDirty();
  }

  /* ================= Giao diện sáng / tối ================= */
  function syncThemeButtons() {
    const dark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    $$('[data-action=toggle-theme]').forEach(b => {
      b.innerHTML = dark ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-stars-fill"></i>';
      b.title = dark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối';
    });
  }
  function toggleTheme() {
    const next = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', next);
    try { localStorage.setItem('mxs.uiTheme', next); } catch (e) { /* bỏ qua */ }
    syncThemeButtons();
  }

  /* ================= Gắn sự kiện ================= */
  document.addEventListener('DOMContentLoaded', () => {
    $('#fontLink').href = M.fontLink(M.FONTS);
    syncThemeButtons();
    $$('[data-action=toggle-theme]').forEach(b => b.addEventListener('click', toggleTheme));
    // Header
    $('#deckTitle').addEventListener('input', e => { deck.title = e.target.value; document.title = deck.title + ' – Mindx Slide'; markDirty(); });
    $('#deckTitle').addEventListener('blur', e => { if (!deck.title.trim()) { deck.title = 'Bài thuyết trình chưa đặt tên'; e.target.value = deck.title; markDirty(); } });
    $('#btnPresent').addEventListener('click', () => { flushSave(); M.Present.open(deck, cur); });
    $('#btnHtml').addEventListener('click', () => { flushSave(); M.exportHTML(deck); M.toast('Đã xuất file HTML – mở bằng trình duyệt để trình chiếu.', 'success'); });

    // Sidebar
    $('#slideList').addEventListener('click', e => {
      const item = e.target.closest('.thumb');
      if (!item) return;
      const i = +item.dataset.i, btn = e.target.closest('[data-act]');
      if (btn) { e.stopPropagation(); slideAction(btn.dataset.act, i); }
      else if (i !== cur) selectSlide(i);
    });
    $('#btnAdd').addEventListener('click', openAddModal);
    $('#addModal').addEventListener('click', e => {
      const b = e.target.closest('.add-opt');
      if (b) addSlide(b.dataset.ct);
    });

    // Editor

    // Thiết kế
    $('#colorInput').addEventListener('input', e => {
      deck.primaryColor = e.target.value;
      $$('#swatches .swatch').forEach(s => s.classList.toggle('active', s.dataset.c.toLowerCase() === deck.primaryColor.toLowerCase()));
      renderPreview();
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; refreshAllThumbs(); });
      markDirty();
    });
    $('#colorInput').addEventListener('change', () => renderDesign());
    $('#swatches').addEventListener('click', e => { const b = e.target.closest('.swatch'); if (b) { deck.primaryColor = b.dataset.c; designChanged(); } });
    $('#fontList').addEventListener('click', e => { const b = e.target.closest('.font-opt'); if (b) { deck.font = b.dataset.f; designChanged(); } });

    // Preview
    $('#pvPrev').addEventListener('click', () => selectSlide(cur - 1));
    $('#pvNext').addEventListener('click', () => selectSlide(cur + 1));
    $('#pvFull').addEventListener('click', () => { flushSave(); M.Present.open(deck, cur); });
    // Bấm vào chữ / ảnh trên slide xem trước → nhảy tới ô nhập tương ứng
    $('#previewBox').addEventListener('click', e => {
      const t = e.target.closest('[data-k]');
      if (t) M.Editor.focusField($('#fieldForm'), t.dataset.k);
    });
    if ('ResizeObserver' in window) new ResizeObserver(sizePreview).observe($('#previewWrap'));
    window.addEventListener('resize', sizePreview);
    M.Present.onClose = i => { if (deck) selectSlide(i); };

    // Phím tắt trong trình soạn thảo
    document.addEventListener('keydown', e => {
      if (!deck || M.Present.isOpen()) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); saveNow(true); }
    });
    window.addEventListener('beforeunload', flushSave);
    window.addEventListener('hashchange', route);
    route();
  });
})(window.MXS);
