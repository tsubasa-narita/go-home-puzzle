/**
 * 画像ストア - IndexedDB でカスタム画像を管理
 * 最大10枚まで保存可能
 */

const DB_NAME = 'puzzle-custom-images';
const DB_VERSION = 1;
const STORE_NAME = 'images';
const MAX_IMAGES = 10;
const MAX_SIZE = 800; // px
const JPEG_QUALITY = 0.85;

/**
 * IndexedDB を開く
 */
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * 全カスタム画像を取得
 * @returns {Promise<Array<{id: string, name: string, blob: Blob}>>}
 */
export async function getAllImages() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * 画像を保存
 * @param {string} id
 * @param {string} name
 * @param {Blob} blob
 */
export async function saveImage(id, name, blob) {
    const count = await getImageCount();
    if (count >= MAX_IMAGES) {
        throw new Error(`最大${MAX_IMAGES}枚までです`);
    }
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id, name, blob, createdAt: Date.now() });
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
    });
}

/**
 * 画像を削除
 * @param {string} id
 */
export async function deleteImage(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => { db.close(); resolve(); };
        tx.onerror = () => { db.close(); reject(tx.error); };
    });
}

/**
 * 保存枚数を取得
 * @returns {Promise<number>}
 */
export async function getImageCount() {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        tx.oncomplete = () => db.close();
    });
}

/**
 * ファイルを 800×800px にリサイズして Blob を返す
 * @param {File} file
 * @returns {Promise<Blob>}
 */
export function resizeImage(file) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(url);

            // Calculate dimensions (cover: fill square, crop center)
            const size = Math.min(img.width, img.height);
            const sx = (img.width - size) / 2;
            const sy = (img.height - size) / 2;

            const canvas = document.createElement('canvas');
            canvas.width = MAX_SIZE;
            canvas.height = MAX_SIZE;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_SIZE, MAX_SIZE);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('画像の変換に失敗しました'));
                    }
                },
                'image/jpeg',
                JPEG_QUALITY
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('画像の読み込みに失敗しました'));
        };
        img.src = url;
    });
}

/**
 * カスタム画像をパズルデータ形式に変換
 * @param {Array<{id: string, name: string, blob: Blob}>} images
 * @returns {Array<{id: string, name: string, image: string, hints: string[], isCustom: boolean}>}
 */
export function toCustomPuzzles(images) {
    return images.map((img) => ({
        id: `custom-${img.id}`,
        name: img.name,
        image: URL.createObjectURL(img.blob),
        hints: [],
        isCustom: true,
    }));
}

export { MAX_IMAGES };
