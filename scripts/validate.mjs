// 数据完整性与算法断言（doc/04 §9.2/9.3，node scripts/validate.mjs）
import { ITEMS, ITEM_MAP, MEDICAL_NOTICE } from '../src/data/items.js'
import { CATEGORIES, CATEGORY_WEIGHTS, SCENARIO_LABELS } from '../src/data/categories.js'
import { SCENARIOS } from '../src/data/scenarios.js'
import { SKILLS, SKILL_BRANCHES } from '../src/data/skills.js'
import { GLOSSARY } from '../src/data/glossary.js'
import { BADGES, earnedBadges } from '../src/data/badges.js'
import {
  categoryRate,
  isSkillUnlocked,
  rankFor,
  scenarioStats,
  totalReadiness,
} from '../src/stores/scoring.js'

let failed = 0

function assert(cond, message) {
  if (cond) {
    console.log(`  [OK] ${message}`)
  } else {
    failed += 1
    console.error(`  [FAIL] ${message}`)
  }
}

function approx(a, b, eps = 1e-9) {
  return Math.abs(a - b) < eps
}

console.log('> 校验物资数据库')
assert(ITEMS.length >= 50, `物资条目 ≥ 50（实际 ${ITEMS.length}）`)
assert(new Set(ITEMS.map((i) => i.id)).size === ITEMS.length, '物资 id 无重复')
for (const item of ITEMS) {
  const ok =
    item.name &&
    ['P1', 'P2', 'P3'].includes(item.priority) &&
    typeof item.amount === 'string' &&
    item.desc &&
    CATEGORY_WEIGHTS[item.category] !== undefined &&
    Array.isArray(item.scenarios) &&
    item.scenarios.every((s) => SCENARIO_LABELS[s] !== undefined)
  if (!ok) {
    failed += 1
    console.error(`  [FAIL] 物资字段不完整: ${item.id}`)
  }
}
assert(ITEMS.filter((i) => i.category === 'medical' && i.tags.includes('处方药遵医嘱')).includes(ITEM_MAP['md-04'])
  && ITEM_MAP['md-10'].tags.includes('处方药遵医嘱'), 'md-04/md-10 带「处方药遵医嘱」提示')
assert(typeof MEDICAL_NOTICE === 'string' && MEDICAL_NOTICE.length > 0, '医疗分类合规提示文案存在')

console.log('> 校验场景库')
assert(SCENARIOS.length === 3, `场景数 = 3（实际 ${SCENARIOS.length}）`)
for (const sc of SCENARIOS) {
  const ids = [...sc.recommended.P1, ...sc.recommended.P2, ...sc.recommended.P3]
  const unknown = ids.filter((id) => !ITEM_MAP[id])
  assert(unknown.length === 0, `${sc.name} 推荐组合物资 id 全部存在（${ids.length} 条）`)
  assert(sc.recommended.P1.length > 0 && sc.recommended.P2.length > 0, `${sc.name} P1/P2 组合非空`)
  assert(Array.isArray(sc.tips) && sc.tips.length > 0, `${sc.name} 场景专属提示非空`)
}

console.log('> 校验技能树')
assert(SKILLS.length === 15, `技能节点 = 15（实际 ${SKILLS.length}）`)
assert(new Set(SKILLS.map((s) => s.id)).size === SKILLS.length, '技能 id 无重复')
for (const branch of SKILL_BRANCHES) {
  const nodes = SKILLS.filter((s) => s.branch === branch.id)
  assert(nodes.length === 3 && [1, 2, 3].every((t) => nodes.some((n) => n.tier === t)), `分支「${branch.name}」3 级齐全`)
}
const unknownSkillItems = SKILLS.flatMap((s) => s.requireItems).filter((id) => !ITEM_MAP[id])
assert(unknownSkillItems.length === 0, '技能解锁条件引用的物资 id 全部存在')

