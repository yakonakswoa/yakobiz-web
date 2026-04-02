// YAKO_BIZ — script.js

// ── Render products ─────────────────────────────────────────────
function renderProducts(filter = 'all') {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const filtered = filter === 'all'
    ? PRODUCTS.filter(p => p.status !== 'hidden')
    : PRODUCTS.filter(p => p.category === filter && p.status !== 'hidden');

  grid.innerHTML = filtered.map(p => {
    const isComing = p.status === 'coming_soon';
    const minPrice = Math.min(...p.plans.map(pl => pl.price));
    const badgeHtml = p.badge
      ? `<div class="card-badge" style="background:${p.badgeColor}22;color:${p.badgeColor};border:1px solid ${p.badgeColor}44">${p.badge}</div>`
      : '';
    const featuresHtml = p.features.map(f =>
      `<div class="card-feature">${f}</div>`
    ).join('');
    const buyBtn = isComing
      ? `<button class="btn-coming" disabled>Sắp ra mắt</button>`
      : p.free
        ? `<a class="btn-download-free" href="${p.downloadUrl || '#'}" target="_blank">⬇️ Tải về miễn phí</a>`
        : `<button class="btn-buy" onclick="openModal('${p.id}')">Mua ngay</button>`;

    // Nút chi tiết — tự động dùng guide.html?id= nếu sản phẩm có guide
    const detailBtn = p.guide
      ? `<a href="guide.html?id=${p.id}" target="_blank" rel="noopener" class="btn-guide">Xem hướng dẫn & chi tiết →</a>`
      : '';

    // Price section - ẩn nếu là phần mềm miễn phí
    const priceSection = p.free
      ? `<div class="card-price-free">🎁 Miễn phí</div>`
      : `<div>
           <div class="card-price-from">Từ</div>
           <div class="card-price">${minPrice.toLocaleString('vi-VN')}₫</div>
         </div>`;


    // Ảnh 9:16 hoặc icon placeholder
    const imageSection = p.image
      ? `<div class="card-image-wrap">
           <img src="${p.image}" class="card-image-916" alt="${p.name}">
           ${p.badge ? `<div class="card-img-badge" style="background:${p.badgeColor}">${p.badge}</div>` : ''}
         </div>`
      : `<div class="card-icon-wrap">
           <div class="card-icon">${p.icon}</div>
           ${badgeHtml}
         </div>`;

    return `
      <div class="product-card reveal ${isComing ? 'coming-soon' : ''}" data-category="${p.category}">
        ${imageSection}
        <div class="card-top">
          ${!p.image ? '' : badgeHtml}
          <div class="card-name">${p.name}</div>
          <div class="card-tagline">${p.tagline}</div>
          <div class="card-features">${featuresHtml}</div>
          ${detailBtn ? `<div style="margin-top:12px">${detailBtn}</div>` : ''}
        </div>
        <div class="card-bottom">
          ${priceSection}
          ${buyBtn}
        </div>
      </div>
    `;
  }).join('');

  observeReveal();
}

// ── Filter ──────────────────────────────────────────────────────
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

// ── Modal mua hàng ─────────────────────────────────────────────
let _selectedPlanIndex = 0;

