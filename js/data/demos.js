/* 3 bài thuyết trình mẫu. Hình ảnh là SVG vẽ sẵn (data URL) để chạy được khi không có mạng. */
window.MXS = window.MXS || {};
(function (M) {
  const svg = (w, h, body) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" font-family="Segoe UI, Arial, sans-serif">${body}</svg>`);

  /* ---------- Game: cảnh platformer ---------- */
  function cat(x, y, s = 1) {
    return `<g transform="translate(${x},${y}) scale(${s})">
      <ellipse cx="0" cy="34" rx="34" ry="26" fill="#ff9f43" stroke="#2d2a32" stroke-width="4"/>
      <circle cx="0" cy="0" r="30" fill="#ff9f43" stroke="#2d2a32" stroke-width="4"/>
      <path d="M-26-14 L-22-44 L-6-26Z M26-14 L22-44 L6-26Z" fill="#ff9f43" stroke="#2d2a32" stroke-width="4" stroke-linejoin="round"/>
      <circle cx="-11" cy="-2" r="5" fill="#2d2a32"/><circle cx="11" cy="-2" r="5" fill="#2d2a32"/>
      <path d="M-6 10 Q0 16 6 10" stroke="#2d2a32" stroke-width="3" fill="none"/>
      <path d="M-34 36 Q-60 20 -52 0" stroke="#2d2a32" stroke-width="10" fill="none" stroke-linecap="round"/>
    </g>`;
  }
  const coin = (x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="#ffd93d" stroke="#c98f00" stroke-width="4"/>`;
  const slime = (x, y, c = '#7bed9f') => `<g transform="translate(${x},${y})"><path d="M-30 20 Q-30 -22 0 -22 Q30 -22 30 20Z" fill="${c}" stroke="#2d2a32" stroke-width="4"/><circle cx="-9" cy="0" r="4" fill="#2d2a32"/><circle cx="9" cy="0" r="4" fill="#2d2a32"/></g>`;
  function gameScene(o) {
    const plat = o.plats.map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="26" rx="10" fill="${o.plat}" stroke="#2d2a32" stroke-width="4"/>`).join('');
    return svg(960, 540, `
      <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.sky1}"/><stop offset="1" stop-color="${o.sky2}"/></linearGradient></defs>
      <rect width="960" height="540" fill="url(#sky)"/>
      <circle cx="${o.sunX || 800}" cy="100" r="54" fill="${o.sun || '#fff3b0'}"/>
      <g fill="#ffffff" opacity=".85"><ellipse cx="180" cy="110" rx="70" ry="26"/><ellipse cx="230" cy="95" rx="50" ry="26"/><ellipse cx="560" cy="70" rx="60" ry="20"/></g>
      <path d="M0 420 Q120 340 240 420 T480 420 T720 420 T960 420 V540 H0Z" fill="${o.hill}" opacity=".7"/>
      <rect y="460" width="960" height="80" fill="${o.ground}" stroke="#2d2a32" stroke-width="4"/>
      ${plat}${(o.coins || []).map(c => coin(c[0], c[1])).join('')}
      ${(o.enemies || []).map(e => slime(e[0], e[1], e[2])).join('')}
      ${cat(o.catX || 180, o.catY || 400, 1)}
      <rect x="20" y="18" width="250" height="50" rx="14" fill="#fff" stroke="#2d2a32" stroke-width="4"/>
      <text x="40" y="52" font-size="26" font-weight="800" fill="#2d2a32">⭐ ${o.score}   ❤️ ${o.lives}</text>
      <rect x="690" y="18" width="250" height="50" rx="14" fill="#2d2a32"/>
      <text x="815" y="52" font-size="24" font-weight="800" fill="#ffd93d" text-anchor="middle">${o.label}</text>`);
  }
  function gameMenu() {
    return svg(960, 540, `
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff6b6b"/><stop offset="1" stop-color="#feca57"/></linearGradient></defs>
      <rect width="960" height="540" fill="url(#g)"/>
      <g fill="#fff" opacity=".18"><circle cx="100" cy="90" r="70"/><circle cx="860" cy="460" r="110"/><circle cx="820" cy="80" r="40"/></g>
      ${cat(480, 170, 1.6)}
      <text x="480" y="320" font-size="66" font-weight="900" fill="#fff" stroke="#2d2a32" stroke-width="5" paint-order="stroke" text-anchor="middle">MÈO PHIÊU LƯU</text>
      <rect x="370" y="360" width="220" height="64" rx="20" fill="#7bed9f" stroke="#2d2a32" stroke-width="5"/>
      <text x="480" y="403" font-size="30" font-weight="800" fill="#2d2a32" text-anchor="middle">▶ CHƠI</text>
      <text x="480" y="470" font-size="22" font-weight="700" fill="#2d2a32" text-anchor="middle">Nhấn phím cách để bắt đầu</text>`);
  }
  function gameCode() {
    const block = (x, y, w, c, t) => `<rect x="${x}" y="${y}" width="${w}" height="44" rx="10" fill="${c}"/><text x="${x + 16}" y="${y + 29}" font-size="20" font-weight="700" fill="#fff">${t}</text>`;
    return svg(960, 540, `<rect width="960" height="540" fill="#f4f6fb"/>
      <rect x="0" y="0" width="960" height="52" fill="#855cd6"/><text x="24" y="34" font-size="22" font-weight="800" fill="#fff">Scratch – Mèo phiêu lưu</text>
      <rect x="20" y="70" width="200" height="450" rx="14" fill="#fff" stroke="#dde1ea" stroke-width="2"/>
      ${['#4c97ff', '#9966ff', '#cf63cf', '#ffbf00', '#ffab19', '#4cbf56'].map((c, i) => `<circle cx="50" cy="${110 + i * 60}" r="16" fill="${c}"/><rect x="80" y="${100 + i * 60}" width="110" height="20" rx="8" fill="#e8ebf2"/>`).join('')}
      ${block(260, 90, 280, '#ffbf00', 'Khi bấm vào lá cờ xanh')}
      ${block(276, 138, 230, '#ffab19', 'liên tục lặp lại')}
      ${block(300, 186, 300, '#4cbf56', 'nếu phím → được bấm thì')}
      ${block(320, 234, 240, '#4c97ff', 'thay đổi x một lượng 6')}
      ${block(300, 282, 300, '#4cbf56', 'nếu phím cách được bấm thì')}
      ${block(320, 330, 220, '#4c97ff', 'nhảy lên cao 18')}
      ${block(300, 378, 320, '#4cbf56', 'nếu chạm vào Slime thì')}
      ${block(320, 426, 220, '#9966ff', 'mất 1 mạng ❤️')}
      <rect x="650" y="70" width="290" height="220" rx="14" fill="#fff" stroke="#dde1ea" stroke-width="2"/>
      <rect x="662" y="82" width="266" height="196" rx="8" fill="#a4e4ff"/>${cat(760, 210, .7)}${coin(860, 140)}`);
  }

  /* ---------- Website: shop giày ---------- */
  function browser(body, url) {
    return svg(1200, 750, `<rect width="1200" height="750" rx="18" fill="#fff"/>
      <rect width="1200" height="54" rx="18" fill="#eceef4"/><rect y="36" width="1200" height="18" fill="#eceef4"/>
      <circle cx="30" cy="27" r="8" fill="#ff5f57"/><circle cx="56" cy="27" r="8" fill="#febc2e"/><circle cx="82" cy="27" r="8" fill="#28c840"/>
      <rect x="130" y="12" width="600" height="30" rx="15" fill="#fff"/><text x="150" y="33" font-size="16" fill="#6b7280">${url}</text>
      <g transform="translate(0,54)">${body}</g>`);
  }
  const nav = `<rect width="1200" height="74" fill="#fff"/><text x="40" y="47" font-size="30" font-weight="900" fill="#6c5ce7">GiàyXinh<tspan fill="#ff7aa2">.vn</tspan></text>
    ${['Trang chủ', 'Sản phẩm', 'Khuyến mãi', 'Liên hệ'].map((t, i) => `<text x="${520 + i * 130}" y="45" font-size="19" font-weight="600" fill="#374151">${t}</text>`).join('')}
    <circle cx="1140" cy="38" r="20" fill="#6c5ce7"/><text x="1140" y="45" font-size="20" fill="#fff" text-anchor="middle">🛒</text>`;
  const shoe = (x, y, c, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><path d="M0 60 Q0 20 30 18 L70 30 Q100 40 140 44 Q170 48 170 70 L170 80 L0 80Z" fill="${c}" stroke="#1f2937" stroke-width="4"/><rect x="0" y="74" width="172" height="14" rx="6" fill="#fff" stroke="#1f2937" stroke-width="4"/><path d="M40 30 L60 52 M55 26 L75 50" stroke="#fff" stroke-width="5"/></g>`;
  const product = (x, y, c, name, price) => `<rect x="${x}" y="${y}" width="250" height="280" rx="18" fill="#fff" stroke="#e5e7eb" stroke-width="2"/>
    <rect x="${x + 14}" y="${y + 14}" width="222" height="160" rx="12" fill="${c}" opacity=".18"/>${shoe(x + 40, y + 50, c, 1)}
    <text x="${x + 18}" y="${y + 208}" font-size="20" font-weight="700" fill="#111827">${name}</text>
    <text x="${x + 18}" y="${y + 240}" font-size="20" font-weight="800" fill="#ff4d7e">${price}</text>
    <rect x="${x + 160}" y="${y + 218}" width="74" height="34" rx="17" fill="#6c5ce7"/><text x="${x + 197}" y="${y + 241}" font-size="15" font-weight="700" fill="#fff" text-anchor="middle">+ Giỏ</text>`;
  function webHome() {
    return browser(`${nav}
      <defs><linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6c5ce7"/><stop offset="1" stop-color="#ff7aa2"/></linearGradient></defs>
      <rect y="74" width="1200" height="330" fill="url(#h)"/>
      <text x="70" y="180" font-size="54" font-weight="900" fill="#fff">Bước đi tự tin</text>
      <text x="70" y="240" font-size="54" font-weight="900" fill="#fff">cùng GiàyXinh 👟</text>
      <text x="70" y="290" font-size="22" fill="#fff" opacity=".9">Giày thể thao chính hãng – giao hàng 2 giờ</text>
      <rect x="70" y="320" width="200" height="56" rx="28" fill="#fff"/><text x="170" y="356" font-size="20" font-weight="800" fill="#6c5ce7" text-anchor="middle">Mua ngay →</text>
      ${shoe(720, 170, '#ffd93d', 2.2)}
      <text x="70" y="460" font-size="28" font-weight="800" fill="#111827">Sản phẩm bán chạy</text>
      ${product(70, 485, '#6c5ce7', 'Runner Pro', '890.000đ')}${product(340, 485, '#ff7aa2', 'Pinky Air', '750.000đ')}${product(610, 485, '#10b981', 'Green Jump', '990.000đ')}${product(880, 485, '#f59e0b', 'Sunny Kid', '520.000đ')}`, 'https://giayxinh.vn');
  }
  function webProducts() {
    return browser(`${nav}<rect y="74" width="1200" height="622" fill="#f8f9fc"/>
      <text x="60" y="130" font-size="30" font-weight="800" fill="#111827">Tất cả sản phẩm</text>
      ${['Tất cả', 'Chạy bộ', 'Bóng rổ', 'Đi học'].map((t, i) => `<rect x="${60 + i * 130}" y="150" width="118" height="38" rx="19" fill="${i ? '#fff' : '#6c5ce7'}" stroke="#e5e7eb"/><text x="${119 + i * 130}" y="175" font-size="16" font-weight="700" fill="${i ? '#374151' : '#fff'}" text-anchor="middle">${t}</text>`).join('')}
      ${product(60, 220, '#6c5ce7', 'Runner Pro', '890.000đ')}${product(330, 220, '#ff7aa2', 'Pinky Air', '750.000đ')}
      ${product(600, 220, '#10b981', 'Green Jump', '990.000đ')}${product(870, 220, '#f59e0b', 'Sunny Kid', '520.000đ')}`, 'https://giayxinh.vn/san-pham');
  }
  function webCart() {
    const row = (y, c, n, p) => `<rect x="60" y="${y}" width="680" height="110" rx="16" fill="#fff" stroke="#e5e7eb"/>${shoe(80, y + 14, c, .5)}
      <text x="190" y="${y + 48}" font-size="22" font-weight="700" fill="#111827">${n}</text><text x="190" y="${y + 80}" font-size="18" fill="#6b7280">Size 38 · SL: 1</text>
      <text x="710" y="${y + 64}" font-size="22" font-weight="800" fill="#ff4d7e" text-anchor="end">${p}</text>`;
    return browser(`${nav}<rect y="74" width="1200" height="622" fill="#f8f9fc"/>
      <text x="60" y="130" font-size="30" font-weight="800" fill="#111827">🛒 Giỏ hàng của bạn</text>
      ${row(160, '#6c5ce7', 'Runner Pro', '890.000đ')}${row(290, '#10b981', 'Green Jump', '990.000đ')}
      <rect x="780" y="160" width="360" height="300" rx="16" fill="#fff" stroke="#e5e7eb"/>
      <text x="810" y="210" font-size="22" font-weight="800" fill="#111827">Thanh toán</text>
      <text x="810" y="260" font-size="18" fill="#6b7280">Tạm tính</text><text x="1110" y="260" font-size="18" fill="#111827" text-anchor="end">1.880.000đ</text>
      <text x="810" y="300" font-size="18" fill="#6b7280">Phí giao hàng</text><text x="1110" y="300" font-size="18" fill="#10b981" text-anchor="end">Miễn phí</text>
      <text x="810" y="350" font-size="22" font-weight="800" fill="#111827">Tổng</text><text x="1110" y="350" font-size="24" font-weight="900" fill="#ff4d7e" text-anchor="end">1.880.000đ</text>
      <rect x="810" y="384" width="300" height="54" rx="27" fill="#6c5ce7"/><text x="960" y="418" font-size="20" font-weight="800" fill="#fff" text-anchor="middle">Đặt hàng</text>`, 'https://giayxinh.vn/gio-hang');
  }

  /* ---------- App: quản lý công việc ---------- */
  function phone(body, accent = '#22d3ee') {
    return svg(600, 900, `<rect width="600" height="900" fill="#0b1224"/>
      <rect x="120" y="30" width="360" height="840" rx="56" fill="#111827" stroke="${accent}" stroke-width="3"/>
      <rect x="136" y="46" width="328" height="808" rx="42" fill="#0f172a"/>
      <rect x="250" y="58" width="100" height="22" rx="11" fill="#111827"/>
      <g transform="translate(136,96)">${body}</g>`);
  }
  const task = (y, text, done, tag, c) => `<rect x="18" y="${y}" width="292" height="74" rx="16" fill="#1e293b"/>
    <rect x="34" y="${y + 23}" width="28" height="28" rx="8" fill="${done ? c : 'none'}" stroke="${c}" stroke-width="3"/>${done ? `<path d="M40 ${y + 37} l6 7 l12 -14" stroke="#0f172a" stroke-width="4" fill="none"/>` : ''}
    <text x="76" y="${y + 34}" font-size="17" font-weight="700" fill="${done ? '#64748b' : '#e2e8f0'}" ${done ? 'text-decoration="line-through"' : ''}>${text}</text>
    <text x="76" y="${y + 58}" font-size="13" fill="${c}">${tag}</text>`;
  function appHome() {
    return phone(`<text x="22" y="30" font-size="15" fill="#94a3b8">Thứ Hai, 10/11</text>
      <text x="22" y="66" font-size="30" font-weight="800" fill="#fff">Hôm nay 👋</text>
      <rect x="18" y="90" width="292" height="96" rx="18" fill="#22d3ee" opacity=".16" stroke="#22d3ee"/>
      <text x="36" y="124" font-size="16" fill="#a5f3fc">Tiến độ hôm nay</text><text x="36" y="160" font-size="28" font-weight="800" fill="#fff">3/5 việc</text>
      <rect x="160" y="146" width="130" height="12" rx="6" fill="#1e293b"/><rect x="160" y="146" width="78" height="12" rx="6" fill="#22d3ee"/>
      ${task(206, 'Làm bài tập Toán', true, '📚 Học tập · 7:00', '#22d3ee')}
      ${task(292, 'Luyện code Python', true, '💻 Lập trình · 9:00', '#a78bfa')}
      ${task(378, 'Đọc sách 20 phút', true, '📖 Thói quen · 14:00', '#34d399')}
      ${task(464, 'Dọn phòng', false, '🏠 Việc nhà · 17:00', '#fbbf24')}
      ${task(550, 'Chuẩn bị thuyết trình', false, '🎤 Dự án · 20:00', '#f472b6')}
      <circle cx="270" cy="690" r="32" fill="#22d3ee"/><text x="270" y="702" font-size="36" font-weight="700" fill="#0f172a" text-anchor="middle">+</text>`);
  }
  function appAdd() {
    const field = (y, l, v) => `<text x="22" y="${y}" font-size="14" fill="#94a3b8">${l}</text><rect x="18" y="${y + 10}" width="292" height="50" rx="14" fill="#1e293b" stroke="#334155"/><text x="34" y="${y + 42}" font-size="17" fill="#e2e8f0">${v}</text>`;
    return phone(`<text x="22" y="50" font-size="26" font-weight="800" fill="#fff">✏️ Thêm công việc</text>
      ${field(100, 'Tên công việc', 'Ôn tập Tiếng Anh')}${field(190, 'Thời gian', '19:30 – Hôm nay')}
      <text x="22" y="290" font-size="14" fill="#94a3b8">Nhóm</text>
      ${[['📚 Học tập', '#22d3ee'], ['💻 Code', '#a78bfa'], ['🏠 Nhà', '#fbbf24']].map(([t, c], i) => `<rect x="${18 + i * 100}" y="302" width="92" height="40" rx="20" fill="${i ? '#1e293b' : c}" stroke="${c}"/><text x="${64 + i * 100}" y="328" font-size="14" font-weight="700" fill="${i ? c : '#0f172a'}" text-anchor="middle">${t}</text>`).join('')}
      <text x="22" y="390" font-size="14" fill="#94a3b8">Nhắc nhở</text>
      <rect x="18" y="400" width="292" height="56" rx="14" fill="#1e293b"/><text x="34" y="434" font-size="17" fill="#e2e8f0">🔔 Trước 15 phút</text>
      <rect x="250" y="416" width="44" height="24" rx="12" fill="#22d3ee"/><circle cx="282" cy="428" r="9" fill="#fff"/>
      <rect x="18" y="600" width="292" height="60" rx="30" fill="#22d3ee"/><text x="164" y="638" font-size="19" font-weight="800" fill="#0f172a" text-anchor="middle">Lưu công việc</text>`);
  }
  function appStats() {
    const bars = [40, 70, 55, 90, 65, 100, 80];
    return phone(`<text x="22" y="50" font-size="26" font-weight="800" fill="#fff">📊 Thống kê</text>
      <text x="22" y="84" font-size="15" fill="#94a3b8">Tuần này em đã hoàn thành</text>
      <text x="22" y="132" font-size="46" font-weight="900" fill="#22d3ee">27 việc</text>
      <rect x="18" y="160" width="292" height="250" rx="18" fill="#1e293b"/>
      ${bars.map((h, i) => `<rect x="${40 + i * 38}" y="${380 - h * 1.8}" width="24" height="${h * 1.8}" rx="8" fill="${i === 5 ? '#a78bfa' : '#22d3ee'}"/><text x="${52 + i * 38}" y="400" font-size="12" fill="#94a3b8" text-anchor="middle">${'HBTNSBC'[i]}</text>`).join('')}
      <rect x="18" y="430" width="140" height="110" rx="18" fill="#1e293b"/><text x="36" y="470" font-size="14" fill="#94a3b8">Chuỗi ngày</text><text x="36" y="515" font-size="32" font-weight="800" fill="#fbbf24">🔥 12</text>
      <rect x="170" y="430" width="140" height="110" rx="18" fill="#1e293b"/><text x="188" y="470" font-size="14" fill="#94a3b8">Điểm thưởng</text><text x="188" y="515" font-size="32" font-weight="800" fill="#34d399">⭐ 340</text>`, '#a78bfa');
  }
  function qr() {
    let cells = '';
    let seed = 7;
    for (let y = 0; y < 21; y++) for (let x = 0; x < 21; x++) {
      seed = (seed * 9301 + 49297) % 233280;
      const finder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (!finder && seed / 233280 > 0.52) cells += `<rect x="${x * 10}" y="${y * 10}" width="10" height="10"/>`;
    }
    const f = (x, y) => `<rect x="${x}" y="${y}" width="70" height="70" fill="#111"/><rect x="${x + 10}" y="${y + 10}" width="50" height="50" fill="#fff"/><rect x="${x + 20}" y="${y + 20}" width="30" height="30" fill="#111"/>`;
    return svg(250, 250, `<rect width="250" height="250" fill="#fff" rx="16"/><g transform="translate(20,20)"><g fill="#111">${cells}</g>${f(0, 0)}${f(140, 0)}${f(0, 140)}</g>`);
  }

  const IMG = {
    gMenu: gameMenu(),
    g1: gameScene({ sky1: '#74b9ff', sky2: '#c7ecff', hill: '#55efc4', ground: '#8ed16f', plat: '#e17055', plats: [[360, 330, 160], [600, 250, 160]], coins: [[440, 290], [680, 210], [720, 210]], enemies: [[560, 440]], score: 120, lives: 3, label: 'MÀN 1: KHU VƯỜN' }),
    g2: gameScene({ sky1: '#fd9644', sky2: '#fed330', sun: '#fff', hill: '#e58e26', ground: '#d1a054', plat: '#a55eea', plats: [[300, 360, 120], [480, 290, 120], [660, 220, 120]], coins: [[360, 320], [540, 250], [720, 180]], enemies: [[420, 440, '#ff7675'], [760, 440, '#ff7675']], catX: 520, catY: 250, score: 480, lives: 2, label: 'MÀN 2: SA MẠC' }),
    g3: gameScene({ sky1: '#2c3e50', sky2: '#4b6584', sun: '#dfe6e9', sunX: 140, hill: '#3d3d6b', ground: '#596275', plat: '#00cec9', plats: [[420, 300, 200]], coins: [[480, 260], [520, 260], [560, 260]], enemies: [[700, 430, '#a29bfe'], [820, 430, '#a29bfe']], catX: 300, catY: 400, score: 950, lives: 1, label: 'MÀN 3: LÂU ĐÀI' }),
    gCode: gameCode(),
    wHome: webHome(), wProducts: webProducts(), wCart: webCart(),
    aHome: appHome(), aAdd: appAdd(), aStats: appStats(), qr: qr()
  };

  const S = (contentType, layout, data) => ({ contentType, layout, data: M.normalizeData(layout, data) });

  M.DEMOS = [
    {
      title: 'Giới thiệu Game', productType: 'game', productName: 'Mèo Phiêu Lưu', author: 'Nguyễn Minh An', course: 'Lớp 7A2 – Khóa Scratch', summary: 'Game nhảy vượt chướng ngại vật',
      theme: 'playful', primaryColor: '#FF6B6B', font: 'Baloo 2',
      slides: [
        S('cover', 'cover', { title: 'Mèo Phiêu Lưu', subtitle: 'Cùng chú mèo Mướp vượt qua 3 vùng đất kỳ bí!', author: 'Nguyễn Minh An', course: 'Lớp 7A2 – Khóa Scratch', image: IMG.gMenu }),
        S('intro', 'intro', { title: 'Ý tưởng trò chơi', idea: 'Em rất thích nuôi mèo và chơi game Mario, nên em muốn làm một game nhảy vượt chướng ngại vật với nhân vật chính là chú mèo của em.', purpose: 'Giúp các bạn giải trí sau giờ học và rèn phản xạ nhanh.', image: IMG.g1 }),
        S('story', 'twoColumns', { title: 'Cốt truyện & Nhân vật', leftIcon: '📖', leftTitle: 'Cốt truyện', leftText: 'Bé mèo Mướp bị lạc khỏi nhà. Mướp phải đi qua khu vườn, sa mạc và lâu đài, nhặt đủ đồng xu vàng để tìm đường về với chủ.', rightIcon: '🐱', rightTitle: 'Nhân vật', rightText: 'Mướp: nhanh nhẹn, nhảy cao.\nSlime xanh: đi qua lại, chạm vào sẽ mất mạng.\nSlime tím: canh giữ lâu đài, khó né hơn.' }),
        S('gameplay', 'process', { title: 'Cách chơi', steps: [
          { name: 'Di chuyển', desc: 'Dùng phím mũi tên ← → để chạy sang trái, phải.' },
          { name: 'Nhảy', desc: 'Nhấn phím cách để nhảy lên bục và né Slime.' },
          { name: 'Nhặt xu', desc: 'Mỗi đồng xu được 10 điểm. Đủ 30 xu thì qua màn.' },
          { name: 'Giữ mạng', desc: 'Có 3 mạng ❤️. Chạm Slime mất 1 mạng, hết mạng là thua.' }] }),
        S('features', 'features', { title: 'Tính năng nổi bật', cards: [
          { icon: '🗺️', name: '3 màn chơi', desc: 'Khu vườn, sa mạc và lâu đài với độ khó tăng dần.' },
          { icon: '🏆', name: 'Bảng điểm cao', desc: 'Lưu điểm cao nhất để thử thách bạn bè.' },
          { icon: '🎵', name: 'Âm thanh vui nhộn', desc: 'Nhạc nền và hiệu ứng khi nhặt xu, khi nhảy.' }] }),
        S('gallery', 'gallery', { title: 'Hình ảnh trong game', photos: [
          { src: IMG.g1, caption: 'Màn 1 – Khu vườn' }, { src: IMG.g2, caption: 'Màn 2 – Sa mạc' }, { src: IMG.g3, caption: 'Màn 3 – Lâu đài' }] }),
        S('development', 'imageText', { title: 'Quá trình phát triển', image: IMG.gCode, imagePos: 'right', caption: 'Một đoạn code điều khiển nhân vật',
          text: 'Em làm game bằng Scratch trong 4 tuần: vẽ nhân vật, lập trình di chuyển, thêm màn chơi và sửa lỗi. Khó nhất là làm mèo đứng được trên bục — em đã dùng khối “chạm vào màu” để giải quyết.' }),
        S('question', 'question', { question: 'Theo các bạn, màn chơi nào khó nhất?', options: ['Khu vườn', 'Sa mạc', 'Lâu đài'], note: 'Giơ tay chọn đáp án nhé! 🙋' }),
        S('thankyou', 'thankyou', { heading: 'Cảm ơn mọi người đã lắng nghe!', message: 'Mời các bạn quét mã để chơi thử Mèo Phiêu Lưu nhé!', link: 'scratch.mit.edu/projects/meo-phieu-luu', image: IMG.qr })
      ]
    },
    {
      title: 'Giới thiệu Website', productType: 'website', productName: 'GiàyXinh.vn', author: 'Trần Bảo Ngọc', course: 'Lớp 10A5 – Khóa Web cơ bản', summary: 'Website bán giày thể thao cho học sinh',
      theme: 'modern', primaryColor: '#6C5CE7', font: 'Be Vietnam Pro',
      slides: [
        S('cover', 'cover', { title: 'GiàyXinh.vn', subtitle: 'Website bán giày thể thao dành cho học sinh', author: 'Trần Bảo Ngọc', course: 'Lớp 10A5 – Khóa Web cơ bản', image: IMG.wHome }),
        S('intro', 'intro', { title: 'Ý tưởng phát triển', idea: 'Mẹ em có một cửa hàng giày nhỏ nhưng chỉ bán tại nhà. Em muốn làm website để khách có thể xem và đặt giày online.', purpose: 'Giúp cửa hàng có thêm khách và giúp khách mua giày nhanh, tiện hơn.' }),
        S('problem', 'content', { title: 'Vấn đề website giải quyết', body: 'Trước đây khách phải nhắn tin hỏi từng mẫu giày, giá và size. Việc này mất nhiều thời gian của cả khách và người bán.', bullets: ['Khách xem đủ mẫu, giá, size ngay trên web', 'Đặt hàng 24/7, không cần chờ trả lời', 'Cửa hàng quản lý đơn dễ dàng hơn'] }),
        S('homepage', 'imageText', { title: 'Giao diện trang chủ', image: IMG.wHome, caption: 'Trang chủ GiàyXinh.vn', text: 'Trang chủ có banner lớn, nút “Mua ngay” nổi bật và danh sách sản phẩm bán chạy. Em chọn màu tím – hồng để trẻ trung, phù hợp học sinh.' }),
        S('features', 'features', { title: 'Tính năng nổi bật', subtitle: 'Những chức năng giúp khách mua giày dễ dàng', cards: [
          { icon: '🔍', name: 'Lọc sản phẩm', desc: 'Lọc theo loại giày: chạy bộ, bóng rổ, đi học.' },
          { icon: '🛒', name: 'Giỏ hàng', desc: 'Thêm nhiều sản phẩm, tự tính tổng tiền.' },
          { icon: '📱', name: 'Responsive', desc: 'Hiển thị đẹp trên điện thoại và máy tính.' },
          { icon: '💬', name: 'Liên hệ nhanh', desc: 'Nút chat Zalo để hỏi shop ngay.' }] }),
        S('pages', 'gallery', { title: 'Các trang chức năng', photos: [
          { src: IMG.wHome, caption: 'Trang chủ' }, { src: IMG.wProducts, caption: 'Danh sách sản phẩm' }, { src: IMG.wCart, caption: 'Giỏ hàng & thanh toán' }] }),
        S('tech', 'twoColumns', { title: 'Công nghệ sử dụng', leftIcon: '💻', leftTitle: 'Ngôn ngữ', leftText: 'HTML để tạo cấu trúc trang.\nCSS (Flexbox, Grid) để trình bày giao diện.\nJavaScript để làm giỏ hàng và bộ lọc.', rightIcon: '🛠️', rightTitle: 'Công cụ', rightText: 'Visual Studio Code để viết code.\nFigma để vẽ bản thiết kế.\nGitHub Pages để đưa web lên mạng.' }),
        S('development', 'process', { title: 'Quá trình phát triển', steps: [
          { name: 'Khảo sát', desc: 'Hỏi mẹ và 10 bạn trong lớp về nhu cầu mua giày.' },
          { name: 'Thiết kế', desc: 'Vẽ giao diện trên Figma, chọn màu và font.' },
          { name: 'Lập trình', desc: 'Viết HTML, CSS, JavaScript trong 3 tuần.' },
          { name: 'Kiểm thử', desc: 'Nhờ bạn bè dùng thử và sửa lỗi hiển thị.' },
          { name: 'Ra mắt', desc: 'Đưa web lên GitHub Pages.' }] }),
        S('thankyou', 'thankyou', { heading: 'Cảm ơn thầy cô và các bạn!', message: 'Mời mọi người ghé thăm GiàyXinh.vn và góp ý cho em nhé.', link: 'baongoc.github.io/giayxinh' })
      ]
    },
    {
      title: 'Giới thiệu App', productType: 'app', productName: 'TaskMate', author: 'Lê Hoàng Phúc', course: 'Khóa App Inventor – MindX', summary: 'Ứng dụng quản lý công việc cho học sinh',
      theme: 'tech', primaryColor: '#22D3EE', font: 'Montserrat',
      slides: [
        S('cover', 'cover', { title: 'TaskMate', subtitle: 'Ứng dụng giúp học sinh quản lý công việc mỗi ngày', author: 'Lê Hoàng Phúc', course: 'Khóa App Inventor – MindX', image: IMG.aHome }),
        S('intro', 'intro', { title: 'Ý tưởng phát triển', idea: 'Em hay quên làm bài tập và việc nhà vì có quá nhiều việc. Em muốn có một ứng dụng đơn giản để ghi lại và nhắc nhở công việc.', purpose: 'Giúp học sinh sắp xếp thời gian, hoàn thành việc đúng hạn và hình thành thói quen tốt.', image: IMG.aAdd }),
        S('audience', 'twoColumns', { title: 'Đối tượng sử dụng', leftIcon: '👥', leftTitle: 'Ai sẽ sử dụng?', leftText: 'Học sinh từ 11 – 17 tuổi, có nhiều bài tập, lớp học thêm và hoạt động ngoại khóa.', rightIcon: '🎁', rightTitle: 'Họ nhận được gì?', rightText: 'Không quên việc quan trọng, biết mình đã làm được bao nhiêu và có động lực nhờ điểm thưởng.' }),
        S('screens', 'gallery', { title: 'Các màn hình chính', photos: [
          { src: IMG.aHome, caption: 'Danh sách hôm nay' }, { src: IMG.aAdd, caption: 'Thêm công việc' }, { src: IMG.aStats, caption: 'Thống kê tuần' }] }),
        S('features', 'features', { title: 'Tính năng nổi bật', cards: [
          { icon: '✅', name: 'Danh sách việc', desc: 'Thêm, sửa, đánh dấu hoàn thành chỉ với 1 chạm.' },
          { icon: '🔔', name: 'Nhắc nhở', desc: 'Thông báo trước giờ làm việc 15 phút.' },
          { icon: '🏷️', name: 'Phân nhóm', desc: 'Chia việc theo Học tập, Code, Việc nhà.' },
          { icon: '📊', name: 'Thống kê', desc: 'Biểu đồ số việc hoàn thành mỗi tuần.' },
          { icon: '🔥', name: 'Chuỗi ngày', desc: 'Đếm số ngày liên tiếp hoàn thành hết việc.' },
          { icon: '⭐', name: 'Điểm thưởng', desc: 'Nhận điểm mỗi khi xong việc đúng hạn.' }] }),
        S('usage', 'process', { title: 'Cách sử dụng', steps: [
          { name: 'Mở app', desc: 'Xem các việc cần làm trong hôm nay.' },
          { name: 'Thêm việc', desc: 'Bấm nút + , nhập tên, giờ và chọn nhóm.' },
          { name: 'Hoàn thành', desc: 'Chạm vào ô vuông để đánh dấu đã xong.' },
          { name: 'Xem thống kê', desc: 'Theo dõi tiến bộ và điểm thưởng mỗi tuần.' }] }),
        S('challenges', 'twoColumns', { title: 'Khó khăn & Cách giải quyết', leftIcon: '🧗', leftTitle: 'Khó khăn', leftText: 'Dữ liệu bị mất mỗi khi tắt ứng dụng.\nThông báo không hiện đúng giờ.', rightIcon: '💡', rightTitle: 'Cách giải quyết', rightText: 'Dùng TinyDB để lưu dữ liệu trên máy.\nDùng khối Clock và kiểm tra lại giờ mỗi phút.' }),
        S('lessons', 'content', { title: 'Bài học của em', body: 'Làm TaskMate giúp em hiểu một ứng dụng thật cần được thử nghiệm với người dùng thật.', bullets: ['Biết lưu trữ dữ liệu với TinyDB', 'Biết thiết kế giao diện dễ dùng', 'Kiên nhẫn khi tìm và sửa lỗi', 'Lần sau: đồng bộ dữ liệu lên mạng'], image: IMG.aStats }),
        S('thankyou', 'thankyou', { heading: 'Cảm ơn mọi người!', message: 'Các bạn có câu hỏi nào về TaskMate không?', link: 'Tải file .apk: bit.ly/taskmate-app', image: IMG.qr })
      ]
    }
  ];
})(window.MXS);