console.log('> 校验词典')
assert(GLOSSARY.length === 16, `术语 = 16（实际 ${GLOSSARY.length}）`)

console.log('> 校验评分算法')
const weightSum = CATEGORIES.reduce((sum, c) => sum + c.weight, 0)
assert(approx(weightSum, 1), `分类权重和 = 1（实际 ${weightSum}）`)

const empty = {}
assert(totalReadiness(empty, {}) === 0, '空状态准备度 = 0')
assert(rankFor(0).name === '纯脆皮', '0 分段位 = 纯脆皮')

const allOwned = Object.fromEntries(ITEMS.map((i) => [i.id, true]))
const allPracticed = Object.fromEntries(SKILLS.map((s) => [s.id, true]))
assert(totalReadiness(allOwned, allPracticed) === 100, '全拥有 + 全练习准备度 = 100')
assert(totalReadiness(allOwned, {}) === 70, '全拥有未练习准备度 = 70')
assert(rankFor(85).name === '废土传说', '85 分段位 = 废土传说')
assert(rankFor(45).name === '有备而来', '45 分段位 = 有备而来')

const onlyWater = { 'fw-01': true }
assert(approx(categoryRate('food-water', onlyWater), 1 / 12), '仅拥有 fw-01 时食物拥有率 = 1/12')
assert(totalReadiness(onlyWater, {}) === Math.round(0.25 * (1 / 12) * 0.7 * 100), '仅拥有 fw-01 时总准备度符合公式')

const city = SCENARIOS.find((s) => s.id === 'city')
const cityP1Owned = Object.fromEntries(city.recommended.P1.map((id) => [id, true]))
const cityStats = scenarioStats(city, cityP1Owned)
assert(cityStats.missing.P1.length === 0, '拥有全部城市 P1 后 P1 缺口 = 0')
assert(cityStats.missing.P2.length === city.recommended.P2.length, '未拥有 P2 时 P2 缺口 = 全量')

console.log('> 校验技能解锁')
assert(isSkillUnlocked(SKILLS.find((s) => s.id === 'water-1'), { 'fw-03': true }, {}), '拥有净水片解锁「认识净水」')
assert(!isSkillUnlocked(SKILLS.find((s) => s.id === 'water-1'), {}, {}), '未拥有净水片不解锁「认识净水」')
const water2 = SKILLS.find((s) => s.id === 'water-2')
assert(!isSkillUnlocked(water2, { 'fw-01': true, 'fw-03': true }, {}), '缺练习标记不解锁 tier2')
assert(isSkillUnlocked(water2, { 'fw-01': true, 'fw-03': true }, { 'water-2': true }), '物资 + 练习标记解锁 tier2')

console.log('> 校验成就徽章')
assert(BADGES.length >= 8, `徽章 ≥ 8（实际 ${BADGES.length}）`)
assert(new Set(BADGES.map((b) => b.id)).size === BADGES.length, '徽章 id 无重复')
assert(earnedBadges({}, {}).every((b) => !b.earned), '空状态无徽章点亮')
const allEarned = earnedBadges(allOwned, allPracticed)
assert(allEarned.every((b) => b.earned), '全拥有 + 全练习点亮全部徽章')
assert(earnedBadges({}, {}).length === BADGES.length, 'earnedBadges 返回全量徽章')
const p1Owned = Object.fromEntries(ITEMS.filter((i) => i.priority === 'P1').map((i) => [i.id, true]))
assert(earnedBadges(p1Owned, {}).find((b) => b.id === 'p1-complete')?.earned === true, '全 P1 入库点亮「有备无患」')
assert(earnedBadges(p1Owned, {}).find((b) => b.id === 'legend')?.earned === false, '仅 P1 入库不点亮「废土传说」')

console.log(failed === 0 ? '\n> 全部校验通过 [OK]' : `\n> ${failed} 项校验失败 [FAIL]`)
process.exit(failed === 0 ? 0 : 1)
