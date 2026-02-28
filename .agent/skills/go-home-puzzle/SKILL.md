---
name: go-home-puzzle
description: 「だ〜れだ？パズルラリー」アプリの開発・画像生成・デプロイに関するスキル
---

# 「だ〜れだ？」パズルラリー - 開発スキル

## アプリ概要

保育園から帰りたくなる仕掛けアプリ。シルエットで隠された画像をカスタマイズ可能なステップで段階的に公開し、「正解を見たい！」という好奇心で帰宅を動機づける。

**対象ユーザー:** 3歳児とその保護者
**本番URL:** `https://tsubasa-narita.github.io/go-home-puzzle/`

---

## 技術スタック

| 項目           | 内容                                         |
| -------------- | -------------------------------------------- |
| フレームワーク | Vite + Vanilla JS/CSS                        |
| ホスティング   | GitHub Pages (`/go-home-puzzle/`)            |
| CI/CD          | GitHub Actions (push to main → 自動デプロイ) |
| PWA            | Service Worker + manifest.json               |
| フォント       | Zen Maru Gothic (Google Fonts)               |
| データ保存     | localStorage                                 |

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
│   │   ├── (他にも多数のパズル画像)
│   │   ├── icon-shoes.png       # ステップアイコン: くつ
│   │   ├── icon-walking.jpg     # ステップアイコン: いどう
│   │   ├── icon-apartment.png   # ステップアイコン: おうち
│   │   ├── icon-bath.jpg        # ステップアイコン: おふろ
│   │   ├── icon-bed.jpg         # ステップアイコン: ねる
│   │   ├── icon-teethblush.jpg  # ステップアイコン: はみがき
│   │   ├── icon-eat.jpg         # ステップアイコン: ごはん
│   │   ├── icon-change-clothes.jpg # ステップアイコン: おきがえ
│   │   ├── icon-diaper.jpg      # ステップアイコン: おむつ
│   │   └── icon-nap.jpg         # ステップアイコン: おひるね
│   ├── manifest.json       # PWAマニフェスト
│   ├── sw.js               # Service Worker
│   └── vite.svg            # ファビコン
├── src/
│   ├── main.js             # メインロジック（状態管理・UI更新・イベント）
│   ├── puzzleData.js       # パズルデータ管理（★ 画像追加はここ）
│   ├── stepRegistry.js     # ステップ定義・計算ユーティリティ（★ ステップ追加はここ）
│   ├── effects.js          # サウンド・パーティクル演出
│   └── style.css           # 全スタイル
└── .github/workflows/
    └── deploy.yml          # GitHub Pages 自動デプロイ
```

---

## 主要機能

### カスタマイズ可能なステップ

- **10種類のステップ**: くつをはく、いどうする、おうち、おふろ、ねる、はみがき、ごはん、おきがえ、おむつ、おひるね
- **選択制**: 最低2個〜最大10個のステップを任意に選択可能
- **並び替え**: 設定画面の▲▼ボタンでステップの順序を自由に変更可能
- **へいじつ/おやすみモード**: 曜日ごとに異なるステップ構成を保存・切替

### ステップバー

- 1〜5個: 1行横並び表示
- 6〜10個: 2行折り返し表示（`steps-bar-wrap` クラスで `flex-wrap: wrap`）
- `max-width: 400px` でパズル画像エリアと幅を統一
- 画像読み込み失敗時はフォールバックで絵文字を表示

### パズル表示モード（3種類）

| モード   | ID        | 動作                         |
| -------- | --------- | ---------------------------- |
| ジグソー | `jigsaw`  | 4x4タイルを段階的にめくる    |
| カーテン | `curtain` | 下から上に画像を段階的に表示 |
| ぼかし   | `blur`    | ブラー強→弱で段階的に鮮明化  |

### タイル開示カーブ

二次関数 `(i+1)² / stepCount²` で、最初は少なく後半に加速して多く開示される。
各ステップで前のステップより最低1タイル多く開くことを保証。

### 設定モーダル

HTML5 `<details>/<summary>` で各セクションを**折りたたみ可能**:
- 🎮 みせかたをかえる（デフォルト閉）
- 📅 へいじつ/おやすみ（デフォルト開）
- ✅ ステップをえらぶ + 🔀 じゅんばんをかえる（デフォルト開）
- 🖼️ えをかえる（デフォルト閉）

### スタンプカード（機能実装済み・UI非表示）

- 完了時にスタンプを自動付与
- 連続日数（ストリーク）計算
- `#stamp-btn`, `#stamp-modal` はCSS `display: none` で非表示

