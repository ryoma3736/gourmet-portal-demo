/* ============================================================
   GOURMET PORTAL — お気に入り（会員lite / localStorage）
   全ページ共有。店舗のスナップショットを保存し、favorites.html で再描画。
   公開API: window.GPFav { all, has, count, toggle, remove, reflect }
   イベント: 'gpfav:change'（バッジ [data-fav-badge] / 保存ボタン [data-fav-id] を自動更新）
   ============================================================ */
(function(){
  const KEY = 'gp_favorites';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(e){ return []; } };
  const write = (a) => { localStorage.setItem(KEY, JSON.stringify(a)); emit(); };
  const emit = () => document.dispatchEvent(new CustomEvent('gpfav:change', { detail:{ count: read().length } }));

  const GPFav = {
    all: read,
    has: (id) => read().some(s => s.id === id),
    count: () => read().length,
    toggle: (shop) => {                 // shop = {id,name,genre,area,station,rating,reviews,kw,lock,blabel}
      const a = read(); const i = a.findIndex(s => s.id === shop.id);
      if (i >= 0) a.splice(i, 1); else a.push(shop);
      write(a); return i < 0;           // true = 追加された
    },
    remove: (id) => write(read().filter(s => s.id !== id)),
    reflect: (root) => (root || document).querySelectorAll('[data-fav-id]').forEach(btn =>
      btn.classList.toggle('saved', GPFav.has(btn.dataset.favId))),
  };
  window.GPFav = GPFav;

  function paintBadges(){
    const n = read().length;
    document.querySelectorAll('[data-fav-badge]').forEach(el => { el.textContent = n; el.hidden = n === 0; });
  }
  document.addEventListener('gpfav:change', () => { paintBadges(); GPFav.reflect(); });
  document.addEventListener('DOMContentLoaded', () => { paintBadges(); GPFav.reflect(); });

  /* slug: 日本語店名でも安定したID（保存ボタンが id を持たない場合のフォールバック用） */
  window.GPFav.slug = (name) => 'shop-' + encodeURIComponent(name).replace(/%/g,'').slice(0,40);
})();
