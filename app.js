/* buzz テンプレ共通 JS — 依存なし vanilla。
 * ヒーロー自動再生/ドット/矢印・固定ヘッダーの黒転換・横カルーセル矢印・トップ戻る・検索/現在地。 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- 固定ヘッダー: ヒーローを抜けたら黒半透明へ ---- */
  var hdr = document.querySelector('.hdr');
  function onScroll() {
    if (!hdr) return;
    var threshold = (window.innerHeight * 0.5);
    hdr.classList.toggle('scrolled', window.scrollY > threshold);
    var top = document.querySelector('.totop');
    if (top) top.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- ヒーロースライドショー ---- */
  var hero = document.querySelector('.hero');
  if (hero) {
    var slides = [].slice.call(hero.querySelectorAll('.hero__slide'));
    var dots = [].slice.call(hero.querySelectorAll('.hero__dots button'));
    var cur = 0, timer = null;
    function show(n) {
      cur = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('is-active', i === cur); });
      dots.forEach(function (d, i) { d.setAttribute('aria-current', i === cur ? 'true' : 'false'); });
      // re-trigger ken burns
      if (!reduce) {
        var img = slides[cur].querySelector('img');
        if (img) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
      }
    }
    function next() { show(cur + 1); }
    function start() { if (reduce) return; stop(); timer = setInterval(next, 5000); }
    function stop() { if (timer) clearInterval(timer); }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); start(); }); });
    var pv = hero.querySelector('.hero__arrow.prev'), nx = hero.querySelector('.hero__arrow.next');
    if (pv) pv.addEventListener('click', function () { show(cur - 1); start(); });
    if (nx) nx.addEventListener('click', function () { show(cur + 1); start(); });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0); start();
  }

  /* ---- 横カルーセル矢印 ---- */
  [].slice.call(document.querySelectorAll('.rail')).forEach(function (rail) {
    var track = rail.querySelector('.rail__track');
    var prev = rail.querySelector('.rail__nav.prev');
    var nextBtn = rail.querySelector('.rail__nav.next');
    if (!track) return;
    function step() { return Math.max(track.clientWidth * 0.8, 240); }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (nextBtn) nextBtn.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    function sync() {
      if (prev) prev.hidden = track.scrollLeft < 8;
      if (nextBtn) nextBtn.hidden = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    }
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  /* ---- トップ戻る ---- */
  var totop = document.querySelector('.totop');
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---- 検索 / 現在地 (デモ: トースト) ---- */
  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:rgba(0,0,0,.86);color:#fff;padding:11px 20px;border-radius:999px;z-index:999;font-weight:700;font-size:14px;';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 1900);
  }
  var sb = document.querySelector('[data-act="search"]');
  if (sb) sb.addEventListener('click', function () { toast('検索（デモ）: エリア・ジャンル・気分から探せます'); });
  var lb = document.querySelector('[data-act="locate"]');
  if (lb) lb.addEventListener('click', function () { toast('現在地から近くのお店を検索（デモ）'); });
})();
