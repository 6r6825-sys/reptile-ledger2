/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - PIXEL MASCOTS ENGINE
 * Provides 50 authentic 32x32 pixel-art interactive animal companions (5 大類各 10 種滿載):
 * 
 * --- 🦎 爬蟲與兩棲類 (10款) ---
 * 1. 黃色鬆獅蜥 (bearded-dragon)
 * 2. 立可白肥尾守宮 (whiteout-gecko)
 * 3. 黑夜豹紋守宮 (black-night-gecko)
 * 4. 高冠變色龍 (veiled-chameleon)
 * 5. 睫角守宮 (crested-gecko)
 * 6. 藍舌石龍子 (blue-tongue-skink)
 * 7. 赫曼陸龜 (hermann-tortoise)
 * 8. 玉米錦蛇 (corn-snake)
 * 9. 墨西哥六角恐龍 (axolotl)
 * 10. 沙漠王者蜥 (uromastyx)
 * 
 * --- 🐶 狗狗萌寵 (10款) ---
 * 11. 赤柴犬 (shiba-inu)
 * 12. 威爾斯柯基犬 (corgi)
 * 13. 黃金獵犬 (golden-retriever)
 * 14. 泰迪貴賓狗 (poodle-teddy)
 * 15. 法國鬥牛犬 (french-bulldog)
 * 16. 長毛臘腸狗 (dachshund)
 * 17. 西伯利亞哈士奇 (husky)
 * 18. 薩摩耶犬 (samoyed)
 * 19. 邊境牧羊犬 (border-collie)
 * 20. 雪納瑞 (schnauzer)
 * 
 * --- 🐱 貓咪萌寵 (10款) ---
 * 21. 大橘貓 (ginger-cat)
 * 22. 英國短毛藍貓 (british-shorthair)
 * 23. 招財三花貓 (calico-cat)
 * 24. 皇家暹羅貓 (siamese-cat)
 * 25. 仙女布偶貓 (ragdoll-cat)
 * 26. 辟邪黑貓 (black-cat)
 * 27. 美國短毛虎斑貓 (american-shorthair)
 * 28. 波斯貓 (persian-cat)
 * 29. 蘇格蘭摺耳貓 (scottish-fold)
 * 30. 賓士黑白貓 (tuxedo-cat)
 * 
 * --- 🦜 鳥禽與猛禽 (10款) ---
 * 31. 玄鳳鸚鵡 (cockatiel)
 * 32. 虎皮鸚鵡 (budgerigar)
 * 33. 白文鳥 (java-sparrow)
 * 34. 雨傘巴丹鸚鵡 (cockatoo)
 * 35. 哈里斯栗翅鷹 (harris-hawk)
 * 36. 桃面愛情鳥 (lovebird)
 * 37. 倉鴞猴面鷹 (barn-owl)
 * 38. 綠頰小太陽鸚鵡 (green-cheek-conure)
 * 39. 彩虹巨嘴鳥 (keel-billed-toucan)
 * 40. 緋紅金剛鸚鵡 (scarlet-macaw)
 * 
 * --- 🐹 倉鼠與小寵 (10款) ---
 * 41. 黃金倉鼠金絲熊 (golden-hamster)
 * 42. 三線紫倉鼠 (djungarian-hamster)
 * 43. 老公公倉鼠 (roborovski-hamster)
 * 44. 荷蘭天竺鼠 (guinea-pig)
 * 45. 龍貓毛絲鼠 (chinchilla)
 * 46. 蜜袋鼯 (sugar-glider)
 * 47. 非洲迷你刺蝟 (hedgehog)
 * 48. 荷蘭垂耳兔 (lop-rabbit)
 * 49. 蒙眼雪貂 (ferret)
 * 50. 療癒水豚君 (capybara)
 */