---

## ファイル別の役割まとめ

| ファイル               | 役割                                                                                           | 編集頻度                 |
| ---------------------- | ---------------------------------------------------------------------------------------------- | ------------------------ |
| `src/stepRegistry.js`  | 全ステップの定義（ID, ラベル, アイコン, 絵文字, ゴールメッセージ）、デフォルト構成、開示数計算 | **高**（ステップ追加時） |
| `src/puzzleData.js`    | パズル画像のリスト管理。画像追加はここだけ                                                     | **高**（画像追加時）     |
| `src/main.js`          | アプリ全体のロジック（初期化・状態管理・UI更新・設定画面・ステップピッカー・並び替え）         | 中                       |
| `src/effects.js`       | サウンド（Web Audio API）・パーティクルアニメーション                                          | 低                       |
| `src/style.css`        | 全CSS（デザインシステム・レスポンシブ・アニメーション）                                        | 中                       |
| `index.html`           | メインHTML構造（動的ステップバー・折りたたみ設定モーダル）                                     | 低                       |
| `public/sw.js`         | Service Worker（キャッシュ管理・オフライン対応）                                               | 低                       |
| `public/manifest.json` | PWA設定（アプリ名・アイコン・start_url）                                                       | 低                       |
| `vite.config.js`       | Vite設定（`base` パスのみ）                                                                    | ほぼ変更なし             |

---

## ⚠️ パス設定（最重要・ハマりポイント）

GitHub Pages はサブディレクトリ `/go-home-puzzle/` で配信される。パス設定を間違えると404になる。

### JS内のパス(`src/puzzleData.js`, `src/stepRegistry.js`)

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

## ステップの追加手順

1. `public/images/` にアイコン画像を追加（例: `icon-xxx.jpg`）
2. `src/stepRegistry.js` の `ALL_STEPS` 配列にエントリを追加：

```javascript
{
    id: 'xxx',
    label: 'ステップ名',
    icon: `${BASE}images/icon-xxx.jpg`,
    emoji: '🎯',     // 画像ロード失敗時のフォールバック
    goalMsg: 'できたね！',
},
```

3. 必要に応じて `DEFAULT_WEEKDAY` / `DEFAULT_HOLIDAY` を更新
4. コミット & プッシュでデプロイ

> [!IMPORTANT]
> ステップの最大数は10個。UI上の制約として `main.js` の `buildStepPicker()` でチェックされる。増やす場合はCSS（`.steps-bar-wrap` の列数計算）も調整が必要。

---

## 画像生成ガイドライン

### 🎨 パズル画像（メインの隠される画像）

お子様が「正解を知りたい！」と思うような、鮮やかで魅力的なイラストを生成する。

#### 共通プロンプトテンプレート（基本）

```
A cute, colorful illustration of [対象物の詳細], [向きやポーズ],
children's book style, simple clean background, vibrant colors,
kawaii style, white background
```

#### 電車画像の共通プロンプトテンプレート（高品質版）

電車・新幹線の画像を生成する場合は、以下のテンプレートをそのまま使用して品質を安定させること。

```
水彩画風の＜ここに電車名をいれる＞の画像を作成して。
・電車の窓からはかわいい動物が手を振っています。
・電車自体のデザインは本物に似せてください。
・背景はこの電車が走っているエリアと合うようにして。そのエリア独自の食べ物やキャラクターや場所などがあれば登場させて
・画像の縦横比は１対１
```

#### プロンプトの原則

