/**
 * ステップレジストリ - 利用可能な全ステップの定義
 */

const BASE = import.meta.env.BASE_URL;

export const ALL_STEPS = [
    {
        id: 'shoes',
        label: 'くつをはく',
        icon: `${BASE}images/icon-shoes.png`,
        emoji: '👟',
        goalMsg: 'やった！くつ はけたね！',
    },
    {
        id: 'move',
        label: 'いどうする',
        icon: `${BASE}images/icon-walking.jpg`,
        emoji: '🚶',
        goalMsg: 'いどう できたね！',
    },
    {
        id: 'home',
        label: 'おうち',
        icon: `${BASE}images/icon-apartment.png`,
        emoji: '🏠',
        goalMsg: 'おうちに ついたよ！',
    },
    {
        id: 'bath',
        label: 'おふろ',
        icon: `${BASE}images/icon-bath.jpg`,
        emoji: '🛀',
        goalMsg: 'おふろ はいれたね！',
    },
    {
        id: 'bed',
        label: 'ねる',
        icon: `${BASE}images/icon-bed.jpg`,
        emoji: '😴',
        goalMsg: 'ねんね しようね！',
    },
    {
        id: 'teeth',
        label: 'はみがき',
        icon: `${BASE}images/icon-teethblush.jpg`,
        emoji: '🪥',
        goalMsg: 'はみがき できたね！',
    },
    {
        id: 'meal',
        label: 'ごはん',
        icon: `${BASE}images/icon-eat.jpg`,
        emoji: '🍚',
        goalMsg: 'ごはん たべたね！',
    },
    {
        id: 'dress',
        label: 'おきがえ',
        icon: `${BASE}images/icon-change-clothes.jpg`,
        emoji: '👕',
        goalMsg: 'おきがえ できたね！',
    },
    {
        id: 'diaper',
        label: 'おむつ',
        icon: `${BASE}images/icon-diaper.jpg`,
        emoji: '👶',
        goalMsg: 'おむつ かえたね！',
    },
    {
        id: 'nap',
        label: 'おひるね',
        icon: `${BASE}images/icon-nap.jpg`,
        emoji: '💤',
        goalMsg: 'おひるね できたね！',
    },
];

export const DEFAULT_WEEKDAY = ['shoes', 'move', 'home', 'bath', 'bed'];
export const DEFAULT_HOLIDAY = ['bath', 'bed'];

/**
 * IDリストからステップ定義を取得
 */
export function getStepDefs(ids) {
    return ids.map(id => ALL_STEPS.find(s => s.id === id)).filter(Boolean);
}

/**
 * 選択されたステップ数に応じてrevealCountを自動計算（ジグソー用: 16タイル）
 * 最初は少なく、後半に多くなるカーブ（二次関数）
 * 各ステップで最低1タイルは新たに開示される
 */
export function calcRevealCounts(stepCount, totalTiles = 16) {
    const counts = [];
    for (let i = 0; i < stepCount; i++) {
        if (i === stepCount - 1) {
            counts.push(totalTiles); // last step reveals all
        } else {
            // Quadratic curve: (i+1)^2 / stepCount^2
            const ratio = Math.pow((i + 1) / stepCount, 2);
            let count = Math.max(1, Math.round(totalTiles * ratio));
            // Ensure at least 1 more tile than previous step
            if (i > 0 && count <= counts[i - 1]) {
                count = counts[i - 1] + 1;
            }
            counts.push(count);
        }
    }
    return counts;
}

/**
 * 選択されたステップ数に応じてrevealPercentを自動計算（カーテン/ぼかし用）
 * 最初は少なく、後半に多くなるカーブ（二次関数）
 */
export function calcRevealPercents(stepCount) {
    const percents = [];
    for (let i = 0; i < stepCount; i++) {
        if (i === stepCount - 1) {
            percents.push(1.0);
        } else {
            const ratio = Math.pow((i + 1) / stepCount, 2);
            percents.push(Math.round(ratio * 100) / 100);
        }
    }
    return percents;
}