const ReptileMascots = (() => {
  let containerEl = null;
  let statusTextEl = null;
  let currentMood = 'normal'; // 'normal' | 'happy' | 'confused' | 'action'

  const MASCOTS = {
    // 1. 黃色鬆獅蜥 (Yellow Bearded Dragon)
    'bearded-dragon': {
      id: 'bearded-dragon',
      name: '黃色鬆獅蜥',
      category: 'reptile',
      subtitle: '陽光元氣・金黃刺刺',
      tag: '鬆獅蜥',
      description: '金黃砂岩色澤，下巴帶有標誌性的刺刺鬍鬚，借貸平衡時會開心點頭揮手！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#4a3e36" />
          <rect x="4" y="26" width="24" height="3" fill="#2d2520" />
          <rect x="24" y="22" width="4" height="4" fill="#3b312b" />
          <rect x="2" y="19" width="4" height="3" fill="#e5a11d" />
          <rect x="6" y="18" width="4" height="3" fill="#f5b027" />
          <rect x="10" y="14" width="11" height="9" fill="#f9bf34" />
          <rect x="12" y="15" width="2" height="2" fill="#d98c15" />
          <rect x="16" y="15" width="2" height="2" fill="#d98c15" />
          <rect x="14" y="18" width="3" height="2" fill="#d98c15" />
          <rect x="10" y="21" width="1" height="2" fill="#fae084" />
          <rect x="13" y="22" width="1" height="2" fill="#fae084" />
          <rect x="16" y="22" width="1" height="2" fill="#fae084" />
          <rect x="19" y="21" width="1" height="2" fill="#fae084" />
          <rect x="9" y="21" width="3" height="4" fill="#e5a11d" />
          <rect x="18" y="21" width="3" height="4" fill="#e5a11d" />
          <rect x="21" y="11" width="8" height="7" fill="#f9bf34" />
          <rect x="27" y="13" width="3" height="4" fill="#f9bf34" />
          <rect x="21" y="18" width="2" height="2" fill="#d98c15" />
          <rect x="23" y="18" width="2" height="3" fill="#c47a0b" />
          <rect x="25" y="18" width="2" height="2" fill="#d98c15" />
          ${mood === 'happy' ? `<rect x="23" y="21" width="2" height="2" fill="#ffd700" />` : ''}
          <rect x="23" y="12" width="3" height="3" fill="#ffeaa7" />
          ${
            mood === 'happy'
              ? `<rect x="24" y="13" width="2" height="1" fill="#4b382a" />`
              : mood === 'confused'
              ? `<rect x="23" y="12" width="2" height="2" fill="#c0392b" /><rect x="28" y="7" width="2" height="3" fill="#ff5555" />`
              : `<rect x="24" y="13" width="2" height="2" fill="#301f11" />`
          }
          <rect x="27" y="16" width="3" height="1" fill="#4a311b" />
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="15" width="3" height="3" fill="#f1c40f" stroke="#b7950b" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 2. 立可白肥尾守宮 (Whiteout African Fat-tailed Gecko)
    'whiteout-gecko': {
      id: 'whiteout-gecko',
      name: '立可白肥尾守宮',
      category: 'reptile',
      subtitle: '軟萌圓滾・天使立可白',
      tag: '肥尾守宮',
      description: '經典 Whiteout 立可白品系，背脊一條明亮雪白縱紋，配上水滴般圓潤飽滿的肥肥尾巴！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#3e3835" />
          <rect x="4" y="26" width="24" height="3" fill="#262220" />
          <rect x="3" y="15" width="6" height="7" fill="#6d4c41" />
          <rect x="2" y="17" width="7" height="4" fill="#8d6e63" />
          <rect x="4" y="17" width="4" height="3" fill="#ffffff" />
          <rect x="5" y="15" width="2" height="7" fill="#f5f5f5" />
          <rect x="9" y="14" width="12" height="9" fill="#5d4037" />
          <rect x="8" y="16" width="14" height="3" fill="#ffffff" />
          <rect x="10" y="15" width="10" height="1" fill="#f8f9fa" />
          <rect x="11" y="19" width="3" height="3" fill="#8d6e63" />
          <rect x="16" y="19" width="3" height="3" fill="#8d6e63" />
          <rect x="9" y="22" width="3" height="3" fill="#d7ccc8" />
          <rect x="18" y="22" width="3" height="3" fill="#d7ccc8" />
          <rect x="21" y="13" width="8" height="8" fill="#5d4037" />
          <rect x="21" y="16" width="6" height="2" fill="#ffffff" />
          <rect x="28" y="15" width="2" height="4" fill="#6d4c41" />
          <rect x="22" y="13" width="4" height="4" fill="#1b120c" />
          <rect x="23" y="13" width="1" height="1" fill="#ffffff" />
          <rect x="24" y="14" width="1" height="1" fill="#a1887f" />
          ${mood === 'confused' ? `<rect x="27" y="9" width="2" height="3" fill="#e74c3c" />` : ''}
          <rect x="26" y="19" width="3" height="1" fill="#3e2723" />
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="26" y="18" width="2" height="1" fill="#ff8a80" /><rect x="28" y="18" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 3. 黑夜豹紋守宮 (Black Night Leopard Gecko)
    'black-night-gecko': {
      id: 'black-night-gecko',
      name: '黑夜豹紋守宮',
      category: 'reptile',
      subtitle: '極致黑化・幽夜貴族',
      tag: '豹紋守宮',
      description: '傳奇 Black Night 純黑品系，通體深邃黑曜石炭黑，配上冷峻高貴的金色瞳孔！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#1e2022" />
          <rect x="4" y="26" width="24" height="3" fill="#121314" />
          <rect x="25" y="22" width="3" height="4" fill="#18191b" />
          <rect x="2" y="18" width="4" height="3" fill="#18181b" />
          <rect x="5" y="16" width="4" height="4" fill="#24252a" />
          <rect x="3" y="18" width="1" height="1" fill="#383a42" />
          <rect x="6" y="16" width="1" height="1" fill="#383a42" />
          <rect x="9" y="13" width="12" height="9" fill="#161618" />
          <rect x="11" y="14" width="3" height="2" fill="#2c2d35" />
          <rect x="16" y="14" width="3" height="2" fill="#2c2d35" />
          <rect x="13" y="17" width="4" height="2" fill="#23242a" />
          <rect x="9" y="21" width="3" height="4" fill="#27272a" />
          <rect x="18" y="21" width="3" height="4" fill="#27272a" />
          <rect x="21" y="12" width="8" height="7" fill="#161618" />
          <rect x="28" y="14" width="2" height="4" fill="#161618" />
          <rect x="23" y="11" width="3" height="1" fill="#2c2d35" />
          <rect x="23" y="12" width="3" height="3" fill="#ffd700" />
          ${
            mood === 'happy'
              ? `<rect x="24" y="13" width="2" height="1" fill="#000000" />`
              : mood === 'confused'
              ? `<rect x="23" y="12" width="2" height="2" fill="#ff3838" /><rect x="28" y="8" width="2" height="3" fill="#ff3838" />`
              : `<rect x="24" y="12" width="1" height="3" fill="#000000" />`
          }
          <rect x="26" y="17" width="3" height="1" fill="#09090b" />
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="16" width="3" height="3" fill="#00ffff" stroke="#00b4d8" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 4. 高冠變色龍 (Veiled Chameleon)
    'veiled-chameleon': {
      id: 'veiled-chameleon',
      name: '高冠變色龍',
      category: 'reptile',
      subtitle: '傲嬌高冠・綠林神射',
      tag: '變色龍',
      description: '頭頂如騎士頭盔般的高聳尖冠，獨立轉動的靈動大眼睛，借貸平衡時會神射吐舌抓金幣！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#543d2b" />
          <rect x="4" y="22" width="4" height="3" fill="#27ae60" />
          <rect x="2" y="18" width="4" height="4" fill="#2ecc71" />
          <rect x="4" y="16" width="4" height="3" fill="#2ecc71" />
          <rect x="8" y="13" width="12" height="10" fill="#2ecc71" />
          <rect x="11" y="14" width="2" height="8" fill="#27ae60" />
          <rect x="15" y="14" width="2" height="8" fill="#27ae60" />
          <rect x="9" y="19" width="9" height="3" fill="#a8e6cf" />
          <rect x="9" y="22" width="3" height="3" fill="#27ae60" />
          <rect x="17" y="22" width="3" height="3" fill="#27ae60" />
          <rect x="20" y="6" w="7" height="8" fill="#27ae60" />
          <rect x="22" y="5" width="4" height="4" fill="#2ecc71" />
          <rect x="20" y="11" width="9" height="8" fill="#2ecc71" />
          <rect x="28" y="14" width="2" height="4" fill="#27ae60" />
          <rect x="22" y="13" width="4" height="4" fill="#1b8a47" />
          <rect x="23" y="14" width="2" height="2" fill="#0c2b18" />
          ${mood === 'confused' ? `<rect x="27" y="8" width="2" height="3" fill="#e74c3c" />` : ''}
          <rect x="27" y="17" width="3" height="1" fill="#1b8a47" />
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="16" width="3" height="2" fill="#ff7675" /><rect x="29" y="15" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 5. 睫角守宮 (Crested Gecko)
    'crested-gecko': {
      id: 'crested-gecko',
      name: '睫角守宮',
      category: 'reptile',
      subtitle: '睫毛精靈・呆萌跳跳',
      tag: '睫角守宮',
      description: '眼眶上長著像睫毛一樣的柔軟刺棘，愛歪頭賣萌、舔自己大眼球的跳跳小精靈！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#6ab04c" />
          <rect x="3" y="18" width="5" height="4" fill="#e67e22" />
          <rect x="8" y="13" width="12" height="10" fill="#e67e22" />
          <rect x="8" y="13" width="12" height="3" fill="#fde3a7" />
          <rect x="10" y="16" width="8" height="2" fill="#f39c12" />
          <rect x="8" y="22" width="3" height="3" fill="#f5cd79" />
          <rect x="17" y="22" width="3" height="3" fill="#f5cd79" />
          <rect x="20" y="11" width="9" height="9" fill="#e67e22" />
          <rect x="19" y="9" width="3" height="3" fill="#d35400" />
          <rect x="22" y="9" width="2" height="3" fill="#d35400" />
          <rect x="22" y="12" width="4" height="4" fill="#1e272e" />
          <rect x="23" y="12" width="1" height="1" fill="#ffffff" />
          <rect x="28" y="15" width="2" height="4" fill="#d35400" />
          <rect x="26" y="18" width="3" height="1" fill="#873600" />
          ${mood === 'confused' ? `<rect x="27" y="7" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="23" y="11" width="3" height="3" fill="#ff7675" /><rect x="28" y="17" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 6. 藍舌石龍子 (Blue-tongued Skink)
    'blue-tongue-skink': {
      id: 'blue-tongue-skink',
      name: '藍舌石龍子',
      category: 'reptile',
      subtitle: '圓滾香腸・霸氣藍舌',
      tag: '藍舌蜥',
      description: '胖乎乎圓滾滾的香腸身材，配上呆萌的小短腿與一張極具反差萌的鮮豔深藍色大舌頭！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#4a423d" />
          <rect x="3" y="17" width="4" height="4" fill="#8d6e63" />
          <rect x="6" y="14" width="14" height="9" fill="#8d6e63" />
          <rect x="9" y="14" width="2" height="9" fill="#4e342e" />
          <rect x="14" y="14" width="2" height="9" fill="#4e342e" />
          <rect x="7" y="22" width="3" height="3" fill="#a1887f" />
          <rect x="16" y="22" width="3" height="3" fill="#a1887f" />
          <rect x="20" y="13" width="8" height="8" fill="#8d6e63" />
          <rect x="27" y="15" width="2" height="4" fill="#6d4c41" />
          <rect x="22" y="14" width="3" height="3" fill="#2d1d17" />
          <rect x="23" y="14" width="1" height="1" fill="#d7ccc8" />
          <rect x="26" y="18" width="5" height="3" fill="#0984e3" />
          ${mood === 'confused' ? `<rect x="27" y="8" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="16" width="3" height="3" fill="#f1c40f" stroke="#b7950b" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 7. 赫曼陸龜 (Hermann's Tortoise)
    'hermann-tortoise': {
      id: 'hermann-tortoise',
      name: '赫曼陸龜',
      category: 'reptile',
      subtitle: '穩重金甲・慢活壽星',
      tag: '陸龜',
      description: '背著高聳圓拱的黑黃幾何盾紋龜殼，慢條斯理地爬行，借貸平衡時會把頭伸得老長！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4a6b28" />
          <rect x="6" y="10" width="15" height="13" fill="#d4ac0d" />
          <rect x="9" y="12" width="3" height="3" fill="#2c2c2c" />
          <rect x="15" y="12" width="3" height="3" fill="#2c2c2c" />
          <rect x="12" y="16" width="4" height="4" fill="#2c2c2c" />
          <rect x="6" y="21" width="15" height="3" fill="#f1c40f" />
          <rect x="7" y="22" width="4" height="4" fill="#627850" />
          <rect x="15" y="22" width="4" height="4" fill="#627850" />
          <rect x="20" y="16" width="7" height="6" fill="#789262" />
          <rect x="26" y="18" width="2" height="3" fill="#627850" />
          <rect x="23" y="17" width="2" height="2" fill="#1b120c" />
          ${mood === 'confused' ? `<rect x="27" y="10" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="12" y="7" width="3" height="3" fill="#f1c40f" stroke="#b7950b" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 8. 玉米錦蛇 (Corn Snake)
    'corn-snake': {
      id: 'corn-snake',
      name: '玉米錦蛇',
      category: 'reptile',
      subtitle: '斑斕錦緞・溫柔小麵',
      tag: '玉米蛇',
      description: '紅白相間的華麗錦緞鞍紋，性情溫馴乖巧，盤成優雅甜甜圈靜靜看著您記帳！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#ded7c6" />
          <rect x="5" y="17" width="17" height="7" fill="#e67e22" />
          <rect x="7" y="16" width="4" height="8" fill="#e74c3c" />
          <rect x="14" y="16" width="4" height="8" fill="#e74c3c" />
          <rect x="10" y="15" width="8" height="5" fill="#f39c12" />
          <rect x="19" y="12" width="8" height="7" fill="#e74c3c" />
          <rect x="26" y="14" width="2" height="4" fill="#c0392b" />
          <rect x="22" y="13" width="2" height="2" fill="#581845" />
          <rect x="23" y="13" width="1" height="1" fill="#ff7675" />
          <rect x="27" y="16" width="4" height="1" fill="#ff7675" />
          <rect x="30" y="15" width="1" height="3" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="7" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="13" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 9. 墨西哥六角恐龍 (Axolotl)
    'axolotl': {
      id: 'axolotl',
      name: '墨西哥六角恐龍',
      category: 'reptile',
      subtitle: '水中天使・微笑萌神',
      tag: '六角恐龍',
      description: '粉嫩半透明的軟萌身軀，頭部兩側長著羽毛般的鮮紅外鰓，永遠掛著天使般的治癒微笑！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#74b9ff" />
          <rect x="2" y="16" width="6" height="5" fill="#ffccd2" />
          <rect x="8" y="14" width="12" height="9" fill="#ffb8b8" />
          <rect x="9" y="22" width="3" height="3" fill="#ffccd2" />
          <rect x="16" y="22" width="3" height="3" fill="#ffccd2" />
          <rect x="19" y="12" width="9" height="9" fill="#ffb8b8" />
          <rect x="17" y="10" width="3" height="2" fill="#ff4757" />
          <rect x="17" y="13" width="3" height="2" fill="#ff4757" />
          <rect x="17" y="16" width="3" height="2" fill="#ff4757" />
          <rect x="23" y="14" width="2" height="2" fill="#2d3436" />
          <rect x="27" y="15" width="2" height="2" fill="#ff7675" />
          <rect x="24" y="18" width="4" height="1" fill="#d63031" />
          ${mood === 'confused' ? `<rect x="28" y="7" width="2" height="3" fill="#0984e3" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="14" width="3" height="3" fill="#f1c40f" stroke="#e17055" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 10. 沙漠王者蜥 (Uromastyx)
    'uromastyx': {
      id: 'uromastyx',
      name: '沙漠王者蜥',
      category: 'reptile',
      subtitle: '烈日戰車・刺刺狼牙',
      tag: '王者蜥',
      description: '大漠中的素食恐龍，粗壯圓滾的黃金體魄，配上威武霸氣如狼牙棒般的帶刺尾巴！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="24" width="28" height="5" fill="#8c3a27" />
          <rect x="2" y="16" width="7" height="7" fill="#b8860b" />
          <rect x="1" y="17" width="1" height="2" fill="#d4ac0d" />
          <rect x="3" y="15" width="2" height="1" fill="#d4ac0d" />
          <rect x="5" y="15" width="2" height="1" fill="#d4ac0d" />
          <rect x="9" y="13" width="12" height="10" fill="#d4ac0d" />
          <rect x="11" y="14" width="3" height="4" fill="#b8860b" />
          <rect x="16" y="14" width="3" height="4" fill="#b8860b" />
          <rect x="8" y="22" width="3" height="3" fill="#b8860b" />
          <rect x="18" y="22" width="3" height="3" fill="#b8860b" />
          <rect x="20" y="12" width="8" height="8" fill="#d4ac0d" />
          <rect x="27" y="14" width="2" height="4" fill="#b8860b" />
          <rect x="23" y="14" width="2" height="2" fill="#3e2723" />
          ${mood === 'confused' ? `<rect x="27" y="7" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="16" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 11. 赤柴犬 (Shiba Inu)
    'shiba-inu': {
      id: 'shiba-inu',
      name: '赤柴犬',
      category: 'dog',
      subtitle: '元氣微笑・柴柴萬歲',
      tag: '柴犬',
      description: '經典赤柴色澤與白色臉頰（裏白），捲捲的小尾巴配上治癒的柴犬大笑臉！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#95af74" />
          <rect x="3" y="12" width="5" height="5" fill="#e67e22" />
          <rect x="4" y="13" width="2" height="2" fill="#ffffff" />
          <rect x="8" y="13" width="13" height="10" fill="#d35400" />
          <rect x="11" y="16" width="8" height="7" fill="#ffffff" />
          <rect x="9" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="19" y="9" width="10" height="10" fill="#e67e22" />
          <rect x="18" y="6" width="3" height="4" fill="#b03a2e" />
          <rect x="25" y="6" width="3" height="4" fill="#b03a2e" />
          <rect x="20" y="14" width="8" height="5" fill="#ffffff" />
          <rect x="21" y="12" width="2" height="2" fill="#1e272e" />
          <rect x="26" y="12" width="2" height="2" fill="#1e272e" />
          <rect x="24" y="14" width="2" height="2" fill="#1e272e" />
          <rect x="24" y="16" width="2" height="2" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 12. 威爾斯柯基犬 (Corgi)
    'corgi': {
      id: 'corgi',
      name: '威爾斯柯基犬',
      category: 'dog',
      subtitle: '愛心電臀・短腿萌神',
      tag: '柯基犬',
      description: '超大立耳、白色圍兜與標誌性的小短腿，走起路來左右搖擺的愛心毛毛大屁屁！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#a1887f" />
          <rect x="2" y="14" width="5" height="5" fill="#e67e22" />
          <rect x="7" y="14" width="14" height="9" fill="#e67e22" />
          <rect x="10" y="18" width="8" height="5" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="17" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="19" y="10" width="10" height="9" fill="#e67e22" />
          <rect x="18" y="5" width="4" height="6" fill="#d35400" />
          <rect x="19" y="6" width="2" height="4" fill="#ffccd2" />
          <rect x="25" y="5" width="4" height="6" fill="#d35400" />
          <rect x="26" y="6" width="2" height="4" fill="#ffccd2" />
          <rect x="23" y="10" width="2" height="7" fill="#ffffff" />
          <rect x="21" y="13" width="2" height="2" fill="#2c3e50" />
          <rect x="26" y="13" width="2" height="2" fill="#2c3e50" />
          <rect x="23" y="15" width="2" height="2" fill="#2c3e50" />
          <rect x="23" y="17" width="2" height="2" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="16" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 13. 黃金獵犬 (Golden Retriever)
    'golden-retriever': {
      id: 'golden-retriever',
      name: '黃金獵犬',
      category: 'dog',
      subtitle: '暖心天使・大汪汪大笑',
      tag: '黃金獵犬',
      description: '一身溫暖柔順的金黃波浪毛，眼神溫柔忠誠，最喜歡幫主人把收支帳目平衡叼回來！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#34495e" />
          <rect x="2" y="14" width="5" height="5" fill="#f1c40f" />
          <rect x="7" y="12" width="14" height="11" fill="#f1c40f" />
          <rect x="9" y="16" width="10" height="7" fill="#f9e79f" />
          <rect x="8" y="22" width="3" height="4" fill="#f39c12" />
          <rect x="17" y="22" width="3" height="4" fill="#f39c12" />
          <rect x="19" y="9" width="10" height="11" fill="#f39c12" />
          <rect x="17" y="11" width="3" height="7" fill="#d68910" />
          <rect x="28" y="11" width="3" height="7" fill="#d68910" />
          <rect x="21" y="12" width="2" height="2" fill="#3e2723" />
          <rect x="26" y="12" width="2" height="2" fill="#3e2723" />
          <rect x="23" y="14" width="3" height="2" fill="#1b120c" />
          <rect x="23" y="17" width="3" height="2" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="24" y="16" width="4" height="4" fill="#f1c40f" stroke="#b7950b" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 14. 泰迪貴賓狗 (Poodle Teddy)
    'poodle-teddy': {
      id: 'poodle-teddy',
      name: '泰迪貴賓狗',
      category: 'dog',
      subtitle: '焦糖泡芙・捲毛甜心',
      tag: '貴賓狗',
      description: '像玩偶熊般軟綿綿的巧克力焦糖捲捲毛，圓溜溜的黑豆眼睛，永遠活力充沛跳呀跳！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#ffb8b8" />
          <rect x="4" y="13" width="4" height="4" fill="#8b4513" />
          <rect x="8" y="13" width="12" height="10" fill="#a0522d" />
          <rect x="10" y="14" width="3" height="3" fill="#8b4513" />
          <rect x="15" y="14" width="3" height="3" fill="#8b4513" />
          <rect x="9" y="22" width="3" height="4" fill="#8b4513" />
          <rect x="16" y="22" width="3" height="4" fill="#8b4513" />
          <rect x="18" y="8" width="11" height="11" fill="#a0522d" />
          <rect x="16" y="10" width="3" height="8" fill="#8b4513" />
          <rect x="28" y="10" width="3" height="8" fill="#8b4513" />
          <rect x="21" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="26" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="23" y="14" width="3" height="2" fill="#1a1a1a" />
          <rect x="24" y="16" width="1" height="1" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 15. 大橘貓 (Ginger Tabby Cat)
    'ginger-cat': {
      id: 'ginger-cat',
      name: '大橘貓',
      category: 'cat',
      subtitle: '十橘九胖・壓垮秤盤',
      tag: '橘貓',
      description: '圓滾滾福氣滿滿的大橘貓，只要借貸完全平衡，就會露出軟糯肉球跟發出呼嚕嚕大滿意！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#90a4ae" />
          <rect x="2" y="18" width="6" height="4" fill="#e67e22" />
          <rect x="4" y="18" width="2" height="4" fill="#ba4a00" />
          <rect x="7" y="13" width="15" height="11" fill="#e67e22" />
          <rect x="10" y="14" width="2" height="7" fill="#ba4a00" />
          <rect x="14" y="14" width="2" height="7" fill="#ba4a00" />
          <rect x="10" y="18" width="8" height="6" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="17" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="19" y="10" width="10" height="9" fill="#e67e22" />
          <rect x="19" y="7" width="3" height="4" fill="#e67e22" />
          <rect x="20" y="8" width="1" height="2" fill="#ff8a80" />
          <rect x="26" y="7" width="3" height="4" fill="#e67e22" />
          <rect x="27" y="8" width="1" height="2" fill="#ff8a80" />
          <rect x="21" y="13" width="2" height="2" fill="#27ae60" />
          <rect x="26" y="13" width="2" height="2" fill="#27ae60" />
          <rect x="24" y="14" width="1" height="1" fill="#ff8a80" />
          <rect x="23" y="15" width="3" height="1" fill="#ba4a00" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 16. 英國短毛藍貓 (British Shorthair)
    'british-shorthair': {
      id: 'british-shorthair',
      name: '英國短毛藍貓',
      category: 'cat',
      subtitle: '圓臉發腮・紳士藍貓',
      tag: '英短藍貓',
      description: '包子大圓臉與茂密的銀灰藍被毛，配上一對金澄澄的銅色大眼睛，優雅從容的高冷管家！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#2c3e50" />
          <rect x="2" y="17" width="6" height="4" fill="#546e7a" />
          <rect x="7" y="13" width="13" height="10" fill="#546e7a" />
          <rect x="10" y="15" width="8" height="6" fill="#455a64" />
          <rect x="8" y="22" width="3" height="4" fill="#607d8b" />
          <rect x="16" y="22" width="3" height="4" fill="#607d8b" />
          <rect x="18" y="10" width="11" height="10" fill="#607d8b" />
          <rect x="18" y="7" width="3" height="4" fill="#546e7a" />
          <rect x="19" y="8" width="1" height="2" fill="#ffab91" />
          <rect x="26" y="7" width="3" height="4" fill="#546e7a" />
          <rect x="27" y="8" width="1" height="2" fill="#ffab91" />
          <rect x="20" y="13" width="3" height="3" fill="#f39c12" />
          <rect x="21" y="13" width="1" height="3" fill="#1b120c" />
          <rect x="25" y="13" width="3" height="3" fill="#f39c12" />
          <rect x="26" y="13" width="1" height="3" fill="#1b120c" />
          <rect x="24" y="15" width="1" height="1" fill="#cfd8dc" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 17. 招財三花貓 (Calico Cat)
    'calico-cat': {
      id: 'calico-cat',
      name: '招財三花貓',
      category: 'cat',
      subtitle: '招財納福・吉祥三花',
      tag: '三花貓',
      description: '白、黑、橘招財三色毛色，高舉小肉爪為您的財務帶來滾滾財源與福氣！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#c0392b" />
          <rect x="3" y="16" width="5" height="5" fill="#e67e22" />
          <rect x="8" y="13" width="13" height="10" fill="#ffffff" />
          <rect x="9" y="14" width="4" height="5" fill="#2d3436" />
          <rect x="14" y="14" width="4" height="5" fill="#d35400" />
          <rect x="9" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="19" y="10" width="10" height="9" fill="#ffffff" />
          <rect x="18" y="7" width="3" height="4" fill="#2d3436" />
          <rect x="26" y="7" width="3" height="4" fill="#d35400" />
          <rect x="21" y="13" width="2" height="2" fill="#27ae60" />
          <rect x="26" y="13" width="2" height="2" fill="#27ae60" />
          <rect x="24" y="15" width="1" height="1" fill="#ff8a80" />
          <rect x="20" y="18" width="8" height="2" fill="#e74c3c" />
          <rect x="23" y="19" width="2" height="2" fill="#f1c40f" />
          <rect x="26" y="14" width="3" height="4" fill="#ffffff" />
          <rect x="27" y="15" width="2" height="2" fill="#ff8a80" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="27" y="12" width="4" height="4" fill="#f1c40f" stroke="#b7950b" stroke-width="0.5" />`
              : ''
          }
        </svg>
      `
    },

    // 18. 玄鳳鸚鵡 (Cockatiel)
    'cockatiel': {
      id: 'cockatiel',
      name: '玄鳳鸚鵡',
      category: 'bird',
      subtitle: '招牌腮紅・俏皮高冠',
      tag: '玄鳳鸚鵡',
      description: '臉頰上兩顆圓滾滾的鮮豔大腮紅，頭頂豎起高聳羽冠，心情好時會瘋狂唱歌吹口哨！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#6d4c41" />
          <rect x="3" y="20" width="6" height="4" fill="#546e7a" />
          <rect x="8" y="14" width="12" height="10" fill="#78909c" />
          <rect x="9" y="16" width="3" height="7" fill="#ffffff" />
          <rect x="11" y="23" width="2" height="3" fill="#cfd8dc" />
          <rect x="15" y="23" width="2" height="3" fill="#cfd8dc" />
          <rect x="18" y="11" width="9" height="8" fill="#fdd835" />
          <rect x="19" y="5" width="4" height="7" fill="#ffeb3b" />
          <rect x="21" y="4" width="2" height="3" fill="#fdd835" />
          <rect x="22" y="13" width="2" height="2" fill="#1a1a1a" />
          <rect x="24" y="14" width="3" height="3" fill="#e64a19" />
          <rect x="27" y="14" width="3" height="3" fill="#607d8b" />
          ${mood === 'confused' ? `<rect x="27" y="7" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="13" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 19. 虎皮鸚鵡 (Budgerigar)
    'budgerigar': {
      id: 'budgerigar',
      name: '虎皮鸚鵡',
      category: 'bird',
      subtitle: '晴空藍羽・虎斑靈動',
      tag: '虎皮鸚鵡',
      description: '胸前一抹清爽亮麗的天空藍，翅膀飾有黑黃相間的細密虎皮斑紋，活潑好動愛聊天！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#795548" />
          <rect x="4" y="20" width="6" height="4" fill="#0097a7" />
          <rect x="9" y="14" width="11" height="9" fill="#00bcd4" />
          <rect x="6" y="15" width="6" height="8" fill="#fbc02d" />
          <rect x="6" y="16" width="6" height="1" fill="#212121" />
          <rect x="6" y="18" width="6" height="1" fill="#212121" />
          <rect x="6" y="20" width="6" height="1" fill="#212121" />
          <rect x="12" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="16" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="18" y="10" width="9" height="8" fill="#ffeb3b" />
          <rect x="21" y="12" width="2" height="2" fill="#1b120c" />
          <rect x="23" y="14" width="2" height="2" fill="#7b1fa2" />
          <rect x="27" y="13" width="3" height="3" fill="#fbc02d" />
          ${mood === 'confused' ? `<rect x="27" y="6" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="12" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 20. 白文鳥 (Java Sparrow)
    'java-sparrow': {
      id: 'java-sparrow',
      name: '白文鳥',
      category: 'bird',
      subtitle: '雪白大福・紅豆小嘴',
      tag: '白文鳥',
      description: '像剛出爐圓滾雪白大福麻糬，配上一顆鮮紅剔透的小豆豆嘴，生氣時會澎成一顆大雪球！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4e342e" />
          <rect x="8" y="12" width="13" height="12" fill="#ffffff" />
          <rect x="8" y="20" width="13" height="4" fill="#eceff1" />
          <rect x="11" y="23" width="2" height="3" fill="#ff80ab" />
          <rect x="16" y="23" width="2" height="3" fill="#ff80ab" />
          <rect x="18" y="11" width="8" height="8" fill="#ffffff" />
          <rect x="21" y="14" width="2" height="2" fill="#1a1a1a" />
          <rect x="20" y="13" width="4" height="4" fill="none" stroke="#e53935" stroke-width="0.5" />
          <rect x="24" y="14" width="5" height="4" fill="#e53935" />
          <rect x="28" y="15" width="2" height="2" fill="#ff8a80" />
          ${mood === 'confused' ? `<rect x="27" y="7" width="2" height="3" fill="#e74c3c" />` : ''}
          ${
            mood === 'happy' || mood === 'action'
              ? `<rect x="28" y="13" width="3" height="3" fill="#f1c40f" />`
              : ''
          }
        </svg>
      `
    },

    // 15. 法國鬥牛犬 (French Bulldog)
    'french-bulldog': {
      id: 'french-bulldog',
      name: '法國鬥牛犬',
      category: 'dog',
      subtitle: '蝙蝠大耳・憨萌法鬥',
      tag: '法鬥',
      description: '經典黑白乳牛花斑，標誌性的招風大蝙蝠耳朵，圓滾短胖身材，憨厚逗趣討人喜愛！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#607d8b" />
          <rect x="3" y="18" width="4" height="4" fill="#2d3436" />
          <rect x="7" y="14" width="13" height="10" fill="#ffffff" />
          <rect x="9" y="15" width="5" height="6" fill="#2d3436" />
          <rect x="8" y="22" width="3" height="4" fill="#2d3436" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="10" width="11" height="10" fill="#ffffff" />
          <rect x="18" y="10" width="6" height="6" fill="#2d3436" />
          <rect x="17" y="5" width="4" height="6" fill="#2d3436" />
          <rect x="18" y="6" width="2" height="4" fill="#ff8a80" />
          <rect x="26" y="5" width="4" height="6" fill="#ffffff" />
          <rect x="27" y="6" width="2" height="4" fill="#ff8a80" />
          <rect x="20" y="12" width="2" height="2" fill="#1e272e" />
          <rect x="26" y="12" width="2" height="2" fill="#1e272e" />
          <rect x="22" y="14" width="4" height="3" fill="#1e272e" />
          <rect x="23" y="16" width="2" height="2" fill="#ff8a80" />
          ${mood === 'confused' ? `<rect x="28" y="3" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 16. 長毛臘腸狗 (Long-haired Dachshund)
    'dachshund': {
      id: 'dachshund',
      name: '長毛臘腸狗',
      category: 'dog',
      subtitle: '小短腿長身・機靈臘腸',
      tag: '臘腸狗',
      description: '長長的身軀配上可愛的小短腿，深棕焦糖色長毛與垂垂大耳朵，嗅覺敏銳查帳最細心！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#5d4037" />
          <rect x="2" y="16" width="4" height="4" fill="#6e3b1f" />
          <rect x="5" y="15" width="16" height="8" fill="#a0522d" />
          <rect x="7" y="22" width="2" height="4" fill="#6e3b1f" />
          <rect x="18" y="22" width="2" height="4" fill="#6e3b1f" />
          <rect x="19" y="11" width="10" height="9" fill="#a0522d" />
          <rect x="18" y="12" width="3" height="8" fill="#6e3b1f" />
          <rect x="28" y="12" width="3" height="7" fill="#6e3b1f" />
          <rect x="23" y="13" width="2" height="2" fill="#1e272e" />
          <rect x="27" y="14" width="3" height="3" fill="#1e272e" />
          <rect x="24" y="17" width="2" height="1" fill="#ff8a80" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 17. 西伯利亞哈士奇 (Siberian Husky)
    'husky': {
      id: 'husky',
      name: '西伯利亞哈士奇',
      category: 'dog',
      subtitle: '帥氣二哈・晴空藍眸',
      tag: '哈士奇',
      description: '額前經典「三把火」灰黑白斑紋，一雙冰晶澄澈的晴空藍眼睛，看似帥氣狼王實則搞笑二哈！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#37474f" />
          <rect x="3" y="14" width="4" height="4" fill="#ffffff" />
          <rect x="7" y="13" width="13" height="10" fill="#455a64" />
          <rect x="9" y="15" width="6" height="8" fill="#ffffff" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#455a64" />
          <rect x="19" y="5" width="3" height="5" fill="#37474f" />
          <rect x="26" y="5" width="3" height="5" fill="#37474f" />
          <rect x="22" y="9" width="3" height="4" fill="#ffffff" />
          <rect x="20" y="13" width="7" height="6" fill="#ffffff" />
          <rect x="20" y="12" width="2" height="2" fill="#00bcd4" />
          <rect x="26" y="12" width="2" height="2" fill="#00bcd4" />
          <rect x="23" y="14" width="3" height="2" fill="#1a1a1a" />
          <rect x="24" y="16" width="2" height="2" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 18. 薩摩耶犬 (Samoyed)
    'samoyed': {
      id: 'samoyed',
      name: '薩摩耶犬',
      category: 'dog',
      subtitle: '微笑天使・白雪大棉花',
      tag: '薩摩耶',
      description: '全身如雲朵般純白蓬鬆的柔軟厚毛，嘴角天生上揚帶笑，永遠帶給您治癒溫暖好心情！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#b0bec5" />
          <rect x="3" y="13" width="5" height="5" fill="#ffffff" />
          <rect x="7" y="12" width="14" height="11" fill="#ffffff" />
          <rect x="9" y="14" width="8" height="5" fill="#eceff1" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="8" width="12" height="12" fill="#ffffff" />
          <rect x="19" y="5" width="3" height="4" fill="#ffffff" />
          <rect x="20" y="6" width="1" height="2" fill="#ffcdd2" />
          <rect x="27" y="5" width="3" height="4" fill="#ffffff" />
          <rect x="28" y="6" width="1" height="2" fill="#ffcdd2" />
          <rect x="21" y="12" width="2" height="2" fill="#111111" />
          <rect x="27" y="12" width="2" height="2" fill="#111111" />
          <rect x="24" y="14" width="2" height="2" fill="#111111" />
          <rect x="23" y="16" width="4" height="2" fill="#ff7675" />
          ${mood === 'confused' ? `<rect x="28" y="3" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="14" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 19. 邊境牧羊犬 (Border Collie)
    'border-collie': {
      id: 'border-collie',
      name: '邊境牧羊犬',
      category: 'dog',
      subtitle: '天才犬種・專注靈動',
      tag: '邊境牧羊犬',
      description: '犬界智商第一名！經典黑白對稱花紋與圍脖，眼神銳利專注，任何帳目差額都逃不過牠法眼！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#424242" />
          <rect x="2" y="14" width="5" height="4" fill="#212121" />
          <rect x="2" y="17" width="3" height="3" fill="#ffffff" />
          <rect x="7" y="13" width="13" height="10" fill="#212121" />
          <rect x="12" y="14" width="6" height="8" fill="#ffffff" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#212121" />
          <rect x="18" y="5" width="3" height="5" fill="#212121" />
          <rect x="26" y="5" width="3" height="5" fill="#ffffff" />
          <rect x="22" y="9" width="3" height="6" fill="#ffffff" />
          <rect x="21" y="15" width="6" height="4" fill="#ffffff" />
          <rect x="20" y="12" width="2" height="2" fill="#e67e22" />
          <rect x="26" y="12" width="2" height="2" fill="#e67e22" />
          <rect x="23" y="14" width="2" height="2" fill="#111111" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 20. 雪納瑞 (Schnauzer)
    'schnauzer': {
      id: 'schnauzer',
      name: '雪納瑞',
      category: 'dog',
      subtitle: '紳士絡腮鬍・機警小老頭',
      tag: '雪納瑞',
      description: '濃密的小老頭八字鬍與長長眉毛，性格活潑忠誠機敏，隨時為您看守錢包與財務金庫！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#546e7a" />
          <rect x="4" y="16" width="3" height="3" fill="#455a64" />
          <rect x="7" y="13" width="12" height="10" fill="#607d8b" />
          <rect x="8" y="22" width="3" height="4" fill="#eceff1" />
          <rect x="15" y="22" width="3" height="4" fill="#eceff1" />
          <rect x="18" y="9" width="11" height="11" fill="#78909c" />
          <rect x="18" y="5" width="3" height="5" fill="#455a64" />
          <rect x="26" y="5" width="3" height="5" fill="#455a64" />
          <rect x="20" y="10" width="3" height="2" fill="#eceff1" />
          <rect x="25" y="10" width="3" height="2" fill="#eceff1" />
          <rect x="21" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="25" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="23" y="14" width="2" height="2" fill="#111111" />
          <rect x="20" y="15" width="8" height="5" fill="#eceff1" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 24. 皇家暹羅貓 (Siamese Cat)
    'siamese-cat': {
      id: 'siamese-cat',
      name: '皇家暹羅貓',
      category: 'cat',
      subtitle: '挖煤小臉・海藍寶石眸',
      tag: '暹羅貓',
      description: '泰國古老貴族貓，招牌深朱古力色「挖煤」小臉與耳朵，配上一對攝人心魄的深藍晶透大眼！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4e342e" />
          <rect x="2" y="16" width="6" height="4" fill="#4e342e" />
          <rect x="7" y="13" width="13" height="10" fill="#f5ede3" />
          <rect x="8" y="22" width="3" height="4" fill="#4e342e" />
          <rect x="16" y="22" width="3" height="4" fill="#4e342e" />
          <rect x="18" y="10" width="11" height="10" fill="#f5ede3" />
          <rect x="18" y="6" width="3" height="5" fill="#4e342e" />
          <rect x="26" y="6" width="3" height="5" fill="#4e342e" />
          <rect x="21" y="12" width="6" height="6" fill="#4e342e" />
          <rect x="21" y="12" width="2" height="2" fill="#1e88e5" />
          <rect x="25" y="12" width="2" height="2" fill="#1e88e5" />
          <rect x="23" y="15" width="2" height="1" fill="#1b120c" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 25. 仙女布偶貓 (Ragdoll Cat)
    'ragdoll-cat': {
      id: 'ragdoll-cat',
      name: '仙女布偶貓',
      category: 'cat',
      subtitle: '藍眸仙子・蓬鬆甜心',
      tag: '布偶貓',
      description: '貓界顏值天花板！湛藍深邃如星空的雙眼，海豹重點色漸層與雪白長毛，性格溫柔黏人愛撒嬌。',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#b0bec5" />
          <rect x="2" y="16" width="6" height="5" fill="#78909c" />
          <rect x="7" y="12" width="14" height="11" fill="#ffffff" />
          <rect x="9" y="14" width="8" height="6" fill="#eceff1" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#ffffff" />
          <rect x="18" y="6" width="3" height="5" fill="#6d4c41" />
          <rect x="26" y="6" width="3" height="5" fill="#6d4c41" />
          <rect x="21" y="11" width="6" height="5" fill="#bcaaa4" />
          <rect x="21" y="12" width="2" height="2" fill="#0288d1" />
          <rect x="25" y="12" width="2" height="2" fill="#0288d1" />
          <rect x="23" y="14" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 26. 辟邪黑貓 (Black Cat)
    'black-cat': {
      id: 'black-cat',
      name: '辟邪黑貓',
      category: 'cat',
      subtitle: '辟邪招財・黑曜靈瞳',
      tag: '黑貓',
      description: '古籍記載玄貓能辟邪鎮宅！一身絲緞般純黑毛皮，配上一雙金澄澄的滿月大眼，神祕又優雅！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#37474f" />
          <rect x="2" y="16" width="6" height="4" fill="#181818" />
          <rect x="7" y="13" width="13" height="10" fill="#181818" />
          <rect x="9" y="15" width="8" height="6" fill="#2c3e50" />
          <rect x="8" y="22" width="3" height="4" fill="#181818" />
          <rect x="16" y="22" width="3" height="4" fill="#181818" />
          <rect x="18" y="9" width="11" height="11" fill="#181818" />
          <rect x="18" y="5" width="3" height="5" fill="#181818" />
          <rect x="19" y="6" width="1" height="3" fill="#ff80ab" />
          <rect x="26" y="5" width="3" height="5" fill="#181818" />
          <rect x="27" y="6" width="1" height="3" fill="#ff80ab" />
          <rect x="20" y="12" width="3" height="3" fill="#ffd700" />
          <rect x="21" y="13" width="1" height="2" fill="#111111" />
          <rect x="25" y="12" width="3" height="3" fill="#ffd700" />
          <rect x="26" y="13" width="1" height="2" fill="#111111" />
          <rect x="24" y="15" width="1" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 27. 美國短毛虎斑貓 (American Shorthair)
    'american-shorthair': {
      id: 'american-shorthair',
      name: '美國短毛虎斑貓',
      category: 'cat',
      subtitle: '銀灰回力鏢・經典渦紋',
      tag: '美短虎斑',
      description: '銀灰底色飾以清晰優雅的黑色古典回力鏢渦卷斑紋，健壯結實，性格獨立開朗又貼心！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#455a64" />
          <rect x="2" y="17" width="6" height="4" fill="#cfd8dc" />
          <rect x="3" y="18" width="2" height="3" fill="#263238" />
          <rect x="7" y="13" width="13" height="10" fill="#cfd8dc" />
          <rect x="9" y="14" width="2" height="7" fill="#263238" />
          <rect x="13" y="14" width="3" height="7" fill="#263238" />
          <rect x="17" y="15" width="2" height="5" fill="#263238" />
          <rect x="8" y="22" width="3" height="4" fill="#cfd8dc" />
          <rect x="16" y="22" width="3" height="4" fill="#cfd8dc" />
          <rect x="18" y="9" width="11" height="11" fill="#cfd8dc" />
          <rect x="18" y="6" width="3" height="4" fill="#263238" />
          <rect x="26" y="6" width="3" height="4" fill="#263238" />
          <rect x="22" y="10" width="4" height="1" fill="#263238" />
          <rect x="20" y="12" width="2" height="2" fill="#2e7d32" />
          <rect x="26" y="12" width="2" height="2" fill="#2e7d32" />
          <rect x="23" y="14" width="2" height="2" fill="#ff8a80" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 28. 波斯貓 (Persian Cat)
    'persian-cat': {
      id: 'persian-cat',
      name: '波斯貓',
      category: 'cat',
      subtitle: '華貴長毛・金銀鴛鴦眼',
      tag: '波斯貓',
      description: '奢華如絲緞的純白蓬鬆長毛，精緻扁平的小娃娃臉龐，特別擁有金黃與海藍的稀有異色鴛鴦眼！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#b0bec5" />
          <rect x="3" y="15" width="6" height="6" fill="#ffffff" />
          <rect x="7" y="12" width="14" height="12" fill="#ffffff" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="8" width="13" height="12" fill="#ffffff" />
          <rect x="18" y="6" width="3" height="3" fill="#ffcdd2" />
          <rect x="27" y="6" width="3" height="3" fill="#ffcdd2" />
          <rect x="20" y="12" width="2" height="2" fill="#fbc02d" />
          <rect x="26" y="12" width="2" height="2" fill="#29b6f6" />
          <rect x="23" y="14" width="2" height="2" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 29. 蘇格蘭摺耳貓 (Scottish Fold)
    'scottish-fold': {
      id: 'scottish-fold',
      name: '蘇格蘭摺耳貓',
      category: 'cat',
      subtitle: '服貼小耳・圓滾小海豹',
      tag: '摺耳貓',
      description: '緊緊服貼在圓圓大腦袋上的精緻小摺耳，像一顆圓滾滾軟綿綿的小海豹，眼神無辜惹人憐愛！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#78909c" />
          <rect x="3" y="17" width="5" height="4" fill="#ffe082" />
          <rect x="7" y="13" width="13" height="10" fill="#ffe082" />
          <rect x="10" y="15" width="6" height="6" fill="#ffffff" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#ffe082" />
          <rect x="18" y="9" width="2" height="2" fill="#ffa000" />
          <rect x="28" y="9" width="2" height="2" fill="#ffa000" />
          <rect x="20" y="12" width="2" height="2" fill="#f57c00" />
          <rect x="26" y="12" width="2" height="2" fill="#f57c00" />
          <rect x="23" y="14" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 30. 賓士黑白貓 (Tuxedo Cat)
    'tuxedo-cat': {
      id: 'tuxedo-cat',
      name: '賓士黑白貓',
      category: 'cat',
      subtitle: '黑白燕尾服・搗蛋紳士',
      tag: '賓士貓',
      description: '穿著正式黑白燕尾服、白手套與正中白色鼻樑花紋，精力充沛思維跳躍，永遠帶給您歡笑！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#37474f" />
          <rect x="2" y="16" width="6" height="4" fill="#1e272e" />
          <rect x="7" y="13" width="13" height="10" fill="#1e272e" />
          <rect x="11" y="15" width="6" height="7" fill="#ffffff" />
          <rect x="8" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="16" y="22" width="3" height="4" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#1e272e" />
          <rect x="18" y="6" width="3" height="4" fill="#1e272e" />
          <rect x="26" y="6" width="3" height="4" fill="#1e272e" />
          <rect x="23" y="12" width="2" height="7" fill="#ffffff" />
          <rect x="20" y="12" width="2" height="2" fill="#4caf50" />
          <rect x="26" y="12" width="2" height="2" fill="#4caf50" />
          <rect x="23" y="15" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 34. 雨傘巴丹鸚鵡 (Cockatoo)
    'cockatoo': {
      id: 'cockatoo',
      name: '雨傘巴丹鸚鵡',
      category: 'bird',
      subtitle: '狂野葵花冠・熱情舞王',
      tag: '巴丹鸚鵡',
      description: '純白無瑕的羽翼，頭頂豎起高聳醒目的鮮黃扇形大冠羽，興奮時會左右狂甩頭跳踢踏舞！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#546e7a" />
          <rect x="4" y="19" width="6" height="5" fill="#eceff1" />
          <rect x="8" y="12" width="12" height="12" fill="#ffffff" />
          <rect x="10" y="23" width="2" height="3" fill="#78909c" />
          <rect x="15" y="23" width="2" height="3" fill="#78909c" />
          <rect x="17" y="9" width="10" height="9" fill="#ffffff" />
          <!-- 標誌性葵花羽冠 -->
          <rect x="18" y="3" width="4" height="7" fill="#ffd700" />
          <rect x="21" y="2" width="3" height="5" fill="#fff176" />
          <rect x="24" y="4" width="3" height="4" fill="#ffd700" />
          <rect x="21" y="12" width="2" height="2" fill="#111111" />
          <rect x="25" y="12" width="4" height="5" fill="#263238" />
          <rect x="24" y="14" width="2" height="2" fill="#ffcdd2" />
          ${mood === 'confused' ? `<rect x="28" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="28" y="12" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 35. 哈里斯栗翅鷹 (Harris's Hawk)
    'harris-hawk': {
      id: 'harris-hawk',
      name: '哈里斯栗翅鷹',
      category: 'bird',
      subtitle: '空中獵手・栗紅鷹翅',
      tag: '栗翅鷹',
      description: '鷹獵名門栗翅鷹！深棕頭身配栗紅斑斕肩翅，銳利如金的鷹隼雙眼與黃色彎鉤銳喙，威風凜凜！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#3e2723" />
          <rect x="4" y="18" width="5" height="6" fill="#212121" />
          <rect x="8" y="12" width="12" height="12" fill="#3e2723" />
          <!-- 栗紅肩翅 -->
          <rect x="9" y="13" width="4" height="8" fill="#c0392b" />
          <rect x="13" y="14" width="3" height="7" fill="#8e281e" />
          <rect x="10" y="23" width="2" height="3" fill="#fbc02d" />
          <rect x="15" y="23" width="2" height="3" fill="#fbc02d" />
          <rect x="17" y="8" width="9" height="10" fill="#3e2723" />
          <rect x="20" y="11" width="2" height="2" fill="#ffd700" />
          <rect x="21" y="11" width="1" height="2" fill="#111111" />
          <!-- 銳利鷹喙 -->
          <rect x="24" y="11" width="4" height="3" fill="#fbc02d" />
          <rect x="27" y="13" width="2" height="3" fill="#1b120c" />
          ${mood === 'confused' ? `<rect x="27" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="13" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 36. 桃面愛情鳥 (Peach-faced Lovebird)
    'lovebird': {
      id: 'lovebird',
      name: '桃面愛情鳥',
      category: 'bird',
      subtitle: '蜜桃紅顏・情深意濃',
      tag: '愛情鳥',
      description: '翠綠羽身配上一整張嬌豔如蜜桃成熟的緋紅臉龐，成雙成對恩愛甜蜜，叫聲悅耳清脆！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4e342e" />
          <rect x="4" y="19" width="6" height="5" fill="#2e7d32" />
          <rect x="8" y="13" width="12" height="11" fill="#43a047" />
          <rect x="10" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="15" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="17" y="9" width="9" height="10" fill="#e91e63" />
          <rect x="16" y="10" width="3" height="8" fill="#ff80ab" />
          <rect x="21" y="12" width="2" height="2" fill="#111111" />
          <rect x="20" y="11" width="4" height="4" fill="none" stroke="#ffffff" stroke-width="0.5" />
          <rect x="25" y="12" width="4" height="4" fill="#fff59d" />
          ${mood === 'confused' ? `<rect x="27" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="28" y="12" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 37. 倉鴞猴面鷹 (Barn Owl)
    'barn-owl': {
      id: 'barn-owl',
      name: '倉鴞 (猴面鷹)',
      category: 'bird',
      subtitle: '蘋果心臉盤・靜謐守護',
      tag: '倉鴞',
      description: '獨一無二的心形蘋果白臉盤，淺金褐色絲絨羽毛點綴黑色細斑，無聲滑翔守望夜間財務！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4e342e" />
          <rect x="5" y="18" width="5" height="6" fill="#8d6e63" />
          <rect x="8" y="12" width="12" height="12" fill="#d7ccc8" />
          <rect x="10" y="14" width="3" height="6" fill="#8d6e63" />
          <rect x="15" y="14" width="3" height="6" fill="#8d6e63" />
          <rect x="10" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="15" y="23" width="2" height="3" fill="#ffb74d" />
          <rect x="17" y="8" width="10" height="11" fill="#8d6e63" />
          <rect x="18" y="9" width="8" height="8" fill="#ffffff" />
          <rect x="20" y="11" width="2" height="3" fill="#111111" />
          <rect x="24" y="11" width="2" height="3" fill="#111111" />
          <rect x="22" y="14" width="2" height="2" fill="#d7ccc8" />
          ${mood === 'confused' ? `<rect x="27" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="13" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 38. 綠頰小太陽鸚鵡 (Green-cheeked Conure)
    'green-cheek-conure': {
      id: 'green-cheek-conure',
      name: '綠頰小太陽鸚鵡',
      category: 'bird',
      subtitle: '鮮綠腮頰・赤紅尾羽',
      tag: '小太陽鸚鵡',
      description: '橄欖綠身軀配上深紅如火焰的漂亮長尾羽，臉頰兩側一抹靈動翠綠，聰明親人最愛躺手撒嬌！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#3e2723" />
          <rect x="3" y="19" width="7" height="5" fill="#c62828" />
          <rect x="8" y="13" width="12" height="11" fill="#689f38" />
          <rect x="10" y="15" width="4" height="6" fill="#c62828" />
          <rect x="10" y="23" width="2" height="3" fill="#78909c" />
          <rect x="15" y="23" width="2" height="3" fill="#78909c" />
          <rect x="17" y="9" width="9" height="10" fill="#546e7a" />
          <rect x="18" y="12" width="3" height="4" fill="#7cb342" />
          <rect x="21" y="12" width="2" height="2" fill="#111111" />
          <rect x="25" y="12" width="3" height="4" fill="#37474f" />
          ${mood === 'confused' ? `<rect x="27" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="28" y="12" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 39. 彩虹巨嘴鳥 (Keel-billed Toucan)
    'keel-billed-toucan': {
      id: 'keel-billed-toucan',
      name: '彩虹巨嘴鳥',
      category: 'bird',
      subtitle: '巨型彩喙・熱帶雨林之星',
      tag: '巨嘴鳥',
      description: '擁有佔全身三分之一的繽紛彩虹大鳥嘴，亮黑羽身與金黃胸羽，熱帶雨林中最耀眼的明星！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#263238" />
          <rect x="4" y="18" width="5" height="6" fill="#121212" />
          <rect x="7" y="13" width="11" height="11" fill="#121212" />
          <rect x="10" y="23" width="2" height="3" fill="#00bcd4" />
          <rect x="14" y="23" width="2" height="3" fill="#00bcd4" />
          <rect x="15" y="9" width="8" height="10" fill="#121212" />
          <rect x="16" y="11" width="5" height="7" fill="#ffd600" />
          <rect x="18" y="12" width="2" height="2" fill="#00e5ff" />
          <rect x="19" y="12" width="1" height="2" fill="#111111" />
          <rect x="22" y="10" width="7" height="6" fill="#76ff03" />
          <rect x="26" y="11" width="3" height="4" fill="#ff6d00" />
          <rect x="28" y="12" width="2" height="3" fill="#d50000" />
          ${mood === 'confused' ? `<rect x="27" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="28" y="9" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 40. 緋紅金剛鸚鵡 (Scarlet Macaw)
    'scarlet-macaw': {
      id: 'scarlet-macaw',
      name: '緋紅金剛鸚鵡',
      category: 'bird',
      subtitle: '雨林王者・華麗紅黃藍',
      tag: '金剛鸚鵡',
      description: '氣勢磅礡的雨林王者！鮮豔正紅、金黃與寶藍三色漸層長長羽尾，雙翼展翅時光彩奪目！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#3e2723" />
          <rect x="2" y="18" width="6" height="7" fill="#2962ff" />
          <rect x="7" y="12" width="12" height="12" fill="#d50000" />
          <rect x="9" y="14" width="3" height="6" fill="#ffd600" />
          <rect x="12" y="15" width="3" height="6" fill="#2962ff" />
          <rect x="10" y="23" width="2" height="3" fill="#37474f" />
          <rect x="15" y="23" width="2" height="3" fill="#37474f" />
          <rect x="16" y="8" width="9" height="11" fill="#d50000" />
          <rect x="18" y="10" width="5" height="5" fill="#eceff1" />
          <rect x="20" y="11" width="2" height="2" fill="#ffd600" />
          <rect x="21" y="11" width="1" height="2" fill="#111111" />
          <rect x="23" y="10" width="4" height="5" fill="#eceff1" />
          <rect x="25" y="13" width="2" height="3" fill="#212121" />
          ${mood === 'confused' ? `<rect x="27" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="12" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 41. 黃金倉鼠金絲熊 (Golden Hamster)
    'golden-hamster': {
      id: 'golden-hamster',
      name: '黃金倉鼠 (金絲熊)',
      category: 'small-pet',
      subtitle: '金絲毛絨・塞滿葵花子',
      tag: '倉鼠',
      description: '圓滾滾金黃絲絨被毛，腮幫子塞得鼓鼓囊囊像小包子，兩隻粉嫩小爪抓著葵花子狂啃不停！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#a1887f" />
          <rect x="6" y="13" width="16" height="11" fill="#f39c12" />
          <rect x="10" y="15" width="8" height="8" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffb8b8" />
          <rect x="17" y="23" width="3" height="3" fill="#ffb8b8" />
          <rect x="18" y="10" width="11" height="11" fill="#f39c12" />
          <rect x="18" y="7" width="3" height="4" fill="#f39c12" />
          <rect x="19" y="8" width="1" height="2" fill="#ff80ab" />
          <rect x="26" y="7" width="3" height="4" fill="#f39c12" />
          <rect x="27" y="8" width="1" height="2" fill="#ff80ab" />
          <rect x="21" y="13" width="2" height="2" fill="#111111" />
          <rect x="26" y="13" width="2" height="2" fill="#111111" />
          <rect x="23" y="15" width="2" height="1" fill="#ff80ab" />
          <rect x="22" y="17" width="4" height="4" fill="#3e2723" />
          <rect x="23" y="18" width="2" height="2" fill="#ffffff" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 42. 三線紫倉鼠 (Djungarian Hamster)
    'djungarian-hamster': {
      id: 'djungarian-hamster',
      name: '三線紫倉鼠',
      category: 'small-pet',
      subtitle: '芝麻小飯糰・溫馴親人',
      tag: '倉鼠',
      description: '背脊上一條標誌性的深灰背線，灰白相間像一顆剛捏好的小芝麻海苔飯糰，性格溫馴愛上手！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#78909c" />
          <rect x="6" y="14" width="16" height="10" fill="#b0bec5" />
          <rect x="9" y="14" width="3" height="8" fill="#455a64" />
          <rect x="10" y="16" width="8" height="7" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffb8b8" />
          <rect x="17" y="23" width="3" height="3" fill="#ffb8b8" />
          <rect x="18" y="11" width="11" height="10" fill="#b0bec5" />
          <rect x="19" y="8" width="3" height="4" fill="#78909c" />
          <rect x="26" y="8" width="3" height="4" fill="#78909c" />
          <rect x="21" y="13" width="2" height="2" fill="#111111" />
          <rect x="26" y="13" width="2" height="2" fill="#111111" />
          <rect x="23" y="15" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 43. 老公公倉鼠 (Roborovski Hamster)
    'roborovski-hamster': {
      id: 'roborovski-hamster',
      name: '老公公倉鼠',
      category: 'small-pet',
      subtitle: '白眉仙翁・超音速小毛球',
      tag: '倉鼠',
      description: '體型最小巧靈巧的侏儒倉鼠！眼睛上方兩道白白小眉毛宛如仙翁，奔跑如風動作極其敏捷！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#8d6e63" />
          <rect x="7" y="15" width="14" height="9" fill="#d7ccc8" />
          <rect x="10" y="17" width="8" height="6" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="16" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="18" y="11" width="10" height="10" fill="#d7ccc8" />
          <rect x="19" y="8" width="3" height="4" fill="#bcaaa4" />
          <rect x="25" y="8" width="3" height="4" fill="#bcaaa4" />
          <rect x="20" y="12" width="2" height="1" fill="#ffffff" />
          <rect x="25" y="12" width="2" height="1" fill="#ffffff" />
          <rect x="20" y="13" width="2" height="2" fill="#111111" />
          <rect x="25" y="13" width="2" height="2" fill="#111111" />
          <rect x="22" y="15" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="27" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 44. 荷蘭天竺鼠 (Guinea Pig)
    'guinea-pig': {
      id: 'guinea-pig',
      name: '荷蘭天竺鼠',
      category: 'small-pet',
      subtitle: '圓滾豚鼠・咕嚕吹哨叫',
      tag: '天竺鼠',
      description: '胖嘟嘟圓滾身材沒有尾巴，黑白棕三色斑塊，聞到草香時會興奮發出「PUI PUI」高亢哨音！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#6d4c41" />
          <rect x="4" y="13" width="18" height="11" fill="#ffffff" />
          <rect x="5" y="13" width="6" height="8" fill="#212121" />
          <rect x="13" y="14" width="7" height="8" fill="#d35400" />
          <rect x="7" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="18" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="18" y="10" width="11" height="11" fill="#d35400" />
          <rect x="18" y="9" width="3" height="3" fill="#a04000" />
          <rect x="27" y="9" width="3" height="3" fill="#a04000" />
          <rect x="22" y="12" width="2" height="2" fill="#111111" />
          <rect x="26" y="12" width="2" height="2" fill="#111111" />
          <rect x="23" y="15" width="3" height="2" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="16" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 45. 龍貓 (Chinchilla)
    'chinchilla': {
      id: 'chinchilla',
      name: '龍貓 (毛絲鼠)',
      category: 'small-pet',
      subtitle: '絲絨大耳朵・宮崎駿龍貓',
      tag: '龍貓',
      description: '世界上最細膩柔軟的銀灰皮毛，圓滾如球的身軀與大大的兔子耳朵，呆萌坐姿神似龍貓本尊！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#546e7a" />
          <rect x="3" y="16" width="5" height="5" fill="#78909c" />
          <rect x="7" y="12" width="15" height="12" fill="#78909c" />
          <rect x="10" y="14" width="8" height="8" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#eceff1" />
          <rect x="17" y="23" width="3" height="3" fill="#eceff1" />
          <rect x="18" y="9" width="11" height="11" fill="#78909c" />
          <rect x="17" y="4" width="4" height="6" fill="#78909c" />
          <rect x="18" y="5" width="2" height="4" fill="#ffcdd2" />
          <rect x="26" y="4" width="4" height="6" fill="#78909c" />
          <rect x="27" y="5" width="2" height="4" fill="#ffcdd2" />
          <rect x="20" y="12" width="2" height="2" fill="#111111" />
          <rect x="26" y="12" width="2" height="2" fill="#111111" />
          <rect x="23" y="14" width="2" height="2" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="3" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 46. 蜜袋鼯 (Sugar Glider)
    'sugar-glider': {
      id: 'sugar-glider',
      name: '蜜袋鼯',
      category: 'small-pet',
      subtitle: '水汪汪大眼・口袋滑翔機',
      tag: '蜜袋鼯',
      description: '擁有水汪汪無辜大黑眼睛與粉紅小鼻子，兩側展開薄薄的滑翔翼膜，最愛鑽進口袋溫暖睡覺！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#455a64" />
          <rect x="3" y="17" width="5" height="4" fill="#90a4ae" />
          <rect x="6" y="13" width="15" height="11" fill="#90a4ae" />
          <rect x="9" y="14" width="3" height="8" fill="#37474f" />
          <rect x="10" y="16" width="7" height="6" fill="#ffffff" />
          <rect x="7" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="16" y="23" width="3" height="3" fill="#ffcdd2" />
          <rect x="18" y="9" width="11" height="11" fill="#90a4ae" />
          <rect x="18" y="6" width="3" height="4" fill="#37474f" />
          <rect x="26" y="6" width="3" height="4" fill="#37474f" />
          <rect x="19" y="11" width="3" height="3" fill="#000000" />
          <rect x="20" y="11" width="1" height="1" fill="#ffffff" />
          <rect x="25" y="11" width="3" height="3" fill="#000000" />
          <rect x="26" y="11" width="1" height="1" fill="#ffffff" />
          <rect x="23" y="14" width="2" height="1" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 47. 非洲迷你刺蝟 (African Pygmy Hedgehog)
    'hedgehog': {
      id: 'hedgehog',
      name: '非洲迷你刺蝟',
      category: 'small-pet',
      subtitle: '帶刺小栗子・粉嫩軟肚皮',
      tag: '刺蝟',
      description: '背上排列整齊的黑白相間小刺刺，緊張時縮成一顆小刺球，放鬆時露出粉嫩軟糯的小肚肚！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#5d4037" />
          <rect x="5" y="11" width="16" height="12" fill="#424242" />
          <rect x="6" y="10" width="3" height="3" fill="#ffffff" />
          <rect x="11" y="10" width="3" height="3" fill="#ffffff" />
          <rect x="16" y="10" width="3" height="3" fill="#ffffff" />
          <rect x="8" y="14" width="3" height="3" fill="#ffffff" />
          <rect x="13" y="14" width="3" height="3" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffebee" />
          <rect x="17" y="23" width="3" height="3" fill="#ffebee" />
          <rect x="18" y="12" width="11" height="9" fill="#ffebee" />
          <rect x="19" y="10" width="2" height="2" fill="#ffcdd2" />
          <rect x="21" y="13" width="2" height="2" fill="#111111" />
          <rect x="26" y="14" width="3" height="3" fill="#111111" />
          ${mood === 'confused' ? `<rect x="28" y="5" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 48. 荷蘭垂耳兔 (Holland Lop Rabbit)
    'lop-rabbit': {
      id: 'lop-rabbit',
      name: '荷蘭垂耳兔',
      category: 'small-pet',
      subtitle: '垂耳大毛球・三瓣小嘴咬草',
      tag: '垂耳兔',
      description: '兩隻長長大耳朵乖順地垂在臉頰兩側，圓潤蓬鬆身軀與不停咀嚼的三瓣嘴，萌化所有人！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#8d6e63" />
          <rect x="3" y="17" width="5" height="4" fill="#ffffff" />
          <rect x="7" y="13" width="14" height="11" fill="#d7ccc8" />
          <rect x="9" y="15" width="7" height="6" fill="#ffffff" />
          <rect x="8" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="17" y="23" width="3" height="3" fill="#ffffff" />
          <rect x="18" y="9" width="11" height="11" fill="#d7ccc8" />
          <rect x="17" y="10" width="3" height="10" fill="#8d6e63" />
          <rect x="28" y="10" width="3" height="10" fill="#8d6e63" />
          <rect x="21" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="26" y="12" width="2" height="2" fill="#1a1a1a" />
          <rect x="23" y="14" width="2" height="2" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 49. 蒙眼雪貂 (Ferret)
    'ferret': {
      id: 'ferret',
      name: '蒙眼雪貂',
      category: 'small-pet',
      subtitle: '神祕眼罩・修長軟骨功',
      tag: '雪貂',
      description: '自帶黑色神祕佐羅面罩，修長靈活像麵條般的軟骨身材，好奇心旺盛最愛到處鑽洞探險！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#3e2723" />
          <rect x="2" y="18" width="6" height="4" fill="#3e2723" />
          <rect x="6" y="15" width="15" height="9" fill="#fff8e1" />
          <rect x="7" y="14" width="12" height="4" fill="#3e2723" />
          <rect x="8" y="23" width="2" height="3" fill="#3e2723" />
          <rect x="18" y="23" width="2" height="3" fill="#3e2723" />
          <rect x="19" y="10" width="10" height="9" fill="#fff8e1" />
          <rect x="19" y="8" width="2" height="3" fill="#3e2723" />
          <rect x="27" y="8" width="2" height="3" fill="#3e2723" />
          <rect x="19" y="11" width="10" height="3" fill="#212121" />
          <rect x="21" y="12" width="1" height="1" fill="#ffffff" />
          <rect x="26" y="12" width="1" height="1" fill="#ffffff" />
          <rect x="24" y="14" width="2" height="2" fill="#ff80ab" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    },

    // 50. 療癒水豚君 (Capybara)
    'capybara': {
      id: 'capybara',
      name: '水豚君 (卡皮巴拉)',
      category: 'small-pet',
      subtitle: '頭頂小橘子・與世無爭佛系王',
      tag: '水豚',
      description: '世界上體型最大的囓齒動物！頭頂一顆小橘子泡著溫泉，半瞇眼睛一臉平靜祥和，情緒穩定大師！',
      render: (mood) => `
        <svg class="pixel-mascot-svg" viewBox="0 0 32 32" width="54" height="54" shape-rendering="crispEdges">
          <rect x="2" y="25" width="28" height="4" fill="#4e342e" />
          <rect x="4" y="13" width="18" height="11" fill="#8d6e63" />
          <rect x="6" y="14" width="12" height="4" fill="#5d4037" />
          <rect x="7" y="23" width="3" height="3" fill="#5d4037" />
          <rect x="17" y="23" width="3" height="3" fill="#5d4037" />
          <rect x="18" y="11" width="11" height="11" fill="#8d6e63" />
          <rect x="18" y="9" width="3" height="3" fill="#5d4037" />
          <rect x="21" y="13" width="3" height="1" fill="#1a1a1a" />
          <rect x="25" y="15" width="4" height="3" fill="#5d4037" />
          <rect x="21" y="7" width="4" height="4" fill="#ff9800" />
          <rect x="22" y="6" width="2" height="1" fill="#4caf50" />
          ${mood === 'confused' ? `<rect x="28" y="4" width="2" height="3" fill="#e74c3c" />` : ''}
          ${mood === 'happy' || mood === 'action' ? `<rect x="27" y="15" width="3" height="3" fill="#f1c40f" />` : ''}
        </svg>
      `
    }
  };

  // Helper to group mascots into color profiles
  function getMascotColorGroup(mascotId) {
    const gold = [
      'bearded-dragon', 'golden-retriever', 'corgi', 'ginger-cat', 'shiba-inu',
      'golden-hamster', 'scottish-fold', 'barn-owl'
    ];
    const dark = [
      'black-night-gecko', 'black-cat', 'schnauzer', 'french-bulldog',
      'harris-hawk', 'ferret', 'tuxedo-cat'
    ];
    const green = [
      'veiled-chameleon', 'hermann-tortoise', 'lovebird', 'green-cheek-conure'
    ];
    const white = [
      'whiteout-gecko', 'axolotl', 'java-sparrow', 'samoyed',
      'persian-cat', 'cockatoo', 'chinchilla', 'hedgehog',
      'roborovski-hamster', 'lop-rabbit'
    ];
    const blue = [
      'blue-tongue-skink', 'british-shorthair', 'budgerigar', 'husky',
      'siamese-cat', 'ragdoll-cat', 'djungarian-hamster', 'sugar-glider',
      'keel-billed-toucan'
    ];
    if (gold.includes(mascotId)) return 'gold';
    if (dark.includes(mascotId)) return 'dark';
    if (green.includes(mascotId)) return 'green';
    if (white.includes(mascotId)) return 'white';
    if (blue.includes(mascotId)) return 'blue';
    return 'orange'; // crested-gecko, corn-snake, uromastyx, calico-cat, cockatiel, poodle-teddy, dachshund, border-collie, american-shorthair, scarlet-macaw, guinea-pig, capybara
  }

  // Helper to generate festive accessory SVG based on active theme and mascot color
  function getFestiveAccessorySvg(mascotId, theme, mood) {
    if (!['halloween', 'christmas', 'spring-festival', 'mid-autumn'].includes(theme)) {
      return '';
    }

    const colorGroup = getMascotColorGroup(mascotId);

    // 1. 萬聖節 (Halloween: 巫師南瓜尖頂帽與魔幻星輝)
    if (theme === 'halloween') {
      let ribbonColor = '#76ff03';
      let buckleColor = '#d500f9';
      let sparkColor = '#ff7518';

      if (colorGroup === 'gold') {
        ribbonColor = '#76ff03';  // 毒蘋果亮綠
        buckleColor = '#e040fb';  // 幻紫寶石
        sparkColor = '#ffd700';
      } else if (colorGroup === 'dark') {
        ribbonColor = '#ff6d00';  // 南瓜焰橘
        buckleColor = '#ffd700';  // 純金星芒
        sparkColor = '#00ffff';   // 幽火青藍
      } else if (colorGroup === 'green') {
        ribbonColor = '#ff1744';  // 魔藥赤紅
        buckleColor = '#00e5ff';  // 螢光水藍
        sparkColor = '#ff9100';
      } else if (colorGroup === 'white') {
        ribbonColor = '#ab47bc';  // 幽靈魅紫
        buckleColor = '#ff4081';  // 霓虹桃紅
        sparkColor = '#76ff03';
      } else if (colorGroup === 'blue') {
        ribbonColor = '#ff9100';  // 琥珀焰橙
        buckleColor = '#76ff03';  // 螢光萊姆
        sparkColor = '#80d8ff';
      } else { // orange
        ribbonColor = '#7c4dff';  // 夜魅暗紫
        buckleColor = '#ffd700';  // 黃金徽章
        sparkColor = '#ff3d00';
      }

      return `
        <!-- 萬聖節限定配飾：像素尖頂女巫南瓜帽 (依萌寵色系適配飾帶與寶石) -->
        <g class="festive-accessory accessory-halloween">
          <rect x="18" y="9" width="12" height="2" fill="#24143d" />
          <rect x="19" y="8" width="10" height="1" fill="#321b54" />
          <rect x="21" y="4" width="6" height="4" fill="#321b54" />
          <rect x="22" y="2" width="4" height="2" fill="#42246e" />
          <rect x="24" y="0" width="3" height="2" fill="#542e8c" />
          <rect x="26" y="1" width="2" height="2" fill="#6939ad" />
          <!-- 專屬色系飾帶與寶石 -->
          <rect x="21" y="7" width="6" height="2" fill="${ribbonColor}" />
          <rect x="23" y="7" width="2" height="2" fill="${buckleColor}" />
          <!-- 萬聖南瓜糖果與奇幻浮動星光 -->
          <rect x="29" y="4" width="2" height="2" fill="${sparkColor}" />
          ${mood === 'action' ? `<rect x="17" y="3" width="2" height="2" fill="${sparkColor}" /><rect x="29" y="1" width="3" height="3" fill="#ff7518" />` : ''}
        </g>
      `;
    }

    // 2. 聖誕節 (Christmas: 毛絨聖誕帽、冬青莓果與聖誕鈴鐺)
    if (theme === 'christmas') {
      let accent1 = '#1b5e20'; // 冬青綠
      let accent2 = '#f44336'; // 莓果紅
      let snowSparkle = '#ffffff';

      if (colorGroup === 'gold') {
        accent1 = '#1b5e20'; // 深松針綠
        accent2 = '#d32f2f'; // 聖誕紅
      } else if (colorGroup === 'dark') {
        accent1 = '#ffd700'; // 閃耀金鈴
        accent2 = '#ffffff'; // 純白雪花
        snowSparkle = '#e0f7fa';
      } else if (colorGroup === 'green') {
        accent1 = '#ffd700'; // 金色鈴鐺
        accent2 = '#ff1744'; // 糖果拐杖紅
      } else if (colorGroup === 'white') {
        accent1 = '#c62828'; // 絲絨緋紅
        accent2 = '#ffca28'; // 聖誕金星
      } else if (colorGroup === 'blue') {
        accent1 = '#ffca28'; // 暖冬金球
        accent2 = '#e53935'; // 漿果冬青
      } else { // orange
        accent1 = '#2e7d32'; // 森林翠綠
        accent2 = '#e0e0e0'; // 銀色雪鈴
      }

      return `
        <!-- 聖誕節限定配飾：聖誕老人毛絨帽與冬青飾品 (依萌寵色系適配裝飾) -->
        <g class="festive-accessory accessory-christmas">
          <!-- 蓬鬆雪白帽沿 (微立體陰影邊框) -->
          <rect x="18" y="8" width="13" height="4" fill="#2d4030" />
          <rect x="19" y="8" width="11" height="3" fill="#ffffff" />
          <rect x="20" y="10" width="9" height="1" fill="#cbd5e1" />
          <!-- 聖誕正紅帽身 -->
          <rect x="21" y="4" width="7" height="4" fill="#d32f2f" />
          <rect x="22" y="2" width="5" height="2" fill="#e53935" />
          <rect x="19" y="3" width="3" height="3" fill="#d32f2f" />
          <!-- 垂落雪白毛球 (含微邊框) -->
          <rect x="16" y="2" width="5" height="5" fill="#2d4030" />
          <rect x="17" y="3" width="3" height="3" fill="#ffffff" />
          <rect x="18" y="4" width="1" height="1" fill="#cbd5e1" />
          <!-- 專屬冬青葉與金色聖誕鈴鐺 -->
          <rect x="20" y="7" width="2" height="2" fill="${accent1}" />
          <rect x="22" y="7" width="2" height="2" fill="${accent2}" />
          <!-- 晶亮小雪花 -->
          <rect x="29" y="3" width="2" height="2" fill="${snowSparkle}" />
          ${mood === 'action' ? `<rect x="16" y="1" width="2" height="2" fill="#ffffff" /><rect x="29" y="0" width="2" height="2" fill="#ffd700" />` : ''}
        </g>
      `;
    }

    // 3. 春節 (Spring Festival: 吉祥財神冠、雙翼展翅與迎春元寶)
    if (theme === 'spring-festival') {
      let gemColor = '#00e676';
      let ingotColor = '#ffd700';
      let tasselColor = '#d50000';

      if (colorGroup === 'gold') {
        gemColor = '#00e676';   // 翡翠綠寶
        ingotColor = '#ffd700'; // 金鑲玉
        tasselColor = '#d50000';// 朱紅流蘇
      } else if (colorGroup === 'dark') {
        gemColor = '#ff1744';   // 紅寶石
        ingotColor = '#ffeb3b'; // 24K純金元寶
        tasselColor = '#ffd700';// 金絲流蘇
      } else if (colorGroup === 'green') {
        gemColor = '#ffd700';   // 招財金幣
        ingotColor = '#ff1744'; // 迎春朱砂
        tasselColor = '#ffd700';// 金黃流蘇
      } else if (colorGroup === 'white') {
        gemColor = '#00bfa5';   // 碧玉平安扣
        ingotColor = '#ffd700'; // 純金底飾
        tasselColor = '#ff1744';// 大紅穗子
      } else if (colorGroup === 'blue') {
        gemColor = '#ffd700';   // 金元寶
        ingotColor = '#ff5252'; // 吉祥如意結
        tasselColor = '#ffb300';
      } else { // orange
        gemColor = '#00e676';   // 翠玉元寶
        ingotColor = '#ffd700'; // 鎏金包邊
        tasselColor = '#d50000';
      }

      return `
        <!-- 春節限定配飾：吉祥財神雙翅冠與金元寶 (依萌寵色系適配寶石與流蘇) -->
        <g class="festive-accessory accessory-spring">
          <!-- 財神帽身 -->
          <rect x="20" y="4" width="8" height="5" fill="#c62828" />
          <rect x="21" y="2" width="6" height="2" fill="#b71c1c" />
          <rect x="19" y="8" width="10" height="2" fill="#ffd700" />
          <!-- 財神雙翼展翅 -->
          <rect x="16" y="6" width="4" height="2" fill="#b71c1c" />
          <rect x="15" y="5" width="2" height="3" fill="#ffd700" />
          <rect x="28" y="6" width="4" height="2" fill="#b71c1c" />
          <rect x="31" y="5" width="2" height="3" fill="#ffd700" />
          <!-- 額前招財進寶與寶石 -->
          <rect x="23" y="4" width="2" height="2" fill="${gemColor}" />
          <rect x="22" y="5" width="4" height="2" fill="${ingotColor}" />
          <!-- 兩側垂飾流蘇 -->
          <rect x="16" y="8" width="1" height="3" fill="${tasselColor}" />
          <rect x="31" y="8" width="1" height="3" fill="${tasselColor}" />
          ${mood === 'action' ? `<rect x="29" y="1" width="3" height="3" fill="#ffd700" /><rect x="18" y="1" width="2" height="2" fill="#ff4757" />` : ''}
        </g>
      `;
    }

    // 4. 中秋節 (Mid-Autumn: 玉兔雙耳飾、金桂天香與滿月光暈)
    if (theme === 'mid-autumn') {
      let innerEar = '#ffcc80';
      let flowerColor = '#ffd54f';
      let moonbeam = '#fff59d';

      if (colorGroup === 'gold') {
        innerEar = '#ffcc80';    // 蜜桃金兔耳
        flowerColor = '#ffd54f'; // 盛放金桂
      } else if (colorGroup === 'dark') {
        innerEar = '#cfd8dc';    // 皎潔銀兔耳
        flowerColor = '#fff59d'; // 滿月金光
        moonbeam = '#ffffff';
      } else if (colorGroup === 'green') {
        innerEar = '#a7ffeb';    // 碧玉清泉內耳
        flowerColor = '#ffca28'; // 桂花花瓣
      } else if (colorGroup === 'white') {
        innerEar = '#ff80ab';    // 落櫻粉兔耳
        flowerColor = '#ffd700'; // 金色月牙
      } else if (colorGroup === 'blue') {
        innerEar = '#80d8ff';    // 澄澈星光天藍
        flowerColor = '#ffe082'; // 月宮金桂
      } else { // orange
        innerEar = '#d1c4e9';    // 薰衣草晚霞耳
        flowerColor = '#ffb300'; // 丹桂飄香
      }

      return `
        <!-- 中秋節限定配飾：白玉兔雙耳飾與金桂月飾 (依萌寵色系適配內耳與桂花) -->
        <g class="festive-accessory accessory-midautumn">
          <!-- 玉兔左耳 (外框+耳身) -->
          <rect x="19" y="0" width="5" height="10" fill="#334155" />
          <rect x="20" y="1" width="3" height="8" fill="#ffffff" />
          <rect x="21" y="3" width="1" height="5" fill="${innerEar}" />
          <!-- 玉兔右耳 (外框+耳身) -->
          <rect x="24" y="0" width="5" height="10" fill="#334155" />
          <rect x="25" y="1" width="3" height="8" fill="#ffffff" />
          <rect x="26" y="3" width="1" height="5" fill="${innerEar}" />
          <!-- 金桂花頭飾 -->
          <rect x="23" y="6" width="2" height="2" fill="${flowerColor}" />
          <rect x="22" y="7" width="4" height="1" fill="${flowerColor}" />
          <rect x="23" y="8" width="2" height="1" fill="#fff59d" />
          <!-- 滿月皎潔月露 -->
          <rect x="29" y="3" width="2" height="2" fill="${moonbeam}" />
          ${mood === 'action' ? `<rect x="17" y="2" width="2" height="2" fill="#fbc02d" /><rect x="28" y="1" width="3" height="3" fill="#fff59d" />` : ''}
        </g>
      `;
    }

    return '';
  }

  return {
    getMascotList: () => Object.values(MASCOTS),
    getMascot: (id) => MASCOTS[id] || MASCOTS['bearded-dragon'],

    init: (avatarSelector, statusSelector) => {
      containerEl = document.querySelector(avatarSelector);
      statusTextEl = document.querySelector(statusSelector);

      const activeId = Store.getMascot();
      ReptileMascots.renderCurrent(activeId, 'normal');

      if (containerEl) {
        containerEl.addEventListener('click', () => {
          PixelAudio.playCoin();
          ReptileMascots.triggerAction();
        });
      }
    },

    renderCurrent: (mascotId, mood = 'normal') => {
      currentMood = mood;
      const mascot = MASCOTS[mascotId] || MASCOTS['bearded-dragon'];
      if (containerEl) {
        let svgStr = mascot.render(mood);
        const theme = Store.getTheme ? Store.getTheme() : 'obsidian-dark';
        const accessorySvg = getFestiveAccessorySvg(mascot.id, theme, mood);
        if (accessorySvg) {
          svgStr = svgStr.replace('</svg>', `${accessorySvg}</svg>`);
        }
        containerEl.innerHTML = svgStr;
        containerEl.setAttribute('title', `點擊【${mascot.name}】互動或更換萌寵！`);
      }
    },

    setBalanceStatus: (isBalanced, diffAmount = 0) => {
      const activeId = Store.getMascot();
      const mascot = MASCOTS[activeId] || MASCOTS['bearded-dragon'];

      if (isBalanced) {
        currentMood = 'happy';
        ReptileMascots.renderCurrent(activeId, 'happy');
        if (statusTextEl) {
          statusTextEl.innerHTML = `<span style="color:var(--balance-ok)">🐾【${mascot.name}】點頭認證：借貸完全平衡！</span>`;
        }
      } else {
        currentMood = 'confused';
        ReptileMascots.renderCurrent(activeId, 'confused');
        if (statusTextEl) {
          statusTextEl.innerHTML = `<span style="color:var(--balance-err)">🐾【${mascot.name}】困惑中：借貸差額 $${Math.abs(diffAmount)}</span>`;
        }
      }
    },

    triggerAction: () => {
      const activeId = Store.getMascot();
      ReptileMascots.renderCurrent(activeId, 'action');
      setTimeout(() => {
        ReptileMascots.renderCurrent(activeId, currentMood);
      }, 450);
    },

    switchMascot: (mascotId) => {
      if (!MASCOTS[mascotId]) return;
      Store.setMascot(mascotId);
      ReptileMascots.renderCurrent(mascotId, currentMood);
    }
  };
})();

// Alias for backwards compatibility
if (typeof window !== 'undefined') {
  window.ChameleonMascot = ReptileMascots;
}