| 原則             | 詳細                                                               |
| ---------------- | ------------------------------------------------------------------ |
| **スタイル統一** | 必ず `children's book style`, `kawaii style` を含める              |
| **背景**         | `white background` または `simple clean background` で統一         |
| **色彩**         | `vibrant colors`, `colorful` で鮮やかに                            |
| **構図**         | `side view`（乗り物）や `centered composition` で見やすく          |
| **テキスト禁止** | 画像内にテキストが入らないよう注意（生成AIが勝手に入れる場合あり） |

### 🔘 ステップアイコン画像

ボタン内で小さく（48×48px）表示されるため、シンプルで認識しやすいイラストにする。

#### 共通プロンプトテンプレート

```
A cute kawaii illustration of [対象物の詳細], simple children's book
style, white background, no text, icon style, centered composition
```

#### キャラクター一貫性の原則

既存アイコンのキャラクターデザインを必ず踏襲する：

| キャラ       | 特徴                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------- |
| **男の子**   | 黒髪、新幹線柄の青い帽子、新幹線プリントTシャツ（赤×緑の袖）、黄色リュック、ジーンズ、ピンクのほっぺ |
| **ママ**     | 茶色ボブヘア、ベージュセーター、ベージュロングスカート                                               |
| **スタイル** | 温かみのある水彩風、kawaii系イラスト                                                                 |

> [!TIP]
> 新しいアイコン生成時は既存のアイコン画像を `ImagePaths` パラメータで参照画像として渡すと、キャラクターの一貫性が保たれやすい。

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
    'ヒント1のテキスト＋絵文字',   // ステップ1で表示
    'ヒント2のテキスト＋絵文字',   // ステップ2で表示
  ],
},
```

4. コミット & プッシュでデプロイ

> [!IMPORTANT]
> ヒントテキストはひらがな＋絵文字で書く。3歳児が理解できる簡単な表現にすること。
> 日替わりローテーションは `getDate() % PUZZLES.length` で自動計算されるため、追加するだけでローテーションに組み込まれる。
> ヒントの数はステップ数に依存するが、`STEPS` 長 - 1 個のヒントがあればよい。不足分は空文字で補完される。

---

## localStorage キー一覧

| キー                | 用途                                | 値の例                                                                      |
| ------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| `step-config`       | へいじつ/おやすみ別のステップID配列 | `{"weekday":["shoes","move","home","bath","bed"],"holiday":["bath","bed"]}` |
| `day-mode`          | 現在のモード                        | `"weekday"` / `"holiday"`                                                   |
| `reveal-mode`       | パズル表示モード                    | `"jigsaw"` / `"curtain"` / `"blur"`                                         |
| `puzzle-override`   | 手動選択されたパズルID              | `"komachi"`                                                                 |
| `puzzle-progress-*` | 日付+パズルID別の進捗               | `{"step":2,"puzzleId":"komachi","date":"2026-02-21"}`                       |
| `puzzle-stamps`     | スタンプカードデータ                | `[{"date":"2026-02-21","puzzleId":"komachi"}]`                              |

---

## UI設計の原則

| 原則                 | 詳細                                                                                         |
| -------------------- | -------------------------------------------------------------------------------------------- |
| **ゴール画面**       | 完成画像をオーバーレイで隠さない。画像は常に見え、祝福はパーティクル＋メッセージエリアで表示 |
| **ステップ遷移**     | ボタンは順番にロック解除。前のステップを完了しないと次へ進めない                             |
| **ステップアイコン** | カスタム生成画像を使用（48×48px表示）、読み込み失敗時は絵文字フォールバック                  |
| **日替わり**         | 毎日 `getDate() % PUZZLES.length` で自動ローテーション                                       |
| **手動切替**         | 設定画面から好きな画像に強制変更可能（`localStorage` の `puzzle-override`）                  |
| **進捗保存**         | 日付＋パズルIDで `localStorage` に保存。日付が変わるとリセット                               |
| **フォント**         | Zen Maru Gothic（丸ゴシック）— 子供向けの柔らかい印象                                        |
| **カラー**           | オレンジ系の暖色パレット（`#FF9800` をプライマリ）                                           |
| **設定画面**         | `<details>/<summary>` で折りたたみ可能。スクロール量を削減                                   |
| **レイアウト**       | ステップ6個以上は2行折り返し。パズル画像エリアと幅を統一（400px）                            |
