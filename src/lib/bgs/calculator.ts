// BGS 商業成長系統 — 完整計算引擎
// 基於 MMT 方法論，轉譯為商業營運導向語言

// ============================================================
// 類型定義
// ============================================================

export interface BGSResult {
  birth: string
  rawSum: number
  talents: {
    self: number[]       // 本我牌 3 張
    environment: number[] // 環境應對（年輪牌）3-4 張
  }
  mentor: {
    visible: number[]    // 顯性導師（篩選後的歸約鏈）
    shadow: number[]     // 陰影牌
    core: number         // 導師核心（個位數 1-9）
    process: number[]    // 完整歸約歷程
  }
  energy: {
    sorted: EnergyItem[]
    pool: number[]
  }
  yearStrategy: YearStrategy[]
}

export interface EnergyItem {
  element: 'wind' | 'fire' | 'water' | 'earth'
  label: string
  count: number
  pct: number
}

export interface YearStrategy {
  startYear: number
  endYear: number
  strategy: number
}

// ============================================================
// 22 張牌資料（商業成長語言）
// ============================================================

export const CARDS = [
  { id: 0,  name: '原創開發力', element: 'wind'  as const, archetype: '戴奧尼索斯 (Dionysus)' },
  { id: 1,  name: '資訊整合力', element: 'wind'  as const, archetype: '荷米斯 (Hermes)' },
  { id: 2,  name: '信任經營力', element: 'water' as const, archetype: '希拉 (Hera)' },
  { id: 3,  name: '形象吸引力', element: 'water' as const, archetype: '阿芙蘿黛蒂 (Aphrodite)' },
  { id: 4,  name: '決斷執行力', element: 'fire'  as const, archetype: '阿瑞斯 (Ares)' },
  { id: 5,  name: '價值傳遞力', element: 'earth' as const, archetype: '狄蜜特 (Demeter)' },
  { id: 6,  name: '內容表現力', element: 'wind'  as const, archetype: '厄洛斯與賽姬 (Eros & Psyche)' },
  { id: 7,  name: '品質守成力', element: 'water' as const, archetype: '赫斯提亞 (Hestia)' },
  { id: 8,  name: '帶人賦能力', element: 'fire'  as const, archetype: '赫拉克勒斯 (Heracles)' },
  { id: 9,  name: '洞察診斷力', element: 'earth' as const, archetype: '阿提米斯 (Artemis)' },
  { id: 10, name: '資源連結力', element: 'earth' as const, archetype: '宙斯 (Zeus)' },
  { id: 11, name: '專業權威力', element: 'wind'  as const, archetype: '雅典娜 (Athena)' },
  { id: 12, name: '趨勢感知力', element: 'water' as const, archetype: '波賽頓 (Poseidon)' },
  { id: 13, name: '變革推動力', element: 'water' as const, archetype: '阿基里斯 (Achilles)' },
  { id: 14, name: '敘事影響力', element: 'fire'  as const, archetype: '普羅米修斯 (Prometheus)' },
  { id: 15, name: '謀略布局力', element: 'earth' as const, archetype: '奧德修斯 (Odysseus)' },
  { id: 16, name: '落地執行力', element: 'fire'  as const, archetype: '赫菲斯托斯 (Hephaestus)' },
  { id: 17, name: '優勢識別力', element: 'wind'  as const, archetype: '澤菲羅斯 (Zephyrus)' },
  { id: 18, name: '情境洞察力', element: 'water' as const, archetype: '波西鳳 (Persephone)' },
  { id: 19, name: '資源號召力', element: 'fire'  as const, archetype: '阿波羅 (Apollo)' },
  { id: 20, name: '風控規劃力', element: 'wind'  as const, archetype: '哈迪斯 (Hades)' },
  { id: 21, name: '系統建構力', element: 'earth' as const, archetype: '克羅諾斯 (Cronus)' },
]

