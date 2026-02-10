/**
 * パズルデータ管理
 * 画像の追加・変更はこのファイルだけ編集すればOK！
 */

// ==================================================
// 📝 画像を追加・変更するにはここを編集してください
// ==================================================
// 新しい画像を追加する手順:
// 1. 画像ファイルを public/images/ フォルダに入れる
// 2. 下のリストに { id, name, image, hints } を追加する
// ==================================================

const BASE = import.meta.env.BASE_URL;

export const PUZZLES = [
  {
    id: 'komachi',
    name: 'こまち',
    image: `${BASE}images/komachi.png`,
    hints: [
      'あかい いろが みえるよ！🔴',
      'でんしゃ かな？ しんかんせん かな？🚄',
    ],
  },
  {
    id: 'hayabusa',
    name: 'はやぶさ',
    image: `${BASE}images/hayabusa.png`,
    hints: [
      'みどりいろ！なにかな？💚',
      'しんかんせん だ！どの しんかんせん？🚅',
    ],
  },
  {
    id: 'firetruck',
    name: 'しょうぼうしゃ',
    image: `${BASE}images/firetruck.png`,
    hints: [
      'あかくて おおきい！🔴',
      'おみず を だすよ！なんの くるま？🚒',
    ],
  },
  {
    id: 'panda',
    name: 'パンダ',
    image: `${BASE}images/panda.png`,
    hints: [
      'しろと くろ の どうぶつ だよ！🐾',
      'ささ を たべるよ！だ〜れだ？🎋',
    ],
  },
  {
    id: 'rabbit',
    name: 'うさぎ',
    image: `${BASE}images/rabbit.png`,
    hints: [
      'ながい みみ が みえる！👂',
      'ぴょんぴょん はねるよ！🐰',
    ],
  },
  {
    id: 'lion',
    name: 'ライオン',
    image: `${BASE}images/lion.png`,
    hints: [
      'きいろい たてがみ！🦁',
      'どうぶつ の おうさま だよ！👑',
    ],
  },
];

/**
 * 今日のパズルを取得（日替わり）
 */
export function getTodayPuzzle() {
  const today = new Date();
  const dayIndex = today.getDate() % PUZZLES.length;
  return PUZZLES[dayIndex];
}

/**
 * ランダムなパズルを取得
 */
export function getRandomPuzzle() {
  const index = Math.floor(Math.random() * PUZZLES.length);
  return PUZZLES[index];
}

/**
 * 進捗をlocalStorageに保存
 */
export function saveProgress(step) {
  const today = new Date().toISOString().split('T')[0];
  const data = { date: today, step };
  localStorage.setItem('puzzle-progress', JSON.stringify(data));
}

/**
 * 進捗をlocalStorageから読み込み
 */
export function loadProgress() {
  try {
    const raw = localStorage.getItem('puzzle-progress');
    if (!raw) return null;
    const data = JSON.parse(raw);
    const today = new Date().toISOString().split('T')[0];
    // 日付が違う場合はリセット
    if (data.date !== today) {
      localStorage.removeItem('puzzle-progress');
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

/**
 * 進捗をリセット
 */
export function resetProgress() {
  localStorage.removeItem('puzzle-progress');
}
