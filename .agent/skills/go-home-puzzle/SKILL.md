---
name: go-home-puzzle
description: 「だ〜れだ？パズルラリー」アプリの開発・画像生成・デプロイに関するスキル
---

# 「だ〜れだ？」パズルラリー - 開発スキル

## アプリ概要

保育園から帰りたくなる仕掛けアプリ。シルエットで隠された画像を3ステップ（くつ → いどう → おうち）で段階的に公開し、「正解を見たい！」という好奇心で帰宅を動機づける。

**対象ユーザー:** 3歳児とその保護者
**本番URL:** `https://tsubasa-narita.github.io/go-home-puzzle/`

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Vite + Vanilla JS/CSS |
| ホスティング | GitHub Pages (`/go-home-puzzle/`) |
| CI/CD | GitHub Actions (push to main → 自動デプロイ) |
| PWA | Service Worker + manifest.json |
| フォント | Zen Maru Gothic (Google Fonts) |
| データ保存 | localStorage |

---

## ローカル開発

```powershell
cd c:\develop\go-home-puzzle
npm install   # 初回のみ
npm run dev   # http://localhost:5173/go-home-puzzle/ で起動
```

> [!IMPORTANT]
> `vite.config.js` に `base: '/go-home-puzzle/'` が設定されているため、ローカルでも `/go-home-puzzle/` パスでアクセスする。

---

## デプロイ手順

`main` ブランチに push すると GitHub Actions が自動でビルド・デプロイする。

```powershell
git add .
git commit -m "コミットメッセージ"
git push origin main
```

デプロイ完了まで約1〜2分かかる。

---

## プロジェクト構成

```
go-home-puzzle/
├── index.html              # メインHTML（Viteエントリポイント）
├── vite.config.js          # Vite設定 (base: '/go-home-puzzle/')
├── package.json
├── public/
│   ├── images/
│   │   ├── komachi.png     # パズル画像: こまち（新幹線）
│   │   ├── hayabusa.png    # パズル画像: はやぶさ（新幹線）
│   │   ├── firetruck.png   # パズル画像: しょうぼうしゃ
│   │   ├── panda.png       # パズル画像: パンダ
│   │   ├── rabbit.png      # パズル画像: うさぎ
│   │   ├── lion.png        # パズル画像: ライオン
│   │   ├── icon-shoes.png  # ステップアイコン: くつ（N'EX風）
│   │   ├── icon-walking.png # ステップアイコン: いどう（ママと男の子）
│   │   └── icon-apartment.png # ステップアイコン: おうち（タワマン）
│   ├── manifest.json       # PWAマニフェスト
│   ├── sw.js               # Service Worker
│   └── vite.svg            # ファビコン
├── src/
│   ├── main.js             # メインロジック（状態管理・UI更新・イベント）
│   ├── puzzleData.js       # パズルデータ管理（★ 画像追加はここ）
│   ├── effects.js          # サウンド・パーティクル演出
│   └── style.css           # 全スタイル
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自動デプロイ
```

---

## ⚠️ パス設定（最重要・ハマりポイント）

GitHub Pages はサブディレクトリ `/go-home-puzzle/` で配信される。パス設定を間違えると404になる。

### JS内のパス(`src/puzzleData.js`)

```javascript
// ✅ 正しい — import.meta.env.BASE_URL を使う
const BASE = import.meta.env.BASE_URL;
image: `${BASE}images/komachi.png`
// 結果: /go-home-puzzle/images/komachi.png

// ❌ 間違い — 絶対パスはルートを指してしまう
image: '/images/komachi.png'
// 結果: /images/komachi.png → 404
```

### HTML内のパス(`index.html`)

```html
<!-- ✅ 正しい — 相対パス（Vite buildが自動でbase処理） -->
<link rel="manifest" href="manifest.json" />
<link rel="icon" href="vite.svg" />
<img src="images/icon-shoes.png" />

<!-- ❌ 間違い — 絶対パスはGitHub Pagesで404 -->
<link rel="manifest" href="/manifest.json" />
```

