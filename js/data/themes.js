/* Theme và font */
window.MXS = window.MXS || {};
(function (M) {
  M.THEMES = {
    modern: { name: 'Modern', desc: 'Trẻ trung, gradient hiện đại – hợp mọi loại sản phẩm', primary: '#6C5CE7', font: 'Be Vietnam Pro', hueShift: 45 },
    minimal: { name: 'Minimal', desc: 'Nền sáng, tối giản, tập trung vào nội dung', primary: '#2563EB', font: 'Lexend', hueShift: 25 },
    tech: { name: 'Technology', desc: 'Nền tối, neon xanh tím – hợp Website & App', primary: '#22D3EE', font: 'Montserrat', hueShift: 90 },
    playful: { name: 'Playful', desc: 'Vui nhộn, hình khối sinh động – hợp Game', primary: '#FF6B6B', font: 'Baloo 2', hueShift: 160 }
  };
  M.THEME_ORDER = ['modern', 'minimal', 'tech', 'playful'];

  M.SWATCHES = ['#6C5CE7', '#2563EB', '#0EA5E9', '#22D3EE', '#10B981', '#84CC16', '#F59E0B', '#FF6B6B', '#EC4899', '#A855F7', '#F97316', '#111827'];

  M.FONTS = ['Be Vietnam Pro', 'Nunito', 'Montserrat', 'Lexend', 'Quicksand', 'Baloo 2'];
  M.fontLink = fonts => 'https://fonts.googleapis.com/css2?' +
    fonts.map(f => 'family=' + f.replace(/ /g, '+') + (f === 'Quicksand' ? ':wght@400;500;600;700' : ':wght@400;500;600;700;800')).join('&') + '&display=swap';
})(window.MXS);
