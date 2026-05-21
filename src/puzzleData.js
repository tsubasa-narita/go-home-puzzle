/**
 * パズルデータ管理
 * 画像の追加・変更はこのファイルだけ編集すればOK！
 */
import { getAllImages, toCustomPuzzles } from './imageStore.js';

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
    image: `${BASE}images/komachi.jpg`,
    hints: [
      'あかい いろが みえるよ！🔴',
      'でんしゃ かな？ しんかんせん かな？🚄',
    ],
  },
  {
    id: 'hayabusa',
    name: 'はやぶさ',
    image: `${BASE}images/hayabusa.jpg`,
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
  {
    id: 'yokosuka',
    name: 'よこすかせん',
    image: `${BASE}images/yokosuka.jpg`,
    hints: [
      'あお と クリームいろ！🔵',
      'かまくら に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'yamanote',
    name: 'やまのてせん',
    image: `${BASE}images/yamanote.jpg`,
    hints: [
      'きみどりいろ の デンシャ！💚',
      'とうきょう を ぐるぐる まわるよ！♻️',
    ],
  },
  {
    id: 'seibu40000',
    name: 'せいぶせん',
    image: `${BASE}images/seibu40000.jpg`,
    hints: [
      'もぐもぐ さきっちょ が まるい！🥖',
      'ブルー と グリーン の いろ だよ！💙',
    ],
  },
  {
    id: 'tokyu-toyoko',
    name: 'とうきゅう とうよこせん',
    image: `${BASE}images/tokyu-toyoko.jpg`,
    hints: [
      'あかい ライン が かっこいい！🔴',
      'しぶや に いく デンシャ だよ！🏙️',
    ],
  },
  {
    id: 'shonan-shinjuku',
    name: 'しょうなん しんじゅくらいん',
    image: `${BASE}images/shonan-shinjuku.jpg`,
    hints: [
      'オレンジ と みどり の ライン！🍊',
      'とおく まで いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'kagayaki',
    name: 'かがやき',
    image: `${BASE}images/kagayaki.jpg`,
    hints: [
      'あお と きんいろ！✨',
      'ほくりく に いく しんかんせん！🚅',
    ],
  },
  {
    id: 'tsubasa',
    name: 'つばさ',
    image: `${BASE}images/tsubasa.jpg`,
    hints: [
      'シルバー と むらさき！💜',
      'やまがた に いく しんかんせん！🚅',
    ],
  },
  {
    id: 'saphir-odoriko',
    name: 'サフィールおどりこ',
    image: `${BASE}images/saphir-odoriko.jpg`,
    hints: [
      'あおい うみ みたいな いろ！🌊',
      'いず に いく とっきゅう だよ！💎',
    ],
  },
  {
    id: 'narita-express',
    name: 'なりたエクスプレス',
    image: `${BASE}images/narita-express.jpg`,
    hints: [
      'あかい いろ と くろい いろ！🔴⚫',
      'ひこうき に のる 人 が のるよ！✈️',
    ],
  },
  {
    id: 'joban',
    name: 'じょうばんせん',
    image: `${BASE}images/joban.jpg`,
    hints: [
      'あお  の ライン！💚💛',
      'みと や いわき に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'marunouchi',
    name: 'まるのうちせん',
    image: `${BASE}images/marunouchi.jpg`,
    hints: [
      'あかい でんしゃ！🔴',
      'とうきょう の ちかてつ だよ！🚇',
    ],
  },
  {
    id: 'sl-taiju',
    name: 'SLたいじゅ',
    image: `${BASE}images/sl-taiju.jpg`,
    hints: [
      'くろくて けむり を だすよ！💨',
      'ふるい きかんしゃ だ！だ〜れだ？🚂',
    ],
  },
  {
    id: 'saikyo',
    name: 'さいきょうせん',
    image: `${BASE}images/saikyo.jpg`,
    hints: [
      'みどりいろ の ライン だよ！💚',
      'しんじゅく や おおみや に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'sotetsu',
    name: 'そうてつせん',
    image: `${BASE}images/sotetsu.jpg`,
    hints: [
      'かっこいい ネイビーブルー の いろ！💙',
      'よこはま に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'nanbu',
    name: 'なんぶせん',
    image: `${BASE}images/nanbu.jpg`,
    hints: [
      'きいろ と オレンジ の ライン！💛🍊',
      'かわさき や たちかわ に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'spacia',
    name: 'スペーシア',
    image: `${BASE}images/spacia.jpg`,
    hints: [
      'かっこいい とっきゅう デンシャ！✨',
      'にっこう に いく よ！だ〜れだ？🚄',
    ],
  },
  {
    id: 'dennentoshi',
    name: 'でんえんとしせん',
    image: `${BASE}images/dennentoshi.jpg`,
    hints: [
      'みどりいろ の ライン だよ！💚',
      'しぶや に いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'ginza',
    name: 'ぎんざせん',
    image: `${BASE}images/ginza.jpg`,
    hints: [
      'きいろい でんしゃ！💛',
      'とうきょう の ちかてつ だよ！🚇',
    ],
  },
  {
    id: 'odakyu3000',
    name: 'おだきゅうせん',
    image: `${BASE}images/odakyu3000.jpg`,
    hints: [
      'あおい ライン の デンシャ だよ！💙',
      'しんじゅく から はこね の ほうに いくよ！🚃',
    ],
  },
  {
    id: 'romance',
    name: 'ロマンスカー',
    image: `${BASE}images/romance.jpg`,
    hints: [
      'あか と しろ の かっこいい とっきゅう！🔴⚪',
      'はこね に いく よ！だ〜れだ？🚄',
    ],
  },
  {
    id: 'doctor-yellow',
    name: 'ドクターイエロー',
    image: `${BASE}images/doctor-yellow.png`,
    hints: [
      'きいろい しんかんせん だよ！💛',
      'みつけると しあわせになれる かも？🚄',
    ],
  },
  {
    id: 'keihin-tohoku',
    name: 'けいひんとうほくせん',
    image: `${BASE}images/keihin-tohoku.png`,
    hints: [
      'みずいろ の ライン だよ！🩵',
      'さいたま から よこはま まで いく デンシャ だよ！🚃',
    ],
  },
  {
    id: 'shonan-monorail',
    name: 'しょうなんモノレール',
    image: `${BASE}images/shonan-monorail.png`,
    hints: [
      'ぶらさがって はしる でんしゃ だよ！🎢',
      'おそら を とんでる みたい！えのしま に いく よ！🚃',
    ],
  },
  {
    id: 'jr-chuo',
    name: 'ちゅうおうせん',
    image: `${BASE}images/jr-chuo.png`,
    hints: [
      'オレンジ色 の デンシャ だよ！🍊',
      'とっきゅう も はしっているよ！しんじゅくから まっすぐスイスイ！🚃',
    ],
  },
  {
    id: 'jr-sobu',
    name: 'そうぶせん',
    image: `${BASE}images/jr-sobu.png`,
    hints: [
      'きいろい ライン の デンシャ だよ！💛',
      'ちば から とうきょう まで いくよ！🚃',
    ],
  },
  {
    id: 'keikyu',
    name: 'けいきゅうせん',
    image: `${BASE}images/keikyu.png`,
    hints: [
      'あかい いろ の デンシャ だよ！🔴',
      'ひこうき に のる 人 も のるよ！ドレミファ って おとが なる かも？🚃',
    ],
  },
  {
    id: 'keio-5000',
    name: 'けいおうせん 5000けい',
    image: `${BASE}images/keio_5000.png`,
    hints: [
      'ピンク の ライン と くろい おかお が かっこいい！🩷',
      'しんじゅく から はしる けいおう の あたらしい でんしゃ だよ！🚃',
    ],
  },
  {
    id: 'seibu30000',
    name: 'せいぶせん 30000けい',
    image: `${BASE}images/seibu30000.png`,
    hints: [
      'きいろい デンシャ だよ！💛',
      'いけぶくろ や しんじゅく から はしるよ！🚃',
    ],
  },
  {
    id: 'enoden',
    name: 'えのでん',
    image: `${BASE}images/enoden.png`,
    hints: [
      'ちいさくて かわいい デンシャ だよ！💚',
      'うみ の そば を はしるよ！えのしま に いこう！🌊',
    ],
  },
  {
    id: 'skyliner',
    name: 'スカイライナー',
    image: `${BASE}images/skyliner.png`,
    hints: [
      'あおい かっこいい とっきゅう だよ！💙',
      'なりた くうこう に いく デンシャ だよ！✈️',
    ],
  },
  {
    id: 'kaiji',
    name: 'とっきゅう かいじ',
    image: `${BASE}images/kaiji.png`,
    hints: [
      'むらさき の ライン が かっこいい！💜',
      'やまなし の ぶどう の まち に いくよ！🍇',
    ],
  },
  {
    id: 'sunrise',
    name: 'サンライズ せと・いずも',
    image: `${BASE}images/sunrise.png`,
    hints: [
      'よる に はしる でんしゃ だよ！🌙',
      'ねている あいだに とおくまで いくよ！だ〜れだ？🛏️',
    ],
  },
  {
    id: 'laview',
    name: 'とっきゅう ラビュー',
    image: `${BASE}images/laview.png`,
    hints: [
      'ぎんいろ で まるい かたち だよ！🥚',
      'ちちぶ に いく とっきゅう だよ！おやま が きれい！🏔️',
    ],
  },
  {
    id: 'odoriko',
    name: 'とっきゅう おどりこ',
    image: `${BASE}images/odoriko.png`,
    hints: [
      'しろ と あお の ライン だよ！🌊',
      'いず に いく とっきゅう だよ！みかん が おいしいね🍊',
    ],
  },
  {
    id: 'rapi_t',
    name: 'なんかい ラピート',
    image: `${BASE}images/rapi_t.png`,
    hints: [
      'あおい いろ で まるっこい かたち！🤖',
      'かんさいくうこう に いく とっきゅう だよ！✈️',
    ],
  },
  {
    id: 'oimachi',
    name: 'とうきゅう おおいまちせん',
    image: `${BASE}images/oimachi.png`,
    hints: [
      'オレンジ と きいろ の ライン だよ！🧡💛',
      'ふたこたまがわ を わたる デンシャ だよ！🚃',
    ],
  },
  {
    id: 'yurikamome',
    name: 'ゆりかもめ',
    image: `${BASE}images/yurikamome.png`,
    hints: [
      'タイヤ で はしる よ！🚗',
      'おだいば を はしる デンシャ だよ！うみ が みえるね🌊',
    ],
  },
  {
    id: 'arakawa',
    name: 'とえい あらかわせん（さくらトラム）',
    image: `${BASE}images/arakawa.png`,
    hints: [
      'みち の うえ を はしる デンシャ だよ！🚋',
      'さくら の き の した を はしる よ！🌸',
    ],
  },
  {
    id: 'newshuttle',
    name: 'ニューシャトル',
    image: `${BASE}images/newshuttle.png`,
    hints: [
      'タイヤ で はしる ちいさな デンシャ だよ！🚗',
      'しんかんせん の よこ を はしる よ！てつどうはくぶつかん に いくね🚄',
    ],
  },
  {
    id: 'yurakucho',
    name: 'とうきょうメトロ ゆうらくちょうせん',
    image: `${BASE}images/yurakucho.png`,
    hints: [
      'きいろい ライン の デンシャ だよ！💛',
      'ちか を はしる よ！いけぶくろ や ゆうらくちょう に いくね🚇',
    ],
  },
  {
    id: 'fukutoshin',
    name: 'とうきょうメトロ ふくとしんせん',
    image: `${BASE}images/fukutoshin.png`,
    hints: [
      'ちゃいろ の ライン が もくひょう だよ！🤎',
      'ちか を はしる よ！しぶや や しんじゅく に いくね🚇',
    ],
  },
  {
    id: 'hibiya',
    name: 'とうきょうメトロ ひびやせん',
    image: `${BASE}images/tokyo_metro_hibiya_13000.png`,
    hints: [
      'シルバー の からだ に みずいろ の ライン だよ！🩵',
      'うえの や ぎんざ の ほうを はしる ちかてつ だよ！🚇',
    ],
  },
  {
    id: 'tozai',
    name: 'とうきょうメトロ とうざいせん',
    image: `${BASE}images/tokyo_metro_tozai_15000.png`,
    hints: [
      'みずいろ の ライン が すてき だよ！🩵',
      'とうきょう を よこに ビューンと はしる ちかてつ だよ！🚇',
    ],
  },
  {
    id: 'chiyoda',
    name: 'とうきょうメトロ ちよだせん',
    image: `${BASE}images/tokyo_metro_chiyoda_16000.png`,
    hints: [
      'みどり の ライン が めじるし だよ！💚',
      'おおてまち や おもてさんどう の ほうを はしるよ！🚇',
    ],
  },
  {
    id: 'hanzomon',
    name: 'とうきょうメトロ はんぞうもんせん',
    image: `${BASE}images/tokyo_metro_hanzomon_18000.png`,
    hints: [
      'むらさき の ライン の あたらしい でんしゃ だよ！💜',
      'しぶや や おしあげ の ほうを はしる ちかてつ だよ！🚇',
    ],
  },
  {
    id: 'namboku',
    name: 'とうきょうメトロ なんぼくせん',
    image: `${BASE}images/tokyo_metro_namboku_9000.png`,
    hints: [
      'エメラルドグリーン の ライン が めじるし だよ！💚',
      'めぐろ や あかばねいわぶち の ほうを はしるよ！🚇',
    ],
  },
  {
    id: 'oedo',
    name: 'とえい おおえどせん',
    image: `${BASE}images/oedo.png`,
    hints: [
      'あかむらさき（マゼンタ）の ライン の デンシャ だよ！🩷',
      'ちか ふかく を はしる よ！ちいさな デンシャ だね🚇',
    ],
  },
  {
    id: 'musashikosugi',
    name: 'むさしこすぎを はしる でんしゃ',
    image: `${BASE}images/musashikosugi.png`,
    hints: [
      'しょうなんしんじゅくライン、よこすかせん、さいきょうせん の ３つ だよ！🚃',
      'おおきな マンション の よこ を みんないっしょに はしるよ！🏙️',
    ],
  },
  {
    id: 'n700s-nozomi',
    name: 'のぞみ（N700S）',
    image: `${BASE}images/n700s_nozomi.png`,
    hints: [
      'しろくて はやい しんかんせん だよ！🤍',
      'とうきょう と おおさか を はしるよ！🚄',
    ],
  },
  {
    id: 'hinotori',
    name: 'ひのとり',
    image: `${BASE}images/hinotori.png`,
    hints: [
      'まっかっか の かっこいい でんしゃ だよ！🔴',
      'おおさか や なごや に いく とっきゅう だよ！✨',
    ],
  },
  {
    id: 'panda-kuroshio',
    name: 'パンダくろしお',
    image: `${BASE}images/panda_kuroshio.png`,
    hints: [
      'おめめ が まんまる の パンダ だよ！🐼',
      'わかやま の うみ を はしる とっきゅう だよ！🌊',
    ],
  },
  {
    id: 'e8-tsubasa',
    name: 'あたらしい つばさ（E8けい）',
    image: `${BASE}images/e8_tsubasa.png`,
    hints: [
      'むらさきいろ と きいろ の しんかんせん！💜💛',
      'やまがた に いく あたらしい でんしゃ だよ！🚅',
    ],
  },
  {
    id: 'hello-kitty-haruka',
    name: 'ハローキティはるか',
    image: `${BASE}images/hello_kitty_haruka.png`,
    hints: [
      'かわいい リボン が ついている よ！🎀',
      'かんさいくうこう に いく とっきゅう だよ！✈️',
    ],
  },
  {
    id: 'hankyu',
    name: 'はんきゅうでんしゃ',
    image: `${BASE}images/hankyu.png`,
    hints: [
      'ピカピカ の あずきいろ だよ！🟤',
      'おおさか や きょうと を はしる よ！🚃',
    ],
  },
  {
    id: 'hayabusa-komachi-renketsu',
    name: 'れんけつ！はやぶさ と こまち',
    image: `${BASE}images/hayabusa_komachi_renketsu.png`,
    hints: [
      'みどり と あか の しんかんせん が いっしょ！💚❤️',
      'がっちゃん！って くっついて はしるよ！🚄',
    ],
    countQuiz: {
      enabled: true,
      answer: 2,
      prompt: 'しんかんせんは なんだい いるかな？',
      note: 'くっついていても 2だい だよ',
    },
  },
  {
    id: 'ochanomizu-crossing',
    name: 'おちゃのみずえき（３つの でんしゃ）',
    image: `${BASE}images/ochanomizu_crossing.png`,
    hints: [
      'あか、オレンジ、きいろ の でんしゃ が いるよ！🔴🍊💛',
      'うえ と した で いっしょに はしっていて すごいね！🌉',
    ],
    countQuiz: {
      enabled: true,
      answer: 3,
      prompt: 'でんしゃは なんだい いたかな？',
      note: 'うえ と した の でんしゃを かぞえてね',
    },
  },
  {
    id: 'tokyo-station-shinkansen',
    name: 'とうきょうえき の しんかんせん',
    image: `${BASE}images/tokyo_station_shinkansen.png`,
    hints: [
      'いろんな いろ の しんかんせん が ならんでいるよ！✨',
      'ここから みんな とおく に しゅっぱつ するよ！🚄',
    ],
  },
  {
    id: 'nippori-trains',
    name: 'にっぽりえき の でんしゃまつり',
    image: `${BASE}images/nippori_trains.png`,
    hints: [
      'あお、みどり、みずいろ の でんしゃ が いるよ！💙💚🩵',
      'せんろ が いっぱい あって ワクワク するね！🛤️',
    ],
  },
  {
    id: 'doctor-yellow-nozomi',
    name: 'すれちがう！ドクターイエロー と のぞみ',
    image: `${BASE}images/doctor_yellow_nozomi.png`,
    hints: [
      'きいろい しんかんせん と しろい しんかんせん！💛🤍',
      'ビュン！って すれちがって かっこいい！🚄',
    ],
    countQuiz: {
      enabled: true,
      answer: 2,
      prompt: 'しんかんせんは なんだい いたかな？',
      note: 'きいろ と しろ を かぞえてね',
    },
  },
  {
    id: 'russell-snowplow',
    name: 'ラッセルしゃ（じょせつしゃ）',
    image: `${BASE}images/russell_snowplow.png`,
    hints: [
      'まっか な いろ の でんしゃ だよ！🔴',
      'ゆき を いっぱい とばして はしるよ！❄️',
    ],
  },
  {
    id: 'crossing-cars',
    name: 'ふみきり と はたらくくるま',
    image: `${BASE}images/crossing_cars.png`,
    hints: [
      'カンカンカン… でんしゃ を まっているね！🚃',
      'パトカー や しょうぼうしゃ が いるよ！🚓🚒',
    ],
  },
  {
    id: 'cassiopeia-night',
    name: 'カシオペア（しんだいとっきゅう）',
    image: `${BASE}images/cassiopeia_night.png`,
    hints: [
      'よる に はしる ロマンチック な でんしゃ！🌃',
      'ねている あいだ に とおく に いくよ！🛏️',
    ],
  },
  {
    id: 'momotaro-freight',
    name: 'かもつれっしゃ ももたろう',
    image: `${BASE}images/momotaro_freight.png`,
    hints: [
      'ちからもち な でんしゃ だよ！💪',
      'にもつ を たくさん はこんでいるね！📦',
    ],
  },
  {
    id: 'yufuin-no-mori',
    name: 'とっきゅう ゆふいんのもり',
    image: `${BASE}images/yufuin_no_mori.png`,
    hints: [
      'みどりいろ の おしゃれな レトロ でんしゃ！🌲',
      'ゆふいん の しぜん の なか を はしるよ！♨️',
    ],
  },
  {
    id: 'twilight-mizukaze',
    name: 'トワイライトエクスプレス みずかぜ',
    image: `${BASE}images/twilight_mizukaze.png`,
    hints: [
      'ピカピカ な みどりいろ の でんしゃ だよ！✨',
      'ごうか な ホテル みたい な でんしゃ！🏨',
    ],
  },
  {
    id: 'osaka-loop-line',
    name: 'おおさかかんじょうせん',
    image: `${BASE}images/osaka_loop_line.png`,
    hints: [
      'オレンジいろ の でんしゃ だよ！🍊',
      'おおさか の まち を ぐるぐる まわるよ！🏯',
    ],
  },
  {
    id: 'midosuji-30000',
    name: 'みどうすじせん 30000けい',
    image: `${BASE}images/midosuji_30000.png`,
    hints: [
      'あかい ライン の ちかてつ だよ！🔴',
      'おおさか の まんなかを はしる みどうすじせん だよ！🚇',
    ],
  },
  {
    id: 'e657-hitachi',
    name: 'とっきゅう ひたち',
    image: `${BASE}images/e657_hitachi.png`,
    hints: [
      'しろ と ピンク の ライン が あるよ！🌸',
      'うみ の そば を はしる とっきゅう だよ！🌊',
    ],
  },
  {
    id: 'e5-h5-shinkansen',
    name: 'しんかんせん E5とH5',
    image: `${BASE}images/e5_h5_shinkansen.png`,
    hints: [
      'みどりいろの はやい でんしゃが 2つ はしっているよ',
      'とうほく と ほっかいどうを はしる しんかんせん だよ',
    ],
    countQuiz: {
      enabled: true,
      answer: 2,
      prompt: 'しんかんせんは なんだい いるかな？',
      note: 'E5 と H5 を 1だいずつ かぞえてね',
    },
  },
  {
    id: 'alfa-x',
    name: 'ALFA-X',
    image: `${BASE}images/alfa_x.png`,
    hints: [
      'ながい はなの みらいみたいな しんかんせん だよ',
      'はやく はしるための しけんを する とくべつな でんしゃ だよ',
    ],
  },
  {
    id: 'e4-max',
    name: 'E4 Max',
    image: `${BASE}images/e4_max.png`,
    hints: [
      '2かいだての おおきい しんかんせん だよ',
      'きいろ と あお が めだつ Max の でんしゃ だよ',
    ],
  },
  {
    id: 'anpanman-train',
    name: 'アンパンマンれっしゃ',
    image: `${BASE}images/anpanman_train.png`,
    hints: [
      'アンパンマンの なかまたちが いそうな たのしい れっしゃ だよ',
      'しこく の ほうを はしる にぎやかな れっしゃ だよ',
    ],
  },
  {
    id: 'asoboy',
    name: 'あそぼーい！',
    image: `${BASE}images/asoboy.png`,
    hints: [
      'くろちゃん が いそうな かわいい とっきゅう だよ',
      'あそ の おやま の ほうを はしる れっしゃ だよ',
    ],
  },
  {
    id: 'shimakaze-50000',
    name: 'しまかぜ 50000けい',
    image: `${BASE}images/shimakaze_50000.png`,
    hints: [
      'あお と しろ の ごうかな とっきゅう だよ',
      'いせしま の うみ の ほうへ はしるよ',
    ],
  },
  {
    id: 'musky-2000',
    name: 'ミュースカイ 2000けい',
    image: `${BASE}images/musky_2000.png`,
    hints: [
      'あお と しろ の くうこう とっきゅう だよ',
      'セントレア の ほうへ ビューンと はしるよ',
    ],
  },
  {
    id: 'shinkansen-all-stars',
    name: 'しんかんせん せいぞろい',
    image: `${BASE}images/shinkansen_all_stars.png`,
    hints: [
      'いろんな しんかんせん が ならんでいるよ',
      'ながい はな、まるい はな、いろんな かたちを みつけてね',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'しんかんせんは なんだい いるかな？',
      note: '500けい、N700S、E5、E6、E7 を かぞえてね',
    },
  },
  {
    id: 'sea-train-festival',
    name: 'うみの でんしゃまつり',
    image: `${BASE}images/sea_train_festival.png`,
    hints: [
      'うみ の そばに いろんな でんしゃ が あつまったよ',
      'あおい とっきゅう や ちいさな でんしゃ を みつけてね',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'でんしゃは なんだい いるかな？',
      note: 'うみ の そば の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'ueno-tokyo-line',
    name: 'うえのとうきょうライン',
    image: `${BASE}images/ueno_tokyo_line.png`,
    hints: [
      'オレンジ と みどり の ライン だよ！🧡💚',
      'とうきょう を たてに はしる デンシャ だよ！🚃',
    ],
  },
  {
    id: 'keiyo',
    name: 'けいようせん',
    image: `${BASE}images/keiyo.png`,
    hints: [
      'あかい ライン が めじるし だよ！🔴',
      'まいはま や うみ の ほうへ はしるよ！🌊',
    ],
  },
  {
    id: 'tobu-tojo',
    name: 'とうぶとうじょうせん',
    image: `${BASE}images/tobu_tojo.png`,
    hints: [
      'あおい ライン が すてき だよ！💙',
      'いけぶくろ から おやま の ほうへ はしるよ！🚃',
    ],
  },
  {
    id: 'rinkai',
    name: 'りんかいせん',
    image: `${BASE}images/rinkai.png`,
    hints: [
      'あおい ライン の デンシャ だよ！💙',
      'おだいば や うみ の ちかくを はしるよ！🌉',
    ],
  },
  {
    id: 'keihan',
    name: 'けいはんでんしゃ',
    image: `${BASE}images/keihan.png`,
    hints: [
      'みどり の デンシャ だよ！💚',
      'きょうと と おおさか を むすぶよ！🚃',
    ],
  },
  {
    id: 'kintetsu-local',
    name: 'きんてつでんしゃ',
    image: `${BASE}images/kintetsu_local.png`,
    hints: [
      'あか と しろ の デンシャ だよ！🔴⚪',
      'なら や おおさか の ほうへ はしるよ！🦌',
    ],
  },
  {
    id: 'e2-yamabiko',
    name: 'E2けい やまびこ',
    image: `${BASE}images/e2_yamabiko.png`,
    hints: [
      'しろい からだに あかい ライン だよ！🔴',
      'とうほくを はしる しんかんせん だよ！🚄',
    ],
  },
  {
    id: 'h5-hayabusa',
    name: 'H5けい はやぶさ',
    image: `${BASE}images/h5_hayabusa.png`,
    hints: [
      'みどり と むらさき の しんかんせん！💚💜',
      'ほっかいどう の ほうへ はしるよ！🚄',
    ],
  },
  {
    id: 'w7-hokuriku',
    name: 'W7けい ほくりくしんかんせん',
    image: `${BASE}images/w7_hokuriku.png`,
    hints: [
      'あお と きんいろ の ライン が あるよ！💙✨',
      'ほくりく の やま の ほうへ はしるよ！🏔️',
    ],
  },
  {
    id: 'shinkansen-500',
    name: '500けい しんかんせん',
    image: `${BASE}images/shinkansen_500.png`,
    hints: [
      'ながくて とがった はな が かっこいい！🚄',
      'さんようしんかんせんを はしるよ！💙',
    ],
  },
  {
    id: 'n700a-nozomi',
    name: 'N700A のぞみ',
    image: `${BASE}images/n700a_nozomi.png`,
    hints: [
      'しろい からだに あおい ライン だよ！💙',
      'とうきょう と おおさか の あいだを はしるよ！🗻',
    ],
  },
  {
    id: 'n700-mizuho-sakura',
    name: 'N700けい みずほ・さくら',
    image: `${BASE}images/n700_mizuho_sakura.png`,
    hints: [
      'しろ と みずいろ の しんかんせん だよ！🩵',
      'きゅうしゅう の ほうへ はしるよ！🚄',
    ],
  },
  {
    id: 'kyushu-800-tsubame',
    name: '800けい つばめ',
    image: `${BASE}images/kyushu_800_tsubame.png`,
    hints: [
      'しろい からだに あかい ライン だよ！🔴',
      'きゅうしゅう を はしる しんかんせん だよ！🌋',
    ],
  },
  {
    id: 'kamome-n700s',
    name: 'かもめ N700S',
    image: `${BASE}images/kamome_n700s.png`,
    hints: [
      'しろ と あか の しんかんせん だよ！🔴',
      'ながさき の ほうへ はしる かもめ だよ！🌊',
    ],
  },
  {
    id: 'doctor-s',
    name: 'ドクターS',
    image: `${BASE}images/doctor_s.png`,
    hints: [
      'きいろい あたらしい けんさ の しんかんせん！💛',
      'せんろ を しらべる とくべつな でんしゃ だよ！🚄',
    ],
  },
  {
    id: 'e10-shinkansen',
    name: 'E10けい しんかんせん',
    image: `${BASE}images/e10_shinkansen.png`,
    hints: [
      'みらい みたいな しんかんせん だよ！✨',
      'ながい はな で ビューンと はしりそう！🚄',
    ],
  },
  {
    id: 'e8-tsubasa-snow',
    name: 'ゆきの つばさ（E8けい）',
    image: `${BASE}images/e8_tsubasa_snow.png`,
    hints: [
      'むらさき と きいろ の しんかんせん！💜💛',
      'ゆき の なかを やまがたへ はしるよ！❄️',
    ],
  },
  {
    id: 'n700s-kamome-rainbow',
    name: 'にじの かもめ N700S',
    image: `${BASE}images/n700s_kamome_rainbow.png`,
    hints: [
      'しろ と あか の しんかんせん だよ！🔴',
      'にじ の そばを ながさきへ はしるよ！🌈',
    ],
  },
  {
    id: 'tokyo-metro-17000',
    name: 'とうきょうメトロ 17000けい',
    image: `${BASE}images/tokyo_metro_17000.png`,
    hints: [
      'きいろ と ちゃいろ の ライン が あるよ！💛',
      'ちか を はしって いけぶくろ の ほうへ いくよ！🚇',
    ],
  },
  {
    id: 'keikyu-1000-le-ciel',
    name: 'けいきゅう 1000けい ル・シエル',
    image: `${BASE}images/keikyu_1000_le_ciel.png`,
    hints: [
      'あかい けいきゅう の デンシャ だよ！🔴',
      'とくべつな なまえ の かっこいい でんしゃ！✨',
    ],
  },
  {
    id: 'sotetsu-13000',
    name: 'そうてつ 13000けい',
    image: `${BASE}images/sotetsu_13000.png`,
    hints: [
      'ネイビーブルー が かっこいい デンシャ だよ！💙',
      'よこはま の ほうへ はしる そうてつせん だよ！🚃',
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

/**
 * ビルトイン + カスタム画像を結合して返す
 * @returns {Promise<Array>}
 */
export async function getAllPuzzlesWithCustom() {
  try {
    const customImages = await getAllImages();
    const customPuzzles = toCustomPuzzles(customImages);
    return [...PUZZLES, ...customPuzzles];
  } catch (e) {
    console.warn('[PUZZLE] カスタム画像の読み込みに失敗:', e);
    return [...PUZZLES];
  }
}
