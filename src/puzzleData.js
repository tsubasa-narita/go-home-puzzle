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
  {
    id: 'doctor-yellow-count',
    name: 'ドクターイエロー 1だい',
    image: `${BASE}images/doctor_yellow_count.png`,
    hints: [
      'きいろい しんかんせん が みえるよ！💛',
      'せんろ を しらべる とくべつな でんしゃ だよ！🚄',
    ],
    countQuiz: {
      enabled: true,
      answer: 1,
      prompt: 'ドクターイエローは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'きいろい しんかんせんを かぞえてね',
      success: 'せいかい！ドクターイエローは 1だい！',
      note: 'きいろい しんかんせんを かぞえてね',
    },
  },
  {
    id: 'hayabusa-komachi-count',
    name: 'はやぶさ と こまち 2だい',
    image: `${BASE}images/hayabusa_komachi_count.png`,
    hints: [
      'みどり と あか の しんかんせん が いるよ！💚❤️',
      'くっついて はしる と とっても かっこいいね！🚄',
    ],
    countQuiz: {
      enabled: true,
      answer: 2,
      prompt: 'しんかんせんは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'はやぶさ と こまちを 1だいずつ かぞえてね',
      success: 'せいかい！2だい いたね！',
      note: 'くっついていても 2だい だよ',
    },
  },
  {
    id: 'three-shinkansen-count',
    name: 'しんかんせん 3だい',
    image: `${BASE}images/three_shinkansen_count.png`,
    hints: [
      'みどり、あか、あお の しんかんせん！✨',
      'えき に ならんで しゅっぱつ まち だよ！🚉',
    ],
    countQuiz: {
      enabled: true,
      answer: 3,
      prompt: 'しんかんせんは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'みどり、あか、あおを ひとつずつ かぞえてね',
      success: 'すごい！3だい みつけたね！',
      note: 'えき の しんかんせんを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'tokyo-commuter-four-count',
    name: 'とうきょうのでんしゃ 4だい',
    image: `${BASE}images/tokyo_commuter_four_count.png`,
    hints: [
      'みどり、オレンジ、きいろ、みずいろ が いるよ！🌈',
      'とうきょう の まちを はしる デンシャ だよ！🏙️',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'でんしゃは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'いろの ちがう でんしゃを ひとつずつ かぞえてね',
      success: 'せいかい！4だい かぞえられたね！',
      note: 'せんろ の うえ の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'shinkansen-five-count',
    name: 'しんかんせん 5だい',
    image: `${BASE}images/shinkansen_five_count.png`,
    hints: [
      'いろんな しんかんせん が せいぞろい！🚄',
      'ながい はな、まるい はな、いろんな かたち！✨',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'しんかんせんは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'ならんでいる しんかんせんを ぜんぶ かぞえてね',
      success: 'たいへんよくできました！5だい せいかい！',
      note: 'まえ に ならんだ しんかんせんを かぞえてね',
    },
  },
  {
    id: 'romancecar-gse-count',
    name: 'ロマンスカー 1だい',
    image: `${BASE}images/romancecar_gse_count.png`,
    hints: [
      'あかい ロマンスカー が みえるよ！🔴',
      'はこね の おやま へ はしる とっきゅう だよ！⛰️',
    ],
    countQuiz: {
      enabled: true,
      answer: 1,
      prompt: 'ロマンスカーは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'あかい とっきゅうを かぞえてね',
      success: 'せいかい！ロマンスカーは 1だい！',
      note: 'あかい ロマンスカーを かぞえてね',
    },
  },
  {
    id: 'keikyu-two-count',
    name: 'けいきゅう 2だい',
    image: `${BASE}images/keikyu_two_count.png`,
    hints: [
      'あかい けいきゅう が ならんでいるよ！🔴',
      'よこはま や くうこう の ほうへ はしるよ！✈️',
    ],
    countQuiz: {
      enabled: true,
      answer: 2,
      prompt: 'けいきゅうは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'あかい でんしゃを ひとつずつ かぞえてね',
      success: 'ぴんぽん！2だい いたね！',
      note: 'あかい けいきゅうを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'enoden-three-count',
    name: 'えのでん 3だい',
    image: `${BASE}images/enoden_three_count.png`,
    hints: [
      'うみ の そばに えのでん が いるよ！🌊',
      'ちいさくて かわいい デンシャ だね！💚',
    ],
    countQuiz: {
      enabled: true,
      answer: 3,
      prompt: 'えのでんは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'みどりの ちいさな でんしゃを かぞえてね',
      success: 'せいかい！えのでん 3だい！',
      note: 'うみ の そば の えのでんを かぞえてね',
    },
  },
  {
    id: 'tokyo-metro-four-count',
    name: 'とうきょうメトロ 4だい',
    image: `${BASE}images/tokyo_metro_four_count.png`,
    hints: [
      'ちかてつ が いろいろ ならんでいるよ！🚇',
      'きいろ、あか、むらさき、ちゃいろ を さがしてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'ちかてつは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'ならんだ ちかてつを ひとつずつ かぞえてね',
      success: 'すばらしい！4だい せいかい！',
      note: 'とうきょうメトロの でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'airport-trains-five-count',
    name: 'くうこうでんしゃ 5だい',
    image: `${BASE}images/airport_trains_five_count.png`,
    hints: [
      'くうこうへ いく デンシャ が あつまったよ！✈️',
      'いろんな かお の デンシャ が いるね！🚃',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'くうこうでんしゃは なんだい いるかな？',
      choices: [1, 2, 3, 4, 5],
      hint: 'ならんでいる でんしゃを ぜんぶ かぞえてね',
      success: 'すうじはかせ！5だい せいかい！',
      note: 'くうこうへ いく でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-airport-station-four',
    name: 'くうこうえきの なかよしでんしゃ 4だい',
    image: `${BASE}images/count_airport_station_four.png`,
    hints: [
      'くうこう の えきに いろんな でんしゃ が いるよ！',
      'ひこうき と にもつも みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'でんしゃは ぜんぶで なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ホームにいる でんしゃを ひとつずつ かぞえてね',
      success: 'やったね！4だい みつけたね！',
      note: 'くうこうえき の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-night-city-five',
    name: 'よるの まちの きらきらえき 5だい',
    image: `${BASE}images/count_night_city_five.png`,
    hints: [
      'よる の えきで ライトが ぴかぴか しているよ！',
      'ねだいれっしゃ と しんかんせんも いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'きらきらえきに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ライトがついている でんしゃを かぞえよう',
      success: 'ぴかぴか！5だい せいかい！',
      note: 'よる の えき の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-shibuya-six',
    name: 'しぶやの にぎやかえき 6だい',
    image: `${BASE}images/count_shibuya_six.png`,
    hints: [
      'まち の なかを いろんな でんしゃ が はしるよ！',
      'みどり、むらさき、きいろの でんしゃを さがしてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 6,
      prompt: 'にぎやかな えきに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'はしっている でんしゃと とまっている でんしゃを あわせてね',
      success: 'すごい！6だい ぜんぶ かぞえたね！',
      note: 'まち の でんしゃを ひとつずつ かぞえてね',
    },
  },
  {
    id: 'count-tokyo-shinkansen-four',
    name: 'とうきょうえきの しんかんせん 4だい',
    image: `${BASE}images/count_tokyo_shinkansen_four.png`,
    hints: [
      'みどり、あか、あお、しろ の しんかんせん！',
      'えきべんも ならんで たのしい えきだよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'しんかんせんは なんだい いるかな？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ながい はやい でんしゃだけを かぞえてね',
      success: 'せいかい！しんかんせんは 4だい！',
      note: 'とうきょうえき の しんかんせんを かぞえてね',
    },
  },
  {
    id: 'count-harbor-mono-four',
    name: 'ゆうがたの モノレールと うみ 4だい',
    image: `${BASE}images/count_harbor_mono_four.png`,
    hints: [
      'そらに ぶらさがる モノレールが はしるよ！',
      'うみの そばにも でんしゃ が いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'でんしゃは ぜんぶで なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'モノレールと したを はしる でんしゃを あわせてね',
      success: 'そのとおり！4だいだね！',
      note: 'うみ の そば の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-mountain-valley-five',
    name: 'おはなの やまのでんしゃ 5だい',
    image: `${BASE}images/count_mountain_valley_five.png`,
    hints: [
      'やま と おはなの あいだを でんしゃ が はしるよ！',
      'みどりの とっきゅう と まるい とっきゅうを みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'やまの なかに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'はし、えき、はらっぱ の でんしゃを かぞえてね',
      success: 'せいかい！やまに 5だい いたね！',
      note: 'やま と おはな の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-seaside-resort-six',
    name: 'うみべの リゾートでんしゃ 6だい',
    image: `${BASE}images/count_seaside_resort_six.png`,
    hints: [
      'あおい うみ の そばに でんしゃ が あつまったよ！',
      'モノレールも しんかんせんも いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 6,
      prompt: 'うみの まわりに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'うみぞい、はし、えき、そらの うえを みてね',
      success: 'やったね！6だい みつけたよ！',
      note: 'うみべ の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-autumn-forest-seven',
    name: 'あきの もりのでんしゃ 7だい',
    image: `${BASE}images/count_autumn_forest_seven.png`,
    hints: [
      'もみじ の もりに でんしゃ が いっぱい！',
      'あおい きかんしゃ と しんかんせんも いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 7,
      prompt: 'もりの なかに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'きの あいだ と せんろ の うえを ゆっくり みてね',
      success: 'すごい！7だい ぜんぶ みつけたね！',
      note: 'あき の もり の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-snow-hot-spring-eight',
    name: 'ゆきの おんせんでんしゃ 8だい',
    image: `${BASE}images/count_snow_hot_spring_eight.png`,
    hints: [
      'ゆき の まちに でんしゃ が せいぞろい！',
      'しんかんせん と とっきゅうを ひとつずつ かぞえてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 8,
      prompt: 'ゆきの まちに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'おんせん の まわりの 8つの でんしゃを さがそう',
      success: 'たいへんよくできました！8だい せいかい！',
      note: 'ゆき の まち の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-toy-town-four',
    name: 'おもちゃのまちのでんしゃ 4だい',
    image: `${BASE}images/count_toy_town_four.png`,
    hints: [
      'おもちゃ の まちに でんしゃ が はしるよ！',
      'うえ の レールの モノレールも みてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'おもちゃの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'みどり、あか、あお、そらの でんしゃを かぞえてね',
      success: 'やったね！4だい みつけたよ！',
      note: 'おもちゃ の まち の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-space-station-five',
    name: 'うちゅうえきのでんしゃ 5だい',
    image: `${BASE}images/count_space_station_five.png`,
    hints: [
      'ほし の えきに しんかんせん が あつまったよ！',
      'ねだいれっしゃも うちゅうを はしるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'うちゅうえきに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'しんかんせん 4だい と ねだいれっしゃ 1だいだよ',
      success: 'すごい！5だい ぜんぶ みつけたね！',
      note: 'うちゅうえき の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-rainbow-virtual-six',
    name: 'にじいろバーチャルせんろ 6だい',
    image: `${BASE}images/count_rainbow_virtual_six.png`,
    hints: [
      'にじ の せんろを でんしゃ が はしるよ！',
      'モノレール と ちかてつも いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 6,
      prompt: 'にじの せかいの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'うえを はしる モノレールも かぞえてね',
      success: 'せいかい！6だい みつけられたね！',
      note: 'にじいろ の せんろ の でんしゃを かぞえてね',
    },
  },
  {
    id: 'count-playroom-seven',
    name: 'プレイルームのでんしゃごっこ 7だい',
    image: `${BASE}images/count_playroom_seven.png`,
    hints: [
      'おへや の なかに でんしゃ が いっぱい！',
      'つみき と トンネルの まわりを みてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 7,
      prompt: 'おへやの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'いろの ちがう でんしゃを ひとつずつ かぞえよう',
      success: 'ぴったり！7だい ぜんぶ かぞえたね！',
      note: 'プレイルーム の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-cloud-dream-eight',
    name: 'ゆめの くものうえでんしゃ 8だい',
    image: `${BASE}images/count_cloud_dream_eight.png`,
    hints: [
      'くもの うえを でんしゃ が はしるよ！',
      'しんかんせん と とっきゅうを さがしてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 8,
      prompt: 'くものうえの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ちいさい でんしゃも あるから すみずみまで みてね',
      success: 'すばらしい！8だい ぜんぶ あったね！',
      note: 'くものうえ の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'count-river-valley-eight',
    name: 'かわの たにのでんしゃ 8だい',
    image: `${BASE}images/count_river_valley_eight.png`,
    hints: [
      'かわ の ちかくに でんしゃ が かくれているよ！',
      'はし、えき、やまの せんろを みてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 8,
      prompt: 'かわの ちかくに でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'はしの うえ、えきの そば、きの あいだを ゆっくり みてね',
      success: 'せいかい！かわの たにには 8だい いたよ！',
      note: 'かわ の たに の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'quiz-real-tokyo-commuter-four',
    name: 'とうきょうの つうきんでんしゃ 4だい',
    image: `${BASE}images/quiz_real_tokyo_commuter_four.png`,
    hints: [
      'みどり、みずいろ、オレンジ、きいろの でんしゃ！',
      'とうきょう の まちの せんろに ならんでいるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'つうきんでんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'いろの ちがう でんしゃを ひとつずつ かぞえてね',
      success: 'せいかい！とうきょうの でんしゃは 4だい！',
      note: '4つの いろの でんしゃを かぞえてね',
    },
  },
  {
    id: 'quiz-real-shinkansen-depot-five',
    name: 'しんかんせん しゃりょうきち 5だい',
    image: `${BASE}images/quiz_real_shinkansen_depot_five.png`,
    hints: [
      'はやぶさ、こまち、かがやき、のぞみが いるよ！',
      'きいろい ドクターイエローも みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'しんかんせんは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ならんでいる しんかんせんを ぜんぶ かぞえてね',
      success: 'やったね！しんかんせん 5だい せいかい！',
      note: 'しゃりょうきちの しんかんせんを かぞえてね',
    },
  },
  {
    id: 'quiz-real-private-express-four',
    name: 'とっきゅうガーデン 4だい',
    image: `${BASE}images/quiz_real_private_express_four.png`,
    hints: [
      'あかい ロマンスカーと まるい ラビューが いるよ！',
      'スカイライナーと スペーシアXも さがしてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'とっきゅうは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'おはな の まわりの とっきゅうを かぞえてね',
      success: 'ぴんぽん！とっきゅうは 4だい！',
      note: '4つの とっきゅうを ひとつずつ かぞえてね',
    },
  },
  {
    id: 'quiz-real-kansai-kyushu-five',
    name: 'おまつりの でんしゃ 5だい',
    image: `${BASE}images/quiz_real_kansai_kyushu_five.png`,
    hints: [
      'はんきゅう、けいはん、ひのとりが いるよ！',
      'ラピートと ゆふいんの森も みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'おまつりの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ちがう かたちの でんしゃを ぜんぶ かぞえよう',
      success: 'すごい！5だい ぜんぶ みつけたね！',
      note: 'おまつり の せんろの でんしゃを かぞえてね',
    },
  },
  {
    id: 'quiz-real-tokyo-metro-six',
    name: 'とうきょうメトロ ちかえき 6だい',
    image: `${BASE}images/quiz_real_tokyo_metro_six.png`,
    hints: [
      'オレンジ、あか、あお、みどりの ちかてつ！',
      'むらさき と エメラルドの でんしゃも いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 6,
      prompt: 'ちかてつは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ホームにいる メトロの でんしゃを かぞえてね',
      success: 'せいかい！メトロは 6だい！',
      note: 'ちかえき の でんしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'quiz-real-seaside-rail-five',
    name: 'うみべの でんしゃ 5だい',
    image: `${BASE}images/quiz_real_seaside_rail_five.png`,
    hints: [
      'えのでん と モノレールが うみの そばに いるよ！',
      'サフィール踊り子と よこすかせんも さがしてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 5,
      prompt: 'うみべの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'そらの レールと うみぞいの レールを みてね',
      success: 'やったね！うみべに 5だい いたね！',
      note: 'うみ の ちかくの でんしゃを かぞえてね',
    },
  },
  {
    id: 'quiz-real-sleeper-night-four',
    name: 'よるの ねだいれっしゃ 4だい',
    image: `${BASE}images/quiz_real_sleeper_night_four.png`,
    hints: [
      'サンライズ と カシオペアが よるの えきに いるよ！',
      'みずかぜ と あおい ねだいれっしゃも みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'ねだいれっしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'よるの えきに とまっている れっしゃを かぞえてね',
      success: 'ぴかぴか！ねだいれっしゃ 4だい！',
      note: 'よる の えきの れっしゃを ぜんぶ かぞえてね',
    },
  },
  {
    id: 'quiz-real-airport-access-four',
    name: 'くうこうへ いくでんしゃ 4だい',
    image: `${BASE}images/quiz_real_airport_access_four.png`,
    hints: [
      '成田エクスプレスと スカイライナーが いるよ！',
      'けいきゅう と モノレールも くうこうへ いくよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 4,
      prompt: 'くうこうでんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ひこうきの ちかくの でんしゃを かぞえてね',
      success: 'せいかい！くうこうへ いく でんしゃは 4だい！',
      note: 'くうこう の まわりの でんしゃを かぞえてね',
    },
  },
  {
    id: 'quiz-real-snow-work-six',
    name: 'ゆきの はたらくでんしゃ 6だい',
    image: `${BASE}images/quiz_real_snow_work_six.png`,
    hints: [
      'ラッセルしゃ と かもつれっしゃが はたらくよ！',
      'SL と しんかんせんも ゆきの なかに いるよ！',
    ],
    countQuiz: {
      enabled: true,
      answer: 6,
      prompt: 'ゆきの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'ゆきの せんろにいる でんしゃを ぜんぶ かぞえてね',
      success: 'すごい！ゆきの でんしゃ 6だい！',
      note: 'ゆき の なかの はたらく でんしゃを かぞえてね',
    },
  },
  {
    id: 'quiz-real-railway-museum-eight',
    name: 'てつどうはくぶつかん 8だい',
    image: `${BASE}images/quiz_real_railway_museum_eight.png`,
    hints: [
      'しんかんせん と とっきゅうが ならんでいるよ！',
      'やまのてせん と 成田エクスプレスも みつけてね！',
    ],
    countQuiz: {
      enabled: true,
      answer: 8,
      prompt: 'はくぶつかんの でんしゃは なんだい？',
      choices: [4, 5, 6, 7, 8],
      hint: 'うえ と したに ならんだ でんしゃを ぜんぶ かぞえてね',
      success: 'たいへんよくできました！8だい せいかい！',
      note: 'はくぶつかん の でんしゃを ぜんぶ かぞえてね',
    },
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
