import { PRODUCTS } from './catalog.js'

const ZODIAC_KEY = 'bead-zodiac-profile'

export const ELEMENT_TONE = {
  火象: 'fire',
  水象: 'water',
  土象: 'earth',
  風象: 'air',
}

export function zodiacTone(element) {
  return ELEMENT_TONE[element] || 'air'
}

export function signIcon(id) {
  return `./zodiac/icon/${id}.png`
}

export function signBack(id) {
  return `./zodiac/back/${id}.png`
}

export const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name: '白羊座',
    symbol: '♈',
    element: '火象',
    range: '3.21 ~ 4.19',
    keywords: '勇敢開拓 · 熱情直接 · 行動力強 · 自信獨立 · 追求挑戰',
    reading:
      '白羊座充滿衝勁與冒險精神。需要增強自信、穩定情緒，讓能量持續而不急躁。',
    tip: '佩戴建議：左手增強行動與勇氣，右手幫助淨化、沉澱情緒。',
    crystals: [
      { name: '南紅瑪瑙', keywords: '活力 · 勇氣', reason: '激發勇氣，驅散猶豫。' },
      { name: '太陽石', keywords: '自信 · 樂觀', reason: '帶來樂觀，提升領導力。' },
      { name: '白水晶', keywords: '淨化 · 專注', reason: '淨化雜念，目標更清晰。' },
    ],
  },
  {
    id: 'taurus',
    name: '金牛座',
    symbol: '♉',
    element: '土象',
    range: '4.20 ~ 5.20',
    keywords: '穩定 · 豐盛 · 耐心 · 感官享受',
    reading:
      '金牛座重視踏實與感官享受。增強安全感與物質吸引力，幫助穩定情緒、享受當下，吸引財富與美好，建立舒適生活。',
    tip: '小貼士：可放在銀包、書枱或睡房，持續穩住豐盛能量。',
    crystals: [
      { name: '綠幽靈', keywords: '財富 · 成長', reason: '吸引財富，穩步成長。' },
      { name: '粉晶', keywords: '愛與和諧 · 價值', reason: '療癒內心，提升自我價值。' },
      { name: '高透黃水晶', keywords: '財富 · 自信', reason: '激發創造，招來好運。' },
      { name: '黃虎眼', keywords: '穩定 · 勇氣', reason: '增強決斷，穩住節奏。' },
    ],
  },
  {
    id: 'gemini',
    name: '雙子座',
    symbol: '♊',
    element: '風象',
    range: '5.21 ~ 6.21',
    keywords: '溝通 · 學習 · 好奇心 · 靈活',
    reading:
      '雙子座思維敏捷，善於交流，適應力強，好奇心旺盛。需要能量來提升專注、穩定情緒，避免思維過於分散。',
    tip: '使用場景：學習、寫作或社交前佩戴，幫助思緒歸位。',
    crystals: [
      { name: '天河石', keywords: '溝通 · 表達', reason: '順暢表達，少説一半。' },
      { name: '淨體白水晶', keywords: '淨化 · 聚焦', reason: '清理雜念，提升專注。' },
      { name: '玻利維亞紫水晶', keywords: '智慧 · 學習', reason: '讓思維沉穩，判斷更清。' },
      { name: '冰川藍海藍寶', keywords: '平靜 · 表達', reason: '説出感受，溝通更真誠。' },
    ],
  },
  {
    id: 'cancer',
    name: '巨蟹座',
    symbol: '♋',
    element: '水象',
    range: '6.22 ~ 7.22',
    keywords: '家庭 · 保護 · 安全感 · 共情',
    reading:
      '巨蟹座情感細膩，重視家庭與安全感，容易被情緒影響。增強情感能量、療癒內在，安撫情緒起伏，增強直覺，帶來溫暖與安全感。',
    tip: '小貼士：冥想時握晶深呼吸，想像月光溫柔環繞，釋放焦慮與疲憊。',
    crystals: [
      { name: '月光石', keywords: '平衡情緒 · 直覺', reason: '穩定心情，增強直覺。' },
      { name: '粉晶', keywords: '愛與療癒 · 接納', reason: '療癒傷口，溫柔自我接納。' },
      { name: '透體灰月光', keywords: '純淨守護 · 安神', reason: '安撫焦慮，給內心空間。' },
      { name: '藍天海藍寶', keywords: '溝通 · 釋放', reason: '説出感受，釋放壓抑。' },
    ],
  },
  {
    id: 'leo',
    name: '獅子座',
    symbol: '♌',
    element: '火象',
    range: '7.23 ~ 8.22',
    keywords: '自信耀眼 · 創造力強 · 領導力 · 慷慨大方 · 追求認可',
    reading:
      '獅子座天生光芒四射，渴望被看見。需要增強自信、吸引貴人，同時保持內心的平衡與謙遜。',
    tip: '佩戴建議：左手增強氣場與貴人運，右手幫助守護、收斂內在力量。',
    crystals: [
      { name: '高透黃水晶', keywords: '財富 · 自信', reason: '增強魅力，吸引貴人。' },
      { name: '黃虎眼', keywords: '力量 · 保護', reason: '增強決斷，守護能量場。' },
      { name: '草莓晶', keywords: '熱情 · 行動力', reason: '點燃熱情，帶來行動力。' },
    ],
  },
  {
    id: 'virgo',
    name: '處女座',
    symbol: '♍',
    element: '土象',
    range: '8.23 ~ 9.22',
    keywords: '分析 · 純淨 · 服務 · 完美主義',
    reading:
      '處女座觀察入微，追求秩序與完善。提升專注與分析力，淨化負能量，幫助身心平衡，追求美感與健康，建立有序生活。',
    tip: '小貼士：放在桌邊或隨身佩戴，幫助保持專注與身心平衡。',
    crystals: [
      { name: '玻利維亞紫水晶', keywords: '智慧 · 靈性', reason: '提升專注，思緒更清晰。' },
      { name: '綠幽靈', keywords: '淨化 · 成長', reason: '淨化負能，穩步成長。' },
      { name: '淨體白水晶', keywords: '淨化 · 平衡', reason: '清理過載，身心更平衡。' },
      { name: '黃螢石', keywords: '專注 · 秩序', reason: '提升專注，幫你建秩序。' },
    ],
  },
  {
    id: 'libra',
    name: '天秤座',
    symbol: '♎',
    element: '風象',
    range: '9.23 ~ 10.23',
    keywords: '平衡 · 合作 · 審美 · 和諧',
    reading:
      '天秤座追求和諧與平衡，善於協調關係，注重美感與公正，容易猶豫不決。需要能量來幫助做出選擇，增強內在平衡與自信。',
    tip: '使用場景：需要做選擇或進入社交場合前佩戴，幫助找到自己的中線。',
    crystals: [
      { name: '粉晶', keywords: '愛 · 和諧', reason: '滋養關係，愛得更平衡。' },
      { name: '綠英石', keywords: '平衡 · 療癒', reason: '帶來轉機，少卡在兩難。' },
      { name: '月光石', keywords: '直覺 · 靈感', reason: '聽見內心更安靜的答案。' },
      { name: '白水晶', keywords: '淨化 · 平衡', reason: '去掉比較，選真正想要的。' },
    ],
  },
  {
    id: 'scorpio',
    name: '天蠍座',
    symbol: '♏',
    element: '水象',
    range: '10.24 ~ 11.22',
    keywords: '深度 · 蜕變 · 直覺 · 神秘',
    reading:
      '天蠍座洞察力強，情感深刻，追求真相與內在蜕變。增強洞察力與直覺，保護能量場，釋放負能量，激發內在力量，幫助完成蜕變與成長。',
    tip: '小貼士：睡前冥想，把水晶放在枕邊，幫助夢境靈感與深度療癒。',
    crystals: [
      { name: '高透冰曜石', keywords: '辟邪 · 釋放', reason: '吸收負能，協助轉化。' },
      { name: '烏拉圭紫水晶', keywords: '直覺 · 守護', reason: '提升直覺，淨化能量場。' },
      { name: '硃砂', keywords: '熱情 · 重生', reason: '激發熱情，助力蜕變。' },
      { name: '灰月光', keywords: '靈性 · 保護', reason: '保護能量，避免耗竭。' },
    ],
  },
  {
    id: 'sagittarius',
    name: '射手座',
    symbol: '♐',
    element: '火象',
    range: '11.23 ~ 12.21',
    keywords: '自由樂觀 · 探索冒險 · 智慧哲思 · 誠實直率 · 追求成長',
    reading:
      '射手座熱愛自由與探索。需要提升智慧、保持樂觀，並讓能量更集中於目標。',
    tip: '佩戴建議：左手增強智慧與好運，右手幫助專注與行動。',
    crystals: [
      { name: '烏拉圭紫水晶', keywords: '智慧 · 靈性', reason: '提升智慧，冷靜思考。' },
      { name: '藍晶石', keywords: '真理 · 溝通', reason: '增強表達，帶來靈感。' },
      { name: '淺綠髮晶', keywords: '專注 · 增能', reason: '提升專注，助你實現目標。' },
    ],
  },
  {
    id: 'capricorn',
    name: '摩羯座',
    symbol: '♑',
    element: '土象',
    range: '12.22 ~ 1.19',
    keywords: '責任 · 目標 · 毅力 · 成就',
    reading:
      '摩羯座肩負感強、目標長遠。增強毅力與耐力，帶來穩定能量，幫助腳踏實地、克服困難，達成長期目標與事業成就。',
    tip: '小貼士：放在工作枱或隨身佩戴，支援事業與目標落地。',
    crystals: [
      { name: '深茶晶', keywords: '穩定 · 接地', reason: '穩定情緒，增強耐力。' },
      { name: '黑金超', keywords: '保護 · 防禦', reason: '抵禦負能，守護目標。' },
      { name: '綠幽靈', keywords: '事業 · 財富', reason: '增強事業運與財運。' },
      { name: '高透冰曜石', keywords: '力量 · 勇氣', reason: '增強行動，推進目標。' },
    ],
  },
  {
    id: 'aquarius',
    name: '水瓶座',
    symbol: '♒',
    element: '風象',
    range: '1.20 ~ 2.18',
    keywords: '創新 · 獨立 · 理想 · 洞察',
    reading:
      '水瓶座思維獨特，富有創造力與前瞻性，追求自由與理想。需要能量來增強直覺、穩定情緒，把想法落地。',
    tip: '充能建議：靠近自然、風與陽光，保持好奇心，並定期淨化。',
    crystals: [
      { name: '黃螢石', keywords: '思維 · 靈感', reason: '梳理思緒，落地創意。' },
      { name: '藍晶石', keywords: '智慧 · 洞察', reason: '連接直覺，講清想法。' },
      { name: '高透紫水晶', keywords: '靈性 · 守護', reason: '安定心神，保護靈性。' },
      { name: '白水晶', keywords: '淨化 · 放大', reason: '淨化過載，放大清明。' },
    ],
  },
  {
    id: 'pisces',
    name: '雙魚座',
    symbol: '♓',
    element: '水象',
    range: '2.19 ~ 3.20',
    keywords: '夢幻 · 靈性 · 同情心 · 創造力',
    reading:
      '雙魚座想像力豐富、共情力強，容易受外界影響，需要能量保護與療癒。提升靈性與直覺，療癒情緒，增強共情與創造力，帶來愛與包容。',
    tip: '小貼士：隨身攜帶水象水晶，保護能量場，改善睡眠，增強靈感。',
    crystals: [
      { name: '高透紫水晶', keywords: '靈性 · 平靜', reason: '增強靈性，帶來安寧。' },
      { name: '冰川藍海藍寶', keywords: '療癒 · 表達', reason: '安撫情緒，清晰表達。' },
      { name: '月光石', keywords: '直覺 · 夢境', reason: '增強直覺，引導夢境。' },
      { name: '粉晶', keywords: '愛與包容 · 療癒', reason: '療癒情感，帶來包容。' },
    ],
  },
]

