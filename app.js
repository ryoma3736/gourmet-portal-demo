/* buzz テンプレ共通 JS v2 — 依存なし vanilla。
 * ヒーロー(text-clipワード crossfade)・固定ヘッダー黒転換・横カルーセル矢印・トップ戻る・検索/現在地。 */
(function () {
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 固定ヘッダー: ヒーローを抜けたら黒半透明へ */
  var hdr = document.querySelector('.hdr');
  function onScroll() {
    if (hdr) hdr.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.5);
    var top = document.querySelector('.totop');
    if (top) top.classList.toggle('show', window.scrollY > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ヒーロー: text-clip ワードを順番にクロスフェード */
  var words = [].slice.call(document.querySelectorAll('.hero__word'));
  if (words.length > 1 && !reduce) {
    var hi = 0;
    setInterval(function () {
      words[hi].classList.remove('is-active');
      hi = (hi + 1) % words.length;
      words[hi].classList.add('is-active');
    }, 4000);
  }

  /* 横カルーセル矢印 */
  [].slice.call(document.querySelectorAll('.rail')).forEach(function (rail) {
    var track = rail.querySelector('.rail__track');
    var prev = rail.querySelector('.rail__nav.prev');
    var next = rail.querySelector('.rail__nav.next');
    if (!track) return;
    function step() { return Math.max(track.clientWidth * 0.8, 240); }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    function sync() {
      if (prev) prev.hidden = track.scrollLeft < 8;
      if (next) next.hidden = track.scrollLeft + track.clientWidth > track.scrollWidth - 8;
    }
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  /* トップ戻る */
  var totop = document.querySelector('.totop');
  if (totop) totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* 検索 / 現在地 (デモ: トースト) */
  function toast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:rgba(0,0,0,.86);color:#fff;padding:11px 20px;border-radius:999px;z-index:999;font-weight:700;font-size:14px;max-width:90vw;text-align:center;';
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2000);
  }
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-act]');
    if (!el) return;
    var act = el.getAttribute('data-act');
    if (act === 'search') { e.preventDefault(); toast('検索（デモ）: キーワード・エリア・ジャンル・気分で探せます'); }
    if (act === 'locate') { e.preventDefault(); toast('現在地から近くのお店を検索（デモ）'); }
  });
})();
