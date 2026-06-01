# グルメポータル（GOURMET PORTAL）— 本番品質フロントエンド

明るい「食欲設計」の飲食店ポータル。**TOP → 検索/絞込 → 店舗詳細 → 多段予約 → お気に入り** まで動く、
依存ゼロ（バニラ + Swiper のみ）の静的フロントエンド一式。完全オリジナル・クリーンルーム。

## ライブ
GitHub Pages: https://ryoma3736.github.io/my-project20260530/

## ページ
| ファイル | 役割 |
|---|---|
| `index.html` | TOP（ヒーロー/ジャンル/ランキング/注目/気分/エリア/IG） |
| `list.html` | 検索結果（絞込：kw/エリア/ジャンル/予算/評価/営業中 + 並び替え。URLクエリ着地対応） |
| `store.html` | 店舗詳細（ギャラリー/メニュー/クチコミ/情報/地図/多段予約モーダル/関連店） |
| `favorites.html` | お気に入り一覧（localStorage） |
| `favorites.js` | お気に入り共有モジュール |
| `style.css` | デザイントークン + 全UI |

## 品質
- **WCAG AA**（全配色ペア実測：本文14.15:1 / CTA白5.32:1 / 営業中緑4.82:1 ほか）
- **CLS 0**（全画像 width/height 指定）・lazy・preconnect・hero fetchpriority・font display=swap
- **構造化データ**：JSON-LD（WebSite+SearchAction / CollectionPage / Restaurant+AggregateRating+OpeningHours）
- **SEO**：OGP/Twitter card・canonical・sitemap.xml・robots.txt・manifest.json・favicon
- **a11y**：skip-link・focus-visible・aria・キーボード操作・prefers-reduced-motion
- フォント：Shippori Mincho / Schibsted Grotesk / Zen Kaku Gothic New（汎用sans/serif不使用の独自選定）

## 本番データ差替点（このフロントに「差し込むだけ」）
現状は静的フロントの完成形。実運用には以下の3点を差し替える（フロントの改修は最小）:

1. **写真** → 現状 Unsplash(License)/LoremFlickr(CC) のホットリンク。
   `*.html` 内の画像URLビルダ（`uURL`/`lURL`）を、許諾済み写真・自社撮影のCDN URL に差し替え。
2. **店舗データ** → 現状 各 `*.html` の `SHOPS` / `MENU` / `REVIEWS` 配列（架空）。
   API/CMS から取得する fetch に置換（DOM描画関数 `cardHTML`/`render` はそのまま再利用可）。
3. **予約 / 会員** → 現状 予約は完了画面まで（架空・送信なし）、お気に入りは localStorage。
   - 予約：`store.html` の予約確定ハンドラ（`toDone`）を実予約APIの POST に接続。
   - 会員：`favorites.js` の localStorage 層を、ログイン連携のサーバ保存に差し替え（公開API `GPFav` は不変）。

## クリーンルーム / 知的財産
- 参考サイトのアセット・コピー・ロゴ・実店名・実動画ID・見出し画像は一切複製していない。
- 店名・メニュー・クチコミ・電話/住所は全て架空。写真はライセンス素材。
- レイアウト構造・寸法・デザイントークン値（機能的事実）のみ参考に、独自の食欲設計で再構築。

## ローカル確認
```bash
cd mock/gourmet-bright && python3 -m http.server 8792
# → http://localhost:8792/
```