const BY_ID = Object.fromEntries(ZODIAC_SIGNS.map((s) => [s.id, s]))

export function daysInMonth(month) {
  return [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1] || 31
}

export function signFromBirth(month, day) {
  const md = month * 100 + Number(day)
  if (md >= 321 && md <= 419) return BY_ID.aries
  if (md >= 420 && md <= 520) return BY_ID.taurus
  if (md >= 521 && md <= 621) return BY_ID.gemini
  if (md >= 622 && md <= 722) return BY_ID.cancer
  if (md >= 723 && md <= 822) return BY_ID.leo
  if (md >= 823 && md <= 922) return BY_ID.virgo
  if (md >= 923 && md <= 1023) return BY_ID.libra
  if (md >= 1024 && md <= 1122) return BY_ID.scorpio
  if (md >= 1123 && md <= 1221) return BY_ID.sagittarius
  if (md >= 1222 || md <= 119) return BY_ID.capricorn
  if (md >= 120 && md <= 218) return BY_ID.aquarius
  if (md >= 219 && md <= 320) return BY_ID.pisces
  return null
}

export function getZodiacSign(id) {
  return BY_ID[id] || null
}

export function recommendationsFor(signId) {
  const sign = getZodiacSign(signId)
  if (!sign) return []
  return sign.crystals
    .map((item) => {
      const product = PRODUCTS.find((p) => p.name === item.name)
      if (!product) return null
      return { product, keywords: item.keywords, reason: item.reason }
    })
    .filter(Boolean)
}

export function loadZodiacProfile() {
  try {
    const raw = localStorage.getItem(ZODIAC_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!getZodiacSign(data.signId)) return null
    return data
  } catch {
    return null
  }
}

export function persistZodiacProfile(profile) {
  localStorage.setItem(ZODIAC_KEY, JSON.stringify(profile))
  return profile
}
