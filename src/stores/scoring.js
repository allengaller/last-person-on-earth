// 评分与解锁算法（纯函数，doc/04 §3）
import { ITEMS } from '../data/items.js'
import { CATEGORIES, CATEGORY_WEIGHTS } from '../data/categories.js'
import { SKILLS } from '../data/skills.js'

export const RANKS = [
  { min: 81, name: '废土传说', color: 'var(--rad)', glitch: true },
  { min: 61, name: '老练幸存者', color: 'var(--rad)' },
  { min: 41, name: '有备而来', color: 'var(--warning)' },
  { min: 21, name: '普通路人', color: 'var(--text)' },
  { min: 0, name: '纯脆皮', color: 'var(--text-dim)' },
]

export function rankFor(score) {
  return RANKS.find((r) => score >= r.min)
}

export function ownedRateOf(items, owned) {
  if (!items.length) return 0
  const count = items.reduce((n, item) => n + (owned[item.id] ? 1 : 0), 0)
  return count / items.length
}

export function categoryRate(categoryId, owned) {
  return ownedRateOf(
    ITEMS.filter((item) => item.category === categoryId),
    owned,
  )
}

export function categoryRates(owned) {
  return Object.fromEntries(
    CATEGORIES.map((c) => [c.id, categoryRate(c.id, owned)]),
  )
}

export function skillPracticedRate(practiced) {
  if (!SKILLS.length) return 0
  return SKILLS.filter((s) => practiced[s.id]).length / SKILLS.length
}

// 总准备度 = 分类维度 70% + 技能维度 30%，展示为 0-100 整数
export function totalReadiness(owned, practiced) {
  const catSum = CATEGORIES.reduce(
    (sum, c) => sum + CATEGORY_WEIGHTS[c.id] * categoryRate(c.id, owned),
    0,
  )
  return Math.round((catSum * 0.7 + skillPracticedRate(practiced) * 0.3) * 100)
}

// 六维雷达：五大分类拥有率 + 技能练习率
export function radarData(owned, practiced) {
  return {
    axes: [
      ...CATEGORIES.map((c) => ({
        key: c.id,
        label: c.name,
        value: categoryRate(c.id, owned),
      })),
      { key: 'skills', label: '技能练习', value: skillPracticedRate(practiced) },
    ],
  }
}

export function isSkillUnlocked(skill, owned, practiced) {
  const count = skill.requireItems.reduce(
    (n, id) => n + (owned[id] ? 1 : 0),
    0,
  )
  return count >= skill.requireItemsCount && (!skill.requirePractice || !!practiced[skill.id])
}

export function scenarioStats(scenario, owned) {
  const priorities = ['P1', 'P2', 'P3']
  const missing = {}
  let total = 0
  let ownedCount = 0
  for (const p of priorities) {
    const ids = scenario.recommended[p] ?? []
    missing[p] = ids.filter((id) => !owned[id])
    total += ids.length
    ownedCount += ids.length - missing[p].length
  }
  return { total, ownedCount, rate: total ? ownedCount / total : 0, missing }
}