export const CARD_ELEMENT: Record<number, 'wind' | 'fire' | 'water' | 'earth'> = {
  0: 'wind',  1: 'wind',  2: 'water', 3: 'water',
  4: 'fire',  5: 'earth', 6: 'wind',  7: 'water',
  8: 'fire',  9: 'earth', 10: 'earth', 11: 'wind',
  12: 'water', 13: 'water', 14: 'fire', 15: 'earth',
  16: 'fire', 17: 'wind', 18: 'water', 19: 'fire',
  20: 'wind', 21: 'earth',
}

const ELEMENT_LABEL: Record<string, string> = {
  wind: '靠專業贏', fire: '靠速度贏', water: '靠關係贏', earth: '靠穩紮贏',
}

// 九大家族：每個家族包含 mc 值和對應的牌號
export const FAMILIES: Record<number, { name: string; cards: number[] }> = {
  1: { name: '商業交易天才', cards: [1, 10, 19] },
  2: { name: '內在權威', cards: [2, 11, 20] },
  3: { name: '外在美學', cards: [3, 12, 21] },
  4: { name: '王者風範', cards: [4, 13, 0] },
  5: { name: '價值傳遞', cards: [5, 14] },
  6: { name: '人際關係', cards: [6, 15] },
  7: { name: '業務執行', cards: [7, 16] },
  8: { name: '培訓教育', cards: [8, 17] },
  9: { name: '領域專家', cards: [9, 18] },
}

// ============================================================
// 基礎工具函數
// ============================================================

/** 數位歸約：把數字每位相加 */
function digitSum(n: number): number {
  return String(Math.abs(n))
    .split('')
    .reduce((sum, d) => sum + parseInt(d, 10), 0)
}

/** 持續歸約到個位數（1-9） */
function reduceToSingle(n: number): number {
  while (n >= 10) n = digitSum(n)
  return n
}

/** 減到 0-21 範圍（減 22 法，等同 % 22） */
function reduceTo22(n: number): number {
  return ((n % 22) + 22) % 22
}

/** 非閏年每月前累計天數（index 0 不用，1=Jan ... 12=Dec） */
const CUM_DAYS_BEFORE_MONTH = [0, 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]

/** 計算一年中的第幾天（固定用非閏年曆法） */
function dayOfYear(month: number, day: number): number {
  return CUM_DAYS_BEFORE_MONTH[month] + day
}

// ============================================================
// 本我牌計算
// ============================================================

function calcSelf0(day: number): number {
  if (day >= 1 && day <= 21) return day
  if (day === 22) return 0
  return reduceToSingle(day)
}

function calcSelf1(rawSum: number): number {
  return reduceTo22(rawSum)
}

function calcSelf2(year: number, month: number, day: number): number {
  const yearDS = digitSum(year)
  return reduceTo22(yearDS + month + day)
}

function calcSelf(year: number, month: number, day: number, rawSum: number): number[] {
  return [
    calcSelf0(day),
    calcSelf1(rawSum),
    calcSelf2(year, month, day),
  ]
}

// ============================================================
// 環境應對（年輪牌）計算
// ============================================================

function calcEnvironment(month: number, day: number): number[] {
  const doy = dayOfYear(month, day)
  const center = doy % 22

  const prevCard = (center - 1 + 22) % 22
  const nextCard = (center + 1) % 22

  const isJan1 = month === 1 && day === 1
  const isDec31 = month === 12 && day === 31

  if (isJan1) {
    const dec31Card = 365 % 22
    return [center, dec31Card, nextCard, prevCard]
  }

  if (isDec31) {
    const jan1Card = 1 % 22
    return [center, prevCard, jan1Card, nextCard]
  }

  return [center, prevCard, nextCard]
}

// ============================================================
// 導師牌計算
// ============================================================

function calcMentorCards(rawSum: number): number[] {
  const mentors: number[] = []
  let n = rawSum
  while (n > 9) {
    if (n <= 21) mentors.push(n)
    n = digitSum(n)
  }
  mentors.push(n)
  const seen = new Set<number>()
  return mentors.filter(m => { if (seen.has(m)) return false; seen.add(m); return true })
}

const SHADOW_FAMILY = [
  [1, 10, 19], [2, 11, 20], [3, 12, 21], [4, 13, 0],
  [5, 14], [6, 15], [7, 16], [8, 17], [9, 18],
]

