/* Sinh Form nhập liệu theo schema của từng Layout, đếm ký tự, cảnh báo, quản lý ảnh */
window.MXS = window.MXS || {};
(function (M) {
  const esc = M.esc;
  const el = html => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
  const EMOJIS = ['⭐', '🎮', '🕹️', '👾', '🏆', '🎯', '💡', '🚀', '⚡', '🔥', '❤️', '🧩', '🎨', '🎵', '🗺️', '⏱️', '🐱', '🦸', '📖', '🎁',
    '🛒', '💳', '🔍', '🌐', '💻', '📱', '🔔', '📅', '✅', '📊', '🔒', '💬', '👥', '🛠️', '📚', '🧗', '🏷️', '🙂', '✨', '📌'];
  const ACCEPT = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';

  /* ---------- Đọc ảnh, thu nhỏ để tiết kiệm LocalStorage ---------- */
  M.readImage = function (file) {
    return new Promise((resolve, reject) => {
      const okType = /^image\/(png|jpeg|webp)$/.test(file.type) || /\.(png|jpe?g|webp)$/i.test(file.name);
      if (!okType) return reject(new Error(`“${file.name}” không được hỗ trợ. Hãy chọn ảnh PNG, JPG, JPEG hoặc WEBP.`));
      const fr = new FileReader();
      fr.onerror = () => reject(new Error('Không đọc được file ảnh.'));
      fr.onload = () => {
        const im = new Image();
        im.onerror = () => reject(new Error('File ảnh bị lỗi.'));
        im.onload = () => {
          const max = 1400, k = Math.min(1, max / Math.max(im.width, im.height));
          const c = document.createElement('canvas');
          c.width = Math.round(im.width * k); c.height = Math.round(im.height * k);
          c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
          let out = c.toDataURL('image/webp', 0.85);
          if (out.indexOf('data:image/webp') !== 0) out = c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85);
          resolve(k === 1 && fr.result.length < out.length ? fr.result : out);
        };
        im.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  };

  /* ---------- Bộ đếm ký tự: chỉ cảnh báo, không cắt nội dung ---------- */
  function updateCounter(scope, input, max) {
    if (!max) return;
    const len = input.value.length;
    const st = len > max ? 'over' : len >= max * 0.85 ? 'near' : '';
    const c = scope.querySelector('.mx-count'), o = scope.querySelector('.mx-over');
    c.textContent = `${len}/${max}`;
    c.className = 'mx-count ' + st;
    input.classList.toggle('is-over', len > max);
    o.textContent = len > max ? `Vượt ${len - max} ký tự – em hãy rút gọn nhé` : st === 'near' ? 'Sắp đạt giới hạn' : '';
  }

  const labelHTML = (f, compact) => `<label class="form-label ${compact ? 'small mb-1' : ''}">${esc(f.label)}</label>`;
  const hintHTML = (h, keep) => h ? `<div class="mx-hint${keep ? ' keep' : ''}"><i class="bi bi-lightbulb-fill"></i><span>${esc(h)}</span></div>` : '';

  function textField(f, obj, ctx, compact) {
    const area = f.type === 'textarea';
    const w = el(`<div class="mx-field ${compact ? 'mb-2' : 'mb-3'}">
      ${labelHTML(f, compact)}
      ${area ? `<textarea class="form-control ${compact ? 'form-control-sm' : ''}" rows="${f.rows || 3}"></textarea>` : `<input type="text" class="form-control ${compact ? 'form-control-sm' : ''}">`}
      <div class="mx-count-row"><span class="mx-over"></span><span class="mx-count"></span></div>
      ${compact ? '' : hintHTML(ctx.hint(f))}</div>`);
    const inp = w.querySelector('input,textarea');
    inp.value = obj[f.key] || '';
    inp.placeholder = f.ph || (compact ? '' : 'Em hãy nhập nội dung...');
    inp.addEventListener('input', () => { obj[f.key] = inp.value; updateCounter(w, inp, f.max); ctx.change(); });
    updateCounter(w, inp, f.max);
    return w;
  }

  function selectField(f, obj, ctx) {
    const w = el(`<div class="mx-field mb-3">${labelHTML(f)}<div class="btn-group w-100" role="group">
      ${f.options.map(([v, t]) => `<button type="button" class="btn btn-outline-primary btn-sm" data-v="${esc(v)}">${esc(t)}</button>`).join('')}</div></div>`);
    const sync = () => w.querySelectorAll('[data-v]').forEach(b => b.classList.toggle('active', (obj[f.key] || f.default) === b.dataset.v));
    w.querySelectorAll('[data-v]').forEach(b => b.addEventListener('click', () => { obj[f.key] = b.dataset.v; sync(); ctx.change(); }));
    sync();
    return w;
  }

  function emojiField(f, obj, ctx, compact) {
    const w = el(`<div class="mx-field mx-emoji ${compact ? 'mb-2' : 'mb-3'}">${labelHTML(f, compact)}
      <div class="dropdown">
        <button class="btn btn-light border mx-emoji-btn" type="button" data-bs-toggle="dropdown" data-bs-popper-config='{"strategy":"fixed"}'></button>
        <div class="dropdown-menu mx-emoji-menu p-2">
          <div class="mx-emoji-grid">${EMOJIS.map(e => `<button type="button" class="mx-emo" data-e="${e}">${e}</button>`).join('')}</div>
          <input class="form-control form-control-sm mt-2" maxlength="8" placeholder="Hoặc dán emoji khác vào đây">
        </div></div></div>`);
    const btn = w.querySelector('.mx-emoji-btn'), inp = w.querySelector('input');
    const sync = () => { btn.textContent = obj[f.key] || f.default || '⭐'; };
    w.querySelectorAll('.mx-emo').forEach(b => b.addEventListener('click', () => { obj[f.key] = b.dataset.e; sync(); ctx.change(); }));
    inp.addEventListener('input', () => { if (inp.value.trim()) { obj[f.key] = inp.value.trim(); sync(); ctx.change(); } });
    sync();
    return w;
  }

  /* ---------- Dán ảnh từ clipboard (Win+Shift+S rồi Ctrl+V) ----------
     Ưu tiên: ô ảnh đang rê chuột / đang chọn → ô ảnh trống đầu tiên → ô ảnh duy nhất của slide. */
  let hoveredImg = null;
  document.addEventListener('paste', e => {
    const form = document.getElementById('fieldForm');
    if (!form || !form.offsetParent) return; // không ở tab Nội dung của trình soạn thảo
    const item = [...((e.clipboardData && e.clipboardData.items) || [])].find(i => i.kind === 'file' && /^image\//.test(i.type));
    if (!item) return; // dán chữ bình thường
    e.preventDefault();
    const fields = [...form.querySelectorAll('.mx-img-field')];
    const active = document.activeElement && document.activeElement.closest && document.activeElement.closest('.mx-img-field');
    let target = (hoveredImg && form.contains(hoveredImg) && hoveredImg) || (active && form.contains(active) && active)
      || fields.find(x => x._isEmpty()) || (fields.length === 1 ? fields[0] : null);
    if (!fields.length) return M.toast('Slide này không có ô ảnh. Hãy đổi bố cục sang “Hình ảnh + Chữ” để thêm ảnh.', 'warning');
    if (!target) return M.toast('Các ô ảnh đều đã có ảnh. Rê chuột vào ảnh muốn thay rồi nhấn Ctrl+V.', 'warning');
    target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    target._setImage(item.getAsFile()).then(() => M.toast('Đã dán ảnh!', 'success'));
  });

  function imageField(f, obj, ctx, compact) {
    const w = el(`<div class="mx-field mx-img-field ${compact ? 'mb-2' : 'mb-3'}">${labelHTML(f, compact)}
      <div class="mx-img ${compact ? 'sm' : ''}">
        <button type="button" class="mx-img-thumb" title="Bấm để chọn ảnh, hoặc rê chuột vào đây rồi nhấn Ctrl+V để dán"></button>
        <button type="button" class="mx-img-del" title="Xóa ảnh"><i class="bi bi-x-lg"></i></button>
      </div>
      <input type="file" class="d-none" accept="${ACCEPT}"></div>`);
    const thumb = w.querySelector('.mx-img-thumb'), del = w.querySelector('.mx-img-del'), file = w.querySelector('input[type=file]');
    const refresh = () => {
      const src = obj[f.key];
      thumb.innerHTML = src
        ? `<img src="${esc(src)}" alt=""><span class="mx-img-tip"><i class="bi bi-arrow-repeat"></i> Bấm để đổi · <b>Ctrl+V</b> để dán</span>`
        : `<span class="mx-img-empty"><i class="bi bi-image"></i>Bấm để chọn ảnh<small>hoặc chụp màn hình rồi nhấn <b>Ctrl+V</b> để dán</small></span>`;
      thumb.classList.toggle('empty', !src);
      del.classList.toggle('d-none', !src);
    };
    const setImage = async fl => {
      thumb.classList.add('loading');
      try {
        obj[f.key] = await M.readImage(fl);
        refresh(); ctx.change();
        thumb.classList.remove('pasted'); void thumb.offsetWidth; thumb.classList.add('pasted');
      } catch (e) { M.toast(e.message, 'danger'); }
      finally { thumb.classList.remove('loading'); }
    };
    w._setImage = setImage;
    w._isEmpty = () => !obj[f.key];
    thumb.addEventListener('click', () => file.click());
    thumb.addEventListener('mouseenter', () => { hoveredImg = w; });
    thumb.addEventListener('mouseleave', () => { if (hoveredImg === w) hoveredImg = null; });
    file.addEventListener('change', () => {
      const fl = file.files[0]; file.value = '';
      if (fl) setImage(fl);
    });
    del.addEventListener('click', () => { obj[f.key] = ''; refresh(); ctx.change(); });
    refresh();
    return w;
  }

  function listField(f, obj, ctx) {
    if (!Array.isArray(obj[f.key])) obj[f.key] = [];
    const arr = obj[f.key];
    const w = el(`<div class="mx-field mb-3">
      <label class="form-label">${esc(f.label)} <span class="text-secondary small fw-normal">(tối đa ${f.maxItems})</span></label>${hintHTML(ctx.hint(f), true)}
      <div class="mx-list"></div>
      <button type="button" class="btn btn-sm btn-outline-primary add"><i class="bi bi-plus-lg"></i> ${esc(f.addLabel || 'Thêm')}</button></div>`);
    const list = w.querySelector('.mx-list'), add = w.querySelector('.add');
    const draw = () => {
      list.innerHTML = '';
      arr.forEach((v, i) => {
        const row = el(`<div class="mx-list-row"><span class="mx-list-num">${i + 1}</span>
          <div class="flex-grow-1"><input type="text" class="form-control form-control-sm"><div class="mx-count-row"><span class="mx-over"></span><span class="mx-count"></span></div></div>
          <button type="button" class="btn btn-sm btn-link text-danger rm" title="Xóa dòng này"><i class="bi bi-x-lg"></i></button></div>`);
        const inp = row.querySelector('input');
        row.dataset.path = `${f.key}.${i}`;
        inp.value = v || ''; inp.placeholder = f.ph || '';
        inp.addEventListener('input', () => { arr[i] = inp.value; updateCounter(row, inp, f.max); ctx.change(); });
        updateCounter(row, inp, f.max);
        row.querySelector('.rm').addEventListener('click', () => { arr.splice(i, 1); draw(); ctx.change(); });
        list.appendChild(row);
      });
      add.disabled = arr.length >= f.maxItems;
    };
    add.addEventListener('click', () => {
      if (arr.length >= f.maxItems) return;
      arr.push(''); draw(); ctx.change();
      list.lastElementChild.querySelector('input').focus();
    });
    draw();
    return w;
  }

  function itemsField(f, obj, ctx) {
    if (!Array.isArray(obj[f.key])) obj[f.key] = [];
    const arr = obj[f.key];
    const blankItem = () => { const o = {}; f.fields.forEach(sf => { o[sf.key] = sf.default || ''; }); return o; };
    const w = el(`<div class="mx-field mb-3">
      <label class="form-label">${esc(f.label)} <span class="text-secondary small fw-normal">(${f.minItems}–${f.maxItems})</span></label>${hintHTML(ctx.hint(f), true)}
      <div class="mx-items"></div>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-sm btn-outline-primary add"><i class="bi bi-plus-lg"></i> ${esc(f.addLabel)}</button>
        ${f.bulkImage ? `<button type="button" class="btn btn-sm btn-primary bulk"><i class="bi bi-images"></i> Tải nhiều ảnh cùng lúc</button><input type="file" class="d-none" multiple accept="${ACCEPT}">` : ''}
      </div></div>`);
    const box = w.querySelector('.mx-items'), add = w.querySelector('.add');
    const draw = () => {
      box.innerHTML = '';
      arr.forEach((item, i) => {
        const card = el(`<div class="mx-item"><div class="mx-item-head">
            <span class="mx-item-tag">${esc(f.itemLabel)} ${i + 1}</span>
            <div class="btn-group btn-group-sm">
              <button type="button" class="btn btn-light up" title="Lên" ${i === 0 ? 'disabled' : ''}><i class="bi bi-arrow-up"></i></button>
              <button type="button" class="btn btn-light down" title="Xuống" ${i === arr.length - 1 ? 'disabled' : ''}><i class="bi bi-arrow-down"></i></button>
              <button type="button" class="btn btn-light text-danger rm" title="Xóa" ${arr.length <= f.minItems ? 'disabled' : ''}><i class="bi bi-trash"></i></button>
            </div></div><div class="mx-item-body"></div></div>`);
        const body = card.querySelector('.mx-item-body');
        f.fields.forEach(sf => body.appendChild(fieldFor(sf, item, ctx, true, `${f.key}.${i}.`)));
        const move = d => { const j = i + d; [arr[i], arr[j]] = [arr[j], arr[i]]; draw(); ctx.change(); };
        card.querySelector('.up').addEventListener('click', () => move(-1));
        card.querySelector('.down').addEventListener('click', () => move(1));
        card.querySelector('.rm').addEventListener('click', () => { arr.splice(i, 1); draw(); ctx.change(); });
        box.appendChild(card);
      });
      add.disabled = arr.length >= f.maxItems;
    };
    add.addEventListener('click', () => { if (arr.length < f.maxItems) { arr.push(blankItem()); draw(); ctx.change(); } });
    if (f.bulkImage) {
      const bulk = w.querySelector('.bulk'), file = w.querySelector('input[type=file]');
      bulk.addEventListener('click', () => file.click());
      file.addEventListener('change', async () => {
        const files = [...file.files]; file.value = '';
        let skipped = 0;
        for (const fl of files) {
          try {
            const src = await M.readImage(fl);
            let slot = arr.find(it => !it[f.bulkImage]);
            if (!slot) {
              if (arr.length >= f.maxItems) { skipped++; continue; }
              slot = blankItem(); arr.push(slot);
            }
            slot[f.bulkImage] = src;
          } catch (e) { M.toast(e.message, 'danger'); }
        }
        if (skipped) M.toast(`Slide Gallery chứa tối đa ${f.maxItems} ảnh – đã bỏ qua ${skipped} ảnh.`, 'warning');
        draw(); ctx.change();
      });
    }
    draw();
    return w;
  }

  function fieldFor(f, obj, ctx, compact, prefix = '') {
    let w;
    switch (f.type) {
      case 'image': w = imageField(f, obj, ctx, compact); break;
      case 'emoji': w = emojiField(f, obj, ctx, compact); break;
      case 'select': w = selectField(f, obj, ctx); break;
      case 'list': w = listField(f, obj, ctx); break;
      case 'items': w = itemsField(f, obj, ctx); break;
      default: w = textField(f, obj, ctx, compact);
    }
    w.dataset.path = prefix + f.key; // khớp với data-k trên slide (bấm vào slide → nhảy tới ô này)
    return w;
  }

  M.Editor = {
    /* Bấm vào chữ/ảnh trên slide xem trước → cuộn tới ô nhập tương ứng, tô sáng và đặt con trỏ vào */
    focusField(root, path) {
      let el = null;
      for (let p = path; p && !el; p = p.includes('.') ? p.slice(0, p.lastIndexOf('.')) : '') el = root.querySelector(`[data-path="${p}"]`);
      if (!el) return false;
      el.scrollIntoView({ block: 'center' });
      el.classList.remove('mx-flash'); void el.offsetWidth; el.classList.add('mx-flash');
      const target = el.querySelector('textarea, input[type=text], .mx-img-thumb, .mx-emoji-btn, button');
      if (target) setTimeout(() => {
        target.focus({ preventScroll: true });
        if (target.setSelectionRange && target.value) target.setSelectionRange(target.value.length, target.value.length);
      }, 250);
      return true;
    },

    build(root, slide, deck, onChange) {
      const ct = M.CONTENT_TYPES[slide.contentType] || {};
      const ctx = {
        change: onChange,
        hint: f => M.fillHint((ct.hints && ct.hints[f.key]) || f.hint || '', deck)
      };
      root.innerHTML = '';
      M.LAYOUTS[slide.layout].fields.forEach(f => root.appendChild(fieldFor(f, slide.data, ctx, false)));
    },

    /* Danh sách cảnh báo cho một slide: [{lv:'danger'|'warning'|'info', t}] */
    warnings(slide) {
      const L = M.LAYOUTS[slide.layout], out = [];
      let total = 0, imgs = 0, hasImgField = false, titleVal = null;
      const walk = (fields, obj, prefix) => fields.forEach(f => {
        const v = obj[f.key];
        if (f.type === 'text' || f.type === 'textarea') {
          const s = String(v || '');
          total += s.length;
          if (f.isTitle && !prefix) titleVal = s;
          if (f.max && s.length > f.max) {
            out.push(f.isTitle && !prefix
              ? { lv: 'danger', t: `Tiêu đề quá dài (${s.length}/${f.max} ký tự). Tiêu đề ngắn gọn sẽ dễ nhớ hơn.` }
              : { lv: 'warning', t: `“${prefix}${f.label}” vượt giới hạn (${s.length}/${f.max} ký tự).` });
          }
        } else if (f.type === 'list') {
          (v || []).forEach((s, i) => {
            s = String(s || ''); total += s.length;
            if (s.length > f.max) out.push({ lv: 'warning', t: `“${f.label}” – dòng ${i + 1} vượt giới hạn (${s.length}/${f.max} ký tự).` });
          });
        } else if (f.type === 'items') {
          (v || []).forEach((it, i) => walk(f.fields, it || {}, `${f.itemLabel} ${i + 1} – `));
        } else if (f.type === 'image') {
          hasImgField = true;
          if (v) imgs++;
        }
      });
      walk(L.fields, slide.data || {}, '');
      if (titleVal !== null && !titleVal.trim()) out.push({ lv: 'info', t: 'Slide chưa có tiêu đề.' });
      if (total > L.budget) out.push({ lv: 'warning', t: `Slide có khá nhiều chữ (${total} ký tự). Chỉ giữ ý chính trên slide, phần còn lại em hãy nói khi thuyết trình nhé!` });
      if (!imgs && L.suggestImage) {
        out.push({ lv: 'info', t: hasImgField
          ? 'Slide này chỉ có chữ. Hãy thêm hình ảnh sản phẩm để slide sinh động hơn!'
          : 'Slide chỉ có chữ – thử đổi sang bố cục “Hình ảnh + Chữ” để thêm ảnh minh họa.' });
      }
      return out;
    }
  };
})(window.MXS);
