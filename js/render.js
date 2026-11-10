/* Bộ dựng slide dùng chung cho Thumbnail, Preview, Trình chiếu, xuất HTML và PDF.
   renderSlide(slide, deck, {index, total, ph}) -> chuỗi HTML của slide 1280x720.
   ph = true: hiển thị chữ gợi ý ở các ô trống (chỉ dùng trong trình soạn thảo). */
window.MXS = window.MXS || {};
(function (M) {
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = M.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ESC[c]);
  const nl = s => esc(s).replace(/\n/g, '<br>');

  /* ---------- màu ---------- */
  function hexToRgb(hex) {
    let h = String(hex || '').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    if (!/^[0-9a-f]{6}$/i.test(h)) h = '6c5ce7';
    return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  }
  function rgbToHsl([r, g, b]) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    return [h, s, l];
  }
  function hslToRgb([h, s, l]) {
    h = ((h % 360) + 360) % 360 / 360;
    if (!s) return [l, l, l].map(v => Math.round(v * 255));
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
    const f = t => { t = (t + 1) % 1; return t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p; };
    return [f(h + 1 / 3), f(h), f(h - 1 / 3)].map(v => Math.round(v * 255));
  }
  M.colorVars = function (deck) {
    const theme = M.THEMES[deck.theme] || M.THEMES.modern;
    const rgb = hexToRgb(deck.primaryColor || theme.primary);
    const [h, s, l] = rgbToHsl(rgb);
    const rgb2 = hslToRgb([h + theme.hueShift, Math.max(s, 0.55), Math.min(Math.max(l, 0.45), 0.62)]);
    const hex = c => '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
    // màu chữ trên nền màu chủ đạo: đen nếu màu sáng
    const lum = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
    const font = deck.font || theme.font;
    return `--p:${hex(rgb)};--p-rgb:${rgb.join(',')};--p2:${hex(rgb2)};--p2-rgb:${rgb2.join(',')};--on-p:${lum > 0.68 ? '#111827' : '#ffffff'};--font:'${font}'`;
  };

  /* ---------- tiện ích ---------- */
  // Giảm cỡ chữ theo độ dài để nội dung dài không làm vỡ bố cục (không cắt dữ liệu gốc)
  const fit = (text, base, min, soft) => {
    const len = String(text || '').length;
    return len <= soft ? base : Math.max(min, Math.round(base * Math.sqrt(soft / len)));
  };
  // Trong trình soạn thảo, mỗi phần tử gắn data-k = đường dẫn trường dữ liệu để bấm vào slide là nhảy tới ô nhập
  let editing = false;
  const dk = k => (editing && k ? ` data-k="${esc(k)}"` : '');
  function txt(value, cls, o) {
    const v = String(value ?? '');
    if (!v.trim()) return o.ph ? `<div class="${cls} ph"${dk(o.k)}>${esc(o.ph)}</div>` : '';
    const size = o.base ? `font-size:${fit(v, o.base, o.min || o.base, o.soft || 40)}px;` : '';
    const clamp = o.clamp ? `-webkit-line-clamp:${o.clamp};` : '';
    return `<div class="${cls}${o.clamp ? ' clamp' : ''}" style="${size}${clamp}"${dk(o.k)}>${nl(v)}</div>`;
  }
  const P = (o, s) => (o.ph ? s : '');
  function img(src, cls, o, k) {
    if (src) return `<div class="img-frame ${cls}"${dk(k)}><img src="${esc(src)}" alt=""></div>`;
    return o.ph ? `<div class="img-frame img-ph ${cls}"${dk(k)}><span>🖼️<br>Thêm ảnh</span></div>` : '';
  }
  const title = (d, o, base = 52) => txt(d.title, 's-title', { k: 'title', ph: P(o, 'Tiêu đề slide'), base, min: 30, soft: base > 46 ? 30 : 20, clamp: 2 });
  // giữ chỉ số gốc để data-k trỏ đúng phần tử trong mảng
  const filledIdx = arr => (arr || []).map((v, i) => [v, i]).filter(([v]) => String(v || '').trim());

  /* ---------- từng layout ---------- */
  const R = {
    cover(d, deck, o) {
      const pt = M.PRODUCT_TYPES[deck.productType] || M.PRODUCT_TYPES.game;
      const im = img(d.image, 'cv-img', o, 'image');
      const chip = (v, icon, k) => v ? `<span class="chip"${dk(k)}>${icon} ${esc(v)}</span>` : '';
      const meta = chip(d.author, '👤', 'author') + chip(d.course, '🏫', 'course') || (o.ph ? `<span class="chip ph"${dk('author')}>👤 Tên người thực hiện</span>` : '');
      return `<div class="cv ${im ? 'has-img' : 'no-img'}">
        <div class="cv-text">
          <div class="cv-badge">${pt.icon} ${esc(pt.label.toUpperCase())}</div>
          ${txt(d.title, 'cv-title', { k: 'title', ph: P(o, 'Tên sản phẩm'), base: 88, min: 50, soft: 16, clamp: 3 })}
          ${txt(d.subtitle, 'cv-sub', { k: 'subtitle', ph: P(o, 'Khẩu hiệu hoặc mô tả ngắn'), base: 30, min: 22, soft: 50, clamp: 3 })}
          <div class="cv-meta">${meta}</div>
        </div>${im}</div>`;
    },
    intro(d, deck, o) {
      const im = img(d.image, 'in-img', {}, 'image');
      const block = (label, k, cls, base, min, soft, clamp, ph) => (d[k] && d[k].trim()) || o.ph
        ? `<div class="in-block"><div class="in-label">${label}</div>${txt(d[k], cls, { k, ph: P(o, ph), base, min, soft, clamp })}</div>` : '';
      return `${title(d, o)}<div class="in-body ${im ? 'has-img' : ''}"><div class="in-text">
        ${block('💡 Ý tưởng', 'idea', 'in-idea', 30, 21, 120, 6, 'Sản phẩm được tạo ra để làm gì?')}
        ${block('🎯 Mục đích', 'purpose', 'in-purpose', 25, 19, 90, 4, 'Mục đích của sản phẩm')}
      </div>${im}</div>`;
    },
    content(d, deck, o) {
      const im = img(d.image, 'ct-img', {}, 'image');
      let items = filledIdx(d.bullets);
      const isPh = !items.length;
      if (isPh && o.ph && !(d.body || '').trim()) items = [['Ý chính thứ nhất', 0], ['Ý chính thứ hai', 1]];
      const fs = fit(items.map(x => x[0]).join(''), 26, 19, 200);
      const list = items.length ? `<ul class="ct-list ${isPh ? 'ph' : ''}" style="font-size:${fs}px">${items.map(([v, i]) => `<li${dk(isPh ? 'bullets' : 'bullets.' + i)}><span class="clamp" style="-webkit-line-clamp:2">${esc(v)}</span></li>`).join('')}</ul>` : '';
      return `${title(d, o)}<div class="ct-body ${im ? 'has-img' : ''}"><div class="ct-text">
        ${txt(d.body, 'ct-para', { k: 'body', ph: P(o, 'Đoạn mô tả nội dung...'), base: 28, min: 20, soft: 160, clamp: items.length ? 5 : 10 })}
        ${list}</div>${im}</div>`;
    },
    imageText(d, deck, o) {
      const im = img(d.image, '', o, 'image');
      return `<div class="it ${d.imagePos === 'right' ? 'right' : ''} ${im ? '' : 'no-img'}">
        ${im ? `<div class="it-img">${im}${txt(d.caption, 'it-cap', { k: 'caption', clamp: 1 })}</div>` : ''}
        <div class="it-text">${title(d, o, im ? 44 : 52)}${txt(d.text, 'it-desc', { k: 'text', ph: P(o, 'Mô tả hình ảnh...'), base: 28, min: 20, soft: 140, clamp: 9 })}</div>
      </div>`;
    },
    twoColumns(d, deck, o) {
      const col = side => `<div class="tc-col card-box">
        <div class="tc-icon"${dk(side + 'Icon')}>${esc(d[side + 'Icon'] || '')}</div>
        ${txt(d[side + 'Title'], 'tc-h', { k: side + 'Title', ph: P(o, 'Tiêu đề cột'), base: 34, min: 26, soft: 18, clamp: 2 })}
        ${txt(d[side + 'Text'], 'tc-t', { k: side + 'Text', ph: P(o, 'Nội dung cột...'), base: 26, min: 19, soft: 110, clamp: 8 })}
      </div>`;
      return `${title(d, o)}<div class="tc">${col('left')}${col('right')}</div>`;
    },
    features(d, deck, o) {
      const cards = (d.cards || []).map((c, i) => [c, i]).filter(([c]) => o.ph || (c.name || '').trim() || (c.desc || '').trim());
      const n = Math.max(cards.length, 1);
      const cols = n <= 4 ? n : 3, rows = n <= 4 ? 1 : 2;
      return `${title(d, o)}${txt(d.subtitle, 's-sub', { k: 'subtitle', clamp: 2 })}
        <div class="fc rows-${rows}" style="--cols:${cols}">${cards.map(([c, i]) => `<div class="fc-card card-box">
          <div class="fc-icon"${dk(`cards.${i}.icon`)}>${esc(c.icon || '⭐')}</div>
          ${txt(c.name, 'fc-name', { k: `cards.${i}.name`, ph: P(o, 'Tên tính năng'), base: rows > 1 ? 25 : 28, min: 20, soft: 16, clamp: 2 })}
          ${txt(c.desc, 'fc-desc', { k: `cards.${i}.desc`, ph: P(o, 'Mô tả ngắn...'), base: rows > 1 ? 19 : 23, min: 16, soft: 70, clamp: rows > 1 ? 3 : 5 })}
        </div>`).join('')}</div>`;
    },
    gallery(d, deck, o) {
      const photos = (d.photos || []).map((p, i) => [p, i]).filter(([p]) => o.ph || p.src);
      const n = Math.max(photos.length, 1);
      const cols = n <= 3 ? n : n === 4 ? 2 : 3, rows = n <= 3 ? 1 : 2;
      return `${title(d, o)}<div class="gl" style="--cols:${cols};--rows:${rows}">${photos.map(([p, i]) => `<div class="gl-item">
          ${img(p.src, '', o, `photos.${i}.src`)}${txt(p.caption, 'gl-cap', { k: `photos.${i}.caption`, clamp: 1 })}</div>`).join('')}</div>`;
    },
    process(d, deck, o) {
      const steps = (d.steps || []).map((s, i) => [s, i]).filter(([s]) => o.ph || (s.name || '').trim() || (s.desc || '').trim());
      const many = steps.length >= 5;
      return `${title(d, o)}<div class="pr ${many ? 'many' : ''}">${steps.map(([s, i], n) => `<div class="pr-step">
          <div class="pr-num">${n + 1}</div>
          <div class="pr-card card-box">
            ${txt(s.name, 'pr-name', { k: `steps.${i}.name`, ph: P(o, 'Tên bước'), base: many ? 22 : 26, min: 18, soft: 14, clamp: 2 })}
            ${txt(s.desc, 'pr-desc', { k: `steps.${i}.desc`, ph: P(o, 'Mô tả bước...'), base: many ? 18 : 21, min: 15, soft: 60, clamp: many ? 6 : 7 })}
          </div></div>`).join('')}</div>`;
    },
    question(d, deck, o) {
      const opts = filledIdx(d.options);
      return `<div class="qs">
        <div class="qs-mark">?</div>
        <div class="qs-label">Câu hỏi dành cho các bạn</div>
        ${txt(d.question, 'qs-q', { k: 'question', ph: P(o, 'Câu hỏi của em là gì?'), base: 54, min: 34, soft: 50, clamp: 3 })}
        ${opts.length ? `<div class="qs-opts ${opts.length > 2 ? 'grid' : ''}">${opts.map(([v, i], n) => `<div class="qs-opt"${dk('options.' + i)}><b>${'ABCD'[n]}</b><span class="clamp" style="-webkit-line-clamp:2">${esc(v)}</span></div>`).join('')}</div>` : ''}
        ${txt(d.note, 'qs-note', { k: 'note', clamp: 1 })}
      </div>`;
    },
    thankyou(d, deck, o) {
      const im = img(d.image, 'ty-img', {}, 'image');
      return `<div class="ty ${im ? 'has-img' : 'no-img'}"><div class="ty-text">
        <div class="ty-emoji">🎉</div>
        ${txt(d.heading, 'ty-h', { k: 'heading', ph: P(o, 'Cảm ơn mọi người!'), base: 72, min: 44, soft: 22, clamp: 3 })}
        ${txt(d.message, 'ty-m', { k: 'message', base: 28, min: 21, soft: 70, clamp: 3 })}
        <div class="ty-chips">${d.link && d.link.trim() ? `<span class="chip"${dk('link')}>🔗 ${esc(d.link)}</span>` : ''}<span class="chip">💬 Hỏi &amp; Đáp</span></div>
      </div>${im}</div>`;
    }
  };

  M.renderSlide = function (slide, deck, opts) {
    const o = Object.assign({ ph: false }, opts);
    const L = R[slide.layout] ? slide.layout : 'content';
    editing = !!o.ph;
    const body = R[L](slide.data || {}, deck, o);
    editing = false;
    const foot = L !== 'cover' && o.total
      ? `<div class="s-foot"><span>${esc(deck.productName || deck.title || '')}</span><span>${o.index + 1} / ${o.total}</span></div>` : '';
    return `<div class="mx-slide theme-${esc(deck.theme || 'modern')} layout-${L}" style="${M.colorVars(deck)}">` +
      `<div class="deco d1"></div><div class="deco d2"></div><div class="deco d3"></div>` +
      `<div class="s-inner">${body}</div>${foot}</div>`;
  };

  /* Gắn slide vào khung co giãn (.slide-fit) – tự tính tỉ lệ theo chiều rộng khung */
  const ro = 'ResizeObserver' in window ? new ResizeObserver(es => es.forEach(e => e.target.style.setProperty('--s', e.contentRect.width / 1280))) : null;
  M.mount = function (el, html) {
    el.innerHTML = html;
    if (ro && !el._mxObs) { ro.observe(el); el._mxObs = true; }
    if (el.clientWidth) el.style.setProperty('--s', el.clientWidth / 1280);
  };
})(window.MXS);
