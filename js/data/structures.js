/* Loại sản phẩm, loại nội dung slide và cấu trúc bài thuyết trình gợi ý */
window.MXS = window.MXS || {};
(function (M) {
  M.PRODUCT_TYPES = {
    game: { label: 'Game', icon: '🎮', product: 'trò chơi', user: 'người chơi', theme: 'playful', desc: 'Trò chơi làm bằng Scratch, GameMaker hoặc công cụ khác.' },
    website: { label: 'Website', icon: '🌐', product: 'website', user: 'người dùng', theme: 'modern', desc: 'Website cá nhân, bán hàng, giới thiệu hoặc dự án web.' },
    app: { label: 'App', icon: '📱', product: 'ứng dụng', user: 'người dùng', theme: 'tech', desc: 'Ứng dụng di động hoặc ứng dụng có giao diện tương tác.' }
  };

  /* Loại nội dung: layout mặc định, tiêu đề mặc định, câu hỏi gợi ý cho từng trường.
     {product} và {user} được thay theo loại sản phẩm. */
  M.CONTENT_TYPES = {
    cover: { label: 'Trang bìa', layout: 'cover', guide: 'Trang mở đầu: tên sản phẩm thật nổi bật, tên em và hình ảnh đẹp nhất của sản phẩm.',
      hints: { title: 'Tên {product} của em là gì?', subtitle: 'Một câu ngắn mô tả {product}. Ví dụ: “Trò chơi giúp bé học toán vui vẻ”.', image: 'Chọn ảnh đẹp nhất của sản phẩm (màn hình chính, logo...).' } },
    intro: { label: 'Giới thiệu ý tưởng', layout: 'intro', title: 'Ý tưởng sản phẩm', guide: 'Kể ngắn gọn vì sao em tạo ra sản phẩm này.',
      hints: { idea: 'Sản phẩm của em được tạo ra để làm gì? Em lấy ý tưởng từ đâu?', purpose: 'Em muốn {user} nhận được điều gì khi sử dụng {product}?' } },
    story: { label: 'Cốt truyện & Nhân vật', layout: 'twoColumns', title: 'Cốt truyện & Nhân vật', guide: 'Giới thiệu câu chuyện và các nhân vật trong game.',
      data: { leftIcon: '📖', leftTitle: 'Cốt truyện', rightIcon: '🦸', rightTitle: 'Nhân vật' },
      hints: { leftText: 'Câu chuyện trong game diễn ra như thế nào? Nhân vật chính phải làm gì?', rightText: 'Game có những nhân vật nào? Mỗi nhân vật có đặc điểm gì?' } },
    characters: { label: 'Nhân vật', layout: 'features', title: 'Các nhân vật', guide: 'Mỗi thẻ là một nhân vật trong game.',
      hints: { cards: 'Nhân vật tên gì? Có khả năng hoặc vai trò gì trong game?' } },
    setting: { label: 'Bối cảnh & Môi trường', layout: 'imageText', title: 'Bối cảnh trò chơi', guide: 'Cho mọi người thấy thế giới trong game của em.',
      hints: { text: 'Game diễn ra ở đâu? Không gian, màu sắc, âm thanh như thế nào?', image: 'Ảnh chụp màn hình bối cảnh trong game.' } },
    gameplay: { label: 'Cách chơi & Luật chơi', layout: 'process', title: 'Cách chơi', guide: 'Mỗi bước là một thao tác hoặc một luật chơi.',
      hints: { steps: 'Người chơi cần làm gì? Dùng phím nào? Khi nào thắng, khi nào thua?' } },
    levels: { label: 'Các màn chơi', layout: 'features', title: 'Các màn chơi', guide: 'Mỗi thẻ là một màn chơi.',
      hints: { cards: 'Mỗi màn chơi có gì đặc biệt? Độ khó tăng lên như thế nào?' } },
    features: { label: 'Tính năng nổi bật', layout: 'features', title: 'Tính năng nổi bật', guide: 'Chọn 3–6 tính năng hay nhất.',
      hints: { cards: 'Sản phẩm có những chức năng nổi bật nào? Điều gì làm {product} của em khác biệt?' } },
    gallery: { label: 'Hình ảnh thực tế', layout: 'gallery', title: 'Hình ảnh thực tế', guide: 'Ảnh thật giúp mọi người hình dung sản phẩm rõ nhất.',
      hints: { photos: 'Thêm ảnh chụp màn hình thật của sản phẩm, kèm chú thích ngắn.' } },
    problem: { label: 'Vấn đề giải quyết', layout: 'content', title: 'Vấn đề cần giải quyết', guide: 'Nêu vấn đề mà sản phẩm giúp giải quyết.',
      hints: { body: '{product} giải quyết vấn đề gì trong cuộc sống?', bullets: 'Trước khi có sản phẩm, mọi người gặp những khó khăn gì?' } },
    audience: { label: 'Đối tượng sử dụng', layout: 'twoColumns', title: 'Đối tượng sử dụng', guide: 'Ai sẽ dùng sản phẩm và họ được lợi gì?',
      data: { leftIcon: '👥', leftTitle: 'Ai sẽ sử dụng?', rightIcon: '🎁', rightTitle: 'Họ nhận được gì?' },
      hints: { leftText: '{product} dành cho ai? Độ tuổi, sở thích, nhu cầu của họ?', rightText: '{user} được lợi gì khi dùng {product} của em?' } },
    homepage: { label: 'Giao diện trang chủ', layout: 'imageText', title: 'Giao diện trang chủ', guide: 'Ảnh trang chủ và giải thích bố cục.',
      hints: { image: 'Ảnh chụp trang chủ website.', text: 'Trang chủ có những phần nào? Vì sao em chọn bố cục, màu sắc này?' } },
    pages: { label: 'Các trang chức năng', layout: 'gallery', title: 'Các trang chức năng', guide: 'Mỗi ảnh là một trang của website.',
      hints: { photos: 'Thêm ảnh từng trang (giới thiệu, sản phẩm, liên hệ...) và ghi tên trang.' } },
    appui: { label: 'Giao diện ứng dụng', layout: 'imageText', title: 'Giao diện ứng dụng', guide: 'Ảnh màn hình chính và điểm đặc biệt của giao diện.',
      hints: { image: 'Ảnh màn hình chính của ứng dụng.', text: 'Giao diện có điểm gì đặc biệt? Màu sắc, biểu tượng thân thiện ra sao?' } },
    screens: { label: 'Các màn hình chính', layout: 'gallery', title: 'Các màn hình chính', guide: 'Mỗi ảnh là một màn hình của ứng dụng.',
      hints: { photos: 'Thêm ảnh các màn hình chính và ghi tên từng màn hình.' } },
    usage: { label: 'Cách sử dụng', layout: 'process', title: 'Cách sử dụng', guide: 'Hướng dẫn từng bước để dùng sản phẩm.',
      hints: { steps: 'Người dùng cần thao tác như thế nào? Bước 1, bước 2...' } },
    demo: { label: 'Demo sản phẩm', layout: 'imageText', title: 'Demo sản phẩm', guide: 'Giới thiệu phần em sẽ demo trực tiếp.',
      hints: { text: 'Em sẽ demo phần nào? Mọi người có thể trải nghiệm sản phẩm ở đâu?', caption: 'Ví dụ: link chơi thử, mã QR...' } },
    tech: { label: 'Công nghệ sử dụng', layout: 'features', title: 'Công nghệ sử dụng', guide: 'Mỗi thẻ là một công cụ hoặc ngôn ngữ em đã dùng.',
      hints: { cards: 'Em dùng công cụ, ngôn ngữ lập trình nào? Dùng để làm phần gì?' } },
    development: { label: 'Quá trình phát triển', layout: 'process', title: 'Quá trình phát triển', guide: 'Các bước em đã làm, công nghệ và khó khăn gặp phải.',
      hints: { steps: 'Em đã làm sản phẩm qua những bước nào? Dùng công nghệ gì? Gặp khó khăn gì?' } },
    challenges: { label: 'Khó khăn & Giải pháp', layout: 'twoColumns', title: 'Khó khăn & Cách giải quyết', guide: 'Thật thà kể khó khăn — đó là điều thầy cô rất muốn nghe!',
      data: { leftIcon: '🧗', leftTitle: 'Khó khăn', rightIcon: '💡', rightTitle: 'Cách giải quyết' },
      hints: { leftText: 'Em đã gặp những vấn đề gì khi thực hiện?', rightText: 'Em đã vượt qua khó khăn đó như thế nào?' } },
    lessons: { label: 'Bài học rút ra', layout: 'content', title: 'Bài học của em', guide: 'Điều em học được và dự định cải thiện.',
      hints: { body: 'Em học được gì sau khi hoàn thành sản phẩm?', bullets: 'Kỹ năng mới em có được? Lần sau em sẽ cải thiện điều gì?' } },
    question: { label: 'Câu hỏi tương tác', layout: 'question', guide: 'Một câu hỏi giúp khán giả cùng tham gia.',
      hints: { question: 'Em muốn hỏi khán giả câu gì để họ cùng tham gia?', options: 'Các lựa chọn trả lời (không bắt buộc).' } },
    thankyou: { label: 'Demo & Cảm ơn', layout: 'thankyou', guide: 'Cảm ơn, mời trải nghiệm sản phẩm và hỏi đáp.',
      data: { heading: 'Cảm ơn mọi người đã lắng nghe!' },
      hints: { message: 'Lời cảm ơn hoặc lời mời mọi người trải nghiệm {product}.', link: 'Link chơi thử / xem website / tải app, hoặc email liên hệ.', image: 'Có thể thêm mã QR dẫn tới sản phẩm.' } },
    custom: { label: 'Nội dung tự do', layout: 'content', guide: 'Slide tự do — em chọn bố cục phù hợp ở trên.' }
  };

  /* priority: thứ tự ưu tiên khi chọn slide; order: thứ tự trình bày */
  M.STRUCTURES = {
    game: {
      priority: ['intro', 'gameplay', 'features', 'gallery', 'story', 'development', 'levels', 'tech', 'challenges', 'characters', 'setting', 'demo', 'lessons', 'question'],
      order: ['intro', 'story', 'characters', 'setting', 'gameplay', 'levels', 'features', 'gallery', 'demo', 'tech', 'development', 'challenges', 'lessons', 'question']
    },
    website: {
      priority: ['intro', 'problem', 'homepage', 'features', 'gallery', 'development', 'audience', 'pages', 'tech', 'challenges', 'demo', 'lessons', 'question'],
      order: ['intro', 'problem', 'audience', 'homepage', 'pages', 'features', 'gallery', 'demo', 'tech', 'development', 'challenges', 'lessons', 'question']
    },
    app: {
      priority: ['intro', 'audience', 'appui', 'features', 'usage', 'development', 'screens', 'gallery', 'tech', 'challenges', 'demo', 'lessons', 'question'],
      order: ['intro', 'audience', 'appui', 'screens', 'features', 'usage', 'gallery', 'demo', 'tech', 'development', 'challenges', 'lessons', 'question']
    }
  };

  M.uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  M.fillHint = (text, deck) => {
    const pt = M.PRODUCT_TYPES[(deck && deck.productType) || 'game'];
    return String(text || '').replace(/\{product\}/g, pt.product).replace(/\{user\}/g, pt.user)
      .replace(/^([a-zà-ỹ])/, c => c.toUpperCase());
  };

  /* Các loại nội dung dùng được cho một loại sản phẩm (để chọn khi thêm/đổi slide) */
  M.contentTypesFor = type => ['cover', ...M.STRUCTURES[type].order, 'thankyou', 'custom'];

  M.makeSlide = function (ctId, info, layout) {
    const ct = M.CONTENT_TYPES[ctId] || M.CONTENT_TYPES.custom;
    const lay = layout || ct.layout;
    const data = M.blankData(lay);
    if (ct.title && 'title' in data) data.title = ct.title;
    if (ct.data) Object.keys(ct.data).forEach(k => { if (k in data) data[k] = ct.data[k]; });
    if (ctId === 'cover' && info) {
      data.title = info.productName || '';
      data.subtitle = info.summary || '';
      data.author = info.author || '';
      data.course = info.course || '';
    }
    return { id: M.uid(), contentType: ctId, layout: lay, data };
  };

  /* Danh sách loại nội dung cho n slide */
  M.planSlides = function (type, n, mode) {
    n = Math.max(5, Math.min(20, n | 0));
    const middle = n - 2;
    if (mode === 'custom') return ['cover', ...Array(middle).fill('custom'), 'thankyou'];
    const st = M.STRUCTURES[type];
    const picked = st.priority.slice(0, middle).sort((a, b) => st.order.indexOf(a) - st.order.indexOf(b));
    while (picked.length < middle) picked.push('custom');
    return ['cover', ...picked, 'thankyou'];
  };

  M.buildSlides = (type, n, mode, info) => M.planSlides(type, n, mode).map(ct => M.makeSlide(ct, info));
})(window.MXS);