function calcMentorShadow(mentorCards: number[]): number[] {
  const final = mentorCards[mentorCards.length - 1]
  for (const fam of SHADOW_FAMILY) {
    if (fam.includes(final)) {
      return fam.filter(m => !mentorCards.includes(m))
    }
  }
  return []
}

function calcMentor(rawSum: number) {
  const cards = calcMentorCards(rawSum)
  const core = cards[cards.length - 1]
  const shadow = calcMentorShadow(cards)
  return { core, visible: cards, process: cards, shadow }
}

// ============================================================
// 年度策略計算
// ============================================================

function calcOneYearStrategy(baseYear: number, month: number, day: number): number {
  let result = baseYear + month + day
  while (result > 22) result = digitSum(result)
  if (result === 22) result = 0
  return result
}

function calcYearStrategies(month: number, day: number): YearStrategy[] {
  const now = new Date()
  const curYear = now.getFullYear()
  const thisYearBday = new Date(curYear, month - 1, day)
  const baseYear = now >= thisYearBday ? curYear : curYear - 1

  return [
    { startYear: baseYear, endYear: baseYear + 1, strategy: calcOneYearStrategy(baseYear, month, day) },
    { startYear: baseYear + 1, endYear: baseYear + 2, strategy: calcOneYearStrategy(baseYear + 1, month, day) },
  ]
}

// ============================================================
// 四大能量計算
// ============================================================

function calcEnergy(allTalentCards: number[], mentorCards: number[]) {
  const pool = [...allTalentCards, ...mentorCards]

  const counts: Record<string, number> = { wind: 0, fire: 0, water: 0, earth: 0 }
  for (const card of pool) {
    const el = CARD_ELEMENT[card]
    if (el) counts[el]++
  }

  const sorted: EnergyItem[] = Object.entries(counts)
    .map(([element, count]) => ({
      element: element as EnergyItem['element'],
      label: ELEMENT_LABEL[element],
      count,
      pct: Math.round((count / pool.length) * 1000) / 10,
    }))
    .sort((a, b) => b.pct - a.pct)

  return { sorted, pool }
}

// ============================================================
// 主計算函數
// ============================================================