function openModal(productId) {
  const p = PRODUCTS.find(x => x.id === productId);
  if (!p || p.status === 'coming_soon') return;

  _selectedPlanIndex = p.plans.findIndex(pl => pl.highlight) ?? 0;
  if (_selectedPlanIndex < 0) _selectedPlanIndex = 0;

  const plansHtml = p.plans.map((pl, i) => `
    <div class="plan-option ${i === _selectedPlanIndex ? 'selected' : ''}"
         onclick="selectPlan(this, ${i})">
      <span class="plan-name-text">${pl.name}</span>
      ${pl.save ? `<span class="plan-save-tag">${pl.save}</span>` : ''}
      <span class="plan-price-tag">${pl.price.toLocaleString('vi-VN')}₫</span>
    </div>
  `).join('');

  document.getElementById('modal-box').innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>
    <div class="modal-product-icon">${p.icon}</div>
    <div class="modal-product-name">${p.name}</div>
    <div class="modal-product-tagline">${p.tagline}</div>

    <div class="modal-plans" id="modal-plans">${plansHtml}</div>

    <div class="modal-form">
      <label>Email nhận key *</label>
      <input type="email" id="modal-email" placeholder="email@gmail.com" />
    </div>

    <button class="btn-order-confirm" onclick="confirmOrder('${p.id}')">
      Tạo đơn thanh toán →
    </button>
    <p class="modal-note">
      🔒 Thanh toán qua QR chuyển khoản ngân hàng<br>
      📧 Key gửi về email trong vòng 5 phút
    </p>
  `;

  // Lưu danh sách plan để dùng khi confirm
  document.getElementById('modal-box').dataset.plans = JSON.stringify(p.plans);
  document.getElementById('modal-box').dataset.productName = p.name;

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function selectPlan(el, index) {
  _selectedPlanIndex = index;
  document.querySelectorAll('.plan-option').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal')) return;
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

function confirmOrder(productId) {
  const email = document.getElementById('modal-email')?.value?.trim();
  if (!email || !email.includes('@')) {
    showToast('Vui lòng nhập email hợp lệ!', 'error');
    return;
  }

  const plans = JSON.parse(document.getElementById('modal-box').dataset.plans);
  const productName = document.getElementById('modal-box').dataset.productName;
  const plan = plans[_selectedPlanIndex];
  const amount = plan.price;
  const _rnd = Math.random().toString(36).substring(2,6).toUpperCase();
  // Dùng mã ngắn thay vì tên đầy đủ để tránh MB Bank cắt nội dung (giới hạn ~40 ký tự)
  const PRODUCT_SHORT = { 'macropilot': 'MACRO', 'tiktok-auto-upload': 'TTAU' };
  const productCode = PRODUCT_SHORT[productId] || productId.replace(/-/g,'').substring(0,8).toUpperCase();
  const contentCK = `YAKOBIZ ${productCode} ${email.split('@')[0].toUpperCase()} ${_rnd}`;
  // VD: "YAKOBIZ TTAU YAKONAKSWOA K2VY" = 29 ký tự (an toàn)

  // VietQR — compact template, tỉ lệ tự nhiên
  const qrUrl = `https://img.vietqr.io/image/${SITE.bank_id}-${SITE.bank_number}-compact.png`
    + `?amount=${amount}`
    + `&addInfo=${encodeURIComponent(contentCK)}`
    + `&accountName=${encodeURIComponent(SITE.bank_owner)}`;

  document.getElementById('modal-box').innerHTML = `
    <button class="modal-close" onclick="closeModal()">✕</button>

    <div style="display:flex;gap:24px;align-items:stretch;flex-wrap:wrap">

      <!-- BÊN TRÁI: QR -->
      <div style="flex:0 0 240px;display:flex;flex-direction:column;align-items:center">
        <div style="font-size:.7rem;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px">Quét để thanh toán</div>
        <img src="${qrUrl}" alt="VietQR"
          style="width:240px;border-radius:14px;border:2px solid rgba(124,109,250,.3);background:#fff;display:block"
          onerror="this.outerHTML='<div style=\\'width:240px;height:300px;border-radius:14px;border:2px dashed #333;display:flex;align-items:center;justify-content:center;color:#666;font-size:.85rem;text-align:center\\'>QR không tải được<br>Dùng thông tin bên phải</div>'">
        <div style="font-size:.72rem;color:var(--muted);margin-top:8px;text-align:center;line-height:1.5">
          Mở app ngân hàng, quét mã —<br><strong style="color:var(--text)">tự động điền số tiền & mã giao dịch</strong>
        </div>
        <div style="margin-top:10px;text-align:center;line-height:1.8">
          <div style="font-size:.72rem;color:rgba(255,255,255,.35);font-weight:600;letter-spacing:.5px">NGUYỄN QUỐC TUẤN</div>
          <div style="font-size:.62rem;color:rgba(255,255,255,.18);letter-spacing:1.5px;text-transform:uppercase">⚡ YAKO_BIZ</div>
        </div>
      </div>

      <!-- BÊN PHẢI: Thông tin -->
      <div style="flex:1;min-width:220px;display:flex;flex-direction:column;gap:14px">

        <!-- Tiêu đề -->
        <div>
          <div style="font-size:1.1rem;font-weight:800;margin-bottom:2px">Thanh toán đơn hàng</div>
          <div style="font-size:.78rem;color:var(--muted)">
            Key gửi về <strong style="color:var(--accent)">${email}</strong>
          </div>
        </div>

        <!-- Chi tiết -->
        <div style="background:rgba(255,255,255,.03);border:1px solid var(--border);border-radius:12px;padding:14px;display:grid;grid-template-columns:auto 1fr;gap:6px 12px;font-size:.84rem;align-items:center">
          <span style="color:var(--muted)">Ngân hàng</span>
          <span style="font-weight:700;text-align:right">${SITE.bank_name}</span>
          <span style="color:var(--muted)">Số TK</span>
          <span style="font-weight:700;color:var(--accent);text-align:right;font-family:monospace;letter-spacing:.5px">${SITE.bank_number}</span>
          <span style="color:var(--muted)">Chủ TK</span>
          <span style="font-weight:700;text-align:right">${SITE.bank_owner}</span>

          <div style="grid-column:1/-1;border-top:1px solid var(--border);margin:4px 0"></div>

          <span style="color:var(--muted)">Sản phẩm</span>
          <span style="font-weight:600;text-align:right">${productName} · ${plan.name}</span>
          <span style="color:var(--muted)">Số tiền</span>
          <span style="font-weight:900;color:#00e676;font-size:1.15rem;text-align:right">${amount.toLocaleString('vi-VN')}₫</span>
        </div>

        <!-- Nội dung CK -->
        <div>
          <div style="font-size:.72rem;color:var(--muted);margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;font-weight:600">Nội dung chuyển khoản</div>
          <div class="pay-content-box" onclick="copyText(this)" style="font-size:.88rem;cursor:pointer">${contentCK}</div>
        </div>

        <!-- Auto confirm message -->
        <div style="background:rgba(0,230,118,.06);border:1px solid rgba(0,230,118,.15);border-radius:10px;padding:10px 12px;font-size:.78rem;color:var(--muted);line-height:1.6">
          🤖 Hệ thống tự động xác nhận sau khi CK — Key sẽ hiện ngay trên màn hình này!
        </div>

        <!-- Dem nguoc 10 phut -->
        <div id="order-countdown" style="background:rgba(255,180,0,.08);border:1px solid rgba(255,180,0,.25);border-radius:10px;padding:10px 12px;font-size:.78rem;line-height:1.6;text-align:center">
          ⏳ Hoàn thành đơn trong: <strong id="countdown-timer" style="color:#fbbf24;font-size:1rem">10:00</strong>
          <div style="color:rgba(255,255,255,.4);font-size:.7rem;margin-top:2px">Quá thời hạn đơn sẽ hết hiệu lực, shop không bảo hành</div>
        </div>
      </div>
    </div>
  `;

  // Dem nguoc 10 phut
  let _sec = 600;
  const _cd = setInterval(() => {
    _sec--;
    const el = document.getElementById('countdown-timer');
    if (!el) { clearInterval(_cd); return; }
    if (_sec <= 0) {
      clearInterval(_cd);
      const box = document.getElementById('order-countdown');
      if (box) box.innerHTML = '<span style="color:#ff4d4d;font-weight:700">❌ Đơn đã hết hiệu lực — Vui lòng đặt lại</span>';
      return;
    }
    const m = String(Math.floor(_sec/60)).padStart(2,'0');
    const s = String(_sec%60).padStart(2,'0');
    el.textContent = `${m}:${s}`;
    if (_sec <= 60) el.style.color = '#ff4d4d';
  }, 1000);


  // Map product ID (web) -> product ID (server license)
  const PRODUCT_MAP = { 'macropilot': 'macropilot', 'tiktok-auto-upload': 'tiktok_upload' };
  const serverProduct = PRODUCT_MAP[productId] || productId.replace(/-/g, '_');

  // Luu don hang len server de xu ly tu dong khi CK den
  fetch('https://macropilot-license.onrender.com/api/pending-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content_ck: contentCK,
      email: email,
      amount: amount,
      months: plan.months || 1,
      note: email.split('@')[0],
      plan_name: plan.name,
      product: serverProduct,
    })
  }).catch(() => {});

  // Polling kiem tra trang thai don moi 5 giay
  const _ckEncoded = encodeURIComponent(contentCK);
  let _pollCount = 0;
  const _poll = setInterval(() => {
    _pollCount++;
    if (_pollCount > 120) { clearInterval(_poll); return; } // dung sau 10 phut
    fetch(`https://macropilot-license.onrender.com/api/order-status?ck=${_ckEncoded}`)
      .then(r => r.json())
      .then(data => {
        if (data.status === 'done') {
          clearInterval(_poll);
          clearInterval(_cd);
          const box = document.getElementById('modal-box');
          const licenseKey = data.key || '';
          const expires = data.expires || '';
          if (box) box.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✕</button>
            <div style="text-align:center;padding:32px 20px">
              <div style="font-size:3rem;margin-bottom:12px">✅</div>
              <div style="font-size:1.3rem;font-weight:800;color:#00e676;margin-bottom:16px">Thanh toán thành công!</div>
              ${licenseKey ? `
              <div style="margin-bottom:16px">
                <div style="font-size:.8rem;color:var(--muted);margin-bottom:6px">KEY KÍCH HOẠT CỦA BẠN</div>
                <div onclick="navigator.clipboard.writeText('${licenseKey}')" style="background:#0d1f0d;border:2px solid #00e676;border-radius:10px;padding:14px 18px;font-family:monospace;font-size:1.1rem;font-weight:800;color:#00e676;cursor:pointer;letter-spacing:2px" title="Nhấn để copy">${licenseKey}</div>
                <div style="font-size:.75rem;color:var(--muted);margin-top:4px">👆 Nhấn để copy key</div>
              </div>
              <div style="font-size:.8rem;color:var(--muted);margin-bottom:16px">Hết hạn: <strong style="color:#fff">${expires}</strong> &nbsp;|&nbsp; Biên lai gửi về <strong style="color:var(--accent)">${email}</strong></div>
              ` : `<div style="font-size:.9rem;color:var(--muted);margin-bottom:16px">Biên lai đã gửi về <strong style="color:var(--accent)">${email}</strong></div>`}
              <div style="font-size:.8rem;color:var(--muted)">Hỗ trợ: <strong>Zalo 0961429053</strong></div>
            </div>`;
        } else if (data.status === 'wrong_amount') {
          clearInterval(_poll);
          clearInterval(_cd);
          const box = document.getElementById('modal-box');
          const sent = (data.sent || 0).toLocaleString('vi-VN');
          const required = (data.required || 0).toLocaleString('vi-VN');
          if (box) box.innerHTML = `
            <button class="modal-close" onclick="closeModal()">✕</button>
            <div style="text-align:center;padding:32px 20px">
              <div style="font-size:3rem;margin-bottom:12px">⚠️</div>
              <div style="font-size:1.2rem;font-weight:800;color:#ff4d4d;margin-bottom:12px">Số tiền không đúng!</div>
              <div style="font-size:.9rem;color:var(--muted);line-height:1.8;margin-bottom:20px">
                Bạn đã chuyển <strong style="color:#ff4d4d">${sent}đ</strong><br>
                Yêu cầu <strong style="color:#00e676">${required}đ</strong><br><br>
                Vui lòng liên hệ hỗ trợ để giải quyết.
              </div>
              <a href="${SITE.zalo_url}" target="_blank" style="display:inline-block;background:var(--accent);color:#fff;font-weight:700;padding:10px 24px;border-radius:8px;text-decoration:none">📞 Liên hệ Zalo ${SITE.zalo}</a>
            </div>`;
        }
      }).catch(() => {});

  }, 5000);
}

function copyText(el) {
  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    const orig = el.style.borderColor;
    el.style.borderColor = 'var(--green)';
    el.style.color = 'var(--green)';
    showToast('Đã copy nội dung CK!', 'success');
    setTimeout(() => { el.style.borderColor = orig; el.style.color = ''; }, 1200);
  });
}

// ── Contact section ────────────────────────────────────────────
function renderContact() {
  const box = document.getElementById('contact-box');
  if (!box) return;

  const contacts = [
    {
      icon: '💬',
      title: 'Zalo',
      sub: 'Tư vấn & hỗ trợ kỹ thuật — Phản hồi trong 5–30 phút',
      link: SITE.zalo_url,
      linkText: SITE.zalo,
    },
    {
      icon: '📘',
      title: 'Facebook',
      sub: 'Theo dõi để nhận tin tức & cập nhật mới nhất',
      link: SITE.facebook,
      linkText: 'facebook.com/yakogame52',
    },
    {
      icon: '✈️',
      title: 'Telegram',
      sub: 'Kênh thông báo & hỗ trợ nhanh',
      link: SITE.telegram_url,
      linkText: SITE.telegram,
    },
    {
      icon: '📞',
      title: 'Số điện thoại',
      sub: 'Gọi hoặc nhắn tin trực tiếp',
      link: `tel:${SITE.phone}`,
      linkText: SITE.phone,
    },
  ];

  box.innerHTML = contacts.map(c => `
    <div class="contact-card">
      <div class="contact-icon">${c.icon}</div>
      <div>
        <h3>${c.title}</h3>
        <p>${c.sub}</p>
        <a href="${c.link}" target="_blank" rel="noopener">${c.linkText}</a>
      </div>
    </div>
  `).join('');
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  const colors = { error: '#ff4757', success: '#00e676', info: '#7c6dfa' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `background:${colors[type]}18;border:1px solid ${colors[type]}44;color:${colors[type]}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// ── Mobile menu ────────────────────────────────────────────────
function toggleMobileMenu() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

// ── Nav scroll effect ──────────────────────────────────────────
window.addEventListener('scroll', () => {
  const nav = document.getElementById('nav');
  nav.style.background = window.scrollY > 40
    ? 'rgba(8,9,26,.97)'
    : 'rgba(8,9,26,.85)';
});

// ── Scroll reveal ─────────────────────────────────────────────
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 70);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal:not(.visible)').forEach(el => io.observe(el));
}

// ── Keyboard ESC close modal ───────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
  }
});

// ── Smooth nav links ───────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderProducts('all');
  renderContact();

  // Reveal why cards
  document.querySelectorAll('.why-card').forEach(el => el.classList.add('reveal'));
  setTimeout(observeReveal, 100);
});
