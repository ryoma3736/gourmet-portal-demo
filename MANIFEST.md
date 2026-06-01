# GOURMET PORTAL — 明るい「食欲設計」本命（完全オリジナル / クリーンルーム）

ダーク版(FILMEAT)の自己批評「ダーク×グルメは間違った美学／中身が空のファサード」を受けて構築した、
**食欲喚起・予約コンバージョン優先**の明るい本命。Epic: GitHub #4 / 作業ブランチ: `feat/4-gourmet-100-buildout`。

## 設計意図（辛口批評の処方）
飲食ポータル本来の仕事＝「料理を旨そうに見せ、予約/来店に繋げる」。暗いシネマ版の**真逆**に振った:
暖クリーム地・トマト赤CTA・appetizing写真グレード（明るく彩度UP）・親しみと信頼。

## ガードレール（実測確認）
- クリーンルーム: 参考サイトのアセット/コピー/ロゴ/実店名/実動画ID/見出し画像を複製しない（grep 実害0）
- フォント: Shippori Mincho / Schibsted Grotesk / Zen Kaku Gothic New（Arial/Roboto/Inter 不使用）
- 配色: 全ペア WCAG AA 実測（本文14.15 / muted5.94 / CTA白5.32 / 赤文字6.05 / 営業中緑4.82）
- 写真: Unsplash(License)/LoremFlickr(CC)、データ=架空、ブランド独自

## ページ構成（"面"として回遊）
| ファイル | 役割 | 状態 |
|---|---|---|
| `index.html` | TOP（食欲設計・ヒーロー/ジャンル/ランキング/注目/気分/エリア/IG/CTA・**保存ボタン動作**） | ✅ |
| `list.html` | **検索結果/一覧**（絞込フィルタ**動作**：kw/エリア/ジャンル/予算/評価/営業中＋並び替え＋空状態＋もっと見る＋**保存**） | ✅ |
| `store.html` | **店舗詳細**（ギャラリー/メニュー/写真/クチコミ/情報/地図/**多段予約モーダル**/**お気に入り**/関連店） | ✅ |
| `favorites.html` | **お気に入り一覧**（localStorage・削除・空状態） | ✅ |
| `favorites.js` | お気に入り共有モジュール（localStorage・バッジ・状態反映） | ✅ |

**回遊ループ**：TOP（ジャンル/検索/CTA/保存）→ `list.html`（絞込/保存）→ `store.html`（詳細・**多段予約完了**・保存）→ `favorites.html` → … 
URLクエリ着地：`list.html?genre=寿司` / `?area=関東` / `?kw=...` / `?sort=rating`。

## P3 機能（予約フロー & 会員lite & 状態網羅）
- **多段予約モーダル**（store）: 入力（日時/時間/席種/人数/名前/電話）→ **バリデーション**（必須/過去日/電話形式）→ 確認 → 完了（予約番号 `GP-YYYYMMDD-XXXX`）。ステップインジケータ・Esc/外側クリックで閉じる・focus制御。
- **お気に入り**（全ページ）: 保存マークのトグル＋フッターバッジ＋`favorites.html`一覧＋削除。**localStorageでリロード永続**。index/list/store で id 共有。
- **状態網羅**: フォームエラーUI・検索0件・お気に入り空状態・画像onerrorフォールバック。

## 検証ログ（機械検証 / impl+verify）
- 絞込ロジック: 全22 → 寿司2 / ラーメン2 / 関東7 / ★4.7+ 10 / ¥10,000+ 2 / 営業中18 / 複合「寿司×関東」1 / 無関係kw→空状態表示 / クリア→22復帰（CDP実測 PASS）
- クリーンルーム/禁止font/実名サービス grep: index/list/store すべて実害0
- WCAG AA: 食欲パレット全ペア実測合格
- レンダリング: TOP全景 / store全景 / list（絞込・グリッド）確認

## 採点（私=親の検証ベース・辛口）
- 製品として: ファサード期 ~30 → P2で~78 → **P3で約86**（多段予約完了＋会員lite＋状態網羅）。
- 残（100への差）: 写真・SEO体系/JSON-LD(P4) / 品質監査Lighthouse95+(P5) / デプロイ=本番URL(P6) / 実撮影写真・実API（環境外＝差替点）。

## P4 機能（写真・SEO・コンテンツ体系）
- **構造化データ(JSON-LD)**: index=WebSite+SearchAction / list=CollectionPage / store=Restaurant+AggregateRating+OpeningHoursSpecification（全て JSON.parse 妥当・架空値）。
- **SEO/メタ**: OGP/Twitter card（content各ページ og=6）・canonical・`favicon.svg`（自作炎マーク）・`manifest.json`・`robots.txt`・`sitemap.xml`。favorites は noindex。
- **perf**: CLS0(全img寸法)・lazy・preconnect・hero fetchpriority・font display=swap（既達）。
- 残: Wave 4.4 複数店舗の詳細 data-driven 化（実データ差替点）。

## 検証ログ（P3・CDP機械検証）
- 多段予約: 開く→空名前/不正電話/過去日でエラー表示（step0留まる）→正入力で確認→完了（予約番号生成）=全PASS
- お気に入り: list/index/store で保存→バッジ更新→localStorage永続→favorites.html反映→削除→空状態=全PASS
- クリーンルーム: 全ファイル実害0（pretty誤検出のみ）・禁止font 0・許可3フォントのみ

## 本番移行（差替点）
ホットリンク画像→許諾済み写真／自社撮影、架空データ→実データ、予約フォーム→実予約API、JSON-LD/OGP付与。