export function calculateBGS(birthDate: string): BGSResult {
  const [year, month, day] = birthDate.split('-').map(Number)

  const digits = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`
  const rawSum = digits.split('').reduce((sum, d) => sum + parseInt(d, 10), 0)

  const selfCards = calcSelf(year, month, day, rawSum)
  const envCards = calcEnvironment(month, day)
  const allTalentCards = [...selfCards, ...envCards]
  const mentor = calcMentor(rawSum)
  const energy = calcEnergy(allTalentCards, mentor.visible)
  const yearStrategy = calcYearStrategies(month, day)

  return {
    birth: birthDate,
    rawSum,
    talents: {
      self: selfCards,
      environment: envCards,
    },
    mentor,
    energy,
    yearStrategy,
  }
}

// ============================================================
// 關鍵優勢判斷（天賦牌與導師牌號碼重合 = 內外一致、可當主打）
// ============================================================

export function findKeyAdvantages(result: BGSResult): number[] {
  const mentorNumbers = new Set(result.mentor.visible)
  const talentNumbers = [...result.talents.self, ...result.talents.environment]
  return [...new Set(talentNumbers.filter(n => mentorNumbers.has(n)))].sort((a, b) => a - b)
}

// ============================================================
// 九大家族分析
// ============================================================

export function analyzeFamilies(result: BGSResult): { familyId: number; name: string; ownedCards: number[] }[] {
  const allCards = new Set([...result.talents.self, ...result.talents.environment])
  const found: { familyId: number; name: string; ownedCards: number[] }[] = []

  for (const [id, family] of Object.entries(FAMILIES)) {
    const owned = family.cards.filter(c => allCards.has(c))
    if (owned.length > 0) {
      found.push({ familyId: Number(id), name: family.name, ownedCards: owned })
    }
  }

  return found
}

// ============================================================
// 關係分析工具
// ============================================================

export type RelationType = '互補' | '投射' | '瑜亮' | '無'

export function analyzeRelation(personA: BGSResult, personB: BGSResult): {
  type: RelationType
  details: string
}[] {
  const relations: { type: RelationType; details: string }[] = []

  const aTalents = new Set([...personA.talents.self, ...personA.talents.environment])
  const bTalents = new Set([...personB.talents.self, ...personB.talents.environment])
  const aMentorCore = personA.mentor.core
  const bMentorCore = personB.mentor.core

  for (const card of aTalents) {
    const family = Object.entries(FAMILIES).find(([, f]) => f.cards.includes(card))
    if (family && reduceToSingle(card) === bMentorCore) {
      relations.push({
        type: '互補',
        details: `A 天賦${card}（${CARDS[card].name}）互補 B 導師${bMentorCore}`,
      })
    }
  }
  for (const card of bTalents) {
    const family = Object.entries(FAMILIES).find(([, f]) => f.cards.includes(card))
    if (family && reduceToSingle(card) === aMentorCore) {
      relations.push({
        type: '互補',
        details: `B 天賦${card}（${CARDS[card].name}）互補 A 導師${aMentorCore}`,
      })
    }
  }

  for (const card of aTalents) {
    if (card === bMentorCore) {
      relations.push({
        type: '投射',
        details: `A 天賦${card} 投射 B 導師${bMentorCore}（A 壓制 B）`,
      })
    }
  }
  for (const card of bTalents) {
    if (card === aMentorCore) {
      relations.push({
        type: '投射',
        details: `B 天賦${card} 投射 A 導師${aMentorCore}（B 壓制 A）`,
      })
    }
  }

  for (const [, family] of Object.entries(FAMILIES)) {
    const aInFamily = family.cards.filter(c => aTalents.has(c))
    const bInFamily = family.cards.filter(c => bTalents.has(c))
    if (aInFamily.length > 0 && bInFamily.length > 0) {
      const different = aInFamily.some(a => bInFamily.every(b => b !== a))
      if (different) {
        relations.push({
          type: '瑜亮',
          details: `同家族競合：A有${aInFamily.map(c => CARDS[c].name)} vs B有${bInFamily.map(c => CARDS[c].name)}`,
        })
      }
    }
  }

  return relations
}

// ============================================================
// 格式化輸出
// ============================================================

export function formatResult(result: BGSResult): string {
  const lines: string[] = []
  const { talents, mentor, energy, yearStrategy, rawSum } = result

  lines.push(`生日：${result.birth}`)
  lines.push(`數字總和：${rawSum}`)
  lines.push('')

  lines.push('【本我設計】')
  talents.self.forEach((card, i) => {
    const label = ['日期牌', '總數牌', '雙數牌'][i]
    lines.push(`  ${label}：${card} 號 ${CARDS[card].name}`)
  })
  lines.push('')

  lines.push('【環境應對】')
  talents.environment.forEach((card, i) => {
    lines.push(`  ${i === 0 ? '主牌' : `鄰牌${i}`}：${card} 號 ${CARDS[card].name}`)
  })
  lines.push('')

  lines.push('【待補強項】')
  lines.push(`  核心：T${mentor.core}`)
  lines.push(`  顯性：${mentor.visible.map(n => `T${n}`).join(' → ')}`)
  lines.push(`  歷程：${mentor.process.map(n => `T${n}`).join(' → ')}`)
  if (mentor.shadow.length > 0) {
    lines.push(`  系統性風險點：${mentor.shadow.map(s => `S${s} ${CARDS[s].name}`).join('、')}`)
  } else {
    lines.push(`  系統性風險點：無（2000年後世代特徵）`)
  }
  lines.push('')

  lines.push('【四大營運軸線】')
  energy.sorted.forEach(e => {
    const bar = '█'.repeat(Math.round(e.pct / 5))
    lines.push(`  ${e.label} ${bar} ${e.pct}%`)
  })
  lines.push('')

  lines.push('【年度策略】')
  yearStrategy.forEach(ys => {
    const card = CARDS[ys.strategy]
    lines.push(`  ${ys.startYear}-${ys.endYear}：${ys.strategy} 號 ${card.name}年`)
  })

  return lines.join('\n')
}