> [!WARNING]
> `<script type="module" src="/src/main.js">` はViteのエントリポイントなので `/` のまま書いてよい。Viteがbuild時に自動で正しいパスに変換する。ただし他の静的ファイル参照は上記ルールに従う。

### manifest.json のパス

```json
{
  "start_url": "/go-home-puzzle/",
  "icons": [{ "src": "/go-home-puzzle/vite.svg" }]
}
```

> [!CAUTION]
> `manifest.json` の中身はViteが変換しない。`start_url` や `icons.src` は手動で `/go-home-puzzle/` を含める必要がある。

### Service Worker 登録パス (`main.js`)

```javascript
// ✅ 正しい — 相対パス
navigator.serviceWorker.register('./sw.js')

// ❌ 間違い — 絶対パスはGitHub Pagesで404
navigator.serviceWorker.register('/sw.js')
```

---

## PWA / Service Worker の注意事項

### キャッシュバージョン管理

`public/sw.js` の `CACHE_NAME` を更新すると、古いキャッシュが自動削除される。

```javascript
const CACHE_NAME = 'puzzle-rally-v2'; // ← バージョンを上げる
```

変更を反映させるには：
1. `CACHE_NAME` のバージョンを上げる
2. `skipWaiting()` が入っているので、新しいSWは即座にアクティブ化
3. `activate` イベントで古いキャッシュを自動削除

### トラブルシューティング

PWAで問題が起きた場合：
1. ホーム画面からアプリを削除
2. Chromeの「サイトの設定」からキャッシュ・Service Workerを削除
3. 再度ブラウザでアクセスしてホーム画面に追加

---

## 画像生成ガイドライン

### 🎨 パズル画像（メインの隠される画像）

お子様が「正解を知りたい！」と思うような、鮮やかで魅力的なイラストを生成する。

#### 共通プロンプトテンプレート

```
A cute, colorful illustration of [対象物の詳細], [向きやポーズ],
children's book style, simple clean background, vibrant colors,
kawaii style, white background
```

#### プロンプトの原則

| 原則 | 詳細 |
|------|------|
| **スタイル統一** | 必ず `children's book style`, `kawaii style` を含める |
| **背景** | `white background` または `simple clean background` で統一 |
| **色彩** | `vibrant colors`, `colorful` で鮮やかに |
| **構図** | `side view`（乗り物）や `centered composition` で見やすく |
| **テキスト禁止** | 画像内にテキストが入らないよう注意（生成AIが勝手に入れる場合あり） |

#### 実績のあるプロンプト例

**新幹線こまち:**
```
A cute, colorful illustration of a Japanese Shinkansen bullet train
"Komachi" (red/pink color with pointed nose), side view, children's
book style, simple clean background, vibrant colors, kawaii style,
white background
```

**新幹線はやぶさ:**
```
A cute, colorful illustration of a Japanese Shinkansen bullet train
"Hayabusa" (green color with pointed nose), side view, children's
book style, simple clean background, vibrant colors, kawaii style,
white background
```

**消防車:**
```
A cute, colorful illustration of a red Japanese fire truck (消防車),
side view, children's book style, simple clean background, vibrant
colors, kawaii style, white background
```

**パンダ:**
```
A cute, colorful illustration of a giant panda sitting and eating
bamboo, children's book style, simple clean background, vibrant
colors, kawaii style, white background
```

**うさぎ:**
```
A cute, colorful illustration of a fluffy white rabbit with pink ears,
children's book style, simple clean background, vibrant colors,
kawaii style, white background
```

**ライオン:**
```
A cute, colorful illustration of a friendly lion with big mane,
children's book style, simple clean background, vibrant colors,
kawaii style, white background
```

### 🔘 ステップアイコン画像

ボタン内で小さく（48×48px）表示されるため、シンプルで認識しやすいイラストにする。

#### 共通プロンプトテンプレート

```
A cute kawaii illustration of [対象物の詳細], simple children's book
style, white background, no text, icon style, centered composition
```

#### プロンプトの原則

