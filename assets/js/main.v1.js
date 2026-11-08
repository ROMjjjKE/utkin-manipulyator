/* ИП Уткин А.С. — манипулятор 8 т */
(function () {
  'use strict';
  var WA = 'https://wa.me/375291082275';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    initHeader(); initDrawer(); initReveal(); initParallax(); initPlan(); initForm();
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  });

  function initHeader() {
    var hd = document.getElementById('hd'); if (!hd) return;
    function upd() { hd.classList.toggle('is-stuck', window.scrollY > 30); }
    upd(); window.addEventListener('scroll', upd, { passive: true });
  }

  function initDrawer() {
    var b = document.getElementById('burger'), d = document.getElementById('drawer');
    if (!b || !d) return;
    var last = null;
    function open() {
      last = document.activeElement; d.hidden = false;
      b.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked');
      var x = document.getElementById('drawer-x'); if (x) x.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    var x = document.getElementById('drawer-x'); if (x) x.addEventListener('click', close);
    d.addEventListener('click', function (e) {
      if (e.target.closest('a')) { close(); return; }
      if (!e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (d.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var it = d.querySelectorAll('a, button'); if (!it.length) return;
      var f = it[0], l = it[it.length - 1];
      if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020 && !d.hidden) close(); });
  }

  /* появление блоков: класс ставим из JS, проверяем по прокрутке — работает и при резких переходах */
  function initReveal() {
    var els = [].slice.call(document.querySelectorAll('.sec__head, .cgo__r, .stp, .cat, .gi, .limits__grid > div, .tech__list li, .zone__tags span, .qa, .about2__t'));
    if (!els.length) return;
    if (reduced) return;
    els.forEach(function (el) { el.classList.add('rv'); });
    var raf = false;
    function check() {
      raf = false;
      var line = window.innerHeight * 0.94;
      els = els.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < line) { el.classList.add('is-in'); return false; }
        return true;
      });
      if (!els.length) window.removeEventListener('scroll', onScroll);
    }
    function onScroll() { if (!raf) { raf = true; requestAnimationFrame(check); } }
    check();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  function initParallax() {
    var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || reduced) return;
    var raf = false;
    function upd() {
      raf = false;
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -150 || r.top > vh + 150) return;
        var sp = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        el.style.transform = 'translate3d(0,' + (-(r.top + r.height / 2 - vh / 2) * sp).toFixed(2) + 'px,0)';
      });
    }
    function onScroll() { if (!raf) { raf = true; requestAnimationFrame(upd); } }
    upd(); window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('resize', onScroll);
  }

  /* план кузова: считаем, как груз ляжет в 6,5 × 2,5 м */
  function initPlan() {
    var svg = document.getElementById('bodyPlan'); if (!svg) return;
    var CARGO = [
      { id: 'blocks', w: 2.38, h: 0.60, shape: 'rect', desc: 'Фундаментные блоки и перегородочные. Грузим и ставим манипулятором в траншею, без крана и такелажников.' },
      { id: 'rings', w: 1.50, h: 1.50, shape: 'circle', desc: 'Колодезные кольца КС. Захват стропами, аккуратная выгрузка в котлован или на площадку.' },
      { id: 'brick', w: 1.20, h: 0.80, shape: 'rect', desc: 'Поддоны с кирпичом и газоблоком. Подаём на поддоне прямо к месту кладки.' },
      { id: 'tile', w: 1.20, h: 0.80, shape: 'rect', desc: 'Тротуарная плитка, бордюр, брусчатка на поддонах. Разгружаем без боя, поддон за поддоном.' },
      { id: 'lumber', w: 6.00, h: 1.20, shape: 'rect', desc: 'Доска, брус, обрезной пакет до 6 м. Пакет ложится на кузов целиком.' }
    ];
    var L = 6.5, W = 2.5, S = 100, X0 = 25, Y0 = 25;
    var units = document.getElementById('planUnits');
    var dims = document.getElementById('planDims');
    var cnt = document.getElementById('loadCount'), fill = document.getElementById('loadFill');
    var descEl = document.getElementById('loadDesc'), unitEl = document.getElementById('specUnit'), cntEl = document.getElementById('specCount');
    var cur = CARGO[0];

    dims.innerHTML = '<path d="M25 288 H675" stroke="#14161A" stroke-width="1"/>' +
      '<path d="M25 282 v12 M675 282 v12" stroke="#14161A" stroke-width="1"/>' +
      '<text x="350" y="299" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="11" fill="#4C4E54">6,5 м</text>' +
      '<path d="M12 25 V275" stroke="#14161A" stroke-width="1"/>' +
      '<text x="8" y="150" text-anchor="middle" transform="rotate(-90 8 150)" font-family="JetBrains Mono, monospace" font-size="11" fill="#4C4E54">2,5 м</text>';

    function best(a, b) {
      var o1 = { a: a, b: b }, o2 = { a: b, b: a };
      function pack(o) {
        var cols = Math.floor(L / o.a + 1e-9), rows = Math.floor(W / o.b + 1e-9);
        return { cols: cols, rows: rows, n: cols * rows, a: o.a, b: o.b };
      }
      var p1 = pack(o1), p2 = pack(o2);
      if (p2.n > p1.n) return p2;
      return p1;
    }

    function fmt(v) { return v.toFixed(2).replace('.', ',').replace(',00', ''); }

    function render(c) {
      cur = c;
      units.innerHTML = '';
      var p, n, area;
      if (c.shape === 'circle') {
        var d = c.w, cols = Math.floor(L / d + 1e-9), rows = Math.floor(W / d + 1e-9);
        n = cols * rows; area = Math.PI * Math.pow(d / 2, 2);
        for (var r = 0; r < rows; r++) for (var k = 0; k < cols; k++) {
          var cx = X0 + (k + 0.5) * d * S, cy = Y0 + (r + 0.5) * d * S;
          var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          el.setAttribute('cx', cx); el.setAttribute('cy', cy); el.setAttribute('r', d * S / 2 - 4);
          el.setAttribute('fill', 'rgba(242,195,0,.34)'); el.setAttribute('stroke', '#14161A'); el.setAttribute('stroke-width', '1.5');
          el.setAttribute('class', 'unit'); el.style.animationDelay = ((r * cols + k) * 35) + 'ms';
          units.appendChild(el);
        }
        unitEl.textContent = 'Ø ' + fmt(d) + ' м';
      } else {
        p = best(c.w, c.h);
        n = p.n; area = p.a * p.b;
        for (var row = 0; row < p.rows; row++) for (var col = 0; col < p.cols; col++) {
          var rc = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rc.setAttribute('x', X0 + col * p.a * S + 3); rc.setAttribute('y', Y0 + row * p.b * S + 3);
          rc.setAttribute('width', p.a * S - 6); rc.setAttribute('height', p.b * S - 6);
          rc.setAttribute('fill', 'rgba(242,195,0,.34)'); rc.setAttribute('stroke', '#14161A'); rc.setAttribute('stroke-width', '1.5');
          rc.setAttribute('class', 'unit'); rc.style.animationDelay = ((row * p.cols + col) * 35) + 'ms';
          units.appendChild(rc);
        }
        unitEl.textContent = fmt(c.w) + ' × ' + fmt(c.h) + ' м' + (p.a !== c.w ? ' · поперёк кузова' : '');
      }
      cnt.textContent = n;
      cntEl.textContent = n + ' шт за рейс';
      fill.textContent = 'заполнение ' + Math.round(n * area / (L * W) * 100) + '% площади кузова';
      descEl.textContent = c.desc;
    }

    document.querySelectorAll('.cg').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-c');
        document.querySelectorAll('.cg').forEach(function (o) {
          var on = o === btn; o.classList.toggle('is-on', on); o.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        render(CARGO.filter(function (x) { return x.id === id; })[0]);
      });
    });
    render(CARGO[0]);
  }

  function initForm() {
    var f = document.getElementById('lead-form'); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('f-name'), p = document.getElementById('f-phone'), bad = false;
      [n, p].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#C99E00'; bad = true; } else { el.style.borderColor = ''; }
      });
      var ok = document.getElementById('form-ok'); ok.classList.add('is-on');
      if (bad) { ok.textContent = 'Заполните имя и телефон, иначе мы не сможем ответить.'; return; }
      var text = ['Заявка с сайта: услуги манипулятора', 'Имя: ' + n.value.trim(), 'Телефон: ' + p.value.trim(),
        'Груз: ' + document.getElementById('f-what').value,
        'Адреса и вес: ' + (document.getElementById('f-note').value.trim() || 'не указано')].join('\n');
      ok.textContent = 'Заявка собрана. Открываем WhatsApp — останется нажать «Отправить».';
      window.open(WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      f.reset();
    });
  }
})();
