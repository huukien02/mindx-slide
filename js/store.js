/* Lưu trữ LocalStorage + nhập/xuất JSON */
window.MXS = window.MXS || {};
(function (M) {
  const IDX = 'mxs.decks.index', LAST = 'mxs.lastOpen';
  const K = id => 'mxs.deck.' + id;
  const get = (k, fb) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } };

  function writeIndex(list) { localStorage.setItem(IDX, JSON.stringify(list)); }

  M.store = {
    list() {
      return get(IDX, []).filter(x => x && x.id).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    },
    load(id) {
      const d = get(K(id), null);
      return d ? M.normalizeDeck(d) : null;
    },
    /* trả về {ok, quota} – không bao giờ ném lỗi */
    save(deck) {
      deck.updatedAt = Date.now();
      try {
        localStorage.setItem(K(deck.id), JSON.stringify(deck));
        const list = get(IDX, []).filter(x => x.id !== deck.id);
        list.push({ id: deck.id, title: deck.title, productType: deck.productType, productName: deck.productName, slideCount: deck.slides.length, updatedAt: deck.updatedAt });
        writeIndex(list);
        return { ok: true };
      } catch (e) {
        const quota = e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014);
        return { ok: false, quota };
      }
    },
    remove(id) {
      try {
        localStorage.removeItem(K(id));
        writeIndex(get(IDX, []).filter(x => x.id !== id));
        if (this.getLast() === id) localStorage.removeItem(LAST);
      } catch (e) { /* bỏ qua */ }
    },
    exists(id) { try { return localStorage.getItem(K(id)) !== null; } catch (e) { return false; } },
    setLast(id) { try { localStorage.setItem(LAST, id); } catch (e) { /* bỏ qua */ } },
    getLast() { try { return localStorage.getItem(LAST); } catch (e) { return null; } }
  };

  M.newDeck = function (info) {
    const theme = M.THEMES[info.theme] ? info.theme : 'modern';
    return {
      id: M.uid(), app: 'mindx-slide', version: 1,
      title: info.title || ('Giới thiệu ' + (info.productName || 'sản phẩm')),
      productType: info.productType || 'game', productName: info.productName || '',
      author: info.author || '', course: info.course || '', summary: info.summary || '',
      theme, primaryColor: info.primaryColor || M.THEMES[theme].primary, font: info.font || M.THEMES[theme].font,
      slides: info.slides || [], createdAt: Date.now(), updatedAt: Date.now()
    };
  };

  /* Kiểm tra và chuẩn hóa dữ liệu (dùng khi tải và khi nhập JSON) */
  M.normalizeDeck = function (d) {
    if (!d || typeof d !== 'object' || !Array.isArray(d.slides)) throw new Error('File không đúng định dạng bài thuyết trình Mindx Slide.');
    const deck = M.newDeck({});
    Object.keys(deck).forEach(k => { if (d[k] !== undefined && k !== 'slides') deck[k] = d[k]; });
    if (!M.PRODUCT_TYPES[deck.productType]) deck.productType = 'game';
    if (!M.THEMES[deck.theme]) deck.theme = 'modern';
    if (!/^#[0-9a-f]{6}$/i.test(deck.primaryColor)) deck.primaryColor = M.THEMES[deck.theme].primary;
    if (M.FONTS.indexOf(deck.font) < 0) deck.font = M.THEMES[deck.theme].font;
    ['title', 'productName', 'author', 'course', 'summary'].forEach(k => deck[k] = String(deck[k] ?? ''));
    deck.id = String(d.id || deck.id);
    deck.slides = d.slides.filter(s => s && typeof s === 'object').map(s => {
      const layout = M.LAYOUTS[s.layout] ? s.layout : 'content';
      const slide = { id: String(s.id || M.uid()), contentType: M.CONTENT_TYPES[s.contentType] ? s.contentType : 'custom', layout, data: M.normalizeData(layout, s.data) };
      if (s.stash && typeof s.stash === 'object') slide.stash = s.stash;
      return slide;
    });
    if (!deck.slides.length) deck.slides.push(M.makeSlide('cover', deck));
    return deck;
  };

  M.exportJSON = deck => JSON.stringify({ app: 'mindx-slide', version: 1, exportedAt: new Date().toISOString(), deck }, null, 2);
  M.parseJSON = function (text) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) { throw new Error('File JSON bị lỗi, không đọc được.'); }
    return M.normalizeDeck(obj && obj.deck ? obj.deck : obj);
  };

  M.download = function (filename, content, type) {
    const blob = content instanceof Blob ? content : new Blob([content], { type: type || 'application/octet-stream' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  };
  M.slug = s => (String(s || 'bai-thuyet-trinh').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'bai-thuyet-trinh').slice(0, 60);
})(window.MXS);