| 原則 | 詳細 |
|------|------|
| **サイズ意識** | 48×48pxで表示されるため、シンプルで判別しやすいモチーフ |
| **テキストなし** | 必ず `no text` を含める |
| **中央配置** | `centered composition` で中心に寄せる |
| **アイコン向け** | `icon style` でアイコンとして適した構図に |

#### 実績のあるプロンプト例

**くつ（成田エクスプレス風）:**
```
A pair of cute toddler shoes designed like the Japanese Narita Express
(N'EX) train - white body with red and black accents, train-inspired
design on children's sneakers. Simple icon style, white background,
no text, kawaii illustration style, centered composition
```

**いどう（ママと歩く男の子）:**
```
A cute kawaii illustration of a Japanese mother holding hands with her
3-year-old son walking together, the boy wearing a yellow hat and
backpack, simple children's book style, white background, no text,
icon style, centered composition
```

**おうち（タワーマンション）:**
```
A cute kawaii illustration of a modern Japanese tall apartment building
(tower mansion), dark grey and glass exterior, with green trees around
the base, simple children's book style, white background, no text,
icon style, centered composition
```

> [!TIP]
> おうちアイコンは実際のマンション写真を `ImagePaths` パラメータで参照画像として渡すと、よりリアルな雰囲気になる。

---

## パズル画像の追加手順

1. `generate_image` ツールで上記テンプレートに沿って画像を生成
2. 生成された画像を `public/images/` にコピー（`Copy-Item` コマンド使用）
3. `src/puzzleData.js` の `PUZZLES` 配列にエントリを追加：

```javascript
{
  id: 'new-puzzle-id',        // 英数字のID（ケバブケースまたはキャメル）
  name: 'にほんご なまえ',      // 子供向けのひらがな名前
  image: `${BASE}images/new-puzzle.png`,
  hints: [
    'ヒント1のテキスト＋絵文字',   // ステップ1（くつ）で表示
    'ヒント2のテキスト＋絵文字',   // ステップ2（いどう）で表示
  ],
},
```

4. コミット & プッシュでデプロイ

> [!IMPORTANT]
> ヒントテキストはひらがな＋絵文字で書く。3歳児が理解できる簡単な表現にすること。
> 日替わりローテーションは `getDate() % PUZZLES.length` で自動計算されるため、追加するだけでローテーションに組み込まれる。

---

## UI設計の原則

| 原則 | 詳細 |
|------|------|
| **ゴール画面** | 完成画像をオーバーレイで隠さない。画像は常に見え、祝福はパーティクル＋メッセージエリアで表示 |
| **ステップ遷移** | ボタンは順番にロック解除。前のステップを完了しないと次へ進めない |
| **ステップアイコン** | 絵文字ではなくカスタム生成画像を使用（48×48px表示） |
| **日替わり** | 毎日 `getDate() % PUZZLES.length` で自動ローテーション |
| **手動切替** | 設定画面から好きな画像に強制変更可能（`localStorage` の `puzzle-override`） |
| **進捗保存** | 日付＋パズルIDで `localStorage` に保存。日付が変わるとリセット |
| **フォント** | Zen Maru Gothic（丸ゴシック）— 子供向けの柔らかい印象 |
| **カラー** | オレンジ系の暖色パレット（`#FF9800` をプライマリ） |

---

## ファイル別の役割まとめ

| ファイル | 役割 | 編集頻度 |
|---------|------|---------|
| `src/puzzleData.js` | パズル画像のリスト管理。画像追加はここだけ | **高**（画像追加時） |
| `src/main.js` | アプリ全体のロジック（状態管理・UI更新・設定画面・画像ピッカー） | 中 |
| `src/effects.js` | サウンド（Web Audio API）・パーティクルアニメーション | 低 |
| `src/style.css` | 全CSS（デザインシステム・レスポンシブ・アニメーション） | 中 |
| `index.html` | メインHTML構造（ステップボタン・設定モーダル） | 低 |
| `public/sw.js` | Service Worker（キャッシュ管理・オフライン対応） | 低 |
| `public/manifest.json` | PWA設定（アプリ名・アイコン・start_url） | 低 |
| `vite.config.js` | Vite設定（`base` パスのみ） | ほぼ変更なし |
