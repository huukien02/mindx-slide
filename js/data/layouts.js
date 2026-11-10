/* Danh sách Layout: mỗi layout có form riêng (fields), hướng dẫn, giới hạn ký tự */
window.MXS = window.MXS || {};
(function (M) {
  const TITLE = { key: 'title', type: 'text', label: 'Tiêu đề slide', max: 50, isTitle: true, hint: 'Tiêu đề ngắn gọn, nêu đúng ý chính của slide.' };

  M.LAYOUTS = {
    cover: {
      name: 'Bìa', icon: 'bi-star-fill', desc: 'Trang bìa giới thiệu sản phẩm',
      guide: 'Tên sản phẩm thật nổi bật, kèm tên người thực hiện và một hình ảnh đại diện.',
      budget: 180, suggestImage: true,
      fields: [
        { key: 'title', type: 'text', label: 'Tên sản phẩm', max: 40, isTitle: true, required: true, hint: 'Sản phẩm của em tên là gì?' },
        { key: 'subtitle', type: 'text', label: 'Khẩu hiệu / mô tả ngắn', max: 80, hint: 'Một câu ngắn giới thiệu sản phẩm.' },
        { key: 'author', type: 'text', label: 'Người thực hiện', max: 40, hint: 'Họ tên của em (hoặc tên nhóm).' },
        { key: 'course', type: 'text', label: 'Lớp / Khóa học', max: 40, hint: 'Ví dụ: Lớp 8A1 – Khóa Game Scratch.' },
        { key: 'image', type: 'image', label: 'Ảnh đại diện sản phẩm', hint: 'Chọn ảnh đẹp nhất của sản phẩm.' }
      ]
    },
    intro: {
      name: 'Giới thiệu', icon: 'bi-lightbulb-fill', desc: 'Giới thiệu ý tưởng và mục đích',
      guide: 'Kể ngắn gọn ý tưởng và mục đích của sản phẩm. Mỗi ô chỉ nên 2–3 câu.',
      budget: 420, suggestImage: true,
      fields: [
        TITLE,
        { key: 'idea', type: 'textarea', label: 'Ý tưởng', max: 300, rows: 4, hint: 'Sản phẩm của em được tạo ra để làm gì?' },
        { key: 'purpose', type: 'textarea', label: 'Mục đích', max: 200, rows: 3, hint: 'Em mong người dùng nhận được điều gì?' },
        { key: 'image', type: 'image', label: 'Hình minh họa (không bắt buộc)' }
      ]
    },
    content: {
      name: 'Nội dung', icon: 'bi-text-paragraph', desc: 'Tiêu đề và nội dung mô tả',
      guide: 'Một đoạn mô tả ngắn và vài ý chính dạng gạch đầu dòng.',
      budget: 520, suggestImage: true,
      fields: [
        TITLE,
        { key: 'body', type: 'textarea', label: 'Đoạn mô tả', max: 400, rows: 4, hint: 'Viết ngắn gọn ý chính em muốn nói.' },
        { key: 'bullets', type: 'list', label: 'Các ý chính', max: 80, maxItems: 6, start: 3, addLabel: 'Thêm ý', ph: 'Một ý ngắn...', hint: 'Mỗi dòng là một ý ngắn.' },
        { key: 'image', type: 'image', label: 'Hình minh họa (không bắt buộc)' }
      ]
    },
    imageText: {
      name: 'Hình ảnh + Chữ', icon: 'bi-image', desc: 'Hình ảnh kèm mô tả',
      guide: 'Một hình ảnh lớn của sản phẩm và đoạn mô tả bên cạnh.',
      budget: 380, suggestImage: true,
      fields: [
        TITLE,
        { key: 'image', type: 'image', label: 'Hình ảnh', hint: 'Ảnh chụp màn hình sản phẩm.' },
        { key: 'text', type: 'textarea', label: 'Mô tả', max: 300, rows: 4, hint: 'Hình ảnh này cho thấy điều gì?' },
        { key: 'caption', type: 'text', label: 'Chú thích ảnh', max: 60, hint: 'Một dòng ngắn dưới ảnh.' },
        { key: 'imagePos', type: 'select', label: 'Vị trí ảnh', default: 'left', options: [['left', 'Ảnh bên trái'], ['right', 'Ảnh bên phải']] }
      ]
    },
    twoColumns: {
      name: 'Hai cột', icon: 'bi-layout-split', desc: 'Chia nội dung thành hai cột',
      guide: 'So sánh hoặc trình bày hai ý song song.',
      budget: 480, suggestImage: true,
      fields: [
        TITLE,
        { key: 'leftIcon', type: 'emoji', label: 'Biểu tượng cột trái', default: '📌' },
        { key: 'leftTitle', type: 'text', label: 'Tiêu đề cột trái', max: 30 },
        { key: 'leftText', type: 'textarea', label: 'Nội dung cột trái', max: 250, rows: 4 },
        { key: 'rightIcon', type: 'emoji', label: 'Biểu tượng cột phải', default: '✨' },
        { key: 'rightTitle', type: 'text', label: 'Tiêu đề cột phải', max: 30 },
        { key: 'rightText', type: 'textarea', label: 'Nội dung cột phải', max: 250, rows: 4 }
      ]
    },
    features: {
      name: 'Thẻ tính năng', icon: 'bi-grid-3x2-gap-fill', desc: 'Các tính năng nổi bật dạng Card',
      guide: 'Mỗi thẻ là một tính năng: biểu tượng, tên ngắn và mô tả 1 câu.',
      budget: 620, suggestImage: false,
      fields: [
        TITLE,
        { key: 'subtitle', type: 'text', label: 'Dòng giới thiệu (không bắt buộc)', max: 100 },
        {
          key: 'cards', type: 'items', label: 'Các thẻ', itemLabel: 'Thẻ', minItems: 2, maxItems: 6, start: 3, addLabel: 'Thêm thẻ',
          hint: 'Sản phẩm có những chức năng nổi bật nào?',
          fields: [
            { key: 'icon', type: 'emoji', label: 'Biểu tượng', default: '⭐' },
            { key: 'name', type: 'text', label: 'Tên', max: 30, ph: 'Tên ngắn gọn' },
            { key: 'desc', type: 'textarea', label: 'Mô tả', max: 100, rows: 2, ph: 'Mô tả trong 1 câu' }
          ]
        }
      ]
    },
    gallery: {
      name: 'Thư viện ảnh', icon: 'bi-images', desc: 'Trình bày nhiều hình ảnh sản phẩm',
      guide: 'Thêm 1–6 ảnh chụp sản phẩm, mỗi ảnh có chú thích ngắn.',
      budget: 320, suggestImage: true,
      fields: [
        TITLE,
        {
          key: 'photos', type: 'items', label: 'Các ảnh', itemLabel: 'Ảnh', minItems: 1, maxItems: 6, start: 3, addLabel: 'Thêm ô ảnh', bulkImage: 'src',
          hint: 'Thêm ảnh chụp màn hình thật của sản phẩm.',
          fields: [
            { key: 'src', type: 'image', label: 'Ảnh' },
            { key: 'caption', type: 'text', label: 'Chú thích', max: 60, ph: 'Ảnh này là gì?' }
          ]
        }
      ]
    },
    process: {
      name: 'Quy trình', icon: 'bi-signpost-split-fill', desc: 'Trình bày các bước / quá trình',
      guide: 'Mỗi bước gồm tên ngắn và mô tả 1 câu, theo thứ tự thời gian.',
      budget: 620, suggestImage: false,
      fields: [
        TITLE,
        {
          key: 'steps', type: 'items', label: 'Các bước', itemLabel: 'Bước', minItems: 2, maxItems: 6, start: 4, addLabel: 'Thêm bước',
          hint: 'Em đã thực hiện qua những bước nào?',
          fields: [
            { key: 'name', type: 'text', label: 'Tên bước', max: 30, ph: 'Ví dụ: Lên ý tưởng' },
            { key: 'desc', type: 'textarea', label: 'Mô tả', max: 100, rows: 2, ph: 'Em đã làm gì ở bước này?' }
          ]
        }
      ]
    },
    question: {
      name: 'Câu hỏi', icon: 'bi-question-circle-fill', desc: 'Câu hỏi tương tác với người xem',
      guide: 'Đặt một câu hỏi để khán giả cùng suy nghĩ hoặc trả lời.',
      budget: 300, suggestImage: false,
      fields: [
        { key: 'question', type: 'textarea', label: 'Câu hỏi', max: 120, rows: 2, isTitle: true, hint: 'Em muốn hỏi khán giả điều gì?' },
        { key: 'options', type: 'list', label: 'Các lựa chọn (không bắt buộc)', max: 60, maxItems: 4, start: 0, addLabel: 'Thêm lựa chọn', ph: 'Một đáp án...' },
        { key: 'note', type: 'text', label: 'Lời nhắn', max: 80, hint: 'Ví dụ: Giơ tay nếu bạn chọn đáp án đúng!' }
      ]
    },
    thankyou: {
      name: 'Cảm ơn', icon: 'bi-heart-fill', desc: 'Trang kết thúc và cảm ơn',
      guide: 'Lời cảm ơn, link trải nghiệm sản phẩm và mời mọi người đặt câu hỏi.',
      budget: 240, suggestImage: false,
      fields: [
        { key: 'heading', type: 'text', label: 'Lời cảm ơn', max: 40, isTitle: true, default: 'Cảm ơn mọi người đã lắng nghe!' },
        { key: 'message', type: 'textarea', label: 'Lời nhắn', max: 120, rows: 2 },
        { key: 'link', type: 'text', label: 'Link demo / liên hệ', max: 80 },
        { key: 'image', type: 'image', label: 'Ảnh / mã QR (không bắt buộc)' }
      ]
    }
  };

  M.LAYOUT_ORDER = ['cover', 'intro', 'content', 'imageText', 'twoColumns', 'features', 'gallery', 'process', 'question', 'thankyou'];

  function blank(fields) {
    const o = {};
    fields.forEach(f => {
      if (f.type === 'list') o[f.key] = Array(f.start || 0).fill('');
      else if (f.type === 'items') o[f.key] = Array.from({ length: f.start || f.minItems || 1 }, () => blank(f.fields));
      else o[f.key] = f.default !== undefined ? f.default : '';
    });
    return o;
  }
  M.blankData = layout => blank(M.LAYOUTS[layout].fields);

  /* Bổ sung các khóa thiếu (dữ liệu nhập từ JSON cũ) mà không xóa nội dung có sẵn */
  M.normalizeData = function (layout, data) {
    const fill = (fields, obj) => {
      obj = obj && typeof obj === 'object' ? obj : {};
      fields.forEach(f => {
        if (f.type === 'list') obj[f.key] = Array.isArray(obj[f.key]) ? obj[f.key].map(v => String(v ?? '')) : Array(f.start || 0).fill('');
        else if (f.type === 'items') obj[f.key] = Array.isArray(obj[f.key]) ? obj[f.key].map(it => fill(f.fields, it)) : blank([f])[f.key];
        else if (obj[f.key] === undefined || obj[f.key] === null) obj[f.key] = f.default !== undefined ? f.default : '';
        else obj[f.key] = String(obj[f.key]);
      });
      return obj;
    };
    return fill(M.LAYOUTS[layout].fields, data);
  };

  /* Đổi layout: giữ lại nội dung cũ trong stash, chuyển các trường tương ứng (tiêu đề, ảnh, đoạn văn) */
  M.switchLayout = function (slide, to) {
    if (slide.layout === to) return;
    const clone = o => JSON.parse(JSON.stringify(o));
    const old = slide.data || {};
    slide.stash = slide.stash || {};
    slide.stash[slide.layout] = old;
    const nd = Object.assign(M.blankData(to), slide.stash[to] ? clone(slide.stash[to]) : {});
    delete slide.stash[to];

    const title = old.title || old.heading || '';
    if (title) {
      if ('title' in nd) nd.title = title;
      else if ('heading' in nd) nd.heading = title;
    }
    const img = old.image || ((old.photos || []).find(p => p.src) || {}).src || '';
    if (img) {
      if ('image' in nd && !nd.image) nd.image = img;
      else if (nd.photos && !nd.photos.some(p => p.src)) nd.photos[0].src = img;
    }
    const text = old.body || old.text || old.idea || old.message || '';
    if (text) ['body', 'text', 'idea', 'message'].some(k => (k in nd && !nd[k]) ? (nd[k] = text, true) : false);

    slide.layout = to;
    slide.data = M.normalizeData(to, nd);
  };
})(window.MXS);
